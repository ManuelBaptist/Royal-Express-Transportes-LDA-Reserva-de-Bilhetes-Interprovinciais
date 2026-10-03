import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 180,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: '#111E2E',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      }, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [value, size]);

  return (
    <div className={`flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-stone-200 ${className}`}>
      <canvas ref={canvasRef} className="rounded" />
    </div>
  );
};
