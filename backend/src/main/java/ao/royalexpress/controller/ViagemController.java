package ao.royalexpress.controller;

import ao.royalexpress.entity.Viagem;
import ao.royalexpress.entity.Lugar;
import ao.royalexpress.entity.Reserva;
import ao.royalexpress.entity.EstadoReserva;
import ao.royalexpress.repository.ViagemRepository;
import ao.royalexpress.repository.LugarRepository;
import ao.royalexpress.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/viagens")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ViagemController {

    private final ViagemRepository viagemRepository;
    private final LugarRepository lugarRepository;
    private final ReservaRepository reservaRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarViagens(
        @RequestParam(required = false) String origem,
        @RequestParam(required = false) String destino,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data
    ) {
        List<Viagem> viagens = viagemRepository.buscarViagens(origem, destino, data);
        List<Map<String, Object>> response = new ArrayList<>();
        LocalDateTime agora = LocalDateTime.now();

        for (Viagem v : viagens) {
            List<Lugar> lugares = lugarRepository.findByViaturaIdOrderByNumeroAsc(v.getViatura().getId());
            List<Reserva> reservas = reservaRepository.findByViagemId(v.getId());

            long ocupados = reservas.stream()
                .filter(r -> r.getEstado() == EstadoReserva.CONFIRMADA ||
                            (r.getEstado() == EstadoReserva.PENDENTE_PAGAMENTO && r.getExpiresAt().isAfter(agora)))
                .count();

            int lugaresDisponiveis = Math.max(0, lugares.size() - (int) ocupados);

            Map<String, Object> item = new HashMap<>();
            item.put("id", v.getId());
            item.put("origem", v.getRota().getOrigem());
            item.put("destino", v.getRota().getDestino());
            item.put("distanciaKm", v.getRota().getDistanciaKm());
            item.put("duracaoEstimada", v.getRota().getDuracaoEstimada());
            item.put("dataViagem", v.getDataViagem());
            item.put("horaPartida", v.getHoraPartida().toString().substring(0, 5));
            item.put("horaChegadaEstimada", v.getHoraChegadaEstimada().toString().substring(0, 5));
            item.put("preco", v.getPreco());
            item.put("viatura", v.getViatura().getModelo());
            item.put("viaturaMatricula", v.getViatura().getMatricula());
            item.put("capacidade", v.getViatura().getCapacidade());
            item.put("lugaresDisponiveis", lugaresDisponiveis);
            item.put("estado", v.getEstado());

            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return viagemRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * REGRA 11: Retorna o mapa de lugares com os estados calculados pelo backend
     */
    @GetMapping("/{id}/lugares")
    public ResponseEntity<?> listarLugaresDaViagem(@PathVariable Long id) {
        Viagem viagem = viagemRepository.findById(id).orElse(null);
        if (viagem == null) return ResponseEntity.notFound().build();

        List<Lugar> lugares = lugarRepository.findByViaturaIdOrderByNumeroAsc(viagem.getViatura().getId());
        List<Reserva> reservas = reservaRepository.findByViagemId(viagem.getId());
        LocalDateTime agora = LocalDateTime.now();

        Map<Long, Reserva> mapaReservas = new HashMap<>();
        for (Reserva r : reservas) {
            if (r.getEstado() == EstadoReserva.CONFIRMADA) {
                mapaReservas.put(r.getLugar().getId(), r);
            } else if (r.getEstado() == EstadoReserva.PENDENTE_PAGAMENTO && r.getExpiresAt().isAfter(agora)) {
                mapaReservas.put(r.getLugar().getId(), r);
            }
        }

        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Lugar l : lugares) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", l.getId());
            dto.put("numero", l.getNumero());
            dto.put("fila", l.getFila());
            dto.put("coluna", l.getColuna());
            dto.put("tipo", l.getTipo());

            if (mapaReservas.containsKey(l.getId())) {
                Reserva r = mapaReservas.get(l.getId());
                if (r.getEstado() == EstadoReserva.CONFIRMADA) {
                    dto.put("estado", "OCUPADO");
                } else {
                    dto.put("estado", "RESERVADO_TEMPORARIAMENTE");
                }
            } else if ("BLOQUEADO".equalsIgnoreCase(l.getEstado())) {
                dto.put("estado", "BLOQUEADO");
            } else {
                dto.put("estado", "DISPONIVEL");
            }

            resultado.add(dto);
        }

        return ResponseEntity.ok(Map.of(
            "viagemId", viagem.getId(),
            "viaturaModelo", viagem.getViatura().getModelo(),
            "viaturaCapacidade", viagem.getViatura().getCapacidade(),
            "preco", viagem.getPreco(),
            "lugares", resultado
        ));
    }
}
