import imageCompression from 'browser-image-compression';

export async function compressImage(file: File, maxWidthOrHeight: number = 1200): Promise<File> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

export async function getCompressedImageData(file: File): Promise<{
  blob: Blob;
  originalSize: number;
  compressedSize: number;
}> {
  const compressed = await compressImage(file);
  return {
    blob: compressed,
    originalSize: file.size,
    compressedSize: compressed.size,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
