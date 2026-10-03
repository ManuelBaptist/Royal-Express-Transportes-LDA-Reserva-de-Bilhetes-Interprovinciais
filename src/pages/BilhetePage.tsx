import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bilhete } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { generateTicketPDF } from '../utils/generateTicketPDF';
import { OfficialLogo } from '../components/OfficialLogo';
import { NotificationModal } from '../components/NotificationModal';
import { 
  CheckCircle2, 
  Printer, 
  Share2, 
  Mail, 
  MessageSquare, 
  Download, 
  Calendar, 
  Clock, 
  Bus, 
  User, 
  Phone, 
  CreditCard,
  ArrowLeft,
  FileText,
  Loader2,
  Smartphone,
  BellRing
} from 'lucide-react';

interface BilhetePageProps {
  bilheteId: string;
  onNavigate: (path: string, state?: any) => void;
}

export const BilhetePage: React.FC<BilhetePageProps> = ({ bilheteId, onNavigate }) => {
  const [bilhete, setBilhete] = useState<Bilhete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    const fetchBilhete = async () => {
      try {
        setLoading(true);
        const data = await api.getBilhete(bilheteId);
        setBilhete(data);
      } catch (err: any) {
        setError(err.message || 'Bilhete não encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchBilhete();
  }, [bilheteId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!bilhete) return;
    try {
      setGeneratingPdf(true);
      await generateTicketPDF(bilhete);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF do bilhete:', err);
      alert('Não foi possível gerar o ficheiro PDF. Por favor tente novamente.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!bilhete) return;
    const msg = `*BILHETE DIGITAL ROYAL EXPRESS TRANSPORTES, LDA*\n` +
      `Bilhete Nº: ${bilhete.numeroBilhete}\n` +
      `Passageiro: ${bilhete.passageiro}\n` +
      `Origem: ${bilhete.origem} → Destino: ${bilhete.destino}\n` +
      `Data: ${bilhete.dataViagem} às ${bilhete.horaPartida}\n` +
      `Lugar: Nº ${bilhete.lugarNumero < 10 ? '0' + bilhete.lugarNumero : bilhete.lugarNumero}\n` +
      `Estado: PAGO\n` +
      `Validação: ${window.location.origin}/validar/${bilhete.numeroBilhete}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleEmailShare = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <Bus className="w-10 h-10 text-[#440717] animate-pulse mx-auto" />
          <p className="text-stone-600 text-sm font-semibold">A carregar bilhete digital...</p>
        </div>
      </div>
    );
  }

  if (error || !bilhete) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-stone-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            ✕
          </div>
          <h2 className="text-lg font-bold text-stone-900">Bilhete Não Encontrado</h2>
          <p className="text-xs text-stone-500">{error || 'O bilhete solicitado não existe ou ainda não foi emitido.'}</p>
          <button
            onClick={() => onNavigate('/')}
            className="w-full bg-[#440717] text-white py-2.5 rounded-lg text-xs font-bold"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const validationUrl = `${window.location.origin}/validar/${bilhete.numeroBilhete}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back navigation */}
        <div className="flex items-center justify-between no-print">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
          </button>
          <span className="text-xs text-stone-400">
            Reserva: {bilhete.codigoReserva}
          </span>
        </div>

        {/* Success Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-6 text-center shadow-xs no-print">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-emerald-950">
            O seu bilhete está pronto!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800 mt-1">
            Obrigado por viajar com a Royal Express Transportes, LDA.
          </p>
        </div>

        {/* OFFICIAL DIGITAL TICKET (Exact styling of prototype image 4) */}
        <div id="bilhete-digital-printable" className="bg-white rounded-2xl border-2 border-stone-300 shadow-xl overflow-hidden print:shadow-none print:border-stone-800">
          
          {/* Ticket Header */}
          <div className="bg-[#111E2E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-[#440717]">
            <div className="flex items-center gap-3">
              <OfficialLogo size="lg" variant="dark-bg" />
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs text-stone-400 uppercase tracking-widest block font-medium">
                Bilhete Nº
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
                {bilhete.numeroBilhete}
              </span>
            </div>
          </div>

          {/* Route Stripe */}
          <div className="bg-[#440717] text-white py-3 px-6 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 text-lg sm:text-xl font-bold font-serif">
              <span>{bilhete.origem}</span>
              <span className="text-amber-400">→</span>
              <span>{bilhete.destino}</span>
            </div>
            <span className="text-xs bg-emerald-500 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {bilhete.estado === 'EMITIDO' ? 'PAGO' : bilhete.estado}
            </span>
          </div>

          {/* Ticket Body: Details & QR Code */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Details Table */}
            <div className="md:col-span-8 space-y-3">
              <table className="w-full text-xs sm:text-sm">
                <tbody className="divide-y divide-stone-100">
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold w-40">Data de Viagem:</td>
                    <td className="py-2.5 font-bold font-mono text-stone-900">{bilhete.dataViagem}</td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold">Hora de Partida:</td>
                    <td className="py-2.5 font-bold font-mono text-stone-900">{bilhete.horaPartida} ({bilhete.duracaoEstimada})</td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold">Lugar:</td>
                    <td className="py-2.5 font-extrabold font-mono text-[#440717] text-lg">
                      Nº {bilhete.lugarNumero < 10 ? `0${bilhete.lugarNumero}` : bilhete.lugarNumero}
                    </td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold">Passageiro:</td>
                    <td className="py-2.5 font-bold text-stone-900">{bilhete.passageiro}</td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold">Telefone:</td>
                    <td className="py-2.5 font-mono text-stone-800">{bilhete.telefone}</td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold">Viatura:</td>
                    <td className="py-2.5 text-stone-700">{bilhete.viatura} ({bilhete.viaturaMatricula})</td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold">Valor Pago:</td>
                    <td className="py-2.5 font-bold font-mono text-stone-900 text-base">
                      {bilhete.valor.toLocaleString('pt-AO')} Kz
                    </td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 text-stone-400 font-semibold">Estado:</td>
                    <td className="py-2.5 font-bold text-emerald-600">PAGO</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* QR Code Validation Box */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <QRCodeDisplay value={validationUrl} size={160} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-2">
                Código QR de Embarque
              </span>
              <span className="text-[11px] font-mono text-stone-600 font-bold mt-0.5">
                {bilhete.numeroBilhete}
              </span>
            </div>

          </div>

          {/* Footer of ticket */}
          <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 text-center text-xs text-stone-600 font-medium">
            Apresente este bilhete digital ou impresso no momento do embarque.
          </div>
        </div>

        {/* Feedback alert for PDF download */}
        {pdfSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2 no-print shadow-xs animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bilhete descarregado com sucesso! Guardado no seu dispositivo para consulta offline.</span>
          </div>
        )}

        {/* SMS & Email Notification Status Card (Prompt User Request) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Notificação Digital por SMS & E-mail
                </h4>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                O link do bilhete digital foi enviado para <strong className="text-stone-900">{bilhete.telefone}</strong>
                {bilhete.email ? ` e ${bilhete.email}` : ''}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNotificationModal(true)}
            className="bg-[#111E2E] hover:bg-[#1E213A] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver / Reenviar Notificação</span>
          </button>
        </div>

        {/* Action Buttons (Matching Prototype: Enviar por WhatsApp, Enviar por email, Download PDF, Imprimir) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 no-print">
          <button
            onClick={() => setShowNotificationModal(true)}
            className="w-full sm:w-auto bg-[#111E2E] hover:bg-[#1E213A] text-white px-5 py-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            title="Ver e reenviar SMS oficial"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Enviar por SMS</span>
          </button>

          <button
            onClick={() => setShowNotificationModal(true)}
            className="w-full sm:w-auto bg-[#111E2E] hover:bg-[#1E213A] text-white px-5 py-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            title="Ver e reenviar E-mail oficial"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Enviar por E-mail</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={generatingPdf}
            className="w-full sm:w-auto bg-[#440717] hover:bg-[#A7193D] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-75"
          >
            {generatingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A Gerar Documento PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descarregar Bilhete PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-4 py-3 rounded-xl font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            title="Imprimir na impressora térmica ou A4"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Imprimir</span>
          </button>
        </div>

        {/* Notification Modal */}
        {showNotificationModal && (
          <NotificationModal
            isOpen={showNotificationModal}
            onClose={() => setShowNotificationModal(false)}
            tipo="BILHETE"
            id={bilhete.numeroBilhete}
            destinatarioTelefone={bilhete.telefone}
            destinatarioEmail={bilhete.email}
            passageiroNome={bilhete.passageiro}
            codigoReserva={bilhete.codigoReserva}
            numeroBilhete={bilhete.numeroBilhete}
          />
        )}

        {/* Validation link preview */}
        <div className="text-center pt-2 text-xs text-stone-400 no-print">
          Link de validação de embarque: <button onClick={() => onNavigate(`/validar/${bilhete.numeroBilhete}`)} className="text-[#440717] hover:underline font-semibold">{validationUrl}</button>
        </div>

      </div>
    </div>
  );
};
