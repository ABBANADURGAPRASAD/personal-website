import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { AgentStatus, AgentCapability, ProfileData, TechnologyStack } from '../../models/chat.models';

@Component({
  selector: 'app-agent-capabilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-capabilities.component.html',
  styleUrl: './agent-capabilities.component.scss'
})
export class AgentCapabilitiesComponent implements OnInit {
  private profileService = inject(ProfileService);

  agentStatus = signal<AgentStatus>({
    isActive: true,
    strictScopeEnabled: true,
    currentProfile: 'Abbana Durga Prasad'
  });

  profileData = signal<ProfileData | null>(null);
  technologyStack = signal<TechnologyStack | null>(null);
  availableProfiles = signal<string[]>([]);
  showProfileData = signal<boolean>(false);
  showTechStack = signal<boolean>(false);
  showProfileSwitcher = signal<boolean>(false);
  isExpanded = signal<boolean>(true);

  capabilities = computed<AgentCapability[]>(() => [
    {
      id: 'view-profile',
      title: 'View Profile Data',
      description: 'Display profile information loaded from backend',
      icon: '👤',
      action: () => this.viewProfileData()
    },
    {
      id: 'switch-profile',
      title: 'Switch Profile',
      description: 'Switch between multiple profiles (future feature)',
      icon: '🔄',
      action: () => this.showProfileSwitcher.set(true)
    },
    {
      id: 'download-resume',
      title: 'Download Resume',
      description: 'Download resume PDF',
      icon: '📄',
      action: () => this.downloadResume()
    },
    {
      id: 'open-project-links',
      title: 'Open Project Links',
      description: 'Access project repositories and demos',
      icon: '🔗',
      action: () => this.openProjectLinks()
    },
    {
      id: 'tech-stack',
      title: 'Technology Stack',
      description: 'View technologies and tools used',
      icon: '⚙️',
      action: () => this.viewTechStack()
    }
  ]);

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.profileService.getAvailableProfiles().subscribe(profiles => {
      this.availableProfiles.set(profiles);
    });
  }

  viewProfileData(): void {
    if (!this.profileData()) {
      this.profileService.getProfileData().subscribe(data => {
        this.profileData.set(data);
        this.showProfileData.set(true);
      });
    } else {
      this.showProfileData.set(!this.showProfileData());
    }
  }

  viewTechStack(): void {
    if (!this.technologyStack()) {
      this.profileService.getTechnologyStack().subscribe(stack => {
        this.technologyStack.set(stack);
        this.showTechStack.set(true);
      });
    } else {
      this.showTechStack.set(!this.showTechStack());
    }
  }

  downloadResume(): void {
    this.profileService.downloadResume().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Abbana_Durga_Prasad_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }

  openProjectLinks(): void {
    // TODO: Implement project links opening
    // This could open GitHub repos, live demos, etc.
    alert('Project links feature - to be implemented with backend endpoints');
  }

  switchProfile(profileName: string): void {
    // TODO: Implement profile switching when backend supports it
    this.agentStatus.update(status => ({
      ...status,
      currentProfile: profileName
    }));
    this.showProfileSwitcher.set(false);
    alert(`Switching to profile: ${profileName} (Feature coming soon)`);
  }

  closeProfileData(): void {
    this.showProfileData.set(false);
  }

  closeTechStack(): void {
    this.showTechStack.set(false);
  }

  toggleCapabilities(): void {
    this.isExpanded.update(value => !value);
  }
}

