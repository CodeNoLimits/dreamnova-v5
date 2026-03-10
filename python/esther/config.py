"""
Esther AI configuration — model parameters, thresholds, and MLX device settings.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class EstherConfig:
    """Immutable configuration for the Esther entropy monitor."""

    # --- Entropy computation ---
    epsilon: float = 1e-10
    """Numerical stabilization constant for log operations."""

    entropy_window_size: int = 64
    """Number of consecutive state snapshots in the sliding window."""

    derivative_order: int = 1
    """Order of the entropy derivative (1 = velocity, 2 = acceleration)."""

    # --- GNN architecture ---
    gnn_hidden_dim: int = 128
    """Hidden dimension for GNN message passing layers."""

    gnn_num_layers: int = 3
    """Number of message passing iterations."""

    gnn_heads: int = 4
    """Number of attention heads in graph attention layers."""

    gnn_dropout: float = 0.1
    """Dropout probability during training."""

    node_feature_dim: int = 32
    """Dimensionality of input node feature vectors."""

    edge_feature_dim: int = 16
    """Dimensionality of input edge feature vectors."""

    # --- Anomaly detection ---
    anomaly_threshold: float = 2.5
    """Standard deviations above mean entropy derivative to flag anomaly."""

    critical_threshold: float = 4.0
    """Standard deviations threshold for critical alerts (immediate action)."""

    min_samples_for_baseline: int = 128
    """Minimum number of samples required before anomaly scoring activates."""

    # --- Quantization ---
    use_4bit_quantization: bool = True
    """Enable 4-bit weight quantization for MLX inference."""

    quantization_group_size: int = 64
    """Group size for block-wise quantization."""

    # --- Monitor daemon ---
    poll_interval_ms: int = 100
    """Milliseconds between state polling cycles."""

    max_history_size: int = 10_000
    """Maximum number of entropy samples to retain in memory."""

    alert_cooldown_seconds: float = 5.0
    """Minimum seconds between repeated alerts for the same anomaly class."""

    # --- MLX device ---
    device: str = "gpu"
    """MLX device: 'gpu' for Apple Silicon Metal, 'cpu' for fallback."""

    stream_index: int = 0
    """MLX stream index for async compute scheduling."""

    # --- Antimatrix integration ---
    antimatrix_hook_enabled: bool = True
    """Whether to send entropy events to the Antimatrix hypervisor."""

    antimatrix_ipc_path: str = "/tmp/dreamnova-antimatrix.sock"
    """Unix socket path for Antimatrix IPC."""

    # --- Sacred constants (DreamNova numerology) ---
    sacred_seed: int = 491
    """Na Nach Nachma Nachman MeUman gematria — used as PRNG seed for reproducibility."""

    def validate(self) -> None:
        """Raise ValueError if any parameter is out of valid range."""
        if self.epsilon <= 0:
            raise ValueError(f"epsilon must be positive, got {self.epsilon}")
        if self.entropy_window_size < 2:
            raise ValueError(f"entropy_window_size must be >= 2, got {self.entropy_window_size}")
        if self.derivative_order < 1:
            raise ValueError(f"derivative_order must be >= 1, got {self.derivative_order}")
        if self.gnn_hidden_dim < 1:
            raise ValueError(f"gnn_hidden_dim must be >= 1, got {self.gnn_hidden_dim}")
        if self.gnn_num_layers < 1:
            raise ValueError(f"gnn_num_layers must be >= 1, got {self.gnn_num_layers}")
        if not (0.0 <= self.gnn_dropout < 1.0):
            raise ValueError(f"gnn_dropout must be in [0, 1), got {self.gnn_dropout}")
        if self.anomaly_threshold <= 0:
            raise ValueError(f"anomaly_threshold must be positive, got {self.anomaly_threshold}")
        if self.critical_threshold <= self.anomaly_threshold:
            raise ValueError(
                f"critical_threshold ({self.critical_threshold}) must exceed "
                f"anomaly_threshold ({self.anomaly_threshold})"
            )
        if self.poll_interval_ms < 1:
            raise ValueError(f"poll_interval_ms must be >= 1, got {self.poll_interval_ms}")
        if self.quantization_group_size < 1:
            raise ValueError(f"quantization_group_size must be >= 1, got {self.quantization_group_size}")
