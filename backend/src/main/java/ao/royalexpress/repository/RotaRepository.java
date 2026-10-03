package ao.royalexpress.repository;

import ao.royalexpress.entity.Rota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RotaRepository extends JpaRepository<Rota, Long> {

    List<Rota> findByEstado(String estado);

    Optional<Rota> findByOrigemAndDestino(String origem, String destino);
}
