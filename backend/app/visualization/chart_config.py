from pathlib import Path

# ==========================
# Chart Settings
# ==========================

CHART_FOLDER = Path("charts")
CHART_FOLDER.mkdir(exist_ok=True)

FIGURE_SIZE = (10, 6)

DPI = 300

IMAGE_FORMAT = "png"

BACKGROUND_COLOR = "white"

GRID_ALPHA = 0.3

TITLE_SIZE = 16

LABEL_SIZE = 12

TIGHT_LAYOUT = True