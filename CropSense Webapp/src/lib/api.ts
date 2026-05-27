import { PredictionResult } from "./types";

/**
 * Uploads a leaf image file (from upload or camera) to the /api/predict route.
 */
export async function predictImage(file: File | Blob): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file, "leaf_image.jpg");

  const response = await fetch("/api/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Inference server error (${response.status})`);
  }

  return response.json();
}

/**
 * Predicts from a sample image URL. Fetches the image as a blob first,
 * then uploads it to the prediction endpoint.
 */
export async function predictFromUrl(url: string): Promise<PredictionResult> {
  const imageRes = await fetch(url);
  if (!imageRes.ok) {
    throw new Error(`Failed to load sample image from ${url}`);
  }
  const blob = await imageRes.blob();
  return predictImage(blob);
}

/**
 * Fetches the list of sample images from the local API route.
 */
export async function getSamples(): Promise<{ category: string; path: string; filename: string }[]> {
  const response = await fetch("/api/samples");
  if (!response.ok) {
    throw new Error("Failed to load sample list");
  }
  const data = await response.json();
  return data.samples || [];
}
