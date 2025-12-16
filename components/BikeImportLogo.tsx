import React from 'react';

interface BikeImportLogoProps {
  size?: number;
  className?: string;
}

const BikeImportLogo: React.FC<BikeImportLogoProps> = ({
  size = 32,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Black rectangle - top */}
      <rect
        x="4"
        y="4"
        width="24"
        height="6"
        fill="#000000"
      />

      {/* Light blue rectangle - middle */}
      <rect
        x="4"
        y="12"
        width="16"
        height="6"
        fill="#3b82f6"
      />

      {/* Red/Orange rectangle - bottom */}
      <rect
        x="4"
        y="20"
        width="20"
        height="8"
        fill="#ef4444"
      />
    </svg>
  );
};

export default BikeImportLogo;