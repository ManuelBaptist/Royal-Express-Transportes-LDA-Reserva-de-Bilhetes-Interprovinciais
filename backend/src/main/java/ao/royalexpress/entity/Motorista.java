package ao.royalexpress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "motoristas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "telefone", nullable = false, length = 30)
    private String telefone;

    @Column(name = "numero_carta", nullable = false, unique = true, length = 50)
    private String numeroCarta;

    @Column(name = "categoria_carta", nullable = false, length = 20)
    private String categoriaCarta;

    @Column(name = "data_validade_carta", nullable = false)
    private LocalDate dataValidadeCarta;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
