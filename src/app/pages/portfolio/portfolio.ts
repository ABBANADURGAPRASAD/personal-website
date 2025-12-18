import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { AuthService } from '../../services/auth';
import { Profile, Skill, Project, PortfolioSection } from '../../models/portfolio.models';

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
  sections = signal<PortfolioSection[]>([]);
  
  // Edit states
  editingProfile = signal<boolean>(false);
  editingProject = signal<string | null>(null);
  editingSkill = signal<string | null>(null);
  editingSection = signal<string | null>(null);
  draggingSectionId = signal<string | null>(null);
  
  // Form models
  profileForm: Partial<Profile> = {};
  projectForm: Partial<Project> = {};
  skillForm: Partial<Skill> = {};
  sectionForm: Partial<PortfolioSection> = {};

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
      this.sections.set(data.sections || []);
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
    if (this.secureMode() && !confirm('Do you want to save profile changes?')) return;
    this.portfolioService.updateProfile(this.profileForm).subscribe(updated => {
      this.profile.set(updated);
      this.editingProfile.set(false);
      this.profileForm = {};
    });
  }

  // Project editing
  startEditProject(project: Project): void {
    if (!this.secureMode()) return;
    if (!confirm('Do you want to edit this project?')) return;
    this.projectForm = { ...project };
    this.editingProject.set(project.id);
  }

  startAddProject(): void {
    if (!this.secureMode()) return;
    if (!confirm('Do you want to create a new project?')) return;
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
    if (this.secureMode() && !confirm('Do you want to save this project?')) return;
    
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
    if (!this.secureMode() || !confirm('Are you sure you want to remove this project?')) return;
    this.portfolioService.deleteProject(projectId).subscribe(() => {
      this.loadPortfolioData();
    });
  }

  // Skill editing
  startEditSkill(skill: Skill): void {
    if (!this.secureMode()) return;
    if (!confirm('Do you want to edit this skill?')) return;
    this.skillForm = { ...skill };
    this.editingSkill.set(skill.id);
  }

  startAddSkill(): void {
    if (!this.secureMode()) return;
    if (!confirm('Do you want to create a new skill?')) return;
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
    if (this.secureMode() && !confirm('Do you want to save this skill?')) return;
    
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
    if (!this.secureMode() || !confirm('Are you sure you want to remove this skill?')) return;
    this.portfolioService.deleteSkill(skillId).subscribe(() => {
      this.loadPortfolioData();
    });
  }

  // Section editing
  startAddSection(): void {
    if (!this.secureMode()) return;
    if (!confirm('Do you want to create a new section?')) return;
    this.sectionForm = {
      title: '',
      subtitle: '',
      content: ''
    };
    this.editingSection.set('new');
  }

  startEditSection(section: PortfolioSection): void {
    if (!this.secureMode()) return;
    if (!confirm('Do you want to edit this section?')) return;
    this.sectionForm = { ...section };
    this.editingSection.set(section.id);
  }

  cancelEditSection(): void {
    this.editingSection.set(null);
    this.sectionForm = {};
  }

  saveSection(): void {
    if (!this.sectionForm.title || !this.sectionForm.content) return;
    if (this.secureMode() && !confirm('Do you want to save this section?')) return;

    const section: PortfolioSection = {
      id: this.editingSection() === 'new'
        ? Date.now().toString()
        : this.sectionForm.id!,
      title: this.sectionForm.title,
      subtitle: this.sectionForm.subtitle,
      content: this.sectionForm.content
    };

    this.portfolioService.saveSection(section).subscribe(() => {
      this.loadPortfolioData();
      this.cancelEditSection();
    });
  }

  deleteSection(sectionId: string): void {
    if (!this.secureMode() || !confirm('Are you sure you want to remove this section?')) return;
    this.portfolioService.deleteSection(sectionId).subscribe(() => {
      this.loadPortfolioData();
    });
  }

  // Drag-and-drop reorder handlers
  onDragStart(sectionId: string): void {
    if (!this.secureMode()) return;
    if (!confirm('Do you want to move this section?')) return;
    this.draggingSectionId.set(sectionId);
  }

  onDragEnd(): void {
    this.draggingSectionId.set(null);
  }

  onDragOver(event: DragEvent, targetId: string): void {
    if (!this.secureMode()) return;
    event.preventDefault();
    if (this.draggingSectionId() === targetId) return;
  }

  onDrop(event: DragEvent, targetId: string): void {
    if (!this.secureMode()) return;
    event.preventDefault();

    const sourceId = this.draggingSectionId();
    if (!sourceId || sourceId === targetId) return;

    const list = [...this.sections()];
    const sourceIndex = list.findIndex(s => s.id === sourceId);
    const targetIndex = list.findIndex(s => s.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = list.splice(sourceIndex, 1);
    list.splice(targetIndex, 0, moved);

    this.sections.set(list);
    this.portfolioService.updateSections(list).subscribe(() => {
      this.draggingSectionId.set(null);
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
      if (this.secureMode() && !confirm('Are you sure you want to remove this technology?')) {
        return;
      }
      this.projectForm.technologies.splice(index, 1);
    }
  }

  // Explicit "Save Page" action (main save button)
  savePage(): void {
    if (!this.secureMode()) return;
    if (confirm('Do you want to save all Portfolio page changes?')) {
      // All edits are already persisted on save of each form; this gives explicit feedback.
      alert('Portfolio page saved successfully.');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
