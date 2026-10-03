import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Viagem } from '../types';
import { OfficialLogo } from '../components/OfficialLogo';
import { Search, MapPin, Calendar, Clock, Bus, ArrowRight, Filter } from 'lucide-react';

interface RotasPageProps {
  onNavigate: (path: string, state?: any) => void;
  initialFilters?: { origem?: string; destino?: string; data?: string };
}

export const RotasPage: React.FC<RotasPageProps> = ({ onNavigate, initialFilters }) => {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [origem, setOrigem] = useState(initialFilters?.origem || '');
  const [destino, setDestino] = useState(initialFilters?.destino || '');
  const [data, setData] = useState(initialFilters?.data || '');

  const carregarViagens = async () => {
    try {
      setLoading(true);
      const res = await api.getViagens({
        origem: origem || undefined,
        destino: destino || undefined,
        data: data || undefined
      });
      setViagens(res);
    } catch (err) {
      console.error('Erro ao carregar viagens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarViagens();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    carregarViagens();
  };

  const handleLimparFiltros = () => {
    setOrigem('');
    setDestino('');
    setData('');
    setTimeout(carregarViagens, 0);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Page Header Banner (as in prototype image 2) */}
      <div className="bg-[#111E2E] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">
              Rotas e Horários
            </h1>
            <p className="text-stone-300 text-sm mt-2 max-w-xl">
              Encontre a rota ideal para o seu destino com saídas diárias, conforto de primeira classe e horários pontuais.
            </p>
          </div>
          <OfficialLogo size="md" variant="dark-bg" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border border-stone-200 p-4 sm:p-6 mb-8">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Origem
              </label>
              <select
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
              >
                <option value="">Todas as origens</option>
                <option value="Luanda">Luanda</option>
                <option value="Benguela">Benguela</option>
                <option value="Huambo">Huambo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Destino
              </label>
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
              >
                <option value="">Todos os destinos</option>
                <option value="Benguela">Benguela</option>
                <option value="Huambo">Huambo</option>
                <option value="Bié">Bié</option>
                <option value="Waku Kungu">Waku Kungu</option>
                <option value="Soyo">Soyo</option>
                <option value="Kibala">Kibala</option>
                <option value="Luanda">Luanda</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Data da Viagem
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#440717] hover:bg-[#A7193D] text-white py-2 px-4 rounded-lg font-semibold text-xs shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" /> Pesquisar
              </button>
              {(origem || destino || data) && (
                <button
                  type="button"
                  onClick={handleLimparFiltros}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results List / Table */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Viagens Disponíveis ({viagens.length})
            </h2>
            <span className="text-xs text-stone-500">
              Preços em Kwanzas (Kz)
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-stone-500 text-sm">
              A consultar horários e disponibilidade no servidor...
            </div>
          ) : viagens.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-2">
              <Bus className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="font-semibold text-stone-700">Nenhuma viagem encontrada com estes filtros.</p>
              <p className="text-xs text-stone-400">Tente alterar a data ou remover os filtros de pesquisa.</p>
              <button
                onClick={handleLimparFiltros}
                className="mt-2 text-xs font-bold text-[#440717] hover:underline"
              >
                Ver todas as viagens disponíveis
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                    <th className="py-3 px-6">Origem — Destino</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Horário</th>
                    <th className="py-3 px-4">Duração</th>
                    <th className="py-3 px-4">Preço</th>
                    <th className="py-3 px-4">Lugares</th>
                    <th className="py-3 px-6 text-right">Acção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                  {viagens.map((v) => (
                    <tr key={v.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-stone-900">
                        <div className="flex items-center gap-2">
                          <span>{v.origem}</span>
                          <span className="text-[#A7193D] font-bold">→</span>
                          <span>{v.destino}</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-normal">{v.viatura}</span>
                      </td>

                      <td className="py-4 px-4 text-stone-600 tabular-nums">
                        {v.dataViagem}
                      </td>

                      <td className="py-4 px-4 font-bold text-stone-800 tabular-nums">
                        {v.horaPartida}
                      </td>

                      <td className="py-4 px-4 text-stone-600">
                        {v.duracaoEstimada}
                      </td>

                      <td className="py-4 px-4 font-bold font-mono text-[#440717] tabular-nums">
                        {v.preco.toLocaleString('pt-AO')} Kz
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          v.lugaresDisponiveis > 5
                            ? 'bg-emerald-50 text-emerald-700'
                            : v.lugaresDisponiveis > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {v.lugaresDisponiveis > 0 ? `${v.lugaresDisponiveis} lugares` : 'Esgotado'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          disabled={v.lugaresDisponiveis === 0}
                          onClick={() => onNavigate('/reservar', { viagemId: v.id })}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                            v.lugaresDisponiveis > 0
                              ? 'bg-[#440717] hover:bg-[#A7193D] text-white cursor-pointer active:scale-95'
                              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          Reservar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Informative Note */}
        <div className="mt-6 bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
          <span>* As reservas efectuadas dispõem de <strong>60 minutos</strong> para liquidação por referência Multicaixa (Entidade 00578).</span>
          <span className="font-semibold text-[#440717]">Terminal Principal: Gamek, Nosso Centro</span>
        </div>
      </div>
    </div>
  );
};
