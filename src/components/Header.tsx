import React, { useState } from 'react';
import { Menu, X, Phone, Search, ShieldCheck } from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'Rotas e Horários', path: '/rotas' },
    { label: 'Sobre Nós', path: '/sobre' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Contactos', path: '/contactos' },
    { label: 'Consultar Bilhete', path: '/consultar-bilhete' },
    { label: 'Gestão Admin', path: '/admin' }
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200">
      {/* Top Utility Bar */}
      <div className="bg-[#111E2E] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Phone className="w-3.5 h-3.5 text-[#A7193D]" />
              Apoio ao Cliente: <strong className="text-white">+244 931 324 022</strong> / +244 954 631 145
            </span>
            <span className="text-stone-300">
              Terminal: Gamek, Nosso Centro, Luanda
            </span>
          </div>
          <div className="flex items-center gap-4 text-stone-300">
            <span>Seg - Dom: 06:00 - 22:00</span>
            <span className="text-[#A7193D]">|</span>
            <button 
              onClick={() => handleNav('/consultar-bilhete')}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3 text-[#A7193D]" /> Validar ou Consultar Bilhete
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Logótipo Oficial Royal Express */}
          <div 
            onClick={() => handleNav('/')}
            className="flex items-center cursor-pointer group"
          >
            <OfficialLogo size="md" variant="light-bg" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#440717] font-bold'
                      : 'text-stone-700 hover:text-[#440717]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#440717] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNav('/reservar')}
              className="bg-[#440717] hover:bg-[#A7193D] text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>Reservar Bilhete</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNav('/reservar')}
              className="bg-[#440717] text-white text-xs px-3 py-1.5 rounded-md font-semibold sm:hidden"
            >
              Reservar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-[#440717] focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white shadow-xl animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#440717]/10 text-[#440717] font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => handleNav('/reservar')}
                className="w-full bg-[#440717] text-white py-3 rounded-lg font-semibold text-center text-sm shadow"
              >
                RESERVAR BILHETE AGORA
              </button>
              <div className="text-xs text-stone-500 text-center pt-2">
                Apoio ao cliente: +244 931 324 022
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
