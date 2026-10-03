package ao.royalexpress.controller;

import ao.royalexpress.entity.Pagamento;
import ao.royalexpress.entity.Bilhete;
import ao.royalexpress.repository.PagamentoRepository;
import ao.royalexpress.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/pagamentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PagamentoController {

    private final PagamentoRepository pagamentoRepository;
    private final ReservaService reservaService;

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return pagamentoRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * REGRA 3 & 10 & 21: Consulta o estado do pagamento e o expires_at oficial do servidor
     */
    @GetMapping("/{id}/estado")
    public ResponseEntity<?> consultarEstado(@PathVariable Long id) {
        return pagamentoRepository.findById(id)
            .map(p -> {
                LocalDateTime agora = LocalDateTime.now();
                long segundosRestantes = java.time.Duration.between(agora, p.getExpiresAt()).getSeconds();
                if (segundosRestantes < 0) segundosRestantes = 0;

                return ResponseEntity.ok(Map.of(
                    "id", p.getId(),
                    "referencia", p.getReferencia(),
                    "entidade", p.getEntidade(),
                    "valor", p.getValor(),
                    "estado", p.getEstado().name(),
                    "expiresAt", p.getExpiresAt().toString(),
                    "serverTime", agora.toString(),
                    "segundosRestantes", segundosRestantes,
                    "expirado", agora.isAfter(p.getExpiresAt()) && !p.getEstado().name().equals("PAGO")
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Webhook bancário / EMIS para notificação oficial de pagamento
     */
    @PostMapping("/{id}/webhook")
    public ResponseEntity<?> webhookPagamento(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body
    ) {
        try {
            String transactionId = (String) body.getOrDefault("transaction_id", "TRX-" + System.currentTimeMillis());
            Bilhete bilhete = reservaService.confirmarPagamento(id, transactionId, body.toString());
            return ResponseEntity.ok(Map.of("status", "SUCCESS", "bilhete", bilhete));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * REGRA 26: Simulador de pagamento para ambiente de testes e validação
     */
    @PostMapping("/{id}/simular")
    public ResponseEntity<?> simularPagamento(@PathVariable Long id) {
        try {
            Bilhete bilhete = reservaService.confirmarPagamento(id, "MOCK-SIMULATED-" + System.currentTimeMillis(), "{\"source\":\"TEST_ENVIRONMENT_MOCK\"}");
            return ResponseEntity.ok(Map.of("status", "SUCCESS", "bilhete", bilhete));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
