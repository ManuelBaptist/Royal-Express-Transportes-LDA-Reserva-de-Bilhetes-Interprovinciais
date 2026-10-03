import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Viagem, Lugar, Reserva, Pagamento, Cliente } from '../types';
import { SeatMap } from '../components/SeatMap';
import { PaymentTimer } from '../components/PaymentTimer';
import { OfficialLogo } from '../components/OfficialLogo';
import { NotificationModal } from '../components/NotificationModal';
import { 
  Bus, 
  User, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  Mail
} from 'lucide-react';

interface ReservarPageProps {
  onNavigate: (path: string, state?: any) => void;
  initialState?: {
    viagemId?: number;
    rotaOrigem?: string;
    rotaDestino?: string;
  };
}

export const ReservarPage: React.FC<ReservarPageProps> = ({ onNavigate, initialState }) => {
  // Wizard step: 1 (Viagem), 2 (Lugar), 3 (Dados), 4 (Confirmação/Pagamento)
  const [currentStep, setCurrentStep] = useState<number>(initialState?.viagemId ? 2 : 1);

  // Data states
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [selectedViagem, setSelectedViagem] = useState<Viagem | null>(null);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Form states
  const [clienteForm, setClienteForm] = useState<Partial<Cliente>>({
    nomeCompleto: '',
    telefone: '',
    email: '',
    numeroBi: '',
    provincia: 'Luanda',
    municipio: 'Talatona',
    endereco: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Created Reservation & Payment
  const [reservaCriada, setReservaCriada] = useState<Reserva | null>(null);
  const [pagamentoCriado, setPagamentoCriado] = useState<Pagamento | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Copy buttons feedback
  const [copiedEntidade, setCopiedEntidade] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // 1. Load trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const data = await api.getViagens({
          origem: initialState?.rotaOrigem,
          destino: initialState?.rotaDestino
        });
        setViagens(data);

        if (initialState?.viagemId) {
          const trip = data.find(v => v.id === initialState.viagemId);
          if (trip) {
            setSelectedViagem(trip);
            carregarLugares(trip.id);
          }
        } else if (data.length > 0) {
          setSelectedViagem(data[0]);
          carregarLugares(data[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar viagens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [initialState]);

  // Load seats for a trip
  const carregarLugares = async (viagemId: number) => {
    try {
      const data = await api.getLugaresDaViagem(viagemId);
      setLugares(data.lugares);
      setSelectedSeat(null);
    } catch (err) {
      console.error('Erro ao carregar mapa de lugares:', err);
    }
  };

  const handleSelectTrip = (viagem: Viagem) => {
    setSelectedViagem(viagem);
    carregarLugares(viagem.id);
    setCurrentStep(2);
  };

  const handleSelectSeat = (seatNum: number) => {
    setSelectedSeat(seatNum);
  };

  // Form Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!clienteForm.nomeCompleto || clienteForm.nomeCompleto.trim().length < 3) {
      errors.nomeCompleto = 'Nome completo é obrigatório (mínimo 3 caracteres)';
    }
    if (!clienteForm.telefone || clienteForm.telefone.trim().length < 9) {
      errors.telefone = 'Número de telefone válido é obrigatório';
    }
    if (clienteForm.email && !clienteForm.email.includes('@')) {
      errors.email = 'Insira um email válido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToConfirm = () => {
    if (validateForm()) {
      setCurrentStep(4);
    }
  };

  // Final confirmation: call backend to create reservation & payment reference
  const handleConfirmReservation = async () => {
    if (!selectedViagem || !selectedSeat) return;
    setLoading(true);
    setGeneralError(null);

    try {
      const res = await api.criarReserva(selectedViagem.id, selectedSeat, clienteForm);
      setReservaCriada(res.reserva);
      setPagamentoCriado(res.pagamento);
    } catch (err: any) {
      setGeneralError(err.message || 'Erro ao processar reserva');
    } finally {
      setLoading(false);
    }
  };

  // Simulate payment
  const handleSimulatePayment = async () => {
    if (!pagamentoCriado) return;
    setLoading(true);
    try {
      const res = await api.simularPagamento(pagamentoCriado.id);
      if (res.success && res.bilhete) {
        onNavigate(`/bilhete/${res.bilhete.id}`);
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Erro ao simular pagamento');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'entidade' | 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'entidade') {
      setCopiedEntidade(true);
      setTimeout(() => setCopiedEntidade(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Header Banner */}
      <div className="bg-[#111E2E] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight">
              Reserva de Bilhete
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Selecione a sua viagem, escolha o seu lugar preferido e pague via Multicaixa por referência.
            </p>
          </div>
          <OfficialLogo size="md" variant="dark-bg" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* STEPPER WIDGET (Matching Prototype Image 3) */}
        <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-4 mb-6">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            
            {/* Step 1 */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-lg ${
              currentStep === 1 ? 'bg-[#440717]/10 text-[#440717] font-bold' : currentStep > 1 ? 'text-emerald-700' : 'text-stone-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                currentStep > 1 ? 'bg-emerald-600 text-white' : currentStep === 1 ? 'bg-[#440717] text-white' : 'bg-stone-200 text-stone-500'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="hidden sm:inline">Seleccionar Viagem</span>
              <span className="sm:hidden">Viagem</span>
            </div>

            {/* Step 2 */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-lg ${
              currentStep === 2 ? 'bg-[#440717]/10 text-[#440717] font-bold' : currentStep > 2 ? 'text-emerald-700' : 'text-stone-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                currentStep > 2 ? 'bg-emerald-600 text-white' : currentStep === 2 ? 'bg-[#440717] text-white' : 'bg-stone-200 text-stone-500'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className="hidden sm:inline">Escolher Lugar</span>
              <span className="sm:hidden">Lugar</span>
            </div>

            {/* Step 3 */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-lg ${
              currentStep === 3 ? 'bg-[#440717]/10 text-[#440717] font-bold' : currentStep > 3 ? 'text-emerald-700' : 'text-stone-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                currentStep > 3 ? 'bg-emerald-600 text-white' : currentStep === 3 ? 'bg-[#440717] text-white' : 'bg-stone-200 text-stone-500'
              }`}>
                {currentStep > 3 ? '✓' : '3'}
              </span>
              <span className="hidden sm:inline">Seus Dados</span>
              <span className="sm:hidden">Dados</span>
            </div>

            {/* Step 4 */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-lg ${
              currentStep === 4 ? 'bg-[#440717]/10 text-[#440717] font-bold' : 'text-stone-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                currentStep === 4 ? 'bg-[#440717] text-white' : 'bg-stone-200 text-stone-500'
              }`}>
                4
              </span>
              <span className="hidden sm:inline">Confirmação</span>
              <span className="sm:hidden">Pagar</span>
            </div>

          </div>
        </div>

        {generalError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p>{generalError}</p>
          </div>
        )}

        {/* STEP 1: SELECCIONAR VIAGEM */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#A7193D]" />
                Horários e Viagens Disponíveis
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {viagens.map((trip) => {
                  const isSelected = selectedViagem?.id === trip.id;
                  return (
                    <div
                      key={trip.id}
                      onClick={() => handleSelectTrip(trip)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#440717] bg-[#440717]/5 shadow-sm'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold font-mono text-stone-900">
                          {trip.horaPartida}
                        </span>
                        <span className="text-xs font-bold text-[#A7193D]">
                          {trip.preco.toLocaleString('pt-AO')} Kz
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-stone-700">
                        {trip.origem} → {trip.destino}
                      </p>
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span>{trip.lugaresDisponiveis} lugares livres</span>
                        <span className="text-emerald-700 font-medium">Saída</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ESCOLHER LUGAR */}
        {currentStep === 2 && selectedViagem && (
          <div className="space-y-6">
            {/* Trip brief banner */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-400">Viagem Seleccionada:</span>
                <h3 className="font-bold text-stone-900 text-base">
                  {selectedViagem.origem} → {selectedViagem.destino} ({selectedViagem.dataViagem} às {selectedViagem.horaPartida})
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedViagem.viatura} · Duração estimada: {selectedViagem.duracaoEstimada}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-[#440717] hover:underline font-semibold"
              >
                Mudar Horário
              </button>
            </div>

            {/* Seat Map */}
            <SeatMap
              lugares={lugares}
              selectedSeatNumber={selectedSeat}
              onSelectSeat={handleSelectSeat}
              price={selectedViagem.preco}
              viaturaName={selectedViagem.viatura}
              loading={loading}
            />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar aos Horários
              </button>

              <button
                type="button"
                disabled={!selectedSeat}
                onClick={() => setCurrentStep(3)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold text-xs shadow-md transition-all ${
                  selectedSeat
                    ? 'bg-[#440717] hover:bg-[#A7193D] cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>Continuar para os Seus Dados</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SEUS DADOS */}
        {currentStep === 3 && selectedViagem && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-[#A7193D]" />
                Dados do Passageiro
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Os dados do passageiro são emitidos no bilhete de embarque oficial e comunicados à equipa de viagem.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome Completo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Manuel Baptista"
                    value={clienteForm.nomeCompleto || ''}
                    onChange={(e) => setClienteForm({ ...clienteForm, nomeCompleto: e.target.value })}
                    className={`w-full bg-stone-50 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440717] ${
                      formErrors.nomeCompleto ? 'border-rose-500' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.nomeCompleto && (
                    <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.nomeCompleto}</span>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Telefone de Contacto <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="ex: +244 931 324 022"
                    value={clienteForm.telefone || ''}
                    onChange={(e) => setClienteForm({ ...clienteForm, telefone: e.target.value })}
                    className={`w-full bg-stone-50 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440717] ${
                      formErrors.telefone ? 'border-rose-500' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.telefone && (
                    <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.telefone}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email para envio do Bilhete
                  </label>
                  <input
                    type="email"
                    placeholder="ex: passageiro@email.com"
                    value={clienteForm.email || ''}
                    onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })}
                    className={`w-full bg-stone-50 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440717] ${
                      formErrors.email ? 'border-rose-500' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                {/* BI */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Número do BI ou Passaporte
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 006245891LA042"
                    value={clienteForm.numeroBi || ''}
                    onChange={(e) => setClienteForm({ ...clienteForm, numeroBi: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440717]"
                  />
                </div>

                {/* Província */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Província de Residência
                  </label>
                  <select
                    value={clienteForm.provincia || 'Luanda'}
                    onChange={(e) => setClienteForm({ ...clienteForm, provincia: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440717]"
                  >
                    <option value="Luanda">Luanda</option>
                    <option value="Benguela">Benguela</option>
                    <option value="Huambo">Huambo</option>
                    <option value="Bié">Bié</option>
                    <option value="Kwanza Sul">Kwanza Sul</option>
                    <option value="Zaire">Zaire</option>
                    <option value="Huíla">Huíla</option>
                  </select>
                </div>

                {/* Município / Endereço */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Município & Endereço
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Talatona, Gamek Nosso Centro"
                    value={clienteForm.endereco || ''}
                    onChange={(e) => setClienteForm({ ...clienteForm, endereco: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440717]"
                  />
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar ao Mapa de Lugares
              </button>

              <button
                type="button"
                onClick={handleProceedToConfirm}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#440717] hover:bg-[#A7193D] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Rever e Confirmar Reserva</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMAÇÃO & PAGAMENTO POR REFERÊNCIA */}
        {currentStep === 4 && selectedViagem && selectedSeat && (
          <div className="space-y-6">
            {!reservaCriada ? (
              // Pre-creation Review Card
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 mb-1">
                    Confirmação dos Dados da Reserva
                  </h2>
                  <p className="text-xs text-stone-500">
                    Verifique os dados abaixo antes de gerar a referência de pagamento oficial.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
                  {/* Passageiro */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Passageiro
                    </h4>
                    <p className="text-sm font-semibold text-stone-900">{clienteForm.nomeCompleto}</p>
                    <p className="text-xs text-stone-600">{clienteForm.telefone}</p>
                    {clienteForm.email && <p className="text-xs text-stone-500">{clienteForm.email}</p>}
                    {clienteForm.numeroBi && <p className="text-xs text-stone-500">BI: {clienteForm.numeroBi}</p>}
                  </div>

                  {/* Viagem */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Viagem
                    </h4>
                    <p className="text-sm font-semibold text-stone-900">{selectedViagem.origem} → {selectedViagem.destino}</p>
                    <p className="text-xs text-stone-600">Data: {selectedViagem.dataViagem}</p>
                    <p className="text-xs text-stone-600">Partida: {selectedViagem.horaPartida} ({selectedViagem.duracaoEstimada})</p>
                    <p className="text-xs text-stone-500">{selectedViagem.viatura}</p>
                  </div>

                  {/* Lugar & Pagamento */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Lugar & Total
                    </h4>
                    <p className="text-sm font-semibold text-stone-900">
                      Lugar Nº <span className="text-[#440717] font-bold text-base">{selectedSeat < 10 ? `0${selectedSeat}` : selectedSeat}</span>
                    </p>
                    <p className="text-xs text-stone-500">Modalidade: Referência Multicaixa</p>
                    <p className="text-lg font-bold font-mono text-[#440717] mt-2">
                      {selectedViagem.preco.toLocaleString('pt-AO')} Kz
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Alterar Dados
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleConfirmReservation}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#440717] hover:bg-[#A7193D] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    {loading ? (
                      <span>A gerar reserva no servidor...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirmar Reserva e Gerar Referência</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // PAYMENT REFERENCE SCREEN (Matching Prototype Section 16 - 20)
              <div className="bg-white rounded-2xl border-2 border-[#440717]/20 shadow-xl p-6 sm:p-8 space-y-6">
                
                {/* Header status with Official Logo */}
                <div className="text-center pb-6 border-b border-stone-200 space-y-3">
                  <div className="flex justify-center mb-1">
                    <OfficialLogo size="md" variant="light-bg" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      AGUARDANDO PAGAMENTO
                    </span>
                    <h2 className="text-2xl font-serif font-extrabold text-[#111E2E]">
                      PAGAMENTO POR REFERÊNCIA
                    </h2>
                    <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                      Efectue o pagamento no Multicaixa Express, Internet Banking ou Caixa ATM com os dados abaixo.
                    </p>
                  </div>
                </div>

                {/* Server Expiration Timer */}
                {pagamentoCriado && (
                  <PaymentTimer
                    expiresAt={pagamentoCriado.expiresAt}
                    onExpire={() => {
                      setGeneralError('O prazo de 60 minutos expirou. A reserva foi cancelada e o lugar libertado.');
                    }}
                  />
                )}

                {/* Multicaixa Reference Box */}
                <div className="bg-stone-50 border-2 border-stone-300 rounded-xl p-6 space-y-4">
                  
                  {/* Entidade */}
                  <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-stone-200">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                        Entidade
                      </span>
                      <span className="text-xl font-mono font-bold text-stone-900">
                        {pagamentoCriado?.entidade || '00578'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(pagamentoCriado?.entidade || '00578', 'entidade')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-md transition-colors"
                    >
                      {copiedEntidade ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedEntidade ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* Referência */}
                  <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-stone-200">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                        Referência
                      </span>
                      <span className="text-2xl font-mono font-extrabold text-[#440717] tracking-wider">
                        {pagamentoCriado?.referencia}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(pagamentoCriado?.referencia || '', 'ref')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-md transition-colors"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedRef ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* Valor */}
                  <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-stone-200">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                        Valor a Pagar
                      </span>
                      <span className="text-2xl font-mono font-bold text-stone-900">
                        {pagamentoCriado?.valor.toLocaleString('pt-AO')} Kz
                      </span>
                    </div>
                    <span className="text-xs text-stone-400 font-medium">Moeda: AOA</span>
                  </div>

                  {/* Reserva ID */}
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1 pt-1">
                    <span>Código da Reserva: <strong>{reservaCriada.codigoReserva}</strong></span>
                    <span>Lugar: <strong>Nº {selectedSeat < 10 ? `0${selectedSeat}` : selectedSeat}</strong></span>
                  </div>
                </div>

                {/* SMS & Email Notification Card */}
                <div className="bg-emerald-50/70 border border-emerald-300/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-950">
                        Notificação Automática de Reserva Enviada
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      SMS enviado para <strong>{reservaCriada.cliente.telefone}</strong>
                      {reservaCriada.cliente.email ? ` e E-mail para ${reservaCriada.cliente.email}` : ''}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotificationModal(true)}
                    className="bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-400 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Ver SMS / E-mail</span>
                  </button>
                </div>

                {/* TEST ENVIRONMENT SIMULATOR (Section 26 of prompt) */}
                <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                        AMBIENTE DE TESTE & DEMONSTRAÇÃO
                      </span>
                      <h4 className="text-sm font-bold text-amber-950 mt-1">
                        Simulador de Pagamento Multicaixa
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Simule a liquidação imediata da referência pelo banco para confirmar a reserva e emitir o bilhete digital com QR Code.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSimulatePayment}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      {loading ? 'A processar...' : 'Simular Pagamento'}
                    </button>
                  </div>
                </div>

                {/* Notification Modal */}
                {showNotificationModal && (
                  <NotificationModal
                    isOpen={showNotificationModal}
                    onClose={() => setShowNotificationModal(false)}
                    tipo="RESERVA"
                    id={reservaCriada.id}
                    destinatarioTelefone={reservaCriada.cliente.telefone}
                    destinatarioEmail={reservaCriada.cliente.email}
                    passageiroNome={reservaCriada.cliente.nomeCompleto}
                    codigoReserva={reservaCriada.codigoReserva}
                  />
                )}

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
