import { useState } from 'react';

interface MovieImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function MovieImage({ 
  src, 
  alt, 
  className = "w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-lg",
  fallbackSrc = "/api/placeholder/200/300"
}: MovieImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}
