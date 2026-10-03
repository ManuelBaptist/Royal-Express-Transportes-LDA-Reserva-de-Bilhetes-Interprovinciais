package ao.royalexpress.repository;

import ao.royalexpress.entity.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {

    @Query("SELECT v FROM Viagem v WHERE " +
           "(:origem IS NULL OR LOWER(v.rota.origem) = LOWER(:origem)) AND " +
           "(:destino IS NULL OR LOWER(v.rota.destino) = LOWER(:destino)) AND " +
           "(:dataViagem IS NULL OR v.dataViagem = :dataViagem) AND " +
           "v.estado = 'AGENDADA' " +
           "ORDER BY v.dataViagem ASC, v.horaPartida ASC")
    List<Viagem> buscarViagens(
        @Param("origem") String origem,
        @Param("destino") String destino,
        @Param("dataViagem") LocalDate dataViagem
    );

    List<Viagem> findByDataViagem(LocalDate dataViagem);
}
