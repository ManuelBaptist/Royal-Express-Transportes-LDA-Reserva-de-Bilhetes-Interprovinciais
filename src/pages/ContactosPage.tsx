import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { OfficialLogo } from '../components/OfficialLogo';

export const ContactosPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      setNome('');
      setTelefone('');
      setEmail('');
      setMensagem('');
      setEnviado(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Header Banner matching Prototype Screen 6 */}
      <div className="bg-[#111E2E] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">
              Contacte-nos
            </h1>
            <p className="text-stone-300 text-sm mt-2">
              Estamos sempre disponível para si. Esclareça dúvidas, faça reservas corporativas ou envie sugestões.
            </p>
          </div>
          <OfficialLogo size="md" variant="dark-bg" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards & Map Preview */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              
              {/* Telefone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#440717]/10 flex items-center justify-center text-[#440717] shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Telefone</h4>
                  <p className="text-base font-bold text-stone-900 mt-0.5">+244 931 324 022</p>
                  <p className="text-sm text-stone-600">+244 954 631 145</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-[#440717]/10 flex items-center justify-center text-[#440717] shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Email</h4>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">comercial@royalexpress.ao</p>
                  <p className="text-xs text-stone-500">atendimento@royalexpress.ao</p>
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-[#440717]/10 flex items-center justify-center text-[#440717] shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Endereço do Terminal</h4>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">Gamek, Nosso Centro</p>
                  <p className="text-xs text-stone-600">Luanda — Angola</p>
                </div>
              </div>

              {/* Horário */}
              <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-[#440717]/10 flex items-center justify-center text-[#440717] shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Horário de Atendimento</h4>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">Segunda a Domingo</p>
                  <p className="text-xs text-stone-600">Das 07:00 às 22:00</p>
                </div>
              </div>

            </div>

            {/* Map Preview Box (as shown in prototype screen 6) */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm p-4">
              <span className="text-xs font-bold text-stone-600 block mb-2">Localização do Terminal Gamek</span>
              <div className="w-full h-44 bg-stone-100 rounded-xl flex flex-col items-center justify-center text-center p-4 border border-stone-300 relative overflow-hidden">
                <div className="w-10 h-10 bg-[#440717] text-white rounded-full flex items-center justify-center shadow-lg mb-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <p className="font-bold text-xs text-stone-900">Terminal Royal Express Gamek</p>
                <p className="text-[11px] text-stone-500">Nosso Centro, Estrada de Catete, Luanda</p>
                <a
                  href="https://maps.google.com/?q=Gamek+Nosso+Centro+Luanda"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-xs font-bold text-[#A7193D] hover:underline"
                >
                  Abrir no Google Maps →
                </a>
              </div>
            </div>

            {/* WhatsApp Big Button (Matching Prototype Screen 6) */}
            <a
              href="https://wa.me/244931324022?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20viagens%20da%20Royal%20Express."
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-3 transition-transform active:scale-98"
            >
              <MessageSquare className="w-6 h-6" />
              <div className="text-left">
                <span className="text-[11px] font-normal block leading-tight">Fale connosco pelo WhatsApp</span>
                <span className="text-base font-extrabold font-mono">+244 931 32 40 22</span>
              </div>
            </a>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-1">
                Enviar-nos uma mensagem
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Preencha o formulário abaixo e a nossa equipa entrará em contacto com a maior brevidade.
              </p>

              {enviado ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-emerald-950 text-base">Mensagem Enviada!</h3>
                  <p className="text-xs text-emerald-800">
                    Obrigado pelo seu contacto. A nossa equipa de apoio ao cliente responderá muito em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nome</label>
                    <input
                      type="text"
                      required
                      placeholder="O seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      required
                      placeholder="ex: +244 931 324 022"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ex: passageiro@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Mensagem</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Escreva a sua mensagem, dúvida ou pedido de cotação para grupos..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#440717]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#440717] hover:bg-[#A7193D] text-white py-3 rounded-xl font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
