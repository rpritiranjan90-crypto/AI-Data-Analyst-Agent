import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# =====================================================
# Project Paths
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_FOLDER = BASE_DIR / "uploads"

UPLOAD_FOLDER.mkdir(
    exist_ok=True
)

# =====================================================
# Upload Settings
# =====================================================

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

ALLOWED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".xls",
}

# =====================================================
# Dataset Settings
# =====================================================

DEFAULT_PREVIEW_ROWS = 10

CACHE_ENABLED = True

# =====================================================
# Application
# =====================================================

APP_NAME = "AI Data Analyst Agent"

VERSION = "2.0.0"

# =====================================================
# AI Configuration
# =====================================================

DEFAULT_AI_PROVIDER = "gemini"

OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY",
    ""
)

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY",
    ""
)

# Primary Gemini model
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash"
)

# Automatic fallback models
GEMINI_MODELS = [
    GEMINI_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
]

OLLAMA_URL = "http://localhost:11434"

# =====================================================
# Logging
# =====================================================

LOG_LEVEL = "INFO"