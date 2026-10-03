package ao.royalexpress.repository;

import ao.royalexpress.entity.Bilhete;
import ao.royalexpress.entity.EstadoBilhete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface BilheteRepository extends JpaRepository<Bilhete, Long> {

    Optional<Bilhete> findByNumeroBilhete(String numeroBilhete);

    Optional<Bilhete> findByReservaId(Long reservaId);

    List<Bilhete> findByEstado(EstadoBilhete estado);
}
