package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AchievementRequest;
import com.example.demo.dto.AchievementResponse;
import com.example.demo.service.AchievementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

  private final AchievementService achievementService;

  public AchievementController(AchievementService achievementService) {
    this.achievementService = achievementService;
  }

  @GetMapping
  public ResponseEntity<List<AchievementResponse>> getAll() {
    List<AchievementResponse> list = achievementService.findAll();
    return ResponseEntity.ok(list);
  }

  @GetMapping("/{id}")
  public ResponseEntity<AchievementResponse> getById(@PathVariable Long id) {
    AchievementResponse response = achievementService.findById(id);
    if (response == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(response);
  }

  @PostMapping
  public ResponseEntity<AchievementResponse> create(@Valid @RequestBody AchievementRequest request) {
    AchievementResponse created = achievementService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PutMapping("/{id}")
  public ResponseEntity<AchievementResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody AchievementRequest request) {
    AchievementResponse updated = achievementService.update(id, request);
    if (updated == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    boolean deleted = achievementService.deleteById(id);
    if (!deleted) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }
}
