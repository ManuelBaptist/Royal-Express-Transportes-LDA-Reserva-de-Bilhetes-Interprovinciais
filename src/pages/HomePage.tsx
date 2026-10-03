import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Headphones, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  Bus, 
  Check, 
  Package, 
  PhoneCall,
  ChevronRight
} from 'lucide-react';
import busHeroImg from '../assets/images/royal_express_bus_official_road_1791024782350.jpg';
import cargoImg from '../assets/images/royal_express_cargo_1791021100408.jpg';
import scenicHighwayImg from '../assets/images/angola_scenic_highway_1791021110402.jpg';
import benguelaImg from '../assets/images/dest_benguela_1791021120811.jpg';
import { OfficialLogo } from '../components/OfficialLogo';

interface HomePageProps {
  onNavigate: (path: string, state?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [tripType, setTripType] = useState<'ida' | 'ida-volta'>('ida');
  const [origem, setOrigem] = useState('Luanda');
  const [destino, setDestino] = useState('Benguela');
  const todayStr = new Date().toISOString().split('T')[0];
  const [dataViagem, setDataViagem] = useState(todayStr);
  const [passageiros, setPassageiros] = useState('1');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/rotas', { origem, destino, data: dataViagem, passageiros });
  };

  const destinosPopulares = [
    {
      nome: 'Benguela',
      origem: 'Luanda',
      preco: '18.000',
      duracao: '8h30',
      imagem: benguelaImg,
      destaque: 'Praias & Cidade das Acácias'
    },
    {
      nome: 'Huambo',
      origem: 'Luanda',
      preco: '19.000',
      duracao: '9h30',
      imagem: scenicHighwayImg,
      destaque: 'Planalto Central'
    },
    {
      nome: 'Bié (Cuíto)',
      origem: 'Luanda',
      preco: '21.000',
      duracao: '11h00',
      imagem: busHeroImg,
      destaque: 'Coração de Angola'
    },
    {
      nome: 'Kibala',
      origem: 'Luanda',
      preco: '11.000',
      duracao: '5h00',
      imagem: scenicHighwayImg,
      destaque: 'Kwanza Sul'
    },
    {
      nome: 'Waku Kungu',
      origem: 'Luanda',
      preco: '15.000',
      duracao: '6h30',
      imagem: cargoImg,
      destaque: 'Vale Agrícola da Cela'
    },
    {
      nome: 'Soyo',
      origem: 'Luanda',
      preco: '17.000',
      duracao: '7h30',
      imagem: benguelaImg,
      destaque: 'Foz do Rio Zaire'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#111E2E] via-[#1E213A] to-[#111E2E] text-white pt-10 pb-28 overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A7193D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#440717]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Text & Headings */}
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Transporte Interprovincial de Excelência
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight leading-tight text-white">
                VIAJE COM <span className="text-amber-400">SEGURANÇA</span>, <br className="hidden sm:inline" />
                CONFORTO E <br className="hidden sm:inline" />
                <span className="text-[#A7193D]">PONTUALIDADE</span>.
              </h1>

              <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed">
                Viaje com confiança entre as principais províncias de Angola a bordo dos mais modernos autocarros da Royal Express.
              </p>

              {/* Destination Pills like Prototype (Benguela, Huambo, Bié, Soyo, Kibala) */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-stone-400">Rotas frequentes:</span>
                {['Benguela', 'Huambo', 'Bié', 'Soyo', 'Kibala'].map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => {
                      setDestino(dest);
                      onNavigate('/rotas', { origem: 'Luanda', destino: dest });
                    }}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md border border-white/15 transition-colors cursor-pointer"
                  >
                    Luanda → {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Bus Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
                <img
                  src={busHeroImg}
                  alt="Autocarro Royal Express Volvo G7 em Angola"
                  className="w-full h-72 sm:h-96 object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111E2E]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 text-stone-900 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <OfficialLogo size="sm" variant="light-bg" />
                    <div>
                      <p className="text-xs font-bold text-[#440717]">Frota Oficial Royal Express</p>
                      <p className="text-[11px] text-stone-600">Autocarro Volvo B11R Marcopolo G7 na estrada em Angola</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-[#440717] text-white px-3 py-1.5 rounded-lg shrink-0">
                    Volvo B11R
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEARCH FLIGHT-LIKE BOOKING WIDGET (Overlaying Hero) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-4 sm:p-6">
          {/* Trip Type Tabs with Official Logo */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTripType('ida')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tripType === 'ida'
                    ? 'bg-[#440717] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Só Ida
              </button>
              <button
                type="button"
                onClick={() => setTripType('ida-volta')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tripType === 'ida-volta'
                    ? 'bg-[#440717] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Ida e Volta
              </button>
            </div>
            <div className="hidden sm:block">
              <OfficialLogo size="sm" variant="light-bg" />
            </div>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Origem */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A7193D]" /> Origem
              </label>
              <select
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
              >
                <option value="Luanda">Luanda (Gamek, Nosso Centro)</option>
                <option value="Benguela">Benguela (Terminal Central)</option>
                <option value="Huambo">Huambo (Terminal São Pedro)</option>
              </select>
            </div>

            {/* Destino */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A7193D]" /> Destino
              </label>
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
              >
                <option value="Benguela">Benguela (Via Sumbe / Lobito)</option>
                <option value="Huambo">Huambo (Planalto Central)</option>
                <option value="Bié">Bié (Cuíto)</option>
                <option value="Waku Kungu">Waku Kungu (Cela)</option>
                <option value="Soyo">Soyo (Zaire)</option>
                <option value="Kibala">Kibala (Kwanza Sul)</option>
                <option value="Luanda">Luanda</option>
              </select>
            </div>

            {/* Data de Viagem */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A7193D]" /> Data de Viagem
              </label>
              <input
                type="date"
                value={dataViagem}
                min={todayStr}
                onChange={(e) => setDataViagem(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#440717] hover:bg-[#A7193D] text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pesquisar Viagens</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* VALUE PROPOSITIONS BAR */}
      <section className="py-12 bg-white mt-12 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <div className="w-10 h-10 rounded-lg bg-[#440717]/10 flex items-center justify-center text-[#440717]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Viagem Segura</h4>
                <p className="text-[11px] text-stone-500">Condução defensiva e rastreio GPS</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <div className="w-10 h-10 rounded-lg bg-[#440717]/10 flex items-center justify-center text-[#440717]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Conforto Total</h4>
                <p className="text-[11px] text-stone-500">Bancos reclináveis e ar condicionado</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <div className="w-10 h-10 rounded-lg bg-[#440717]/10 flex items-center justify-center text-[#440717]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Pontualidade</h4>
                <p className="text-[11px] text-stone-500">Partidas rigorosas nos horários</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <div className="w-10 h-10 rounded-lg bg-[#440717]/10 flex items-center justify-center text-[#440717]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Atendimento 24/7</h4>
                <p className="text-[11px] text-stone-500">Apoio contínuo via WhatsApp e Call Center</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPAIS ROTAS (Card layout exactly like Prototype) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[#A7193D] tracking-wider">Destinos em Destaque</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#111E2E]">Principais Rotas</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Consulte as rotas mais procuradas em Angola com as melhores tarifas e saídas diárias.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/rotas')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#440717] hover:text-[#A7193D] transition-colors"
          >
            Ver todos os horários e preços <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinosPopulares.map((item) => (
            <div
              key={item.nome}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imagem}
                    alt={`${item.origem} para ${item.nome}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-[#440717] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {item.destaque}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs text-stone-200">A partir de</span>
                    <p className="text-xl font-bold font-mono">{item.preco} Kz</p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-stone-900">
                      {item.origem} <span className="text-[#A7193D]">→</span> {item.nome}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" /> Duração: {item.duracao}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-stone-400" /> Saídas Diárias
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => onNavigate('/reservar', { rotaOrigem: item.origem, rotaDestino: item.nome })}
                  className="w-full bg-[#440717] hover:bg-[#A7193D] text-white py-2.5 rounded-lg text-xs font-bold text-center transition-colors shadow-xs"
                >
                  Comprar Bilhete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROYAL CARGO / ENVIE AS SUAS ENCOMENDAS (Matching Prototype Banner) */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#440717] to-[#1E213A] rounded-2xl overflow-hidden shadow-xl text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
                <span className="text-amber-300 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <Package className="w-4 h-4" /> Royal Express Cargo & Logística
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold leading-tight">
                  ENVIE AS SUAS ENCOMENDAS COM A ROYAL EXPRESS
                </h3>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl">
                  Dispomos de soluções de carga e encomendas para envios rápidos, seguros e rastreados entre todas as nossas rotas interprovinciais em Angola.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onNavigate('/contactos')}
                    className="bg-white hover:bg-stone-100 text-[#440717] px-6 py-2.5 rounded-lg font-bold text-xs shadow transition-colors"
                  >
                    Fale Connosco
                  </button>
                  <a
                    href="https://wa.me/244931324022?text=Olá,%20gostaria%20de%20informações%20sobre%20envio%20de%20encomendas."
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow flex items-center gap-2 transition-colors"
                  >
                    WhatsApp Encomendas
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
                <img
                  src={cargoImg}
                  alt="Envio de Encomendas Royal Express"
                  className="w-full h-full object-cover object-center"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* EVITA FILAS (Matching Prototype Banner) */}
      <section className="py-16 bg-[#F2F2F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <OfficialLogo size="sm" variant="light-bg" />
                <span className="text-xs font-bold text-[#A7193D] uppercase tracking-wider">Facilidade & Tecnologia</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#111E2E]">
                EVITA FILAS. Compre o seu bilhete onde estiver de forma simples e rápida.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                Pague comodamente por Multicaixa Express, Internet Banking ou ATM através da nossa Entidade <strong>00578</strong> e receba imediatamente o seu bilhete digital com QR Code.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-700 pt-2">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Website Oficial</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Multicaixa Express</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> WhatsApp Oficial</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Terminais de Atendimento</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => onNavigate('/reservar')}
                className="bg-[#440717] hover:bg-[#A7193D] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-colors text-center"
              >
                Comprar Bilhete Online
              </button>
              <button
                onClick={() => onNavigate('/consultar-bilhete')}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-8 py-2.5 rounded-xl font-medium text-xs transition-colors text-center"
              >
                Já tem reserva? Consultar Bilhete
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
