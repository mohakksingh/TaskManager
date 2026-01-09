import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', color = 'border-black', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${color}`}
      ></div>
    </div>
  );
};

export default Loader;
