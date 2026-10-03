import React from 'react';
import { Bus, Package, Users, ShieldCheck, ArrowRight, Clock, Award, Sparkles } from 'lucide-react';
import busHeroImg from '../assets/images/royal_express_bus_official_road_1791024782350.jpg';
import cargoImg from '../assets/images/royal_express_cargo_1791021100408.jpg';
import { OfficialLogo } from '../components/OfficialLogo';

interface ServicosPageProps {
  onNavigate: (path: string) => void;
}

export const ServicosPage: React.FC<ServicosPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Header Banner */}
      <div className="bg-[#111E2E] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Soluções de Mobilidade
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight mt-1">
              Os Nossos Serviços
            </h1>
            <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl">
              Transporte interprovincial de passageiros com padrão executivo, envio expresso de encomendas e fretamento exclusivo para empresas e eventos.
            </p>
          </div>
          <OfficialLogo size="md" variant="dark-bg" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Serviço 1: Transporte Interprovincial */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#440717]/10 text-[#440717] text-xs font-bold">
              <Bus className="w-3.5 h-3.5" /> Linhas Regulares
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#111E2E]">
              Transporte Interprovincial de Passageiros
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Ligamos diariamente Luanda às principais capitais de província em autocarros Volvo Marcopolo G7 com bancos reclináveis em pele, climatização integral, Wi-Fi a bordo e sistema multimédia.
            </p>
            <div className="space-y-2 text-xs text-stone-700 pt-2">
              <div className="flex items-center gap-2">✓ Saídas matinais e vespertinas regulares</div>
              <div className="flex items-center gap-2">✓ Seguro de viagem obrigatório incluído</div>
              <div className="flex items-center gap-2">✓ Pagamento digital por Multicaixa com bilhete instantâneo</div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/reservar')}
                className="bg-[#440717] hover:bg-[#A7193D] text-white px-6 py-2.5 rounded-lg font-bold text-xs shadow transition-colors inline-flex items-center gap-2"
              >
                <span>Reservar Bilhete Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 h-72 sm:h-96 relative">
            <img
              src={busHeroImg}
              alt="Autocarro Royal Express"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Serviço 2: Royal Cargo & Encomendas */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 h-72 sm:h-96 relative order-last lg:order-first">
            <img
              src={cargoImg}
              alt="Royal Express Cargo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <Package className="w-3.5 h-3.5 text-amber-700" /> Carga & Logística
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#111E2E]">
              Royal Cargo & Encomendas Expresso
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Transporte rápido e seguro de mercadorias, caixas, documentos e volumes com levantamento garantido nos terminais centrais de cada província no próprio dia ou no dia seguinte.
            </p>
            <div className="space-y-2 text-xs text-stone-700 pt-2">
              <div className="flex items-center gap-2">✓ Registo informatizado e código de rastreamento</div>
              <div className="flex items-center gap-2">✓ Compartimentos de carga arejados e protegidos</div>
              <div className="flex items-center gap-2">✓ Tarifas competitivas por quilograma ou volume</div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/contactos')}
                className="bg-[#111E2E] hover:bg-[#1E213A] text-white px-6 py-2.5 rounded-lg font-bold text-xs shadow transition-colors inline-flex items-center gap-2"
              >
                <span>Fazer Cotação de Encomenda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Serviço 3: Aluguer & Fretamento */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-[#440717]/10 text-[#440717] rounded-xl flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#111E2E]">
            Aluguer de Autocarros & Serviços Corporativos
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Disponibilizamos autocarros de luxo com motoristas profissionais para congressos, casamentos, excursões turísticas, delegações desportivas e transporte regular de trabalhadores para empresas.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('/contactos')}
              className="bg-[#440717] hover:bg-[#A7193D] text-white px-8 py-3 rounded-xl font-bold text-xs shadow transition-colors"
            >
              Contactar Equipa Corporativa
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
