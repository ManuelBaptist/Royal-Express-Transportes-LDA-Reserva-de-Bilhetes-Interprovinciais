package ao.royalexpress.repository;

import ao.royalexpress.entity.Reserva;
import ao.royalexpress.entity.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    Optional<Reserva> findByCodigoReserva(String codigoReserva);

    /**
     * Verifica concorrência em tempo real com bloqueio pessimista para evitar
     * que dois clientes reservem o mesmo lugar na mesma viagem em paralelo.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Reserva r WHERE r.viagem.id = :viagemId AND r.lugar.id = :lugarId AND r.estado IN (:estados)")
    List<Reserva> findActiveReservationsForSeat(
        @Param("viagemId") Long viagemId,
        @Param("lugarId") Long lugarId,
        @Param("estados") List<EstadoReserva> estados
    );

    /**
     * Busca todas as reservas temporárias que ultrapassaram o prazo de 60 minutos
     * para expiração automática pelo servidor.
     */
    @Query("SELECT r FROM Reserva r WHERE r.estado = :estado AND r.expiresAt <= :now")
    List<Reserva> findExpiredReservations(
        @Param("estado") EstadoReserva estado,
        @Param("now") LocalDateTime now
    );

    List<Reserva> findByViagemId(Long viagemId);

    List<Reserva> findByClienteTelefoneOrderByCreatedAtDesc(String telefone);
}
