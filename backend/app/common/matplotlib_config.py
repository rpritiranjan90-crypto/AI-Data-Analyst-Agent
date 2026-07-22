"""
Centralized Matplotlib configuration.

This module configures Matplotlib for server-side rendering.

It MUST be imported before importing matplotlib.pyplot.
"""

from __future__ import annotations
import matplotlib

# Use a non-GUI backend.
# Required for FastAPI/Uvicorn.
matplotlib.use("Agg")