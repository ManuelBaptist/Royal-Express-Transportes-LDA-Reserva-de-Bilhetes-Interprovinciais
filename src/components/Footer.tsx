import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#111E2E] text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Info with Official Logo */}
          <div className="lg:col-span-1 space-y-4">
            <OfficialLogo 
              size="md" 
              variant="dark-bg" 
              onClick={() => onNavigate('/')} 
            />
            <p className="text-xs text-stone-400 leading-relaxed">
              Empresa angolana de transporte interprovincial de passageiros com compromisso diário em conforto, segurança e pontualidade.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/244931324022" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs px-3 py-1.5 rounded-md border border-[#25D366]/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Directo
              </a>
            </div>
          </div>

          {/* Organização */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#A7193D] pl-2">
              Organização
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/sobre')} className="hover:text-white transition-colors">
                  Sobre Nós
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sobre')} className="hover:text-white transition-colors">
                  Nossa Missão & Valores
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/servicos')} className="hover:text-white transition-colors">
                  Nossa Frota Volvo G7
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-amber-400 transition-colors text-stone-400">
                  Acesso Administrativo
                </button>
              </li>
            </ul>
          </div>

          {/* Destinos */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#A7193D] pl-2">
              Destinos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/rotas')} className="hover:text-white transition-colors">
                  Luanda → Benguela
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rotas')} className="hover:text-white transition-colors">
                  Luanda → Huambo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rotas')} className="hover:text-white transition-colors">
                  Luanda → Bié
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rotas')} className="hover:text-white transition-colors">
                  Luanda → Waku Kungu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rotas')} className="hover:text-white transition-colors">
                  Luanda → Soyo & Kibala
                </button>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#A7193D] pl-2">
              Serviços
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/servicos')} className="hover:text-white transition-colors">
                  Transporte Interprovincial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/servicos')} className="hover:text-white transition-colors">
                  Royal Cargo & Encomendas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/servicos')} className="hover:text-white transition-colors">
                  Aluguer para Eventos / Charter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/consultar-bilhete')} className="hover:text-white transition-colors">
                  Consultar Bilhete Emitido
                </button>
              </li>
            </ul>
          </div>

          {/* Fale Connosco */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#A7193D] pl-2">
              Fale Connosco
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#A7193D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">+244 931 324 022</p>
                  <p className="text-stone-400">+244 954 631 145</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#A7193D] shrink-0 mt-0.5" />
                <span className="text-stone-300">comercial@royalexpress.ao</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A7193D] shrink-0 mt-0.5" />
                <span className="text-stone-300">Gamek, Nosso Centro, Luanda - Angola</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#A7193D] shrink-0 mt-0.5" />
                <span className="text-stone-300">Segunda a Domingo: 07:00 - 22:00</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2">
            <OfficialLogo size="sm" variant="dark-bg" />
            <span>© {new Date().getFullYear()} Royal Express Transportes, LDA. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Entidade Multicaixa: <strong className="text-stone-300">00578</strong></span>
            <span>Angola</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
