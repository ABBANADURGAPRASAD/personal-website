package com.example.demo.dto;

public class AchievementResponse {

  private String id;
  private String title;
  private String description;
  private String icon;
  private String date;
  private String organization;
  private String backgroundImage;

  public AchievementResponse() {
  }

  public AchievementResponse(String id, String title, String description, String icon,
                             String date, String organization, String backgroundImage) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.date = date;
    this.organization = organization;
    this.backgroundImage = backgroundImage;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getIcon() {
    return icon;
  }

  public void setIcon(String icon) {
    this.icon = icon;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getOrganization() {
    return organization;
  }

  public void setOrganization(String organization) {
    this.organization = organization;
  }

  public String getBackgroundImage() {
    return backgroundImage;
  }

  public void setBackgroundImage(String backgroundImage) {
    this.backgroundImage = backgroundImage;
  }
}
