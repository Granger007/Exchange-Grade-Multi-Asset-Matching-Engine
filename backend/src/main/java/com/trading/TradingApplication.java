package com.trading;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main Spring Boot Application
 * 
 * Entry point for the FIFO Order Matching System
 */
@SpringBootApplication
@Configuration
public class TradingApplication {

    public static void main(String[] args) {
        SpringApplication.run(TradingApplication.class, args);
        System.out.println("=== FIFO Order Matching System Started ===");
        System.out.println("API Endpoints:");
        System.out.println("  POST /api/orders - Create order");
        System.out.println("  GET /api/orders/{id} - Get order status");
        System.out.println("  DELETE /api/orders/{id} - Cancel order");
        System.out.println("  GET /api/orders/open - Get open orders");
        System.out.println("=======================================");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
