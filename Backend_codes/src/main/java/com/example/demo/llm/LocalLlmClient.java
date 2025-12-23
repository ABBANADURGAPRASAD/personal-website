package com.example.demo.llm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
      // When stream=false, Ollama returns a single JSON object
      String responseText = webClient.post()
          .uri("/api/generate")
          .bodyValue(new GenerateRequest(model, systemPrompt, prompt, false))
          .retrieve()
          .bodyToMono(String.class)
          .block();

      if (responseText == null || responseText.trim().isEmpty()) {
        return "Error: No response from LLM";
      }

      // Parse JSON and extract only the "response" field
      JsonNode jsonNode = objectMapper.readTree(responseText);
      if (jsonNode.has("response")) {
        String response = jsonNode.get("response").asText();
        if (response != null && !response.trim().isEmpty()) {
          return response.trim();
        }
      }

      return "Error: No response field found in LLM response";
    } catch (Exception e) {
      e.printStackTrace();
      return "Error: Failed to generate response - " + e.getMessage();
    }
  }

  // Overloaded method for backward compatibility
  public String generate(String prompt) {
    return generate(prompt, null);
  }
}


