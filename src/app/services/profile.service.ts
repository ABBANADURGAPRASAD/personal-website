import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProfileData, TechnologyStack } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/profile';

  /**
   * Get profile data from backend
   * Note: This endpoint may need to be created in the backend
   * For now, returns structured data based on ProfileDataService content
   */
  getProfileData(): Observable<ProfileData> {
    // TODO: Replace with actual HTTP call when backend endpoint is available
    // return this.http.get<ProfileData>(`${this.API_URL}/data`).pipe(
    //   catchError(error => {
    //     console.error('Error fetching profile data:', error);
    //     return of(this.getDefaultProfileData());
    //   })
    // );

    // Mock implementation based on ProfileDataService
    return of(this.getDefaultProfileData());
  }

  /**
   * Get technology stack information
   */
  getTechnologyStack(): Observable<TechnologyStack> {
    // TODO: Replace with actual HTTP call when backend endpoint is available
    return of(this.getDefaultTechnologyStack());
  }

  /**
   * Download resume
   * Note: This endpoint may need to be created in the backend
   */
  downloadResume(): Observable<Blob> {
    // TODO: Replace with actual HTTP call when backend endpoint is available
    // return this.http.get(`${this.API_URL}/resume`, { responseType: 'blob' }).pipe(
    //   catchError(error => {
    //     console.error('Error downloading resume:', error);
    //     throw error;
    //   })
    // );

    // Mock implementation
    return of(new Blob(['Resume content'], { type: 'application/pdf' }));
  }

  /**
   * Get available profiles (for future multi-profile support)
   */
  getAvailableProfiles(): Observable<string[]> {
    // TODO: Replace with actual HTTP call when backend endpoint is available
    return of(['Abbana Durga Prasad']);
  }

  private getDefaultProfileData(): ProfileData {
    return {
      name: 'Abbana Durga Prasad',
      professionalIdentity: 'Software Developer specializing in Java, Spring Boot, and AI/ML',
      technologies: [
        'Java (Core Java, Advanced Java)',
        'Spring Framework (Spring Boot, Spring AI)',
        'Ollama (Local LLM integration)',
        'AI/ML Basics',
        'SQL Databases',
        'Frontend Technologies'
      ],
      skills: [
        'Backend Development: Java, Spring Boot, RESTful APIs',
        'AI Integration: Ollama, Spring AI, RAG systems',
        'Database Management: SQL databases, data modeling',
        'Full-Stack Development: Backend and frontend integration'
      ],
      projects: [
        'Personal Portfolio Website: Full-stack application with Angular frontend and Spring Boot backend',
        'AI Chatbot Integration: RAG-based chatbot using Ollama and Spring AI',
        'Backend Services: RESTful API development with Spring Boot',
        'AI Assistant Development: Custom personal AI assistant (LLA AI Bot) using pretrained LLMs'
      ]
    };
  }

  private getDefaultTechnologyStack(): TechnologyStack {
    return {
      backend: ['Java', 'Spring Boot', 'Spring AI', 'Ollama'],
      aiMl: [
        'Ollama for local LLM execution',
        'RAG (Retrieval Augmented Generation) systems',
        'LLM integration and prompt engineering',
        'AI/ML basics and fundamentals'
      ],
      databases: ['SQL databases', 'Database design and management', 'Data modeling'],
      frontend: ['Angular', 'TypeScript', 'HTML/CSS', 'Responsive Design'],
      tools: ['Maven', 'Git', 'VS Code', 'IntelliJ IDEA']
    };
  }
}

