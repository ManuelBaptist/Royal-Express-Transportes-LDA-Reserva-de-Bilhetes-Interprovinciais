package ao.royalexpress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rotas", uniqueConstraints = {
    @UniqueConstraint(name = "uk_origem_destino", columnNames = {"origem", "destino"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "origem", nullable = false, length = 100)
    private String origem;

    @Column(name = "destino", nullable = false, length = 100)
    private String destino;

    @Column(name = "distancia_km", nullable = false)
    private Integer distanciaKm;

    @Column(name = "duracao_estimada", nullable = false, length = 50)
    private String duracaoEstimada;

    @Column(name = "preco_base", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoBase;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_url")
    private String imagemUrl;

    @Column(name = "estado", nullable = false, length = 30)
    @Builder.Default
    private String estado = "ACTIVA";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
