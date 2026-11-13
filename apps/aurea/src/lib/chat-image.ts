/**
 * Prepares a photo for the chatbot API (lk-chatbot `/message`, which takes
 * `imageBase64` + `imageMimeType`, body limit 15 MB). Photos are downscaled
 * in the browser so phone pictures upload quickly on mobile data.
 */

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;

export interface PreparedImage {
  base64: string;
  mimeType: string;
  /** For the local preview only; never sent anywhere. */
  dataUrl: string;
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = src;
  });
}

function split(dataUrl: string, fallbackType: string): PreparedImage {
  const [header, base64 = ""] = dataUrl.split(",");
  const mimeType = header?.match(/data:([^;]+)/)?.[1] ?? fallbackType;
  return { base64, mimeType, dataUrl };
}

/**
 * Returns the image downscaled to MAX_EDGE as JPEG. If the browser cannot
 * decode the format (e.g. HEIC outside Safari), sends the original file.
 * Throws "too-large" or "not-image" for files that should be refused.
 */
export async function prepareChatImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) throw new Error("not-image");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("too-large");

  const original = await readAsDataUrl(file);
  try {
    const img = await loadImage(original);
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return split(original, file.type);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return split(canvas.toDataURL("image/jpeg", JPEG_QUALITY), "image/jpeg");
  } catch {
    return split(original, file.type);
  }
}
