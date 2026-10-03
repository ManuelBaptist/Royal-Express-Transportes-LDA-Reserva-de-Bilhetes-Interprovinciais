package ao.royalexpress.controller;

import ao.royalexpress.entity.Reserva;
import ao.royalexpress.entity.Cliente;
import ao.royalexpress.service.ReservaService;
import ao.royalexpress.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaService reservaService;
    private final ReservaRepository reservaRepository;

    @PostMapping
    public ResponseEntity<?> criarReserva(@RequestBody Map<String, Object> payload) {
        try {
            Long viagemId = Long.valueOf(payload.get("viagemId").toString());
            Long lugarId = Long.valueOf(payload.get("lugarId").toString());

            @SuppressWarnings("unchecked")
            Map<String, Object> clienteData = (Map<String, Object>) payload.get("cliente");

            Cliente cliente = Cliente.builder()
                .nomeCompleto((String) clienteData.get("nomeCompleto"))
                .telefone((String) clienteData.get("telefone"))
                .email((String) clienteData.get("email"))
                .numeroBi((String) clienteData.get("numeroBi"))
                .provincia((String) clienteData.get("provincia"))
                .municipio((String) clienteData.get("municipio"))
                .endereco((String) clienteData.get("endereco"))
                .build();

            Reserva reserva = reservaService.criarReserva(viagemId, lugarId, cliente);
            return ResponseEntity.ok(reserva);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro ao processar reserva: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return reservaRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<?> buscarPorCodigo(@PathVariable String codigo) {
        return reservaRepository.findByCodigoReserva(codigo)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
