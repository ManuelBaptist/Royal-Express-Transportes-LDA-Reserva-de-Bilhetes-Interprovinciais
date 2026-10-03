import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface PaymentTimerProps {
  expiresAt: string; // ISO date string from backend
  onExpire?: () => void;
  className?: string;
}

export const PaymentTimer: React.FC<PaymentTimerProps> = ({
  expiresAt,
  onExpire,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 3600,
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));

      if (diff <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isExpired: true
        });
        if (onExpire) onExpire();
        return;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({
        hours,
        minutes,
        seconds,
        totalSeconds: diff,
        isExpired: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const pad = (n: number) => String(n).padStart(2, '0');

  // Percentage of 60 minutes remaining
  const percentage = Math.min(100, Math.max(0, (timeLeft.totalSeconds / 3600) * 100));

  if (timeLeft.isExpired) {
    return (
      <div className={`bg-rose-50 border border-rose-300 rounded-lg p-3 text-rose-800 flex items-center gap-2 text-sm ${className}`}>
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <strong className="font-semibold">Prazo Expirado!</strong>
          <p className="text-xs text-rose-700">
            O tempo de 60 minutos para pagamento desta reserva terminou. O lugar foi libertado para outros passageiros.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-amber-900 text-sm font-semibold">
          <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <span>Prazo para Pagamento</span>
        </div>
        <div className="font-mono tabular-nums text-lg font-bold text-[#440717]">
          {timeLeft.hours > 0 ? `${pad(timeLeft.hours)}:` : ''}
          {pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-amber-500 to-[#A7193D] h-2 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
        <span>Validade: 60 minutos</span>
        <span>Controlado pelo servidor</span>
      </div>
    </div>
  );
};
