import React from 'react';
import { Lugar, EstadoLugar } from '../types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SeatMapProps {
  lugares: Lugar[];
  selectedSeatNumber: number | null;
  onSelectSeat: (seatNumber: number) => void;
  price: number;
  viaturaName?: string;
  loading?: boolean;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  lugares,
  selectedSeatNumber,
  onSelectSeat,
  price,
  viaturaName = 'Volvo B11R Marcopolo G7 - 50 Lugares',
  loading = false
}) => {
  const getSeatColor = (estado: EstadoLugar, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-[#440717] text-white ring-4 ring-[#A7193D]/40 font-bold scale-105 shadow-md';
    }
    switch (estado) {
      case 'DISPONIVEL':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm active:scale-95';
      case 'OCUPADO':
        return 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-75';
      case 'RESERVADO_TEMPORARIAMENTE':
        return 'bg-amber-400 text-amber-950 cursor-not-allowed font-medium';
      case 'BLOQUEADO':
        return 'bg-stone-700 text-stone-400 cursor-not-allowed';
      default:
        return 'bg-stone-200 text-stone-600';
    }
  };

  const formatSeatNum = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Create row groups for a 50-seat bus (Rows 1 to 13)
  // Row 1: Left has seat 1 (next to driver), Right has seat 2, 3
  // Rows 2-12: Left [A, B], Right [C, D]
  // Row 13 (back row): 5 seats across
  const rows: { rowNumber: number; left: Lugar[]; right: Lugar[] }[] = [];
  
  for (let r = 1; r <= 13; r++) {
    const seatsInRow = lugares.filter(l => l.fila === r);
    const left = seatsInRow.filter(l => l.coluna === 'A' || l.coluna === 'B');
    const right = seatsInRow.filter(l => l.coluna === 'C' || l.coluna === 'D');
    rows.push({ rowNumber: r, left, right });
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 sm:p-6">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#111E2E] flex items-center gap-2">
            <span>Mapa de Lugares</span>
            <span className="text-xs font-normal text-stone-500">({viaturaName})</span>
          </h3>
          <p className="text-xs text-stone-500">
            Clique no lugar livre pretendido para reservar.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-600 inline-block shadow-xs" />
            <span className="text-stone-600">Disponível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#440717] inline-block shadow-xs" />
            <span className="text-stone-600 font-semibold">Seleccionado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-stone-300 inline-block" />
            <span className="text-stone-600">Ocupado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-amber-400 inline-block" />
            <span className="text-stone-600">Reserva Temp.</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-stone-500 text-sm">
          A carregar mapa de lugares da viatura...
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center">
          {/* Coach bus body container */}
          <div className="w-full max-w-sm sm:max-w-md bg-stone-50 border-2 border-stone-300 rounded-3xl p-4 sm:p-6 shadow-inner relative">
            
            {/* Front of Bus with Driver Area */}
            <div className="flex items-center justify-between pb-5 mb-4 border-b-2 border-dashed border-stone-300">
              <div className="flex items-center gap-2 bg-[#111E2E] text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                {/* Steering wheel SVG */}
                <svg className="w-4 h-4 text-amber-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 0-10 10" />
                  <path d="M12 12L2 12" />
                  <path d="M12 12l7 7" />
                  <path d="M12 12l7-7" />
                </svg>
                <span>MOTORISTA</span>
              </div>
              <div className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase bg-stone-200 px-2.5 py-1 rounded">
                PORTA DE ENTRADA
              </div>
            </div>

            {/* Seats Grid */}
            <div className="space-y-2.5">
              {rows.map((row) => (
                <div key={row.rowNumber} className="flex items-center justify-between gap-4">
                  {/* Left Column (2 seats) */}
                  <div className="flex items-center gap-2">
                    {row.left.map((seat) => {
                      const isSelected = selectedSeatNumber === seat.numero;
                      const isClickable = seat.estado === 'DISPONIVEL';

                      return (
                        <button
                          key={seat.numero}
                          type="button"
                          disabled={!isClickable}
                          onClick={() => onSelectSeat(seat.numero)}
                          title={`Lugar ${formatSeatNum(seat.numero)} - ${seat.estado}`}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${getSeatColor(
                            seat.estado,
                            isSelected
                          )}`}
                        >
                          {formatSeatNum(seat.numero)}
                        </button>
                      );
                    })}
                    {/* Fill gap if row 1 only has 1 seat on left */}
                    {row.left.length === 1 && <div className="w-9 h-9 sm:w-10 sm:h-10" />}
                  </div>

                  {/* Central Aisle */}
                  <div className="flex-1 flex justify-center text-[10px] text-stone-400 uppercase tracking-widest select-none">
                    {row.rowNumber === 7 && <span className="rotate-90">CORREDOR</span>}
                  </div>

                  {/* Right Column (2 seats) */}
                  <div className="flex items-center gap-2">
                    {row.right.map((seat) => {
                      const isSelected = selectedSeatNumber === seat.numero;
                      const isClickable = seat.estado === 'DISPONIVEL';

                      return (
                        <button
                          key={seat.numero}
                          type="button"
                          disabled={!isClickable}
                          onClick={() => onSelectSeat(seat.numero)}
                          title={`Lugar ${formatSeatNum(seat.numero)} - ${seat.estado}`}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${getSeatColor(
                            seat.estado,
                            isSelected
                          )}`}
                        >
                          {formatSeatNum(seat.numero)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rear of bus */}
            <div className="mt-4 pt-3 border-t-2 border-stone-200 text-center text-[11px] text-stone-400 font-medium">
              FUNDO DA VIATURA
            </div>
          </div>
        </div>
      )}

      {/* Selected Seat Notification Bar */}
      <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-4 rounded-lg">
        <div>
          {selectedSeatNumber ? (
            <div className="flex items-center gap-2 text-stone-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm">
                Lugar Seleccionado: <strong className="text-[#440717] font-bold text-base">Nº {formatSeatNum(selectedSeatNumber)}</strong>
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-sm font-semibold text-stone-900">
                {price.toLocaleString('pt-AO')} Kz
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Nenhum lugar seleccionado ainda. Clique num lugar verde.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
