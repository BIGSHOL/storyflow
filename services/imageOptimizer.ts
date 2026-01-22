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

// WebP 변환 지원 여부 확인
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
};

// WebP로 변환
export const convertToWebP = async (
  file: File,
  quality: number = 0.8
): Promise<Blob> => {
  return optimizeImage(file, {
    format: 'image/webp',
    quality,
  });
};

// 다중 해상도 이미지 생성 (srcset 지원)
export interface ResponsiveImage {
  width: number;
  blob: Blob;
  url: string;
}

export const generateResponsiveImages = async (
  file: File,
  breakpoints: number[] = [480, 768, 1024, 1920]
): Promise<ResponsiveImage[]> => {
  const results: ResponsiveImage[] = [];

  // 원본 이미지 크기 가져오기
  const originalUrl = URL.createObjectURL(file);
  const dimensions = await getImageDimensions(originalUrl);
  URL.revokeObjectURL(originalUrl);

  // 원본보다 큰 breakpoint는 제외
  const validBreakpoints = breakpoints.filter(bp => bp <= dimensions.width);

  // 원본 크기도 포함
  if (!validBreakpoints.includes(dimensions.width)) {
    validBreakpoints.push(dimensions.width);
  }

  // 각 breakpoint에 대해 이미지 생성
  for (const width of validBreakpoints) {
    const blob = await optimizeImage(file, {
      maxWidth: width,
      maxHeight: Math.round((width / dimensions.width) * dimensions.height),
      quality: 0.8,
      format: supportsWebP() ? 'image/webp' : 'image/jpeg',
    });

    const url = URL.createObjectURL(blob);
    results.push({ width, blob, url });
  }

  return results.sort((a, b) => a.width - b.width);
};

// srcset 문자열 생성
export const generateSrcSet = (images: ResponsiveImage[]): string => {
  return images.map(img => `${img.url} ${img.width}w`).join(', ');
};

// 이미지 품질 분석
export interface ImageQualityInfo {
  originalSize: number;
  estimatedOptimizedSize: number;
  savingsPercent: number;
  recommendation: 'none' | 'light' | 'medium' | 'heavy';
  message: string;
}

export const analyzeImageQuality = async (file: File): Promise<ImageQualityInfo> => {
  const originalSize = file.size;
  const sizeMB = originalSize / (1024 * 1024);

  // 예상 최적화 결과 계산
  let estimatedOptimizedSize: number;
  let recommendation: 'none' | 'light' | 'medium' | 'heavy';
  let message: string;

  if (sizeMB <= 0.5) {
    estimatedOptimizedSize = originalSize;
    recommendation = 'none';
    message = '이미지가 이미 최적화되어 있어요';
  } else if (sizeMB <= 2) {
    estimatedOptimizedSize = originalSize * 0.7;
    recommendation = 'light';
    message = '가벼운 최적화를 권장해요';
  } else if (sizeMB <= 10) {
    estimatedOptimizedSize = originalSize * 0.4;
    recommendation = 'medium';
    message = '최적화하면 로딩 속도가 빨라져요';
  } else {
    estimatedOptimizedSize = originalSize * 0.2;
    recommendation = 'heavy';
    message = '최적화가 필요해요! 파일 크기가 너무 커요';
  }

  const savingsPercent = Math.round((1 - estimatedOptimizedSize / originalSize) * 100);

  return {
    originalSize,
    estimatedOptimizedSize,
    savingsPercent,
    recommendation,
    message,
  };
};

// 자동 최적화 (권장 설정으로 최적화)
export const autoOptimize = async (file: File): Promise<{ blob: Blob; savings: number }> => {
  const analysis = await analyzeImageQuality(file);

  if (analysis.recommendation === 'none') {
    return { blob: file, savings: 0 };
  }

  const options = getRecommendedOptions(file);

  // WebP 지원하면 WebP로 변환
  if (supportsWebP()) {
    options.format = 'image/webp';
  }

  const optimizedBlob = await optimizeImage(file, options);
  const savings = file.size - optimizedBlob.size;

  return { blob: optimizedBlob, savings };
};
