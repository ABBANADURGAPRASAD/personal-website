import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { PortfolioData, Profile, Skill, Project, PortfolioSection } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  // Using signals for reactive state management
  private portfolioDataSignal = signal<PortfolioData>(this.getInitialData());
  public readonly portfolioData$ = this.portfolioDataSignal.asReadonly();

  constructor() {
    // Load data from localStorage or use initial data
    this.loadFromStorage();
  }

  /**
   * Get portfolio data - ready for backend integration
   */
  getPortfolioData(): Observable<PortfolioData> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<PortfolioData>('/api/portfolio')
    //   .pipe(
    //     tap(data => this.portfolioDataSignal.set(data))
    //   );

    // Mock implementation with delay to simulate API call
    return of(this.portfolioDataSignal()).pipe(delay(100));
  }

  /**
   * Get profile
   */
  getProfile(): Profile {
    return this.portfolioDataSignal().profile;
  }

  /**
   * Get skills
   */
  getSkills(): Skill[] {
    return this.portfolioDataSignal().skills;
  }

  /**
   * Get projects
   */
  getProjects(): Project[] {
    return this.portfolioDataSignal().projects;
  }

  /**
   * Get custom sections
   */
  getSections(): PortfolioSection[] {
    return this.portfolioDataSignal().sections;
  }

  /**
   * Update profile - ready for backend integration
   */
  updateProfile(profile: Partial<Profile>): Observable<Profile> {
    // TODO: Replace with actual HTTP call
    // return this.http.put<Profile>(`/api/portfolio/profile`, profile)
    //   .pipe(
    //     tap(updated => {
    //       const current = this.portfolioDataSignal();
    //       this.portfolioDataSignal.set({ ...current, profile: updated });
    //       this.saveToStorage();
    //     })
    //   );

    const current = this.portfolioDataSignal();
    const updated = { ...current.profile, ...profile };
    this.portfolioDataSignal.set({ ...current, profile: updated });
    this.saveToStorage();
    return of(updated).pipe(delay(100));
  }

  /**
   * Add or update skill
   */
  saveSkill(skill: Skill): Observable<Skill> {
    // TODO: Replace with actual HTTP call
    const current = this.portfolioDataSignal();
    const existingIndex = current.skills.findIndex(s => s.id === skill.id);
    
    let updatedSkills: Skill[];
    if (existingIndex >= 0) {
      updatedSkills = [...current.skills];
      updatedSkills[existingIndex] = skill;
    } else {
      updatedSkills = [...current.skills, skill];
    }

    this.portfolioDataSignal.set({ ...current, skills: updatedSkills });
    this.saveToStorage();
    return of(skill).pipe(delay(100));
  }

  /**
   * Delete skill
   */
  deleteSkill(skillId: string): Observable<boolean> {
    // TODO: Replace with actual HTTP call
    const current = this.portfolioDataSignal();
    const updatedSkills = current.skills.filter(s => s.id !== skillId);
    this.portfolioDataSignal.set({ ...current, skills: updatedSkills });
    this.saveToStorage();
    return of(true).pipe(delay(100));
  }

  /**
   * Add or update project
   */
  saveProject(project: Project): Observable<Project> {
    // TODO: Replace with actual HTTP call
    const current = this.portfolioDataSignal();
    const existingIndex = current.projects.findIndex(p => p.id === project.id);
    
    let updatedProjects: Project[];
    if (existingIndex >= 0) {
      updatedProjects = [...current.projects];
      updatedProjects[existingIndex] = { ...project, updatedAt: new Date() };
    } else {
      updatedProjects = [...current.projects, { ...project, createdAt: new Date(), updatedAt: new Date() }];
    }

    this.portfolioDataSignal.set({ ...current, projects: updatedProjects });
    this.saveToStorage();
    return of(project).pipe(delay(100));
  }

  /**
   * Add or update custom portfolio section
   */
  saveSection(section: PortfolioSection): Observable<PortfolioSection> {
    const current = this.portfolioDataSignal();
    const existingIndex = current.sections.findIndex(s => s.id === section.id);

    let updatedSections: PortfolioSection[];
    if (existingIndex >= 0) {
      updatedSections = [...current.sections];
      updatedSections[existingIndex] = section;
    } else {
      updatedSections = [...current.sections, section];
    }

    this.portfolioDataSignal.set({ ...current, sections: updatedSections });
    this.saveToStorage();
    return of(section).pipe(delay(100));
  }

  /**
   * Delete custom portfolio section
   */
  deleteSection(sectionId: string): Observable<boolean> {
    const current = this.portfolioDataSignal();
    const updatedSections = current.sections.filter(s => s.id !== sectionId);
    this.portfolioDataSignal.set({ ...current, sections: updatedSections });
    this.saveToStorage();
    return of(true).pipe(delay(100));
  }

  /**
   * Replace sections order/list (used for drag-and-drop reordering)
   */
  updateSections(sections: PortfolioSection[]): Observable<PortfolioSection[]> {
    const current = this.portfolioDataSignal();
    this.portfolioDataSignal.set({ ...current, sections: [...sections] });
    this.saveToStorage();
    return of(sections).pipe(delay(100));
  }

  /**
   * Delete project
   */
  deleteProject(projectId: string): Observable<boolean> {
    // TODO: Replace with actual HTTP call
    const current = this.portfolioDataSignal();
    const updatedProjects = current.projects.filter(p => p.id !== projectId);
    this.portfolioDataSignal.set({ ...current, projects: updatedProjects });
    this.saveToStorage();
    return of(true).pipe(delay(100));
  }

  /**
   * Get initial/mock data
   */
  private getInitialData(): PortfolioData {
    return {
      profile: {
        id: '1',
        name: 'Abbana Durga Prasad',
        title: 'Java Full Stack Developer | Spring Boot | Angular | AI',
        bio: 'Passionate full-stack developer with expertise in Java, Spring Boot, Angular, and AI technologies. Building scalable applications and exploring the intersection of software development and artificial intelligence.',
        email: 'durga.prasad@example.com',
        phone: '+1 (555) 123-4567',
        location: 'United States',
        socialLinks: {
          github: 'https://github.com/durgaprasad',
          linkedin: 'https://linkedin.com/in/durgaprasad',
          twitter: 'https://twitter.com/durgaprasad'
        }
      },
      skills: [
        { id: '1', name: 'Java', category: 'backend', proficiency: 90 },
        { id: '2', name: 'Spring Boot', category: 'backend', proficiency: 85 },
        { id: '3', name: 'Angular', category: 'frontend', proficiency: 88 },
        { id: '4', name: 'TypeScript', category: 'frontend', proficiency: 85 },
        { id: '5', name: 'MySQL', category: 'database', proficiency: 80 },
        { id: '6', name: 'PostgreSQL', category: 'database', proficiency: 75 },
        { id: '7', name: 'Docker', category: 'devops', proficiency: 70 },
        { id: '8', name: 'Python', category: 'backend', proficiency: 75 },
        { id: '9', name: 'TensorFlow', category: 'other', proficiency: 65 }
      ],
      projects: [
        {
          id: '1',
          title: 'Subscription Management System',
          description: 'A comprehensive subscription management platform built with Spring Boot and Angular, featuring payment processing, user management, and analytics.',
          technologies: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Stripe API'],
          githubUrl: 'https://github.com/durgaprasad/subscription-system',
          featured: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          title: 'Spring AI Chatbot',
          description: 'Intelligent chatbot application leveraging Spring AI framework for natural language processing and conversation management.',
          technologies: ['Java', 'Spring Boot', 'Spring AI', 'OpenAI API'],
          githubUrl: 'https://github.com/durgaprasad/spring-ai-chatbot',
          featured: true,
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date('2024-02-20')
        },
        {
          id: '3',
          title: 'Brain Tumor Detection (ResNet)',
          description: 'Deep learning model using ResNet architecture for medical image analysis and brain tumor detection with high accuracy.',
          technologies: ['Python', 'TensorFlow', 'Keras', 'ResNet', 'Medical Imaging'],
          githubUrl: 'https://github.com/durgaprasad/brain-tumor-detection',
          featured: true,
          createdAt: new Date('2024-03-10'),
          updatedAt: new Date('2024-03-10')
        }
      ]
      ,
      sections: []
    };
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    const stored = localStorage.getItem('portfolio_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Convert date strings back to Date objects
        data.projects = data.projects.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
        if (!data.sections) {
          data.sections = [];
        }
        this.portfolioDataSignal.set(data);
      } catch (e) {
        console.error('Error loading portfolio data from storage', e);
      }
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('portfolio_data', JSON.stringify(this.portfolioDataSignal()));
    } catch (e) {
      console.error('Error saving portfolio data to storage', e);
    }
  }
}

