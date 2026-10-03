package ao.royalexpress.repository;

import ao.royalexpress.entity.Lugar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LugarRepository extends JpaRepository<Lugar, Long> {

    List<Lugar> findByViaturaIdOrderByNumeroAsc(Long viaturaId);

    Optional<Lugar> findByViaturaIdAndNumero(Long viaturaId, Integer numero);
}
