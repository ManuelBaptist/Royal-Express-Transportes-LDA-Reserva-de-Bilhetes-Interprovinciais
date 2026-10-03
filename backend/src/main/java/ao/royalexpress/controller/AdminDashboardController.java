package ao.royalexpress.controller;

import ao.royalexpress.entity.*;
import ao.royalexpress.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    private final ViagemRepository viagemRepository;
    private final ReservaRepository reservaRepository;
    private final PagamentoRepository pagamentoRepository;
    private final BilheteRepository bilheteRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> obterMetricasDashboard() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime agora = LocalDateTime.now();

        List<Viagem> viagensHoje = viagemRepository.findByDataViagem(hoje);
        List<Reserva> todasReservas = reservaRepository.findAll();
        List<Pagamento> todosPagamentos = pagamentoRepository.findAll();
        List<Bilhete> todosBilhetes = bilheteRepository.findAll();

        long reservasHoje = todasReservas.stream()
            .filter(r -> r.getCreatedAt().toLocalDate().isEqual(hoje))
            .count();

        long bilhetesVendidos = todosBilhetes.size();

        BigDecimal receitaTotal = todosPagamentos.stream()
            .filter(p -> p.getEstado() == EstadoPagamento.PAGO)
            .map(Pagamento::getValor)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pagamentosPendentes = todosPagamentos.stream()
            .filter(p -> p.getEstado() == EstadoPagamento.PENDENTE && p.getExpiresAt().isAfter(agora))
            .count();

        return ResponseEntity.ok(Map.of(
            "viagensHoje", viagensHoje.size(),
            "reservasHoje", reservasHoje,
            "bilhetesVendidos", bilhetesVendidos,
            "receitaTotalKz", receitaTotal,
            "pagamentosPendentes", pagamentosPendentes,
            "frotasActivas", 4,
            "rotasOperacionais", 6
        ));
    }
}
