package com.trackie.trackie.service;

// building http request, making http calls
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIExtractionService {
    public Map<String, Object> analyzeText(String extractedText) {
        String aiApiUrl = "http://localhost:8000/analyze";

        // create a new HTTP client to make POST request
        RestTemplate restTemplate = new RestTemplate();

        // setup request headers, and tell api that body will be JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> requestBody = new HashMap<>();

        // prepare JSON body for API
        requestBody.put("text", extractedText);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
        // wrap headers and body into httpentity to send to POST request

        ResponseEntity<Map> response = restTemplate.postForEntity(aiApiUrl, request, Map.class);
        return response.getBody();
    }

}
