import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Notificacao } from '../types';
import { OfficialLogo } from './OfficialLogo';
import { 
  X, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  Send, 
  RotateCw, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Loader2
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'RESERVA' | 'BILHETE';
  id: string | number; // reservaId or numeroBilhete
  destinatarioTelefone?: string;
  destinatarioEmail?: string;
  passageiroNome?: string;
  codigoReserva?: string;
  numeroBilhete?: string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  tipo,
  id,
  destinatarioTelefone = '',
  destinatarioEmail = '',
  passageiroNome = '',
  codigoReserva = '',
  numeroBilhete = ''
}) => {
  const [activeTab, setActiveTab] = useState<'SMS' | 'EMAIL'>('SMS');
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(false);

  // Reenviar inputs
  const [phoneInput, setPhoneInput] = useState(destinatarioTelefone);
  const [emailInput, setEmailInput] = useState(destinatarioEmail);
  const [sendingSms, setSendingSms] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      if (tipo === 'BILHETE' && numeroBilhete) {
        const res = await api.getNotificacoesBilhete(numeroBilhete);
        setNotificacoes(res);
      } else {
        const res = await api.getNotificacoesReserva(id);
        setNotificacoes(res);
      }
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPhoneInput(destinatarioTelefone);
      setEmailInput(destinatarioEmail);
      setFeedbackMsg(null);
      carregarNotificacoes();
    }
  }, [isOpen, id, destinatarioTelefone, destinatarioEmail]);

  if (!isOpen) return null;

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    try {
      setSendingSms(true);
      setFeedbackMsg(null);
      const res = await api.enviarSmsNotificacao({
        destinatario: phoneInput.trim(),
        tipo,
        id
      });
      if (res.success) {
        setFeedbackMsg({ text: `SMS enviado com sucesso para ${phoneInput}!`, type: 'success' });
        carregarNotificacoes();
      }
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Falha ao enviar SMS', type: 'error' });
    } finally {
      setSendingSms(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      setSendingEmail(true);
      setFeedbackMsg(null);
      const res = await api.enviarEmailNotificacao({
        destinatario: emailInput.trim(),
        tipo,
        id
      });
      if (res.success) {
        setFeedbackMsg({ text: `E-mail enviado com sucesso para ${emailInput}!`, type: 'success' });
        carregarNotificacoes();
      }
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Falha ao enviar E-mail', type: 'error' });
    } finally {
      setSendingEmail(false);
    }
  };

  const smsNotifs = notificacoes.filter(n => n.tipo === 'SMS');
  const emailNotifs = notificacoes.filter(n => n.tipo === 'EMAIL');

  const latestSms = smsNotifs[0];
  const latestEmail = emailNotifs[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#111E2E] text-white p-5 flex items-center justify-between border-b-2 border-[#440717]">
          <div className="flex items-center gap-3">
            <OfficialLogo size="sm" variant="dark-bg" />
            <div>
              <h3 className="font-bold text-base text-white">
                Notificações Automáticas por SMS & E-mail
              </h3>
              <p className="text-xs text-stone-300">
                {tipo === 'BILHETE' ? `Bilhete Oficial Nº ${numeroBilhete}` : `Reserva Nº ${codigoReserva}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            onClick={() => setActiveTab('SMS')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'SMS'
                ? 'border-[#440717] text-[#440717] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Notificação por SMS ({smsNotifs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EMAIL')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'EMAIL'
                ? 'border-[#440717] text-[#440717] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Notificação por E-mail ({emailNotifs.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {feedbackMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {activeTab === 'SMS' ? (
            /* SMS TAB */
            <div className="space-y-6">
              
              {/* Phone message screen simulation */}
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Pré-visualização do SMS no Telemóvel do Passageiro
                </span>

                <div className="bg-stone-900 rounded-2xl p-4 text-white max-w-md mx-auto shadow-inner border border-stone-800">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-3 pb-2 border-b border-stone-800">
                    <span className="flex items-center gap-1 font-semibold text-stone-300">
                      <Smartphone className="w-3.5 h-3.5 text-[#25D366]" /> Royal Express
                    </span>
                    <span>{latestSms ? new Date(latestSms.enviadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}</span>
                  </div>

                  {/* SMS Bubble */}
                  <div className="bg-[#1E213A] border border-stone-700 rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-100 space-y-2 leading-relaxed shadow-sm">
                    <p className="font-sans">
                      {latestSms?.mensagem || (
                        tipo === 'BILHETE'
                          ? `Royal Express: Pagamento confirmado! O seu bilhete digital ${numeroBilhete} está pronto. Aceda ao bilhete com QR Code no link: ${window.location.origin}/bilhete/${numeroBilhete}. Compareça no terminal 30 min antes. Boa viagem!`
                          : `Royal Express: Olá ${passageiroNome}, a sua reserva ${codigoReserva} foi gerada. Pague no Multicaixa: Entidade 00578 | Validade: 60 min.`
                      )}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-emerald-400 font-semibold border-t border-stone-700/50">
                      <span>✓ Entregue via Gateway SMS Angola</span>
                      <span>Destino: {latestSms?.destinatario || phoneInput}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Re-send SMS Form */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Reenviar SMS ou Enviar para Outro Número
                </h4>
                <form onSubmit={handleSendSms} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="+244 931 324 022"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#440717]"
                  />
                  <button
                    type="submit"
                    disabled={sendingSms}
                    className="bg-[#440717] hover:bg-[#A7193D] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-75"
                  >
                    {sendingSms ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Enviar SMS Agora</span>
                  </button>
                </form>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  O passageiro recebe instantaneamente a confirmação com o link directo para abertura do bilhete no smartphone.
                </p>
              </div>

            </div>
          ) : (
            /* EMAIL TAB */
            <div className="space-y-6">
              
              {/* Email preview card */}
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Pré-visualização do E-mail Oficial Royal Express
                </span>

                <div className="border border-stone-300 rounded-2xl overflow-hidden shadow-sm bg-white">
                  {/* Email header bar */}
                  <div className="bg-[#111E2E] text-white p-4 flex items-center justify-between border-b-2 border-[#440717]">
                    <div className="flex items-center gap-2">
                      <OfficialLogo size="sm" variant="dark-bg" />
                      <span className="text-xs font-bold text-white">Royal Express Transportes</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      ✓ Mensagem Autêntica
                    </span>
                  </div>

                  {/* Email body preview */}
                  <div className="p-4 sm:p-6 space-y-4 text-xs text-stone-700">
                    <div className="border-b border-stone-100 pb-3 space-y-1">
                      <p><strong>De:</strong> bilhetes@royalexpress.ao</p>
                      <p><strong>Para:</strong> {latestEmail?.destinatario || emailInput || 'passageiro@email.com'}</p>
                      <p><strong>Assunto:</strong> {latestEmail?.assunto || (tipo === 'BILHETE' ? `Bilhete Digital Oficial ${numeroBilhete} | Royal Express` : `Confirmação de Reserva ${codigoReserva}`)}</p>
                    </div>

                    <div className="bg-[#440717] text-white p-3.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase tracking-wider opacity-90 block">Comprovativo Oficial</span>
                      <strong className="text-base font-mono text-amber-400">{numeroBilhete || codigoReserva}</strong>
                    </div>

                    <p className="leading-relaxed">
                      Olá <strong>{passageiroNome || 'Passageiro'}</strong>, o seu bilhete digital foi processado com sucesso. Apresente o código QR ao embarcar no autocarro Volvo B11R no Terminal Gamek.
                    </p>

                    <div className="text-center pt-2">
                      <span className="inline-block bg-[#440717] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-xs">
                        Abrir Bilhete com QR Code
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Re-send Email Form */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Reenviar E-mail ou Enviar para Outro Endereço
                </h4>
                <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="passageiro@email.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#440717]"
                  />
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="bg-[#111E2E] hover:bg-[#1E213A] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-75"
                  >
                    {sendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    <span>Enviar E-mail Agora</span>
                  </button>
                </form>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Envia o bilhete oficial com todos os detalhes da viagem, código QR e instruções de embarque em formato HTML.
                </p>
              </div>

            </div>
          )}

          {/* History of Dispatches */}
          <div className="border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Registo de Envios no Servidor ({notificacoes.length})
              </span>
              <button
                type="button"
                onClick={carregarNotificacoes}
                className="text-[11px] text-[#440717] hover:underline flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" /> Actualizar
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {notificacoes.length === 0 ? (
                <p className="text-xs text-stone-400 italic">Nenhum registo de envio encontrado.</p>
              ) : (
                notificacoes.map((n) => (
                  <div key={n.id} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {n.tipo === 'SMS' ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <Smartphone className="w-3 h-3" /> SMS
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <Mail className="w-3 h-3" /> E-mail
                        </span>
                      )}
                      <span className="font-mono text-stone-700 font-semibold">{n.destinatario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-1.5 py-0.5 rounded font-bold">
                        {n.status}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(n.enviadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
