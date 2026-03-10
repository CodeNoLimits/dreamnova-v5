"""
Graph Neural Network for anomaly detection in memory topology.

Uses Apple MLX (mlx.nn) for Metal-accelerated inference on Apple Silicon.
The GNN treats system memory regions as nodes and data flow paths as edges,
learning to score anomalous topology changes that indicate adversarial
mutation, memory corruption, or unauthorized state transitions.
"""

from __future__ import annotations

from typing import Optional

import mlx.core as mx
import mlx.nn as nn

from esther.config import EstherConfig


class GraphAttentionLayer(nn.Module):
    """Single graph attention layer with multi-head attention.

    Implements GAT-style attention where each node aggregates information
    from its neighbors, weighted by learned attention coefficients.
    """

    def __init__(self, in_dim: int, out_dim: int, heads: int = 4, dropout: float = 0.1) -> None:
        super().__init__()
        self.heads = heads
        self.head_dim = out_dim // heads
        assert out_dim % heads == 0, f"out_dim ({out_dim}) must be divisible by heads ({heads})"

        self.w_query = nn.Linear(in_dim, out_dim, bias=False)
        self.w_key = nn.Linear(in_dim, out_dim, bias=False)
        self.w_value = nn.Linear(in_dim, out_dim, bias=False)

        self.attn_proj = nn.Linear(2 * self.head_dim, 1, bias=False)

        self.output_proj = nn.Linear(out_dim, out_dim)
        self.layer_norm = nn.LayerNorm(out_dim)
        self.dropout = nn.Dropout(dropout)

    def __call__(
        self,
        node_features: mx.array,
        adjacency: mx.array,
        edge_features: Optional[mx.array] = None,
    ) -> mx.array:
        """Forward pass through the graph attention layer.

        Args:
            node_features: (N, in_dim) node feature matrix.
            adjacency: (N, N) binary adjacency matrix (1 = edge exists).
            edge_features: Optional (N, N, edge_dim) edge feature tensor.

        Returns:
            (N, out_dim) updated node features after message passing.
        """
        num_nodes = node_features.shape[0]

        queries = self.w_query(node_features)  # (N, out_dim)
        keys = self.w_key(node_features)  # (N, out_dim)
        values = self.w_value(node_features)  # (N, out_dim)

        queries = mx.reshape(queries, (num_nodes, self.heads, self.head_dim))
        keys = mx.reshape(keys, (num_nodes, self.heads, self.head_dim))
        values = mx.reshape(values, (num_nodes, self.heads, self.head_dim))

        # Compute pairwise attention scores
        # For each head, concatenate query_i and key_j for all (i, j) pairs
        q_expanded = mx.expand_dims(queries, axis=1)  # (N, 1, H, d)
        k_expanded = mx.expand_dims(keys, axis=0)  # (1, N, H, d)
        q_broadcast = mx.broadcast_to(q_expanded, (num_nodes, num_nodes, self.heads, self.head_dim))
        k_broadcast = mx.broadcast_to(k_expanded, (num_nodes, num_nodes, self.heads, self.head_dim))

        # Scaled dot-product attention per head
        attn_logits = mx.sum(q_broadcast * k_broadcast, axis=-1)  # (N, N, H)
        attn_logits = attn_logits / (self.head_dim ** 0.5)

        # Mask non-edges with large negative value
        mask = mx.expand_dims(adjacency, axis=-1)  # (N, N, 1)
        masked_logits = mx.where(mask > 0, attn_logits, mx.array(-1e9))

        attn_weights = mx.softmax(masked_logits, axis=1)  # Normalize over source nodes
        attn_weights = self.dropout(attn_weights)

        # Aggregate values
        v_expanded = mx.expand_dims(values, axis=0)  # (1, N, H, d)
        v_broadcast = mx.broadcast_to(v_expanded, (num_nodes, num_nodes, self.heads, self.head_dim))
        weighted = mx.expand_dims(attn_weights, axis=-1) * v_broadcast  # (N, N, H, d)
        aggregated = mx.sum(weighted, axis=1)  # (N, H, d)

        # Concatenate heads
        concatenated = mx.reshape(aggregated, (num_nodes, self.heads * self.head_dim))

        output = self.output_proj(concatenated)
        output = self.layer_norm(output + node_features if node_features.shape[-1] == output.shape[-1]
                                  else output)

        return output


class MessagePassingBlock(nn.Module):
    """A single message passing block: attention + feedforward + residual."""

    def __init__(self, dim: int, heads: int, dropout: float) -> None:
        super().__init__()
        self.attention = GraphAttentionLayer(dim, dim, heads=heads, dropout=dropout)
        self.ffn = nn.Sequential(
            nn.Linear(dim, dim * 4),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(dim * 4, dim),
            nn.Dropout(dropout),
        )
        self.norm = nn.LayerNorm(dim)

    def __call__(self, node_features: mx.array, adjacency: mx.array) -> mx.array:
        attended = self.attention(node_features, adjacency)
        output = self.norm(attended + self.ffn(attended))
        return output


class EstherGNN(nn.Module):
    """Graph Neural Network for memory topology anomaly detection.

    Architecture:
        1. Node embedding projection (raw features -> hidden dim)
        2. K message passing blocks (attention + FFN + residual)
        3. Global graph pooling (mean + max concatenation)
        4. Anomaly scoring head (MLP -> scalar anomaly score)

    The model learns to assign high anomaly scores to graph states
    that deviate from the learned baseline distribution. A score > 0
    indicates anomalous topology; magnitude indicates severity.
    """

    def __init__(self, config: EstherConfig | None = None) -> None:
        super().__init__()
        if config is None:
            config = EstherConfig()

        self.config = config
        hidden = config.gnn_hidden_dim
        node_dim = config.node_feature_dim

        # Node feature projection
        self.node_embed = nn.Sequential(
            nn.Linear(node_dim, hidden),
            nn.GELU(),
            nn.LayerNorm(hidden),
        )

        # Message passing layers
        self.mp_layers = [
            MessagePassingBlock(hidden, config.gnn_heads, config.gnn_dropout)
            for _ in range(config.gnn_num_layers)
        ]

        # Anomaly scoring head
        # Input is 2 * hidden (mean_pool || max_pool)
        self.score_head = nn.Sequential(
            nn.Linear(hidden * 2, hidden),
            nn.GELU(),
            nn.Dropout(config.gnn_dropout),
            nn.Linear(hidden, hidden // 4),
            nn.GELU(),
            nn.Linear(hidden // 4, 1),
        )

    def __call__(
        self,
        node_features: mx.array,
        adjacency: mx.array,
    ) -> dict[str, mx.array]:
        """Forward pass: compute anomaly score for a graph state.

        Args:
            node_features: (N, node_feature_dim) raw node features.
            adjacency: (N, N) binary adjacency matrix.

        Returns:
            Dictionary with:
                - "score": Scalar anomaly score (higher = more anomalous).
                - "node_embeddings": (N, hidden_dim) learned node representations.
                - "graph_embedding": (2 * hidden_dim,) global graph vector.
        """
        h = self.node_embed(node_features)

        for layer in self.mp_layers:
            h = layer(h, adjacency)

        # Global graph pooling: mean || max
        mean_pool = mx.mean(h, axis=0)  # (hidden,)
        max_pool = mx.max(h, axis=0)  # (hidden,)
        graph_emb = mx.concatenate([mean_pool, max_pool])  # (2 * hidden,)

        score = self.score_head(graph_emb)  # (1,)

        return {
            "score": mx.squeeze(score),
            "node_embeddings": h,
            "graph_embedding": graph_emb,
        }

    def anomaly_score(
        self,
        node_features: mx.array,
        adjacency: mx.array,
    ) -> float:
        """Convenience method: returns just the scalar anomaly score.

        Args:
            node_features: (N, node_feature_dim) raw node features.
            adjacency: (N, N) binary adjacency matrix.

        Returns:
            Float anomaly score.
        """
        result = self(node_features, adjacency)
        mx.eval(result["score"])
        return result["score"].item()

    def classify_anomaly(
        self,
        score: float,
        config: EstherConfig | None = None,
    ) -> str:
        """Classify an anomaly score into severity levels.

        Args:
            score: Raw anomaly score from the model.
            config: Configuration with threshold values.

        Returns:
            One of: "normal", "warning", "critical".
        """
        cfg = config or self.config
        if score >= cfg.critical_threshold:
            return "critical"
        elif score >= cfg.anomaly_threshold:
            return "warning"
        return "normal"
