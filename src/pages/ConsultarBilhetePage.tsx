import React, { useState } from 'react';
import { api } from '../services/api';
import { Bilhete } from '../types';
import { OfficialLogo } from '../components/OfficialLogo';
import { Search, AlertCircle, ArrowRight, Bus } from 'lucide-react';

interface ConsultarBilhetePageProps {
  onNavigate: (path: string, state?: any) => void;
}

export const ConsultarBilhetePage: React.FC<ConsultarBilhetePageProps> = ({ onNavigate }) => {
  const [numero, setNumero] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const bilhete = await api.consultarBilhete(numero.trim());
      onNavigate(`/bilhete/${bilhete.numeroBilhete}`);
    } catch (err: any) {
      setError(err.message || 'BILHETE NÃO ENCONTRADO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <div className="bg-[#111E2E] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <div className="flex justify-center">
            <OfficialLogo size="md" variant="dark-bg" />
          </div>
          <h1 className="text-3xl font-serif font-extrabold tracking-tight">
            Consultar Bilhete
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Insira o número do seu bilhete (ex: RX-20261003-000012) ou código de reserva para visualizar e descarregar.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Número do Bilhete ou Telefone
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ex: RX-20261003-000012 ou +244931324022"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
                  required
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-4 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#440717] hover:bg-[#A7193D] text-white py-3 rounded-xl font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>A consultar bilhete...</span>
              ) : (
                <>
                  <span>Consultar Bilhete</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bilhetes helper */}
          <div className="pt-4 border-t border-stone-100">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
              Bilhetes de Exemplo para Teste Rápido:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setNumero('RX-20261003-000012')}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1 rounded-md font-mono transition-colors"
              >
                RX-20261003-000012 (Manuel Baptista)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
