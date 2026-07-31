package com.studentmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Backend Step 8 — Cross-Origin Resource Sharing (CORS).
 *
 * The frontend (opened from a file or a different port, e.g. Live Server on
 * :5500) runs on a different origin from this API (:8080). Browsers block
 * such cross-origin calls by default. This configuration allows them during
 * development.
 *
 * For production, replace the wildcard with the real frontend URL.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
