package com.example.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageStorageService {

  @Value("${app.upload.dir:uploads}")
  private String uploadDir;

  private static final String PROFILE_IMAGES_DIR = "profile";
  private static final String GALLERY_IMAGES_DIR = "gallery";
  private static final String ACHIEVEMENT_IMAGES_DIR = "achievements";

  /**
   * Initialize upload directories on service creation
   */
  public ImageStorageService() {
    // Directories will be created in the first upload
  }

  /**
   * Store profile image and return the URL path
   */
  public String storeProfileImage(MultipartFile file) throws IOException {
    return storeImage(file, PROFILE_IMAGES_DIR);
  }

  /**
   * Store gallery image and return the URL path
   */
  public String storeGalleryImage(MultipartFile file) throws IOException {
    return storeImage(file, GALLERY_IMAGES_DIR);
  }

  /**
   * Store achievement background image and return the URL path
   */
  public String storeAchievementImage(MultipartFile file) throws IOException {
    return storeImage(file, ACHIEVEMENT_IMAGES_DIR);
  }

  /**
   * Generic method to store an image in the specified subdirectory
   */
  private String storeImage(MultipartFile file, String subdirectory) throws IOException {
    if (file.isEmpty()) {
      throw new IllegalArgumentException("File is empty");
    }

    // Validate file type
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new IllegalArgumentException("File must be an image");
    }

    // Create directory structure: uploads/{subdirectory}/
    Path uploadPath = Paths.get(uploadDir, subdirectory);
    Files.createDirectories(uploadPath);

    // Generate unique filename
    String originalFilename = file.getOriginalFilename();
    String extension = "";
    if (originalFilename != null && originalFilename.contains(".")) {
      extension = originalFilename.substring(originalFilename.lastIndexOf("."));
    }
    String filename = UUID.randomUUID().toString() + extension;

    // Save file
    Path filePath = uploadPath.resolve(filename);
    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

    // Return URL path (relative to /api/images/)
    return "/api/images/" + subdirectory + "/" + filename;
  }

  /**
   * Delete an image file
   */
  public boolean deleteImage(String imagePath) {
    try {
      // Remove /api/images/ prefix to get the actual file path
      String relativePath = imagePath.replaceFirst("^/api/images/", "");
      Path filePath = Paths.get(uploadDir, relativePath);
      
      if (Files.exists(filePath)) {
        Files.delete(filePath);
        return true;
      }
      return false;
    } catch (IOException e) {
      return false;
    }
  }

  /**
   * Get the base upload directory path
   */
  public Path getUploadPath() {
    return Paths.get(uploadDir);
  }
}

