package com.dip.doc_intelligence_pipeline.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AiExtractionService {

    private final RestClient restClient;

    public AiExtractionService(
            @Value("${groq.api.url}") String apiUrl,
            @Value("${groq.api.key}") String apiKey) {

        // Initialize the modern Spring RestClient with your Groq credentials
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String extractDataWithLlama(String rawText) {
        // 1. The Prompt Engineering: Tell Llama 3 exactly what to do
        String systemPrompt = "You are an enterprise document intelligence AI. "
                + "Extract the key entities from the provided text. "
                + "You MUST return ONLY a valid JSON object. Do not include markdown formatting, explanations, or introductory text. "
                + "Look for fields like 'documentType', 'vendorName', 'totalAmount', and 'date'. If a field is not found, set it to null.";

        // 2. Build the request body matching Groq's OpenAI-compatible API
        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.1-8b-instant",
                "temperature", 0.1,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", rawText)
                )
        );

        // 3. Send the request and capture the response
        try {
            Map<String, Object> response = restClient.post()
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            // Navigate the response map to grab the actual message content
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

            return (String) message.get("content");

        } catch (Exception e) {
            System.err.println("AI Extraction failed: " + e.getMessage());
            return "{\"error\": \"Failed to extract data\"}";
        }
    }
}
