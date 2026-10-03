import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OfficialLogo } from '../components/OfficialLogo';
import { 
  Bus, 
  Users, 
  CreditCard, 
  Ticket, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Search,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string, state?: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTicket, setSearchTicket] = useState('');

  const carregarMetricas = async () => {
    try {
      setRefreshing(true);
      const res = await api.getAdminDashboard();
      setMetrics(res);
    } catch (err) {
      console.error('Erro ao carregar dashboard admin:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarMetricas();
    // Auto poll every 15s
    const interval = setInterval(carregarMetricas, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTicket.trim()) {
      onNavigate(`/validar/${searchTicket.trim()}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <Bus className="w-10 h-10 text-[#440717] animate-pulse mx-auto" />
          <p className="text-stone-600 text-sm font-semibold">A carregar consola de gestão operacional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Header */}
      <div className="bg-[#111E2E] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <OfficialLogo size="md" variant="dark-bg" onClick={() => onNavigate('/')} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Consola de Operações & Tráfego
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Online
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight mt-1">
                Painel de Gestão Royal Express
              </h1>
              <p className="text-xs text-stone-300 mt-1">
                Monitorização em tempo real de viagens, reservas, referências Multicaixa e bilhetes emitidos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={carregarMetricas}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-lg font-semibold border border-white/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar Dados</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-8">
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Viagens Hoje */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Viagens Hoje
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-stone-900">
                {metrics?.viagensHoje ?? 0}
              </span>
              <Bus className="w-4 h-4 text-[#A7193D]" />
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Horários activos</span>
          </div>

          {/* Reservas Hoje */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Reservas Hoje
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-[#440717]">
                {metrics?.reservasHoje ?? 0}
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Geradas no servidor</span>
          </div>

          {/* Bilhetes Vendidos */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Bilhetes Emitidos
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-emerald-700">
                {metrics?.bilhetesVendidos ?? 0}
              </span>
              <Ticket className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] text-emerald-600 mt-1 block">Pagamento confirmado</span>
          </div>

          {/* Receita Total */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs md:col-span-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Receita Liquidada (Kz)
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono text-stone-900">
                {(metrics?.receitaTotalKz || 0).toLocaleString('pt-AO')} Kz
              </span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Entidade Multicaixa: 00578</span>
          </div>

          {/* Pagamentos Pendentes */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Aguardando Pagamento
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-amber-600">
                {metrics?.pagamentosPendentes ?? 0}
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Prazo de 60 min activo</span>
          </div>

        </div>

        {/* Quick Inspector Ticket Search Bar */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A7193D]" />
              Validação Rápida de Embarque para Fiscais
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Insira o número do bilhete ou faça a leitura do QR code com o leitor óptico.
            </p>
          </div>

          <form onSubmit={handleQuickSearch} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="ex: RX-20261003-000012"
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#440717]"
            />
            <button
              type="submit"
              className="bg-[#440717] hover:bg-[#A7193D] text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer"
            >
              Validar
            </button>
          </form>
        </div>

        {/* Tables: Recent Bookings & Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Ultimas Reservas */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900">
                Últimas Reservas Geradas
              </h3>
              <span className="text-xs text-stone-400">Tempo real</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {metrics?.ultimasReservas?.length === 0 ? (
                <div className="py-8 text-center text-stone-400">Sem reservas recentes</div>
              ) : (
                metrics?.ultimasReservas?.map((r: any) => (
                  <div key={r.id} className="p-4 flex items-center justify-between hover:bg-stone-50">
                    <div>
                      <p className="font-bold font-mono text-stone-900">{r.codigoReserva}</p>
                      <p className="text-stone-600 text-[11px]">{r.cliente?.nomeCompleto} · Lugar {r.lugarNumero}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.estado === 'CONFIRMADA'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.estado === 'PENDENTE_PAGAMENTO'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {r.estado}
                      </span>
                      <p className="text-[11px] font-mono text-stone-500 mt-1">{r.valor.toLocaleString('pt-AO')} Kz</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ultimos Bilhetes Emitidos */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900">
                Últimos Bilhetes Digitais Emitidos
              </h3>
              <span className="text-xs text-stone-400">Pagos & Prontos</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {metrics?.ultimosBilhetes?.length === 0 ? (
                <div className="py-8 text-center text-stone-400">Nenhum bilhete emitido</div>
              ) : (
                metrics?.ultimosBilhetes?.map((b: any) => (
                  <div key={b.id} className="p-4 flex items-center justify-between hover:bg-stone-50">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold font-mono text-stone-900">{b.numeroBilhete}</span>
                      </div>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        {b.passageiro} · {b.origem} → {b.destino} (Lugar {b.lugarNumero})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate(`/bilhete/${b.numeroBilhete}`)}
                        className="p-1.5 text-stone-500 hover:text-[#440717] bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                        title="Ver Bilhete"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigate(`/validar/${b.numeroBilhete}`)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-[#440717] hover:bg-[#A7193D] text-white rounded-md transition-colors"
                      >
                        Validar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
