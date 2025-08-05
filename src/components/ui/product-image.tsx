'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon?: boolean;
}

export function ProductImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  fallbackIcon = true 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleImageError = () => {
    setImageError(true);
    setImageSrc(null);
  };

  // If no src provided or image failed to load, show fallback
  if (!imageSrc || imageError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        {fallbackIcon ? (
          <Package className={`text-gray-400 ${width <= 48 ? 'h-5 w-5' : 'h-6 w-6'}`} />
        ) : (
          <div className={`text-gray-400 text-xs text-center ${width <= 48 ? 'text-xs' : 'text-sm'}`}>
            No Image
          </div>
        )}
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
      onLoad={() => setImageError(false)}
    />
  );
}
