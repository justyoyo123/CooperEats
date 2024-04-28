package com.coopereats.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {

    // Define the JwtDecoder bean
    @Bean
    public JwtDecoder jwtDecoder() {
        // Specify the JWK Set URI
        String jwkSetUri = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken%40system.gserviceaccount.com";
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    // SecurityFilterChain bean definition
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF
//                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
//                .authorizeHttpRequests(authz -> authz
//                        .requestMatchers("http://localhost:8080/api/**").permitAll()); // Permit all requests to /api/users
////                        .anyRequest().authenticated()) // All other requests require authentication
////                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder()))); // Configure JWT resource server
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure CORS with Java configuration
                .cors(cors -> cors.disable()) // Disable CORS using the new method
                .csrf(csrf -> csrf.disable()) // Disable CSRF
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll()); // Permit all requests

        return http.build();
    }

    // CORS configuration
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost")); // Allows CORS request from the frontend service
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // Necessary if you are handling cookies or basic authentication

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    }
}