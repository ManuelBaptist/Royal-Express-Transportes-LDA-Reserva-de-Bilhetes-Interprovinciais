import React from 'react';
import logoImg from '../assets/images/royal_express_official_logo_1791024796263.jpg';

interface OfficialLogoProps {
  className?: string;
  variant?: 'light-bg' | 'dark-bg' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  className = '',
  variant = 'light-bg',
  size = 'md',
  onClick
}) => {
  // Height constraints based on size
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  const imgElement = (
    <img
      src={logoImg}
      alt="Royal Express Transportes, LDA - Logótipo Oficial"
      className={`${sizeClasses[size]} w-auto object-contain shrink-0`}
      style={{ imageRendering: 'auto' }}
    />
  );

  // If used over dark background, we adapt the background (white plaque) to strictly preserve the official logo
  if (variant === 'dark-bg') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-white rounded-xl px-3 py-1.5 shadow-sm border border-stone-200/50 hover:bg-white/95 transition-colors ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        title="Royal Express Transportes, LDA"
      >
        {imgElement}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      title="Royal Express Transportes, LDA"
    >
      {imgElement}
    </div>
  );
};
