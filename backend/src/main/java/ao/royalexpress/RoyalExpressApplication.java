package ao.royalexpress;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RoyalExpressApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoyalExpressApplication.class, args);
    }
}
