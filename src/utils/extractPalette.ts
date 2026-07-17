// Extract a dominant color palette from an image using a lightweight
// k-means clustering pass over sampled pixel data.

import { rgbToHex, type RGB } from "./color";

function samplePixels(imageData: ImageData, maxSamples = 8000): RGB[] {
  const { data, width, height } = imageData;
  const totalPixels = width * height;
  const step = Math.max(1, Math.floor(totalPixels / maxSamples));
  const pixels: RGB[] = [];

  for (let i = 0; i < totalPixels; i += step) {
    const offset = i * 4;
    const alpha = data[offset + 3];
    if (alpha < 125) continue; // skip mostly-transparent pixels
    pixels.push({
      r: data[offset],
      g: data[offset + 1],
      b: data[offset + 2],
    });
  }

  return pixels;
}

function kMeans(pixels: RGB[], k: number, iterations = 8): RGB[] {
  if (pixels.length === 0) return [];
  if (pixels.length <= k) return pixels;

  // Initialize centroids by picking evenly spaced samples (deterministic-ish).
  let centroids: RGB[] = Array.from({ length: k }, (_, i) => {
    const idx = Math.floor((i * pixels.length) / k);
    return { ...pixels[idx] };
  });

  let assignments = new Array<number>(pixels.length).fill(0);

  for (let iter = 0; iter < iterations; iter++) {
    // Assign step
    for (let p = 0; p < pixels.length; p++) {
      let bestDist = Infinity;
      let bestCluster = 0;
      for (let c = 0; c < centroids.length; c++) {
        const dr = pixels[p].r - centroids[c].r;
        const dg = pixels[p].g - centroids[c].g;
        const db = pixels[p].b - centroids[c].b;
        const dist = dr * dr + dg * dg + db * db;
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = c;
        }
      }
      assignments[p] = bestCluster;
    }

    // Update step
    const sums = Array.from({ length: k }, () => ({ r: 0, g: 0, b: 0, count: 0 }));
    for (let p = 0; p < pixels.length; p++) {
      const cluster = assignments[p];
      sums[cluster].r += pixels[p].r;
      sums[cluster].g += pixels[p].g;
      sums[cluster].b += pixels[p].b;
      sums[cluster].count += 1;
    }

    centroids = sums.map((s, idx) =>
      s.count > 0
        ? { r: s.r / s.count, g: s.g / s.count, b: s.b / s.count }
        : centroids[idx],
    );
  }

  // Sort clusters by population (largest first) for a nicer palette order.
  const counts = new Array<number>(k).fill(0);
  for (const cluster of assignments) counts[cluster] += 1;
  const order = counts
    .map((count, idx) => ({ count, idx }))
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.idx);

  return order.map((idx) => centroids[idx]);
}

export interface ExtractedPalette {
  hexColors: string[];
}

export async function extractPaletteFromImage(
  file: File,
  colorCount = 6,
): Promise<ExtractedPalette> {
  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(imageUrl);
    const canvas = document.createElement("canvas");
    const maxDim = 200; // downscale for performance
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context is not available");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = samplePixels(imageData);
    const centroids = kMeans(pixels, colorCount);

    return { hexColors: centroids.map(rgbToHex) };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
