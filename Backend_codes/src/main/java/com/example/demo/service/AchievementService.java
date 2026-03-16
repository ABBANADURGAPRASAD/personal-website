package com.example.demo.service;

import com.example.demo.dto.AchievementRequest;
import com.example.demo.dto.AchievementResponse;
import com.example.demo.entity.Achievement;
import com.example.demo.repository.AchievementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AchievementService {

  private final AchievementRepository achievementRepository;

  public AchievementService(AchievementRepository achievementRepository) {
    this.achievementRepository = achievementRepository;
  }

  public List<AchievementResponse> findAll() {
    return achievementRepository.findAll().stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  public AchievementResponse findById(Long id) {
    return achievementRepository.findById(id)
        .map(this::toResponse)
        .orElse(null);
  }

  @Transactional
  public AchievementResponse create(AchievementRequest request) {
    Achievement entity = toEntity(request);
    entity = achievementRepository.save(entity);
    return toResponse(entity);
  }

  @Transactional
  public AchievementResponse update(Long id, AchievementRequest request) {
    return achievementRepository.findById(id)
        .map(entity -> {
          entity.setTitle(request.getTitle());
          entity.setDescription(request.getDescription());
          entity.setIcon(request.getIcon());
          entity.setDate(request.getDate());
          entity.setOrganization(request.getOrganization());
          entity.setBackgroundImage(request.getBackgroundImage());
          return achievementRepository.save(entity);
        })
        .map(this::toResponse)
        .orElse(null);
  }

  @Transactional
  public boolean deleteById(Long id) {
    if (!achievementRepository.existsById(id)) {
      return false;
    }
    achievementRepository.deleteById(id);
    return true;
  }

  private Achievement toEntity(AchievementRequest request) {
    Achievement entity = new Achievement();
    entity.setTitle(request.getTitle());
    entity.setDescription(request.getDescription());
    entity.setIcon(request.getIcon());
    entity.setDate(request.getDate());
    entity.setOrganization(request.getOrganization());
    entity.setBackgroundImage(request.getBackgroundImage());
    return entity;
  }

  private AchievementResponse toResponse(Achievement entity) {
    return new AchievementResponse(
        String.valueOf(entity.getId()),
        entity.getTitle(),
        entity.getDescription(),
        entity.getIcon(),
        entity.getDate(),
        entity.getOrganization(),
        entity.getBackgroundImage()
    );
  }
}
