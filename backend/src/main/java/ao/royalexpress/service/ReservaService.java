package ao.royalexpress.service;

import ao.royalexpress.entity.*;
import ao.royalexpress.repository.*;
import ao.royalexpress.util.ReferenciaGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final PagamentoRepository pagamentoRepository;
    private final BilheteRepository bilheteRepository;
    private final ViagemRepository viagemRepository;
    private final LugarRepository lugarRepository;
    private final ClienteRepository clienteRepository;
    private final ReferenciaGenerator referenciaGenerator;

    /**
     * REGRA 1 & 2 & 17: Criação de Reserva com Bloqueio Seguro no Servidor
     */
    @Transactional
    public Reserva criarReserva(Long viagemId, Long lugarId, Cliente clienteInput) {
        Viagem viagem = viagemRepository.findById(viagemId)
            .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada: " + viagemId));

        Lugar lugar = lugarRepository.findById(lugarId)
            .orElseThrow(() -> new IllegalArgumentException("Lugar não encontrado: " + lugarId));

        if (!lugar.getViatura().getId().equals(viagem.getViatura().getId())) {
            throw new IllegalStateException("O lugar não pertence à viatura designada para esta viagem.");
        }

        // Verifica concorrência em tempo real (FOR UPDATE)
        LocalDateTime agora = LocalDateTime.now();
        List<Reserva> reservasActivas = reservaRepository.findActiveReservationsForSeat(
            viagemId, lugarId, List.of(EstadoReserva.CONFIRMADA, EstadoReserva.PENDENTE_PAGAMENTO)
        );

        for (Reserva r : reservasActivas) {
            if (r.getEstado() == EstadoReserva.CONFIRMADA) {
                throw new IllegalStateException("Este lugar já foi vendido.");
            }
            if (r.getEstado() == EstadoReserva.PENDENTE_PAGAMENTO && r.getExpiresAt().isAfter(agora)) {
                throw new IllegalStateException("Este lugar acabou de ser reservado por outro passageiro. Tente outro lugar.");
            }
        }

        // Salvar ou actualizar dados do cliente
        Cliente cliente = clienteRepository.findByTelefone(clienteInput.getTelefone())
            .orElseGet(() -> clienteRepository.save(clienteInput));

        cliente.setNomeCompleto(clienteInput.getNomeCompleto());
        cliente.setEmail(clienteInput.getEmail());
        if (clienteInput.getNumeroBi() != null) cliente.setNumeroBi(clienteInput.getNumeroBi());
        cliente = clienteRepository.save(cliente);

        // Preço da viagem
        BigDecimal preco = viagem.getPreco();

        // Criar Reserva com ID interno e código temporário
        Reserva reserva = Reserva.builder()
            .codigoReserva("RE-TEMP-" + UUID.randomUUID().toString().substring(0, 8))
            .cliente(cliente)
            .viagem(viagem)
            .lugar(lugar)
            .estado(EstadoReserva.PENDENTE_PAGAMENTO)
            .valor(preco)
            .createdAt(agora)
            .expiresAt(agora.plusMinutes(60)) // REGRA 8: 60 minutos controlado pelo servidor
            .build();

        reserva = reservaRepository.save(reserva);

        // Atribuir Código Oficial único baseado no ID interno
        String codigoOficial = referenciaGenerator.gerarCodigoReserva(reserva.getId());
        reserva.setCodigoReserva(codigoOficial);
        reserva = reservaRepository.save(reserva);

        // REGRA 4 & 5 & 16: Criar Pagamento por Referência (Entidade 00578)
        String referenciaUnica = referenciaGenerator.gerarReferencia();
        Pagamento pagamento = Pagamento.builder()
            .reserva(reserva)
            .entidade(ReferenciaGenerator.ENTIDADE_ROYAL_EXPRESS)
            .referencia(referenciaUnica)
            .valor(preco)
            .moeda("AOA")
            .estado(EstadoPagamento.PENDENTE)
            .metodoPagamento("REFERENCIA_MULTICAIXA")
            .provider("EMIS_MULTICAIXA")
            .createdAt(agora)
            .expiresAt(reserva.getExpiresAt())
            .build();

        pagamentoRepository.save(pagamento);

        log.info("Reserva criada com sucesso: ID={}, Código={}, Referência={}",
            reserva.getId(), reserva.getCodigoReserva(), referenciaUnica);

        return reserva;
    }

    /**
     * REGRA 12 & 22: Expiração Automática de Reservas e Pagamentos
     * Executado periodicamente no servidor (a cada 30 segundos)
     */
    @Scheduled(fixedRate = 30000)
    @Transactional
    public void processarExpiracoesAutomaticas() {
        LocalDateTime agora = LocalDateTime.now();
        List<Reserva> expiradas = reservaRepository.findExpiredReservations(EstadoReserva.PENDENTE_PAGAMENTO, agora);

        for (Reserva r : expiradas) {
            r.setEstado(EstadoReserva.EXPIRADA);
            reservaRepository.save(r);

            pagamentoRepository.findByReservaId(r.getId()).ifPresent(p -> {
                if (p.getEstado() == EstadoPagamento.PENDENTE) {
                    p.setEstado(EstadoPagamento.EXPIRADO);
                    pagamentoRepository.save(p);
                }
            });

            log.info("Reserva expirada automaticamente pelo servidor: Código={}, Lugar libertado={}",
                r.getCodigoReserva(), r.getLugar().getNumero());
        }
    }

    /**
     * REGRA 13 & 14 & 26: Confirmação de Pagamento e Emissão Automática de Bilhete
     */
    @Transactional
    public Bilhete confirmarPagamento(Long pagamentoId, String transactionId, String responsePayload) {
        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
            .orElseThrow(() -> new IllegalArgumentException("Pagamento não encontrado: " + pagamentoId));

        if (pagamento.getEstado() == EstadoPagamento.PAGO) {
            return bilheteRepository.findByReservaId(pagamento.getReserva().getId())
                .orElseThrow(() -> new IllegalStateException("Bilhete já emitido"));
        }

        LocalDateTime agora = LocalDateTime.now();
        if (agora.isAfter(pagamento.getExpiresAt())) {
            pagamento.setEstado(EstadoPagamento.EXPIRADO);
            pagamentoRepository.save(pagamento);
            throw new IllegalStateException("A referência de pagamento expirou. O prazo de 60 minutos foi ultrapassado.");
        }

        // Actualizar pagamento para PAGO
        pagamento.setEstado(EstadoPagamento.PAGO);
        pagamento.setPaidAt(agora);
        pagamento.setTransactionId(transactionId != null ? transactionId : "TRX-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        pagamento.setProviderResponse(responsePayload);
        pagamentoRepository.save(pagamento);

        // Actualizar reserva para CONFIRMADA
        Reserva reserva = pagamento.getReserva();
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reserva.setConfirmedAt(agora);
        reservaRepository.save(reserva);

        // Emitir Bilhete Digital Único
        String numeroBilhete = referenciaGenerator.gerarNumeroBilhete(reserva.getId());
        String qrCodeUrl = "/validar/" + numeroBilhete;

        Bilhete bilhete = Bilhete.builder()
            .numeroBilhete(numeroBilhete)
            .reserva(reserva)
            .qrCode(qrCodeUrl)
            .estado(EstadoBilhete.EMITIDO)
            .emitidoEm(agora)
            .build();

        bilhete = bilheteRepository.save(bilhete);
        log.info("Bilhete Digital emitido com sucesso: Bilhete Nº={}, Reserva={}", numeroBilhete, reserva.getCodigoReserva());

        return bilhete;
    }
}
