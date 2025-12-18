package com.example.demo.service;

import org.springframework.stereotype.Service;

/**
 * Service that provides embedded profile data for Abbana Durga Prasad.
 * This acts as a primary/fallback data source when web URLs are not available.
 */
@Service
public class ProfileDataService {

  public String getProfileData() {
    return """
        PROFILE INFORMATION FOR ABBANA DURGA PRASAD
        
        PERSONAL INFORMATION:
        Name: Abbana Durga Prasad
        Professional Identity: Software Developer specializing in Java, Spring Boot, and AI/ML
        
        TECHNOLOGIES AND SKILLS:
        - Java (Core Java, Advanced Java)
        - Spring Framework (Spring Boot, Spring AI)
        - Ollama (Local LLM integration)
        - AI/ML Basics (Machine Learning fundamentals, LLM integration)
        - Databases (SQL databases, database design and management)
        - Frontend Technologies (Used in various projects - check project details)
        
        TECHNICAL EXPERTISE:
        - Backend Development: Java, Spring Boot, RESTful APIs
        - AI Integration: Working with Ollama for local LLM integration, Spring AI
        - Database Management: SQL databases, data modeling
        - Full-Stack Development: Backend and frontend integration
        
        PROJECTS AND WORK:
        - Personal Portfolio Website: Full-stack application with Angular frontend and Spring Boot backend
        - AI Chatbot Integration: RAG-based chatbot using Ollama and Spring AI
        - Backend Services: RESTful API development with Spring Boot
        - AI Assistant Development: Custom personal AI assistant (LLA AI Bot) using pretrained LLMs
        
        EDUCATION:
        (Add educational background details here - update this section with actual education information)
        
        WORK EXPERIENCE:
        (Add work experience details here - update this section with actual work history)
        
        PROFESSIONAL INTERESTS:
        - Building AI-powered applications
        - Backend development with Spring Boot
        - LLM integration and RAG systems
        - Full-stack web development
        
        NOTE: This AI assistant is specifically designed to answer questions ONLY about Abbana Durga Prasad's profile, 
        education, work experience, projects, and technologies. It must refuse to answer general knowledge questions 
        or questions about topics outside this scope.
        """;
  }

  /**
   * Returns structured data about technologies used
   */
  public String getTechnologiesData() {
    return """
        TECHNOLOGIES USED BY ABBANA DURGA PRASAD:
        
        Backend:
        - Java (Programming language)
        - Spring Boot (Framework)
        - Spring AI (AI integration framework)
        - Ollama (Local LLM runtime)
        
        AI/ML:
        - Ollama for local LLM execution
        - RAG (Retrieval Augmented Generation) systems
        - LLM integration and prompt engineering
        - AI/ML basics and fundamentals
        
        Databases:
        - SQL databases
        - Database design and management
        - Data modeling
        
        Frontend:
        - Technologies used in portfolio projects (refer to specific project details)
        
        Development Tools:
        - Maven (Build tool)
        - Git (Version control)
        """;
  }
}

