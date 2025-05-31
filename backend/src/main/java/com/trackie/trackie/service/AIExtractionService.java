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

        // create a new HTTP client to make POST request (responsible for establishing
        // connection, sending, etc...)
        RestTemplate restTemplate = new RestTemplate();

        // setup request headers basically saying that the content will be in JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // initialize request body
        Map<String, String> requestBody = new HashMap<>();

        // prepare the body -> pass in the extracted text
        requestBody.put("text", extractedText);

        // bundles request body, headers into a request
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        // send request using restTemplate, and send a post request to the url, and
        // tells that the response will be a hashmap

        ResponseEntity<Map> response = restTemplate.postForEntity(aiApiUrl, request, Map.class);
        // return the parsed response from ai to the call
        return response.getBody();
    }

}
