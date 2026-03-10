"""
Core entropy computation for the Esther AI subsystem.

Calculates the time derivative of Shannon entropy over system memory state
tensors, using Apple MLX for Metal-accelerated computation on Apple Silicon.
Supports 4-bit quantization for memory-constrained monitoring.
"""

from __future__ import annotations

import mlx.core as mx
import numpy as np

from esther.config import EstherConfig


def _normalize_distribution(tensor: mx.array, epsilon: float) -> mx.array:
    """Normalize a raw state tensor into a valid probability distribution.

    Applies softmax normalization along the last axis so values sum to 1
    and are strictly positive (stabilized by epsilon).

    Args:
        tensor: Raw state tensor of any shape. Last axis is treated as the
                distribution axis.
        epsilon: Small constant added before log to prevent -inf.

    Returns:
        Normalized probability distribution with same shape as input.
    """
    max_vals = mx.max(tensor, axis=-1, keepdims=True)
    shifted = tensor - max_vals
    exp_vals = mx.exp(shifted)
    sum_vals = mx.sum(exp_vals, axis=-1, keepdims=True)
    probs = exp_vals / (sum_vals + epsilon)
    return mx.clip(probs, epsilon, 1.0)


def _shannon_entropy(probs: mx.array, epsilon: float) -> mx.array:
    """Compute Shannon entropy H = -sum(p * log2(p)) along the last axis.

    Args:
        probs: Probability distribution tensor (last axis sums to 1).
        epsilon: Numerical stabilization constant.

    Returns:
        Entropy values with the last dimension reduced.
    """
    log_probs = mx.log2(probs + epsilon)
    return -mx.sum(probs * log_probs, axis=-1)


def _finite_difference(values: mx.array, order: int) -> mx.array:
    """Compute the n-th order finite difference of a 1-D array.

    Uses central differences where possible, falling back to forward/backward
    differences at boundaries.

    Args:
        values: 1-D array of sequential measurements.
        order: Derivative order (1 = first derivative, 2 = second, etc.).

    Returns:
        Array of finite differences (length reduced by `order`).
    """
    result = values
    for _ in range(order):
        if result.shape[0] < 2:
            return mx.array([0.0])
        result = result[1:] - result[:-1]
    return result


def compute_entropy_derivative(
    memory_state_tensor: mx.array,
    config: EstherConfig | None = None,
) -> dict[str, mx.array]:
    """Calculate the time derivative of Shannon entropy over a memory state sequence.

    This is the core Esther AI primitive. Given a sequence of system state snapshots
    (each snapshot is a vector representing memory/register/cache state), it:

    1. Normalizes each snapshot into a probability distribution.
    2. Computes Shannon entropy for each timestep.
    3. Calculates the finite-difference derivative of entropy over time.
    4. Returns statistics for anomaly scoring downstream.

    A spike in entropy derivative indicates rapid state disorder changes —
    the hallmark of code injection, memory corruption, or adversarial mutation.

    Args:
        memory_state_tensor: Tensor of shape (T, D) where T is the number of
            time steps and D is the state dimensionality. Each row is a raw
            state snapshot (not yet normalized).
        config: Esther configuration. Uses defaults if None.

    Returns:
        Dictionary with keys:
            - "entropy": (T,) array of Shannon entropy at each timestep.
            - "derivative": (T - order,) array of entropy derivatives.
            - "mean": Scalar mean of the derivative.
            - "std": Scalar standard deviation of the derivative.
            - "max_abs": Scalar maximum absolute derivative value.
            - "current": The most recent derivative value.

    Raises:
        ValueError: If tensor has fewer than 2 time steps or is not 2-D.
    """
    if config is None:
        config = EstherConfig()

    if memory_state_tensor.ndim != 2:
        raise ValueError(
            f"memory_state_tensor must be 2-D (T, D), got shape {memory_state_tensor.shape}"
        )

    num_timesteps = memory_state_tensor.shape[0]
    if num_timesteps < 2:
        raise ValueError(
            f"Need at least 2 timesteps for derivative, got {num_timesteps}"
        )

    probs = _normalize_distribution(memory_state_tensor, config.epsilon)

    entropy_series = _shannon_entropy(probs, config.epsilon)

    derivative = _finite_difference(entropy_series, config.derivative_order)

    mx.eval(derivative)

    deriv_mean = mx.mean(derivative)
    deriv_std = mx.sqrt(mx.mean((derivative - deriv_mean) ** 2) + config.epsilon)
    max_abs = mx.max(mx.abs(derivative))
    current = derivative[-1] if derivative.shape[0] > 0 else mx.array(0.0)

    return {
        "entropy": entropy_series,
        "derivative": derivative,
        "mean": deriv_mean,
        "std": deriv_std,
        "max_abs": max_abs,
        "current": current,
    }


def quantize_state_4bit(tensor: mx.array, group_size: int = 64) -> tuple[mx.array, mx.array, mx.array]:
    """Quantize a state tensor to 4-bit representation for memory efficiency.

    Uses symmetric min-max quantization within groups of `group_size` elements.
    This allows Esther to monitor large state spaces without exhausting memory.

    Args:
        tensor: Input tensor to quantize. Last axis length must be divisible
                by group_size.
        group_size: Number of elements per quantization group.

    Returns:
        Tuple of (quantized_values, scales, zero_points) that can reconstruct
        the original tensor approximately.
    """
    original_shape = tensor.shape
    flat = mx.reshape(tensor, (-1,))

    pad_len = (group_size - flat.shape[0] % group_size) % group_size
    if pad_len > 0:
        flat = mx.concatenate([flat, mx.zeros((pad_len,))])

    grouped = mx.reshape(flat, (-1, group_size))

    mins = mx.min(grouped, axis=-1, keepdims=True)
    maxs = mx.max(grouped, axis=-1, keepdims=True)

    scales = (maxs - mins) / 15.0  # 4-bit = 16 levels (0-15)
    scales = mx.where(scales == 0, mx.ones_like(scales), scales)

    zero_points = mins

    quantized = mx.round((grouped - zero_points) / scales)
    quantized = mx.clip(quantized, 0.0, 15.0).astype(mx.uint8)

    return quantized, scales, zero_points


def dequantize_state_4bit(
    quantized: mx.array,
    scales: mx.array,
    zero_points: mx.array,
    original_numel: int,
) -> mx.array:
    """Reconstruct a tensor from 4-bit quantized representation.

    Args:
        quantized: Quantized uint8 values (0-15).
        scales: Per-group scale factors.
        zero_points: Per-group zero points (mins).
        original_numel: Number of elements in the original tensor.

    Returns:
        Approximately reconstructed float32 tensor.
    """
    dequantized = quantized.astype(mx.float32) * scales + zero_points
    flat = mx.reshape(dequantized, (-1,))
    return flat[:original_numel]
