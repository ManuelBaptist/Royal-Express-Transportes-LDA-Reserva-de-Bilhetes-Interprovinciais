package ao.royalexpress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos", indexes = {
    @Index(name = "idx_pagamentos_referencia", columnList = "referencia", unique = true),
    @Index(name = "idx_pagamentos_estado", columnList = "estado")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @Column(name = "entidade", nullable = false, length = 30)
    @Builder.Default
    private String entidade = "00578"; // Entidade oficial Royal Express

    @Column(name = "referencia", nullable = false, unique = true, length = 50)
    private String referencia; // 9 dígitos numéricos gerados pelo servidor (ex: 842731905)

    @Column(name = "valor", nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(name = "moeda", nullable = false, length = 10)
    @Builder.Default
    private String moeda = "AOA";

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 30)
    @Builder.Default
    private EstadoPagamento estado = EstadoPagamento.PENDENTE;

    @Column(name = "metodo_pagamento", nullable = false, length = 50)
    @Builder.Default
    private String metodoPagamento = "REFERENCIA_MULTICAIXA";

    @Column(name = "provider", nullable = false, length = 100)
    @Builder.Default
    private String provider = "EMIS_MULTICAIXA";

    @Column(name = "transaction_id", length = 150)
    private String transactionId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "provider_response", columnDefinition = "TEXT")
    private String providerResponse;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.expiresAt == null) {
            this.expiresAt = this.createdAt.plusMinutes(60);
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
