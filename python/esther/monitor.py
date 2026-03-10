"""
Real-time entropy monitoring daemon for the Esther AI subsystem.

Watches system state at configurable intervals, computes entropy derivatives,
runs GNN anomaly detection, and dispatches alerts to the Antimatrix hypervisor
when thresholds are breached.
"""

from __future__ import annotations

import asyncio
import json
import logging
import socket
import time
from collections import deque
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Optional

import mlx.core as mx
import numpy as np

from esther.config import EstherConfig
from esther.entropy import compute_entropy_derivative, quantize_state_4bit
from esther.gnn import EstherGNN

logger = logging.getLogger("esther.monitor")


class AlertLevel(Enum):
    """Severity classification for entropy anomalies."""
    NORMAL = "normal"
    WARNING = "warning"
    CRITICAL = "critical"


@dataclass
class AlertEvent:
    """A single anomaly alert with metadata."""
    timestamp: float
    level: AlertLevel
    entropy_derivative: float
    gnn_score: float
    message: str
    state_snapshot_hash: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "timestamp": self.timestamp,
            "level": self.level.value,
            "entropy_derivative": self.entropy_derivative,
            "gnn_score": self.gnn_score,
            "message": self.message,
            "state_snapshot_hash": self.state_snapshot_hash,
        }

    def to_json(self) -> str:
        return json.dumps(self.to_dict())


@dataclass
class MonitorStats:
    """Running statistics for the monitor daemon."""
    total_polls: int = 0
    total_alerts: int = 0
    total_critical: int = 0
    uptime_start: float = field(default_factory=time.monotonic)
    last_poll_time: float = 0.0
    last_entropy: float = 0.0
    last_derivative: float = 0.0
    last_gnn_score: float = 0.0
    baseline_mean: float = 0.0
    baseline_std: float = 1.0

    @property
    def uptime_seconds(self) -> float:
        return time.monotonic() - self.uptime_start


class EstherMonitor:
    """Real-time system state entropy monitor.

    Runs as an async daemon, polling system state at regular intervals,
    computing entropy derivatives, scoring anomalies via GNN, and
    dispatching alerts to registered handlers and the Antimatrix hypervisor.

    Usage:
        config = EstherConfig(poll_interval_ms=100)
        monitor = EstherMonitor(config)
        monitor.register_alert_handler(my_callback)
        await monitor.run()  # Runs until stopped
    """

    def __init__(self, config: EstherConfig | None = None) -> None:
        self.config = config or EstherConfig()
        self.config.validate()

        self._gnn = EstherGNN(self.config)
        self._running = False
        self._stats = MonitorStats()

        self._entropy_history: deque[float] = deque(maxlen=self.config.max_history_size)
        self._state_buffer: deque[mx.array] = deque(maxlen=self.config.entropy_window_size)

        self._alert_handlers: list[Callable[[AlertEvent], None]] = []
        self._last_alert_times: dict[AlertLevel, float] = {}

    @property
    def stats(self) -> MonitorStats:
        """Current monitor statistics."""
        return self._stats

    @property
    def is_running(self) -> bool:
        return self._running

    def register_alert_handler(self, handler: Callable[[AlertEvent], None]) -> None:
        """Register a callback invoked on every alert event.

        Args:
            handler: Callable taking an AlertEvent. Called synchronously
                     in the monitor loop, so keep it fast.
        """
        self._alert_handlers.append(handler)

    def _ingest_state(self, state_vector: mx.array) -> None:
        """Add a new state snapshot to the rolling buffer.

        Args:
            state_vector: 1-D array of system state values.
        """
        if state_vector.ndim != 1:
            state_vector = mx.reshape(state_vector, (-1,))
        self._state_buffer.append(state_vector)

    def _compute_current_entropy(self) -> dict[str, mx.array] | None:
        """Compute entropy derivative from the current state buffer.

        Returns:
            Entropy computation result dict, or None if insufficient data.
        """
        if len(self._state_buffer) < 2:
            return None

        state_matrix = mx.stack(list(self._state_buffer))
        return compute_entropy_derivative(state_matrix, self.config)

    def _build_topology_graph(self) -> tuple[mx.array, mx.array] | None:
        """Build a graph representation of the current state buffer for GNN scoring.

        Each state snapshot becomes a node. Edges connect consecutive snapshots
        and snapshots with high cosine similarity (shared memory patterns).

        Returns:
            (node_features, adjacency) tuple, or None if insufficient data.
        """
        if len(self._state_buffer) < 3:
            return None

        states = list(self._state_buffer)
        num_nodes = len(states)

        # Node features: project each state vector to node_feature_dim
        raw_features = mx.stack(states)  # (N, D)
        state_dim = raw_features.shape[1]
        node_dim = self.config.node_feature_dim

        if state_dim >= node_dim:
            node_features = raw_features[:, :node_dim]
        else:
            padding = mx.zeros((num_nodes, node_dim - state_dim))
            node_features = mx.concatenate([raw_features, padding], axis=1)

        # Adjacency: sequential edges + similarity edges
        adjacency = mx.zeros((num_nodes, num_nodes))

        # Sequential edges (bidirectional)
        adj_np = np.zeros((num_nodes, num_nodes), dtype=np.float32)
        for i in range(num_nodes - 1):
            adj_np[i, i + 1] = 1.0
            adj_np[i + 1, i] = 1.0

        # Self-loops
        for i in range(num_nodes):
            adj_np[i, i] = 1.0

        # Cosine similarity edges (connect nodes with similarity > 0.8)
        norms = np.linalg.norm(np.array(mx.array(raw_features)), axis=1, keepdims=True)
        norms = np.maximum(norms, 1e-10)
        normalized = np.array(mx.array(raw_features)) / norms
        similarity = normalized @ normalized.T
        adj_np = np.where(similarity > 0.8, 1.0, adj_np)

        adjacency = mx.array(adj_np)

        return node_features, adjacency

    def _score_anomaly(self) -> float:
        """Run GNN anomaly scoring on current topology.

        Returns:
            Anomaly score (float). Returns 0.0 if insufficient data.
        """
        graph = self._build_topology_graph()
        if graph is None:
            return 0.0

        node_features, adjacency = graph
        return self._gnn.anomaly_score(node_features, adjacency)

    def _compute_state_hash(self) -> str:
        """Compute a short hash of the current state buffer for deduplication."""
        if not self._state_buffer:
            return "empty"
        latest = self._state_buffer[-1]
        mx.eval(latest)
        raw = np.array(latest).tobytes()
        import hashlib
        return hashlib.sha256(raw).hexdigest()[:16]

    def _should_alert(self, level: AlertLevel) -> bool:
        """Check if enough time has passed since the last alert of this level."""
        last_time = self._last_alert_times.get(level, 0.0)
        return (time.time() - last_time) >= self.config.alert_cooldown_seconds

    def _dispatch_alert(self, event: AlertEvent) -> None:
        """Send alert to all registered handlers and optionally to Antimatrix."""
        self._last_alert_times[event.level] = time.time()
        self._stats.total_alerts += 1
        if event.level == AlertLevel.CRITICAL:
            self._stats.total_critical += 1

        for handler in self._alert_handlers:
            try:
                handler(event)
            except Exception as exc:
                logger.error("Alert handler raised: %s", exc, exc_info=True)

        if self.config.antimatrix_hook_enabled:
            self._send_to_antimatrix(event)

    def _send_to_antimatrix(self, event: AlertEvent) -> None:
        """Send alert event to the Antimatrix hypervisor via Unix socket IPC.

        Fails silently if the socket is not available — Antimatrix may not
        be running during development.
        """
        sock_path = self.config.antimatrix_ipc_path
        if not Path(sock_path).exists():
            logger.debug("Antimatrix socket not found at %s, skipping IPC", sock_path)
            return

        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
                sock.settimeout(1.0)
                sock.connect(sock_path)
                payload = event.to_json().encode("utf-8") + b"\n"
                sock.sendall(payload)
        except (ConnectionRefusedError, OSError) as exc:
            logger.debug("Antimatrix IPC failed: %s", exc)

    def _evaluate_step(self, entropy_result: dict[str, mx.array], gnn_score: float) -> None:
        """Evaluate current step and fire alerts if thresholds are breached."""
        current_deriv = float(mx.array(entropy_result["current"]).item())
        self._stats.last_derivative = current_deriv
        self._stats.last_gnn_score = gnn_score

        deriv_mean = float(mx.array(entropy_result["mean"]).item())
        deriv_std = float(mx.array(entropy_result["std"]).item())

        self._stats.baseline_mean = deriv_mean
        self._stats.baseline_std = deriv_std

        if len(self._entropy_history) < self.config.min_samples_for_baseline:
            return

        z_score = abs(current_deriv - deriv_mean) / max(deriv_std, self.config.epsilon)

        state_hash = self._compute_state_hash()

        if z_score >= self.config.critical_threshold and self._should_alert(AlertLevel.CRITICAL):
            event = AlertEvent(
                timestamp=time.time(),
                level=AlertLevel.CRITICAL,
                entropy_derivative=current_deriv,
                gnn_score=gnn_score,
                message=f"CRITICAL entropy anomaly: z={z_score:.2f}, dH/dt={current_deriv:.6f}, GNN={gnn_score:.4f}",
                state_snapshot_hash=state_hash,
            )
            logger.critical(event.message)
            self._dispatch_alert(event)

        elif z_score >= self.config.anomaly_threshold and self._should_alert(AlertLevel.WARNING):
            event = AlertEvent(
                timestamp=time.time(),
                level=AlertLevel.WARNING,
                entropy_derivative=current_deriv,
                gnn_score=gnn_score,
                message=f"WARNING entropy anomaly: z={z_score:.2f}, dH/dt={current_deriv:.6f}, GNN={gnn_score:.4f}",
                state_snapshot_hash=state_hash,
            )
            logger.warning(event.message)
            self._dispatch_alert(event)

    async def poll_once(self, state_vector: mx.array) -> Optional[AlertEvent]:
        """Perform a single poll cycle with the given state vector.

        This is the main entry point for external callers who want to
        feed state data manually rather than using the daemon loop.

        Args:
            state_vector: 1-D system state snapshot.

        Returns:
            AlertEvent if an anomaly was detected, None otherwise.
        """
        self._ingest_state(state_vector)
        self._stats.total_polls += 1
        self._stats.last_poll_time = time.time()

        entropy_result = self._compute_current_entropy()
        if entropy_result is None:
            return None

        current_entropy = float(mx.array(entropy_result["entropy"][-1]).item())
        self._stats.last_entropy = current_entropy
        self._entropy_history.append(current_entropy)

        gnn_score = self._score_anomaly()

        self._evaluate_step(entropy_result, gnn_score)

        return None

    async def run(self, state_source: Callable[[], mx.array] | None = None) -> None:
        """Run the monitor daemon loop.

        Polls state at the configured interval until stop() is called.

        Args:
            state_source: Callable that returns the current system state vector.
                         If None, generates random state for testing.
        """
        self._running = True
        self._stats = MonitorStats()
        interval = self.config.poll_interval_ms / 1000.0

        logger.info(
            "Esther monitor started — interval=%dms, threshold=%.1f, critical=%.1f",
            self.config.poll_interval_ms,
            self.config.anomaly_threshold,
            self.config.critical_threshold,
        )

        try:
            while self._running:
                if state_source is not None:
                    state = state_source()
                else:
                    state = mx.random.normal((self.config.node_feature_dim,))

                await self.poll_once(state)
                await asyncio.sleep(interval)
        except asyncio.CancelledError:
            logger.info("Esther monitor cancelled")
        finally:
            self._running = False
            logger.info(
                "Esther monitor stopped — polls=%d, alerts=%d, critical=%d, uptime=%.1fs",
                self._stats.total_polls,
                self._stats.total_alerts,
                self._stats.total_critical,
                self._stats.uptime_seconds,
            )

    def stop(self) -> None:
        """Signal the monitor daemon to stop after the current poll cycle."""
        self._running = False
