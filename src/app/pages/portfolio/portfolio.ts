import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { AuthService } from '../../services/auth';
import { Profile, Skill, Project } from '../../models/portfolio.models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss']
})
export class PortfolioComponent implements OnInit {
  secureMode = signal<boolean>(false);
  profile = signal<Profile | null>(null);
  skills = signal<Skill[]>([]);
  projects = signal<Project[]>([]);
  
  // Edit states
  editingProfile = signal<boolean>(false);
  editingProject = signal<string | null>(null);
  editingSkill = signal<string | null>(null);
  
  // Form models
  profileForm: Partial<Profile> = {};
  projectForm: Partial<Project> = {};
  skillForm: Partial<Skill> = {};

  // Computed values
  featuredProjects = computed(() => 
    this.projects().filter(p => p.featured)
  );
  
  skillsByCategory = computed(() => {
    const skills = this.skills();
    return {
      frontend: skills.filter(s => s.category === 'frontend'),
      backend: skills.filter(s => s.category === 'backend'),
      database: skills.filter(s => s.category === 'database'),
      devops: skills.filter(s => s.category === 'devops'),
      other: skills.filter(s => s.category === 'other')
    } as Record<string, Skill[]>;
  });

  // Get skill categories as an array
  skillCategories = ['frontend', 'backend', 'database', 'devops', 'other'] as const;
  
  getSkillsByCategory(category: string): Skill[] {
    const categories = this.skillsByCategory();
    return categories[category as keyof typeof categories] || [];
  }

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Determine mode from route data (check current route and parent route)
    let routeData = this.route.snapshot.data;
    if (!routeData['secureMode'] && this.route.parent) {
      routeData = this.route.parent.snapshot.data;
    }
    this.secureMode.set(routeData['secureMode'] === true);
    
    // Load portfolio data
    this.loadPortfolioData();
  }

  loadPortfolioData(): void {
    this.portfolioService.getPortfolioData().subscribe(data => {
      this.profile.set(data.profile);
      this.skills.set(data.skills);
      this.projects.set(data.projects);
    });
  }

  // Profile editing
  startEditProfile(): void {
    if (!this.secureMode()) return;
    this.profileForm = { ...this.profile() };
    this.editingProfile.set(true);
  }

  cancelEditProfile(): void {
    this.editingProfile.set(false);
    this.profileForm = {};
  }

  saveProfile(): void {
    if (!this.profile()) return;
    this.portfolioService.updateProfile(this.profileForm).subscribe(updated => {
      this.profile.set(updated);
      this.editingProfile.set(false);
      this.profileForm = {};
    });
  }

  // Project editing
  startEditProject(project: Project): void {
    if (!this.secureMode()) return;
    this.projectForm = { ...project };
    this.editingProject.set(project.id);
  }

  startAddProject(): void {
    if (!this.secureMode()) return;
    this.projectForm = {
      title: '',
      description: '',
      technologies: [],
      featured: false
    };
    this.editingProject.set('new');
  }

  cancelEditProject(): void {
    this.editingProject.set(null);
    this.projectForm = {};
  }

  saveProject(): void {
    if (!this.projectForm.title || !this.projectForm.description) return;
    
    const project: Project = {
      id: this.editingProject() === 'new' 
        ? Date.now().toString() 
        : this.projectForm.id!,
      title: this.projectForm.title,
      description: this.projectForm.description,
      technologies: this.projectForm.technologies || [],
      imageUrl: this.projectForm.imageUrl,
      githubUrl: this.projectForm.githubUrl,
      liveUrl: this.projectForm.liveUrl,
      featured: this.projectForm.featured || false,
      createdAt: this.projectForm.createdAt || new Date(),
      updatedAt: new Date()
    };

    this.portfolioService.saveProject(project).subscribe(() => {
      this.loadPortfolioData();
      this.cancelEditProject();
    });
  }

  deleteProject(projectId: string): void {
    if (!this.secureMode() || !confirm('Are you sure you want to delete this project?')) return;
    this.portfolioService.deleteProject(projectId).subscribe(() => {
      this.loadPortfolioData();
    });
  }

  // Skill editing
  startEditSkill(skill: Skill): void {
    if (!this.secureMode()) return;
    this.skillForm = { ...skill };
    this.editingSkill.set(skill.id);
  }

  startAddSkill(): void {
    if (!this.secureMode()) return;
    this.skillForm = {
      name: '',
      category: 'other',
      proficiency: 50
    };
    this.editingSkill.set('new');
  }

  cancelEditSkill(): void {
    this.editingSkill.set(null);
    this.skillForm = {};
  }

  saveSkill(): void {
    if (!this.skillForm.name) return;
    
    const skill: Skill = {
      id: this.editingSkill() === 'new' 
        ? Date.now().toString() 
        : this.skillForm.id!,
      name: this.skillForm.name,
      category: this.skillForm.category || 'other',
      proficiency: this.skillForm.proficiency || 50,
      icon: this.skillForm.icon
    };

    this.portfolioService.saveSkill(skill).subscribe(() => {
      this.loadPortfolioData();
      this.cancelEditSkill();
    });
  }

  deleteSkill(skillId: string): void {
    if (!this.secureMode() || !confirm('Are you sure you want to delete this skill?')) return;
    this.portfolioService.deleteSkill(skillId).subscribe(() => {
      this.loadPortfolioData();
    });
  }

  addTechnology(): void {
    const tech = prompt('Enter technology name:');
    if (tech && tech.trim()) {
      if (!this.projectForm.technologies) {
        this.projectForm.technologies = [];
      }
      this.projectForm.technologies.push(tech.trim());
    }
  }

  removeTechnology(index: number): void {
    if (this.projectForm.technologies) {
      this.projectForm.technologies.splice(index, 1);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
