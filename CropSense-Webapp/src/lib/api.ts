import { PredictionResult } from "./types";

/**
 * Compresses an image file client-side to prevent "Payload Too Large" errors (e.g., from high-res phone cameras).
 */
async function compressImage(file: File | Blob, maxWidth = 1024, maxHeight = 1024, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads a leaf image file (from upload or camera) to the /api/predict route.
 */
export async function predictImage(file: File | Blob): Promise<PredictionResult> {
  let uploadBlob: File | Blob = file;

  if (typeof window !== "undefined") {
    try {
      uploadBlob = await compressImage(file);
    } catch (err) {
      console.warn("Client-side compression failed, uploading original file", err);
    }
  }

  const formData = new FormData();
  formData.append("file", uploadBlob, "leaf_image.jpg");

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
