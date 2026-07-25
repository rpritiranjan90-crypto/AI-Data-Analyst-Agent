import api from "../api/axios";

export interface MLTrainPayload {
  target: string;
  algorithm: string;
  test_size?: number;
  random_state?: number;
}

export async function trainModel(payload: MLTrainPayload) {
  const response = await api.post("/ml/train", payload);
  return response.data;
}

export async function getAvailableModels() {
  const response = await api.get("/ml/models");
  return response.data;
}

export async function getMLStatus() {
  const response = await api.get("/ml/status");
  return response.data;
}

export async function getMLTrainingSummary() {
  const response = await api.get("/ml/training-summary");
  return response.data;
}
