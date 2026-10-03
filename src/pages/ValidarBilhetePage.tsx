import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { generateTicketPDF } from '../utils/generateTicketPDF';
import { OfficialLogo } from '../components/OfficialLogo';
import { CheckCircle2, XCircle, Bus, User, Calendar, Clock, MapPin, ShieldCheck, ArrowLeft, Download, Loader2 } from 'lucide-react';

interface ValidarBilhetePageProps {
  codigo: string;
  onNavigate: (path: string) => void;
}

export const ValidarBilhetePage: React.FC<ValidarBilhetePageProps> = ({ codigo, onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [embarcadoSucesso, setEmbarcadoSucesso] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    const validar = async () => {
      try {
        setLoading(true);
        const res = await api.validarBilhete(codigo);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Bilhete não encontrado ou inválido.');
      } finally {
        setLoading(false);
      }
    };
    validar();
  }, [codigo]);

  const handleCheckin = async () => {
    try {
      const res = await api.embarcarPassageiro(codigo);
      if (res.success) {
        setEmbarcadoSucesso(true);
        setData({ ...data, estado: 'EMBARCADO' });
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao validar embarque');
    }
  };

  const handleDownloadPDF = async () => {
    if (!data) return;
    try {
      setGeneratingPdf(true);
      await generateTicketPDF({
        id: 0,
        numeroBilhete: data.numeroBilhete,
        reservaId: 0,
        codigoReserva: data.codigoReserva || data.numeroBilhete,
        qrCodeUrl: `/validar/${data.numeroBilhete}`,
        estado: data.estado,
        emitidoEm: data.emitidoEm || new Date().toISOString(),
        passageiro: data.passageiro,
        telefone: data.telefone,
        numeroBi: data.numeroBi,
        origem: data.origem,
        destino: data.destino,
        dataViagem: data.dataViagem,
        horaPartida: data.horaPartida,
        duracaoEstimada: data.duracaoEstimada || '8h30',
        lugarNumero: data.lugarNumero,
        viatura: data.viatura,
        viaturaMatricula: data.viaturaMatricula || 'LD-84-21-HG',
        valor: data.valor || 18000
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar o ficheiro PDF.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <ShieldCheck className="w-10 h-10 text-[#440717] animate-pulse mx-auto" />
          <p className="text-stone-600 text-sm font-semibold">A validar autenticidade do bilhete...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Back link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Portal
        </button>

        {error || !data?.valido && data?.estado !== 'EMBARCADO' ? (
          <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-lg p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-serif font-extrabold text-rose-950">
              BILHETE INVÁLIDO OU NÃO ENCONTRADO
            </h1>
            <p className="text-xs text-stone-600">
              O código <strong>{codigo}</strong> não corresponde a nenhum bilhete activo emitido no sistema da Royal Express.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl overflow-hidden">
            
            {/* Validation Banner with Official Logo */}
            <div className="bg-emerald-600 text-white p-6 text-center space-y-2">
              <div className="flex justify-center mb-1">
                <OfficialLogo size="md" variant="dark-bg" />
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-extrabold tracking-wide uppercase">
                {data.estado === 'EMBARCADO' ? 'BILHETE JÁ EMBARCADO' : 'BILHETE AUTÊNTICO & VÁLIDO'}
              </h1>
              <p className="text-xs text-emerald-100 font-mono">
                {data.numeroBilhete}
              </p>
            </div>

            {/* Passenger & Trip Details for Inspector */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Passageiro:</span>
                  <strong className="text-stone-900">{data.passageiro}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Telefone:</span>
                  <span className="font-mono text-stone-900">{data.telefone}</span>
                </div>
                {data.numeroBi && (
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">BI / Documento:</span>
                    <span className="font-mono text-stone-900">{data.numeroBi}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Trajecto:</span>
                  <strong className="text-[#440717]">{data.origem} → {data.destino}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Data & Hora:</span>
                  <span className="font-mono text-stone-900">{data.dataViagem} às {data.horaPartida}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Lugar Atribuído:</span>
                  <span className="text-lg font-extrabold text-[#440717] font-mono">
                    Nº {data.lugarNumero < 10 ? `0${data.lugarNumero}` : data.lugarNumero}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Viatura:</span>
                  <span className="text-stone-800">{data.viatura}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">Estado do Bilhete:</span>
                  <span className="font-bold text-emerald-700">{data.estado}</span>
                </div>
              </div>

              {/* Inspector Action Button */}
              {data.estado === 'EMITIDO' && (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleCheckin}
                    className="w-full bg-[#440717] hover:bg-[#A7193D] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validar Embarque no Autocarro</span>
                  </button>
                  <p className="text-[11px] text-stone-400 text-center">
                    Regista a entrada do passageiro na viatura para controlo de lotação.
                  </p>
                </div>
              )}

              {data.estado === 'EMBARCADO' && (
                <div className="p-3 bg-stone-100 rounded-lg text-center text-xs text-stone-600 font-medium">
                  ✓ Embarque confirmado no sistema da Royal Express.
                </div>
              )}

              {/* Download PDF button on validation page */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={generatingPdf}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {generatingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                      <span>A gerar ficheiro PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-stone-600" />
                      <span>Descarregar Bilhete Oficial (PDF)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
