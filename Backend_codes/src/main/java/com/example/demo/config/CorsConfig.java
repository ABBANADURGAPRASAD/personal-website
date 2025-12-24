package com.example.demo.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

  @Value("${cors.allowedOrigins:http://localhost:4200}")
  private List<String> allowedOrigins;

  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    
    // For development: allow all localhost ports using patterns
    // This is more flexible than listing every port
    config.addAllowedOriginPattern("http://localhost:*");
    config.addAllowedOriginPattern("http://127.0.0.1:*");
    
    // Also add specific configured origins as backup
    if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
      allowedOrigins.forEach(origin -> {
        if (!origin.contains("*")) {
          config.addAllowedOrigin(origin);
        }
      });
    }
    
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    config.addAllowedMethod("OPTIONS");
    config.addExposedHeader("*");
    config.setMaxAge(3600L); // Cache preflight for 1 hour

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }
}


