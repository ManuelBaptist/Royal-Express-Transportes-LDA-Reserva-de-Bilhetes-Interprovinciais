package ao.royalexpress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lugares", uniqueConstraints = {
    @UniqueConstraint(name = "uk_viatura_lugar", columnNames = {"viatura_id", "numero"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lugar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "viatura_id", nullable = false)
    private Viatura viatura;

    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Column(name = "fila", nullable = false)
    private Integer fila;

    @Column(name = "coluna", nullable = false, length = 5)
    private String coluna; // 'A', 'B', 'C', 'D'

    @Column(name = "tipo", nullable = false, length = 30)
    @Builder.Default
    private String tipo = "NORMAL"; // NORMAL, PRIORITARIO, MOTORISTA, BLOQUEADO

    @Column(name = "estado", nullable = false, length = 30)
    @Builder.Default
    private String estado = "DISPONIVEL";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
