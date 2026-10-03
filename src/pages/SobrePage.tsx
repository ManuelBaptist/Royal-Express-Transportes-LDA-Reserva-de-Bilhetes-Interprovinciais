import React from 'react';
import { ShieldCheck, Award, Clock, HeartHandshake, Lightbulb, Users, CheckCircle } from 'lucide-react';
import busHeroImg from '../assets/images/royal_express_bus_official_road_1791024782350.jpg';
import highwayImg from '../assets/images/angola_scenic_highway_1791021110402.jpg';
import { OfficialLogo } from '../components/OfficialLogo';

interface SobrePageProps {
  onNavigate: (path: string) => void;
}

export const SobrePage: React.FC<SobrePageProps> = ({ onNavigate }) => {
  const valores = [
    {
      titulo: 'Segurança',
      descricao: 'Colocamos a segurança dos passageiros, colaboradores e bens no centro das nossas operações diárias com condução defensiva e manutenção preventiva rigorosa.',
      icon: ShieldCheck
    },
    {
      titulo: 'Confiança',
      descricao: 'Construímos relações duradouras através de responsabilidade, transparência, integridade e cumprimento escrupuloso dos nossos compromissos.',
      icon: HeartHandshake
    },
    {
      titulo: 'Pontualidade',
      descricao: 'Valorizamos o tempo dos nossos passageiros e procuramos cumprir com rigor absoluto os horários estabelecidos nas nossas partidas e chegadas.',
      icon: Clock
    },
    {
      titulo: 'Qualidade & Conforto',
      descricao: 'Procuramos melhorar continuamente os nossos autocarros com ar condicionado, bancos reclináveis, entretenimento a bordo e atendimento caloroso.',
      icon: Award
    },
    {
      titulo: 'Inovação',
      descricao: 'Adoptamos novas soluções digitais e tecnologias para tornar a reserva de bilhetes, pagamento por Multicaixa e validação por QR Code simples e ágeis.',
      icon: Lightbulb
    },
    {
      titulo: 'Compromisso',
      descricao: 'Assumimos responsabilidade por cada viagem, cada passageiro e cada destino, ligando todas as regiões de Angola com dedicação e brio profissional.',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Banner matching Prototype Screen 5 */}
      <div className="bg-[#111E2E] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <OfficialLogo size="md" variant="dark-bg" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Institucional
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white">
              Sobre Nós
            </h1>
            <p className="text-stone-300 text-base sm:text-lg max-w-xl">
              A nossa história, a sua confiança. Ligando famílias, empresas e comunidades em toda a extensão de Angola.
            </p>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
            <img
              src={busHeroImg}
              alt="Autocarro Royal Express Volvo G7 na estrada em Angola"
              className="w-full h-64 sm:h-72 object-cover"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Quem Somos with Official Logo */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold text-[#A7193D] uppercase tracking-wider block mb-1">
                Apresentação Oficial
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#111E2E]">
                Quem Somos
              </h2>
            </div>
            <OfficialLogo size="md" variant="light-bg" />
          </div>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-4xl">
            A <strong>Royal Express Transportes, LDA</strong> é uma empresa angolana dedicada ao transporte interprovincial de passageiros e carga em Angola, com o propósito de aproximar pessoas, famílias, comunidades e destinos através de um serviço seguro, confortável e pontual.
          </p>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-4xl mt-4">
            Operamos uma moderna frota de autocarros executivos Volvo B11R Marcopolo G7 com partidas regulares a partir do terminal central no Gamek, Nosso Centro em Luanda, com destino a Benguela, Huambo, Bié, Kibala, Waku Kungu, Soyo e outras capitais de província.
          </p>
        </div>

        {/* Missão & Visão Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Missão */}
          <div className="bg-white rounded-2xl p-8 border-l-4 border-[#440717] border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#440717]/10 flex items-center justify-center text-[#440717]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-extrabold text-[#111E2E]">Missão</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Garantir transporte interprovincial seguro, confortável e pontual, proporcionando aos nossos passageiros uma experiência de viagem de qualidade e contribuindo para uma maior ligação entre as diferentes regiões de Angola.
            </p>
          </div>

          {/* Visão */}
          <div className="bg-white rounded-2xl p-8 border-l-4 border-[#A7193D] border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#A7193D]/10 flex items-center justify-center text-[#A7193D]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-extrabold text-[#111E2E]">Visão</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Ser uma referência nacional no transporte interprovincial de passageiros, reconhecida pela qualidade dos seus serviços, confiança, inovação, segurança e excelência no atendimento.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#A7193D] uppercase tracking-wider">Princípios Orientadores</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#111E2E]">
              Os Nossos Valores
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Pilares que guiam cada quilómetro percorrido e cada decisão da nossa equipa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((v) => {
              const IconComp = v.icon;
              return (
                <div key={v.titulo} className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#440717] text-white flex items-center justify-center mb-4 shadow-sm">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-stone-900 mb-2">{v.titulo}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{v.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience Counters Bar (Matching Prototype bottom of Screen 5) */}
        <div className="bg-[#440717] rounded-2xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            <div className="pt-4 sm:pt-0">
              <span className="text-3xl sm:text-5xl font-mono font-extrabold text-amber-400 block mb-1">
                +10
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-200">
                Anos de Experiência
              </span>
            </div>

            <div className="pt-4 sm:pt-0">
              <span className="text-3xl sm:text-5xl font-mono font-extrabold text-amber-400 block mb-1">
                +50
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-200">
                Viagens Diárias
              </span>
            </div>

            <div className="pt-4 sm:pt-0">
              <span className="text-3xl sm:text-5xl font-mono font-extrabold text-amber-400 block mb-1">
                +20
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-200">
                Viaturas de Luxo
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
