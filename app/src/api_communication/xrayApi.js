const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// POST /edge-detect (Single Image Upload)
export async function uploadSingleImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/edge-detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to process image");
  }

  return response.json();
}

export function getProcessedImageUrl(imageId, edgeType) {
  return `${API_BASE_URL}/image/${imageId}/${edgeType}`;
}

// Upload ZIP file for batch processing
export async function uploadBatchZip(zipFile) {
  const formData = new FormData();
  formData.append("file", zipFile);

  const response = await fetch(`${API_BASE_URL}/batch-edge-detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Batch processing failed");
  }

  return response.json();
}

export default {
  uploadSingleImage,
  uploadBatchZip,
  getProcessedImageUrl,
};