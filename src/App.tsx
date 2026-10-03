import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { RotasPage } from './pages/RotasPage';
import { ReservarPage } from './pages/ReservarPage';
import { BilhetePage } from './pages/BilhetePage';
import { ConsultarBilhetePage } from './pages/ConsultarBilhetePage';
import { ValidarBilhetePage } from './pages/ValidarBilhetePage';
import { SobrePage } from './pages/SobrePage';
import { ServicosPage } from './pages/ServicosPage';
import { ContactosPage } from './pages/ContactosPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [routeState, setRouteState] = useState<any>(null);

  // Listen to browser forward/backward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, state?: any) => {
    setRouteState(state || null);
    setCurrentPath(path);
    window.history.pushState(state || {}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render correct page view
  const renderContent = () => {
    // 1. Bilhete view: /bilhete/:id
    if (currentPath.startsWith('/bilhete/')) {
      const bilheteId = currentPath.replace('/bilhete/', '');
      return <BilhetePage bilheteId={bilheteId} onNavigate={navigate} />;
    }

    // 2. Validar bilhete view: /validar/:codigo
    if (currentPath.startsWith('/validar/')) {
      const codigo = currentPath.replace('/validar/', '');
      return <ValidarBilhetePage codigo={codigo} onNavigate={navigate} />;
    }

    // 3. Pagamento view: /pagamento/:id -> directs to Reservar with state or Bilhete
    if (currentPath.startsWith('/pagamento/')) {
      const id = currentPath.replace('/pagamento/', '');
      return <ReservarPage onNavigate={navigate} initialState={{ viagemId: Number(id) || undefined }} />;
    }

    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/rotas':
      case '/viagens':
        return <RotasPage onNavigate={navigate} initialFilters={routeState} />;
      case '/reservar':
        return <ReservarPage onNavigate={navigate} initialState={routeState} />;
      case '/consultar-bilhete':
        return <ConsultarBilhetePage onNavigate={navigate} />;
      case '/sobre':
        return <SobrePage onNavigate={navigate} />;
      case '/servicos':
        return <ServicosPage onNavigate={navigate} />;
      case '/contactos':
        return <ContactosPage />;
      case '/admin':
        return <AdminPage onNavigate={navigate} />;
      default:
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-serif font-bold text-[#111E2E] mb-2">404 - Página Não Encontrada</h2>
            <p className="text-xs text-stone-500 mb-6">A página solicitada não existe ou foi movida.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#440717] hover:bg-[#A7193D] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
