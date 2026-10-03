package ao.royalexpress.controller;

import ao.royalexpress.entity.Bilhete;
import ao.royalexpress.entity.EstadoBilhete;
import ao.royalexpress.repository.BilheteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/bilhetes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BilheteController {

    private final BilheteRepository bilheteRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return bilheteRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * REGRA 29: Consultar Bilhete por Número
     */
    @GetMapping("/consultar")
    public ResponseEntity<?> consultarPorNumero(@RequestParam String numero) {
        return bilheteRepository.findByNumeroBilhete(numero.trim())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * REGRA 28: Validar Bilhete via QR Code / Fiscal de Embarque
     */
    @GetMapping("/{codigo}/validar")
    public ResponseEntity<?> validarBilhete(@PathVariable String codigo) {
        return bilheteRepository.findByNumeroBilhete(codigo.trim())
            .map(bilhete -> {
                boolean valido = bilhete.getEstado() == EstadoBilhete.EMITIDO;
                return ResponseEntity.ok(Map.of(
                    "valido", valido,
                    "numeroBilhete", bilhete.getNumeroBilhete(),
                    "passageiro", bilhete.getReserva().getCliente().getNomeCompleto(),
                    "telefone", bilhete.getReserva().getCliente().getTelefone(),
                    "origem", bilhete.getReserva().getViagem().getRota().getOrigem(),
                    "destino", bilhete.getReserva().getViagem().getRota().getDestino(),
                    "dataViagem", bilhete.getReserva().getViagem().getDataViagem(),
                    "horaPartida", bilhete.getReserva().getViagem().getHoraPartida(),
                    "lugar", bilhete.getReserva().getLugar().getNumero(),
                    "viatura", bilhete.getReserva().getViagem().getViatura().getModelo() + " (" + bilhete.getReserva().getViagem().getViatura().getMatricula() + ")",
                    "valor", bilhete.getReserva().getValor(),
                    "estado", bilhete.getEstado().name(),
                    "emitidoEm", bilhete.getEmitidoEm()
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Fiscais de embarque registam a utilização (check-in no autocarro)
     */
    @PostMapping("/{codigo}/embarcar")
    public ResponseEntity<?> embarcarPassageiro(@PathVariable String codigo) {
        return bilheteRepository.findByNumeroBilhete(codigo.trim())
            .map(b -> {
                if (b.getEstado() != EstadoBilhete.EMITIDO) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Bilhete não está no estado EMITIDO. Estado actual: " + b.getEstado()));
                }
                b.setEstado(EstadoBilhete.EMBARCADO);
                b.setUtilizadoEm(LocalDateTime.now());
                bilheteRepository.save(b);
                return ResponseEntity.ok(Map.of("message", "Embarque validado com sucesso!", "bilhete", b));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
