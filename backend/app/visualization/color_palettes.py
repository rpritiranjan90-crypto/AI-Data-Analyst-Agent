from __future__ import annotations

from enum import Enum


class Palette(str, Enum):
    """
    Supported visualization color palettes.
    """

    DEFAULT = "tab10"
    PASTEL = "Pastel1"
    BRIGHT = "Set1"
    DARK = "Dark2"
    ACCENT = "Accent"
    PAIRED = "Paired"
    VIRIDIS = "viridis"
    PLASMA = "plasma"
    INFERNO = "inferno"
    MAGMA = "magma"
    CIVIDIS = "cividis"


class ColorPalette:
    """
    Centralized color palette manager.
    """

    DEFAULT = Palette.DEFAULT

    @classmethod
    def get(cls, palette: Palette | str | None = None) -> str:
        """
        Return a valid matplotlib colormap name.
        """

        if palette is None:
            return cls.DEFAULT.value

        if isinstance(palette, Palette):
            return palette.value

        try:
            return Palette(palette).value
        except ValueError:
            return cls.DEFAULT.value

    @classmethod
    def available(cls) -> list[str]:
        """
        Return all supported palettes.
        """

        return [palette.value for palette in Palette]