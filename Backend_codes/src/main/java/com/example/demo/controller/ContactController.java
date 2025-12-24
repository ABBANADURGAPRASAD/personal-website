package com.example.demo.controller;

import com.example.demo.dto.ContactRequest;
import com.example.demo.dto.ContactResponse;
import com.example.demo.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

  private final EmailService emailService;

  public ContactController(EmailService emailService) {
    this.emailService = emailService;
  }

  @PostMapping
  public ResponseEntity<ContactResponse> submitContact(@Valid @RequestBody ContactRequest request) {
    try {
      boolean emailSent = emailService.sendContactNotification(
          request.getName(),
          request.getEmail(),
          request.getMessage()
      );

      if (emailSent) {
        return ResponseEntity.ok(
            new ContactResponse(true, "Thank you for your message! I'll get back to you soon.")
        );
      } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ContactResponse(false, "Failed to send email. Please try again later."));
      }
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ContactResponse(false, "An error occurred while processing your request."));
    }
  }
}

