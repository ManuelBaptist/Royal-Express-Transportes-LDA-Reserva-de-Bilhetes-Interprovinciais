package ao.royalexpress.controller;

import ao.royalexpress.entity.Rota;
import ao.royalexpress.repository.RotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rotas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RotaController {

    private final RotaRepository rotaRepository;

    @GetMapping
    public ResponseEntity<List<Rota>> listarRotas() {
        return ResponseEntity.ok(rotaRepository.findByEstado("ACTIVA"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rota> buscarPorId(@PathVariable Long id) {
        return rotaRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
