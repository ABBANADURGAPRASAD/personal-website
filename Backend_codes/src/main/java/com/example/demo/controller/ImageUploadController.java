package com.example.demo.controller;

import com.example.demo.service.ImageStorageService;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:63535", "http://127.0.0.1:4200", "http://127.0.0.1:63535"})
public class ImageUploadController {

  private final ImageStorageService imageStorageService;

  public ImageUploadController(ImageStorageService imageStorageService) {
    this.imageStorageService = imageStorageService;
  }

  @PostMapping("/profile")
  public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
    try {
      String imageUrl = imageStorageService.storeProfileImage(file);
      return ResponseEntity.ok().body(new ImageUploadResponse(imageUrl, "Profile image uploaded successfully"));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ErrorResponse("Failed to upload image: " + e.getMessage()));
    }
  }

  @PostMapping("/gallery")
  public ResponseEntity<?> uploadGalleryImage(@RequestParam("file") MultipartFile file) {
    try {
      String imageUrl = imageStorageService.storeGalleryImage(file);
      return ResponseEntity.ok().body(new ImageUploadResponse(imageUrl, "Gallery image uploaded successfully"));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ErrorResponse("Failed to upload image: " + e.getMessage()));
    }
  }

  @PostMapping("/achievement")
  public ResponseEntity<?> uploadAchievementImage(@RequestParam("file") MultipartFile file) {
    try {
      String imageUrl = imageStorageService.storeAchievementImage(file);
      return ResponseEntity.ok().body(new ImageUploadResponse(imageUrl, "Achievement image uploaded successfully"));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ErrorResponse("Failed to upload image: " + e.getMessage()));
    }
  }

  @DeleteMapping
  public ResponseEntity<?> deleteImage(@RequestParam("path") String imagePath) {
    boolean deleted = imageStorageService.deleteImage(imagePath);
    if (deleted) {
      return ResponseEntity.ok().body(new MessageResponse("Image deleted successfully"));
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ErrorResponse("Image not found or could not be deleted"));
    }
  }

  // Response DTOs
  private static class ImageUploadResponse {
    private String imageUrl;
    private String message;

    public ImageUploadResponse(String imageUrl, String message) {
      this.imageUrl = imageUrl;
      this.message = message;
    }

    public String getImageUrl() {
      return imageUrl;
    }

    public String getMessage() {
      return message;
    }
  }

  private static class ErrorResponse {
    private String error;

    public ErrorResponse(String error) {
      this.error = error;
    }

    public String getError() {
      return error;
    }
  }

  private static class MessageResponse {
    private String message;

    public MessageResponse(String message) {
      this.message = message;
    }

    public String getMessage() {
      return message;
    }
  }
}

