import api from "../api/axios";

export async function uploadDataset(
  file: File,
  onProgress?: (progress: number) => void
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },

    onUploadProgress: (event) => {
      if (!event.total || !onProgress) return;

      const progress = Math.round(
        (event.loaded * 100) / event.total
      );

      onProgress(progress);
    },
  });

  return response.data;
}