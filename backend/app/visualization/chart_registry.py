from __future__ import annotations

from app.visualization.services.area_chart_service import AreaChartService
from app.visualization.services.bar_chart_service import BarChartService
from app.visualization.services.boxplot_service import BoxPlotService
from app.visualization.services.bubble_service import BubbleChartService
from app.visualization.services.bullet_chart_service import BulletChartService
from app.visualization.services.candlestick_service import CandlestickService
from app.visualization.services.choropleth_service import ChoroplethService
from app.visualization.services.countplot_service import CountPlotService
from app.visualization.services.density_map_service import DensityMapService
from app.visualization.services.donut_chart_service import DonutChartService
from app.visualization.services.funnel_service import FunnelService
from app.visualization.services.gantt_chart_service import GanttChartService
from app.visualization.services.gauge_service import GaugeService
from app.visualization.services.heatmap_service import HeatmapService
from app.visualization.services.hexbin_service import HexbinService
from app.visualization.services.histogram_service import HistogramService
from app.visualization.services.icicle_service import IcicleService
from app.visualization.services.kde_service import KDEService
from app.visualization.services.line_chart_service import LineChartService
from app.visualization.services.network_graph_service import NetworkGraphService
from app.visualization.services.ohlc_service import OHLCService
from app.visualization.services.pair_plot_service import PairPlotService
from app.visualization.services.parallel_coordinates_service import (
    ParallelCoordinatesService,
)
from app.visualization.services.pie_chart_service import PieChartService
from app.visualization.services.radar_chart_service import RadarChartService
from app.visualization.services.sankey_service import SankeyService
from app.visualization.services.scatter3d_service import Scatter3DService
from app.visualization.services.scatter_service import ScatterService
from app.visualization.services.strip_plot_service import StripPlotService
from app.visualization.services.sunburst_service import SunburstService
from app.visualization.services.swarm_plot_service import SwarmPlotService
from app.visualization.services.treemap_service import TreemapService
from app.visualization.services.violin_plot_service import ViolinPlotService
from app.visualization.services.waterfall_service import WaterfallService
from app.visualization.services.wordcloud_service import WordCloudService


class ChartRegistry:
    """
    Enterprise Chart Registry.
    """

    _charts = {

        # Basic Charts
        "histogram": HistogramService,
        "bar": BarChartService,
        "line": LineChartService,
        "area": AreaChartService,
        "scatter": ScatterService,
        "bubble": BubbleChartService,
        "pie": PieChartService,
        "donut": DonutChartService,
        "countplot": CountPlotService,
        "boxplot": BoxPlotService,
        "violin": ViolinPlotService,
        "strip": StripPlotService,
        "swarm": SwarmPlotService,
        "kde": KDEService,
        "heatmap": HeatmapService,
        "hexbin": HexbinService,
        "pairplot": PairPlotService,
        "parallel": ParallelCoordinatesService,
        "radar": RadarChartService,
        "scatter3d": Scatter3DService,

        # Hierarchical
        "treemap": TreemapService,
        "sunburst": SunburstService,
        "icicle": IcicleService,

        # Flow
        "sankey": SankeyService,
        "waterfall": WaterfallService,
        "funnel": FunnelService,

        # KPI
        "gauge": GaugeService,
        "bullet": BulletChartService,

        # Financial
        "candlestick": CandlestickService,
        "ohlc": OHLCService,

        # Timeline
        "gantt": GanttChartService,

        # Geographic
        "choropleth": ChoroplethService,
        "densitymap": DensityMapService,

        # Specialized
        "network": NetworkGraphService,
        "wordcloud": WordCloudService,
    }

    @classmethod
    def get(cls, chart_name: str):
        """
        Return the chart service class.
        """
        return cls._charts.get(chart_name.lower())

    @classmethod
    def exists(cls, chart_name: str) -> bool:
        """
        Check whether a chart type is registered.
        """
        return chart_name.lower() in cls._charts

    @classmethod
    def list_charts(cls) -> list[str]:
        """
        Return all registered chart names.
        """
        return sorted(cls._charts.keys())

    @classmethod
    def supported(cls) -> list[str]:
        """
        Backward-compatible alias.
        """
        return cls.list_charts()

    @classmethod
    def register(
        cls,
        chart_name: str,
        chart_class,
    ):
        """
        Register a new chart service.
        """
        cls._charts[chart_name.lower()] = chart_class