import re


class AITextFormatter:
    """
    Cleans AI-generated text before rendering it into the PDF.
    """

    @staticmethod
    def clean(text: str) -> str:

        if not text:
            return ""

        # Remove Markdown headings
        text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)

        # Remove bold markers
        text = text.replace("**", "")

        # Remove italic markers
        text = text.replace("*", "")

        # Remove horizontal rules
        text = re.sub(r"^-{3,}$", "", text, flags=re.MULTILINE)

        # Remove repeated blank lines
        text = re.sub(r"\n\s*\n", "\n\n", text)

        # Convert new lines for ReportLab
        text = text.replace("\n", "<br/>")

        return text.strip()