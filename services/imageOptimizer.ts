interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  format: 'image/jpeg',
};

// 이미지 파일을 최적화
export const optimizeImage = async (
  file: File,
  options: OptimizeOptions = {}
): Promise<Blob> => {
  const { maxWidth, maxHeight, quality, format } = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 컨텍스트를 가져올 수 없습니다'));
      return;
    }

    img.onload = () => {
      // 원본 크기
      let { width, height } = img;

      // 비율 유지하면서 리사이즈
      if (width > maxWidth! || height > maxHeight!) {
        const ratio = Math.min(maxWidth! / width, maxHeight! / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Canvas 크기 설정
      canvas.width = width;
      canvas.height = height;

      // 이미지 그리기 (부드러운 리사이즈)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('이미지 변환에 실패했습니다'));
          }
        },
        format,
        quality
      );

      // 메모리 해제
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('이미지를 불러올 수 없습니다'));
    };

    // 이미지 로드
    img.src = URL.createObjectURL(file);
  });
};

// Blob URL에서 최적화된 Blob 생성
export const optimizeBlobUrl = async (
  blobUrl: string,
  options: OptimizeOptions = {}
): Promise<Blob> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const file = new File([blob], 'image', { type: blob.type });
  return optimizeImage(file, options);
};

// 파일 크기 포맷
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// 이미지 크기 정보 가져오기
export const getImageDimensions = (blobUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = blobUrl;
  });
};

// 자동 최적화가 필요한지 확인 (파일 크기 기준)
export const needsOptimization = (file: File): boolean => {
  // 5MB 이상이면 최적화 권장
  return file.size > 5 * 1024 * 1024;
};

// 추천 옵션 계산
export const getRecommendedOptions = (file: File): OptimizeOptions => {
  const sizeMB = file.size / (1024 * 1024);

  if (sizeMB > 20) {
    return { maxWidth: 1280, maxHeight: 720, quality: 0.6 };
  } else if (sizeMB > 10) {
    return { maxWidth: 1600, maxHeight: 900, quality: 0.7 };
  } else {
    return { maxWidth: 1920, maxHeight: 1080, quality: 0.8 };
  }
};
