package com.coopereats.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
public class JwtConfig {

    @Bean
    public JwtDecoder jwtDecoder() {
        String jwkSetUri = "https://your-issuer-uri/.well-known/jwks.json";
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }
}
