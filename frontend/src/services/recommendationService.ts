import api from "../api/axios";

export async function getAutoRecommendations() {
  const response = await api.post("/recommendation/auto-recommend");
  return response.data;
}
