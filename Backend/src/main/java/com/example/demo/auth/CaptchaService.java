package com.example.demo.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CaptchaService {

    @Value("${google.recaptcha.secret}")
    private String secretKey;

    private static final Logger logger = LoggerFactory.getLogger(CaptchaService.class);

    public boolean verifyCaptcha(String response) {
        String url = "https://www.google.com/recaptcha/api/siteverify";
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("secret", secretKey);
        body.add("response", response);

        logger.info("Secret Key: {}", secretKey);
        logger.info("Response: {}", response);

        ResponseEntity<Map> recaptchaResponse = restTemplate.postForEntity(url, body, Map.class);
        Map<String, Object> responseBody = recaptchaResponse.getBody();

        if (responseBody == null || responseBody.isEmpty()) {
            return false;
        }

        logger.info("reCAPTCHA Response: {}", responseBody);

        return (boolean) responseBody.get("success");
    }
}
