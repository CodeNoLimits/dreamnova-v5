"""
Esther AI — Entropy Monitoring Subsystem for DreamNova V5

Uses Shannon entropy derivatives and Graph Neural Networks (Apple MLX)
to detect anomalies in system state topology.

Named after Queen Esther who perceived hidden patterns in the kingdom's
state — this module perceives hidden anomalies in computational state.
"""

from esther.entropy import compute_entropy_derivative
from esther.gnn import EstherGNN
from esther.monitor import EstherMonitor
from esther.config import EstherConfig

__version__ = "0.1.0"
__all__ = [
    "compute_entropy_derivative",
    "EstherGNN",
    "EstherMonitor",
    "EstherConfig",
]
