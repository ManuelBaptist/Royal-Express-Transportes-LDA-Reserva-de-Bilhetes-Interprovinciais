package ao.royalexpress.repository;

import ao.royalexpress.entity.Pagamento;
import ao.royalexpress.entity.EstadoPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    Optional<Pagamento> findByReferencia(String referencia);

    Optional<Pagamento> findByReservaId(Long reservaId);

    List<Pagamento> findByEstado(EstadoPagamento estado);
}
