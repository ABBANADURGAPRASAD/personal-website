package com.example.demo.service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

@Service
@ConfigurationProperties(prefix = "ai")
public class WebDataIndexer {

  private List<String> profileUrls = new ArrayList<>();

  private final List<TextChunk> chunks = new ArrayList<>();

  public static class TextChunk {
    private final String text;
    private final String source;

    public TextChunk(String text, String source) {
      this.text = text;
      this.source = source;
    }

    public String getText() {
      return text;
    }

    public String getSource() {
      return source;
    }
  }

  @PostConstruct
  public void init() {
    try {
      for (String url : profileUrls) {
        indexUrl(url);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void indexUrl(String url) throws IOException {
    Document doc = Jsoup.connect(url).get();
    Elements body = doc.select("body");
    String text = body.text();

    int chunkSize = 500;
    for (int i = 0; i < text.length(); i += chunkSize) {
      int end = Math.min(i + chunkSize, text.length());
      String chunkText = text.substring(i, end).trim();
      if (!chunkText.isEmpty()) {
        chunks.add(new TextChunk(chunkText, url));
      }
    }
  }

  public List<TextChunk> findRelevant(String query, int limit) {
    if (chunks.isEmpty()) {
      return Collections.emptyList();
    }

    String lower = query.toLowerCase();
    List<TextChunk> matches = new ArrayList<>();
    for (TextChunk chunk : chunks) {
      if (chunk.getText().toLowerCase().contains(lower)) {
        matches.add(chunk);
      }
    }
    if (matches.isEmpty()) {
      return chunks.subList(0, Math.min(limit, chunks.size()));
    }
    return matches.subList(0, Math.min(limit, matches.size()));
  }

  public void setProfileUrls(List<String> profileUrls) {
    this.profileUrls = profileUrls != null ? profileUrls : new ArrayList<>();
  }
}


