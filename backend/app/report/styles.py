from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle,
)
styles = getSampleStyleSheet()
TITLE_STYLE = ParagraphStyle(
    "TitleStyle",
    parent=styles["Title"],
    fontSize=28,
    alignment=TA_CENTER,
    textColor=colors.darkblue,
    spaceAfter=20,
)
SECTION_STYLE = ParagraphStyle(
    "SectionStyle",
    parent=styles["Heading2"],
    fontSize=16,
    textColor=colors.darkblue,
    spaceBefore=15,
    spaceAfter=10,
)
NORMAL_STYLE = ParagraphStyle(
    "NormalStyle",
    parent=styles["BodyText"],
    leading=18,
)
FOOTER_STYLE = ParagraphStyle(
    "FooterStyle",
    parent=styles["BodyText"],
    alignment=TA_CENTER,
    textColor=colors.grey,
)