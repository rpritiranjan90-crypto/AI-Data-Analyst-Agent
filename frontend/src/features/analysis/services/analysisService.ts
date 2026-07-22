import api from "../../../api/axios";

import type {
  AnalysisInsightsResponse,
  AnalysisSummaryResponse,
  CategoricalResponse,
  CorrelationResponse,
  DescriptiveStatisticsResponse,
  DistributionResponse,
  StrongCorrelationResponse,
  TimeSeriesResponse,
} from "../types/analysis";

/**
 * ==========================================================
 * Analysis Service
 * ==========================================================
 * Handles all Analysis API requests.
 * ==========================================================
 */
class AnalysisService {
  async getSummary(): Promise<AnalysisSummaryResponse> {
    const response = await api.get<AnalysisSummaryResponse>(
      "/analysis/summary"
    );

    return response.data;
  }

  async getDescriptive(): Promise<DescriptiveStatisticsResponse> {
    const response = await api.get<DescriptiveStatisticsResponse>(
      "/analysis/descriptive"
    );

    return response.data;
  }

  async getCorrelation(
    method: "pearson" | "spearman" | "kendall" = "pearson"
  ): Promise<CorrelationResponse> {
    const response = await api.get<CorrelationResponse>(
      "/analysis/correlation",
      {
        params: {
          method,
        },
      }
    );

    return response.data;
  }

  async getStrongCorrelations(): Promise<StrongCorrelationResponse> {
    const response = await api.get<StrongCorrelationResponse>(
      "/analysis/strong-correlations"
    );

    return response.data;
  }

  async getCategorical(): Promise<CategoricalResponse> {
    const response = await api.get<CategoricalResponse>(
      "/analysis/categorical"
    );

    return response.data;
  }

  async getDistribution(): Promise<DistributionResponse> {
    const response = await api.get<DistributionResponse>(
      "/analysis/distribution"
    );

    return response.data;
  }

  async getTimeSeries(): Promise<TimeSeriesResponse> {
    const response = await api.get<TimeSeriesResponse>(
      "/analysis/timeseries"
    );

    return response.data;
  }

  async getInsights(): Promise<AnalysisInsightsResponse> {
    const response = await api.get<AnalysisInsightsResponse>(
      "/analysis/insights"
    );

    return response.data;
  }
}

const analysisService = new AnalysisService();

export default analysisService;