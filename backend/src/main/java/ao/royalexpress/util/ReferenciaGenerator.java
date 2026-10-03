package ao.royalexpress.util;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component
public class ReferenciaGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();
    public static final String ENTIDADE_ROYAL_EXPRESS = "00578";

    /**
     * Gera uma referência de pagamento Multicaixa única de 9 dígitos numéricos
     * associada à entidade 00578 da Royal Express Transportes.
     * Exemplo: 842 731 905
     */
    public String gerarReferencia() {
        // Gera os primeiros 7 dígitos com entropia criptográfica
        int base = 1000000 + RANDOM.nextInt(9000000);
        
        // Calcula 2 dígitos de verificação (Check-Digits mod 97 padrão EMIS / Multicaixa)
        int checkDigits = calcularCheckDigits(ENTIDADE_ROYAL_EXPRESS, base);
        
        return String.format("%07d%02d", base, checkDigits);
    }

    /**
     * Gera o código público legível da reserva no formato RE-YYYYMMDD-XXXXXX
     */
    public String gerarCodigoReserva(Long id) {
        String dataStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE);
        return String.format("RE-%s-%06d", dataStr, id % 1000000);
    }

    /**
     * Gera o número do bilhete digital no formato RX-YYYYMMDD-XXXXXX
     */
    public String gerarNumeroBilhete(Long id) {
        String dataStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE);
        return String.format("RX-%s-%06d", dataStr, id % 1000000);
    }

    private int calcularCheckDigits(String entidade, int baseNum) {
        // Algoritmo de verificação de referência EMIS / Multicaixa
        long combined = (Long.parseLong(entidade) * 10000000L + baseNum) % 97;
        int check = (int) (98 - (combined * 100 % 97)) % 97;
        return check == 0 ? 97 : check;
    }
}
