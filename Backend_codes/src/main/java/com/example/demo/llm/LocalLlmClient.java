package com.example.demo.llm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class LocalLlmClient {

  private final WebClient webClient;
  private final String model;
  private final ObjectMapper objectMapper;

  public LocalLlmClient(
      @Value("${ai.ollama.baseUrl:http://localhost:11434}") String baseUrl,
      @Value("${ai.ollama.model:llama3}") String model) {
    this.webClient = WebClient.builder()
        .baseUrl(baseUrl)
        .build();
    this.model = model;
    this.objectMapper = new ObjectMapper();
  }

  public String generate(String prompt, String systemPrompt) {
    record GenerateRequest(
        String model,
        @JsonProperty("system") String system,
        String prompt,
        boolean stream
    ) {}

    try {
      // Ollama returns NDJSON (newline-delimited JSON) even when stream=false
      // We need to read the response as text and parse each line
      String responseText = webClient.post()
          .uri("/api/generate")
          .bodyValue(new GenerateRequest(model, systemPrompt, prompt, false))
          .retrieve()
          .bodyToMono(String.class)
          .block();

      if (responseText == null || responseText.trim().isEmpty()) {
        return "Error: No response from LLM";
      }

      // Parse NDJSON - each line is a JSON object
      String fullResponse = parseNdJsonResponse(responseText);

      return fullResponse.length() > 0 ? fullResponse : "Error: No response from LLM";
    } catch (Exception e) {
      e.printStackTrace();
      return "Error: Failed to generate response - " + e.getMessage();
    }
  }

  // Overloaded method for backward compatibility
  public String generate(String prompt) {
    return generate(prompt, null);
  }

  private String parseNdJsonResponse(String responseText) {
    StringBuilder fullResponse = new StringBuilder();
    String[] lines = responseText.split("\n");
    
    for (String line : lines) {
      if (line != null && !line.trim().isEmpty()) {
        String chunk = extractResponseChunk(line);
        if (chunk != null) {
          fullResponse.append(chunk);
        }
      }
    }
    
    return fullResponse.toString();
  }

  private String extractResponseChunk(String jsonLine) {
    try {
      JsonNode jsonNode = objectMapper.readTree(jsonLine);
      if (jsonNode.has("response")) {
        return jsonNode.get("response").asText();
      }
    } catch (IOException e) {
      // Skip malformed JSON lines
    }
    return null;
  }
}


