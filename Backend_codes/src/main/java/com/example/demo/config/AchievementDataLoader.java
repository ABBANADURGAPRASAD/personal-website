package com.example.demo.config;

import com.example.demo.entity.Achievement;
import com.example.demo.repository.AchievementRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds default achievements when the database is empty (e.g. first run).
 */
@Component
public class AchievementDataLoader implements ApplicationRunner {

  private final AchievementRepository achievementRepository;

  public AchievementDataLoader(AchievementRepository achievementRepository) {
    this.achievementRepository = achievementRepository;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (achievementRepository.count() > 0) {
      return;
    }
    List<Achievement> defaults = List.of(
        achievement("Java TalentNext 2025", "Java TalentNext 2025 development certificate", "🏆", "2025", "wipro", null),
        achievement("Letter of achievement", "letter of achievement for the project and placement in Vision Waves", "🥇", "2025", "Sasi Institute of Technology and Engineering", null),
        achievement("Paper Presentation on IEEE Conference", "Paper Presentation on IEEE Conference on Brain Tumor Detection using ResNet", "🎓", "2025", "International IEEE Conference", null),
        achievement("Impact of Life Skills and Soft Skills on Employability", "National Workshop on Impact of Life Skills and Soft Skills on Employability", "🌟", "2023-2024", "Sasi Institute of Technology and Engineering", null),
        achievement("Fast-Track SITE show", "Fast-Track SITE show on the topic of english language proficiency", "💻", "2023", "Sasi Institute of Technology and Engineering", null),
        achievement("Published Research", "Published research paper on Brain Tumor Detection using ResNet", "📄", "2025", "International IEEE Conference", null)
    );
    achievementRepository.saveAll(defaults);
  }

  private static Achievement achievement(String title, String description, String icon, String date, String organization, String backgroundImage) {
    Achievement a = new Achievement();
    a.setTitle(title);
    a.setDescription(description);
    a.setIcon(icon);
    a.setDate(date);
    a.setOrganization(organization);
    a.setBackgroundImage(backgroundImage);
    return a;
  }
}
