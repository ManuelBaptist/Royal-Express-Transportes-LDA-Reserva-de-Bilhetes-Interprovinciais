package ao.royalexpress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clientes", indexes = {
    @Index(name = "idx_clientes_telefone", columnList = "telefone"),
    @Index(name = "idx_clientes_bi", columnList = "numero_bi")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_completo", nullable = false, length = 150)
    private String nomeCompleto;

    @Column(name = "telefone", nullable = false, length = 30)
    private String telefone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "numero_bi", length = 50)
    private String numeroBi;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "provincia", length = 100)
    private String provincia;

    @Column(name = "municipio", length = 100)
    private String municipio;

    @Column(name = "endereco", length = 255)
    private String endereco;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
