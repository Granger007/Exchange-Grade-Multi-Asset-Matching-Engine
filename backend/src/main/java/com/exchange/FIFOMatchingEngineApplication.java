package com.exchange;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.exchange.domain.OrderBook;
import com.exchange.engine.MatchingEngine;
import com.exchange.strategy.FIFOMatching;
import com.exchange.strategy.MatchingStrategy;

@SpringBootApplication
@Configuration
public class FIFOMatchingEngineApplication {

    public static void main(String[] args) {
        SpringApplication.run(FIFOMatchingEngineApplication.class, args);
        System.out.println("🚀 FIFO Order Matching Engine started successfully!");
        System.out.println("📊 Order Book and Matching Engine are ready for trading");
    }

    @Bean
    public OrderBook orderBook() {
        return new OrderBook();
    }

    @Bean
    public MatchingStrategy matchingStrategy() {
        return new FIFOMatching();
    }

    @Bean
    public MatchingEngine matchingEngine(OrderBook orderBook, MatchingStrategy matchingStrategy) {
        return new MatchingEngine(orderBook, matchingStrategy);
    }
}
