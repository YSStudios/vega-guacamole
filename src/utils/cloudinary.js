// Cloudinary optimization utilities
export class CloudinaryOptimizer {
  static getOptimizedUrl(originalUrl, options = {}) {
    if (!originalUrl) {
      return originalUrl;
    }
    
    // If not a Cloudinary URL, return as-is
    if (!originalUrl.includes('res.cloudinary.com')) {
      return originalUrl;
    }

    const {
      width,
      height,
      quality = 'auto:good', // auto:low, auto:good, auto:best
      format = 'auto', // auto format selection
      fetchFormat = 'auto', // f_auto
      crop = 'fill',
      gravity = 'auto',
      loading = 'lazy',
    } = options;

    try {
      // Parse the Cloudinary URL
      const url = new URL(originalUrl);
      const pathParts = url.pathname.split('/');
      
      // Find the transformation part (usually after /upload/)
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex === -1) return originalUrl;

      // Build transformation string
      const transformations = [];
      
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      if (crop) transformations.push(`c_${crop}`);
      if (gravity) transformations.push(`g_${gravity}`);
      if (quality) transformations.push(`q_${quality}`);
      if (format) transformations.push(`f_${format}`);
      
      // Add lazy loading for better performance
      if (loading === 'lazy') {
        transformations.push('fl_lazy');
      }

      // Reconstruct the URL with optimizations
      const newPathParts = [
        ...pathParts.slice(0, uploadIndex + 1),
        transformations.join(','),
        ...pathParts.slice(uploadIndex + 1)
      ];

      url.pathname = newPathParts.join('/');
      return url.toString();
    } catch (error) {
      console.warn('Failed to optimize Cloudinary URL:', error);
      return originalUrl;
    }
  }

  // Common presets for different use cases
  static getThumbnail(url, size = 300) {
    if (!url) return url;
    return this.getOptimizedUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto:good',
      format: 'auto'
    });
  }

  static getResponsiveImage(url, maxWidth = 1200) {
    if (!url) return url;
    return this.getOptimizedUrl(url, {
      width: maxWidth,
      quality: 'auto:good',
      format: 'auto',
      crop: 'scale'
    });
  }

  static getVideoThumbnail(url, options = {}) {
    const { width = 640, height = 360 } = options;
    return this.getOptimizedUrl(url, {
      width,
      height,
      crop: 'fill',
      quality: 'auto:good',
      format: 'jpg' // Force JPG for video thumbnails
    });
  }

  // Preload critical images
  static preloadImage(url, options = {}) {
    if (typeof window === 'undefined') return;

    const optimizedUrl = this.getOptimizedUrl(url, options);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedUrl;
    document.head.appendChild(link);
  }
}

// Cache commonly requested transformations
const transformationCache = new Map();

export function getCachedTransformation(url, options) {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  
  if (transformationCache.has(cacheKey)) {
    return transformationCache.get(cacheKey);
  }

  const optimizedUrl = CloudinaryOptimizer.getOptimizedUrl(url, options);
  transformationCache.set(cacheKey, optimizedUrl);
  
  // Limit cache size to prevent memory leaks
  if (transformationCache.size > 1000) {
    const firstKey = transformationCache.keys().next().value;
    transformationCache.delete(firstKey);
  }

  return optimizedUrl;
}