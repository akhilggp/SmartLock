package com.example.SmartLock.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JWTService {

    // Secure key - should be stored in env or config
    private static final String SECRET_KEY = "ThisIsA512BitSuperSecretKeyUsedForSigningJWTsInSmartLockProject12345678901234567890"; // 512-bit key

    // Signing key using HMAC-SHA256
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Generate JWT token
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(getSigningKey())
                .compact();
    }

    // Extract username (subject) from token
    public String extractUsername(String token) {
        return parseToken(token).getPayload().getSubject();
    }

    // Check if token is valid
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return parseToken(token).getPayload().getExpiration().before(new Date());
    }

    // Parse token and get Jws<Claims>
    private Jws<Claims> parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
    }
}
