package ao.royalexpress.service;

import ao.royalexpress.entity.Bilhete;
import ao.royalexpress.entity.Reserva;
import ao.royalexpress.entity.Pagamento;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Serviço de Notificações Automáticas da Royal Express Transportes, LDA.
 * Envia mensagens SMS e E-mails com links directos para bilhetes digitais e confirmações de reserva.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    @Value("${app.url:https://www.royalexpress.ao}")
    private String appUrl;

    @Value("${royalexpress.sms.gateway-url:https://api.sms-angola.ao/v1/send}")
    private String smsGatewayUrl;

    /**
     * Envia SMS de confirmação de reserva criada com dados de pagamento Multicaixa.
     */
    public void enviarSmsReservaCriada(Reserva reserva, Pagamento pagamento) {
        String mensagem = String.format(
            "Royal Express: Ola %s, a sua reserva %s para %s foi gerada. Pague no Multicaixa: Entidade %s | Ref %s | Valor %,.2f Kz. Prazo: 60 min.",
            reserva.getCliente().getNomeCompleto(),
            reserva.getCodigoReserva(),
            reserva.getViagem().getDestino(),
            pagamento.getEntidade(),
            pagamento.getReferencia(),
            reserva.getValor()
        );

        dispararSmsGateway(reserva.getCliente().getTelefone(), mensagem);
    }

    /**
     * Envia E-mail de confirmação de reserva com template HTML oficial.
     */
    public void enviarEmailReservaCriada(Reserva reserva, Pagamento pagamento) {
        if (reserva.getCliente().getEmail() == null || reserva.getCliente().getEmail().isBlank()) {
            return;
        }

        String assunto = "Confirmação de Reserva " + reserva.getCodigoReserva() + " | Royal Express";
        String corpo = String.format(
            "Prezado(a) %s, a sua reserva foi registada. Efetue o pagamento por Multicaixa: Entidade %s, Referência %s, Valor %,.2f Kz dentro de 60 minutos.",
            reserva.getCliente().getNomeCompleto(),
            pagamento.getEntidade(),
            pagamento.getReferencia(),
            reserva.getValor()
        );

        dispararEmailSmtp(reserva.getCliente().getEmail(), assunto, corpo);
    }

    /**
     * Envia SMS com link do bilhete digital e QR Code após pagamento confirmado.
     */
    public void enviarSmsBilheteEmitido(Bilhete bilhete) {
        String urlBilhete = appUrl + "/bilhete/" + bilhete.getNumeroBilhete();
        String mensagem = String.format(
            "Royal Express: Pagamento confirmado! O seu bilhete digital %s para %s (Lugar %d) esta pronto. Aceda ao bilhete com QR Code: %s. Compareca 30 min antes. Boa viagem!",
            bilhete.getNumeroBilhete(),
            bilhete.getDestino(),
            bilhete.getLugarNumero(),
            urlBilhete
        );

        dispararSmsGateway(bilhete.getTelefone(), mensagem);
    }

    /**
     * Envia E-mail com bilhete oficial de embarque e instruções de viagem.
     */
    public void enviarEmailBilheteEmitido(Bilhete bilhete) {
        if (bilhete.getEmail() == null || bilhete.getEmail().isBlank()) {
            return;
        }

        String urlBilhete = appUrl + "/bilhete/" + bilhete.getNumeroBilhete();
        String assunto = "O seu Bilhete Digital " + bilhete.getNumeroBilhete() + " está Pronto | Royal Express";
        String corpo = String.format(
            "Prezado(a) %s, o pagamento da sua viagem foi confirmado. O seu bilhete digital para %s -> %s (Lugar %d) está pronto: %s",
            bilhete.getPassageiro(),
            bilhete.getOrigem(),
            bilhete.getDestino(),
            bilhete.getLugarNumero(),
            urlBilhete
        );

        dispararEmailSmtp(bilhete.getEmail(), assunto, corpo);
    }

    private void dispararSmsGateway(String telefone, String mensagem) {
        log.info("[SMS GATEWAY ANGOLA] Enviando SMS para {}: {}", telefone, mensagem);
        // Em produção: chamada HTTP REST POST com WebClient / RestTemplate para a API do Gateway SMS de Angola
    }

    private void dispararEmailSmtp(String destinatario, String assunto, String corpo) {
        log.info("[SMTP EMAIL] Enviando email para {} | Assunto: {}", destinatario, assunto);
        // Em produção: envio através de JavaMailSender com MimeMessageHelper e template Thymeleaf
    }
}
