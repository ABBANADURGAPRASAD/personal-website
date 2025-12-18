package com.example.demo.controller;

import com.example.demo.dto.ChatRequest;
import com.example.demo.dto.ChatResponse;
import com.example.demo.service.RagChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

  private final RagChatService ragChatService;

  public ChatController(RagChatService ragChatService) {
    this.ragChatService = ragChatService;
  }

  @PostMapping
  public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
    ChatResponse response = ragChatService.chat(request);
    return ResponseEntity.ok(response);
  }
}


