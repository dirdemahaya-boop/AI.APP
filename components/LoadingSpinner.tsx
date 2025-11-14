import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'h-6' }) => {
  return (
    <svg
      className={`${className} w-auto text-pastel-yellow`}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-label="جاري التحميل..."
    >
      <circle cx="10" cy="20" r="8">
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="1s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
          values="0 0;0 -12;0 0"
          begin="0s"
        />
      </circle>
      <circle cx="30" cy="20" r="8">
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="1s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
          values="0 0;0 -12;0 0"
          begin="0.15s"
        />
      </circle>
      <circle cx="50" cy="20" r="8">
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="1s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
          values="0 0;0 -12;0 0"
          begin="0.3s"
        />
      </circle>
    </svg>
  );
};

export default LoadingSpinner;