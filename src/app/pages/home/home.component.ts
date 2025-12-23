import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryItem, Achievement, ContactForm, HomeSection, HomePageData } from '../../models/home.models';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly storageKey = 'home_page_data';

  secureMode = signal<boolean>(false);
  
  // Edit states
  editingGallery = signal<string | null>(null);
  addingGalleryItem = signal<boolean>(false);
  editingAchievement = signal<string | null>(null);
  addingAchievement = signal<boolean>(false);
  editingSection = signal<string | null>(null);
  editingBio = signal<boolean>(false);
  editingProfileImages = signal<boolean>(false);
  editingHeading = signal<string | null>(null); // 'welcome', 'gallery', 'achievements'
  
  // Form models
  galleryForm: Partial<GalleryItem> = {};
  achievementForm: Partial<Achievement> = {};
  sectionForm: Partial<HomeSection> = {};
  bioData = signal<string>('I am an Associate Software Engineer at Vision Waves with a strong foundation in Java, Spring Boot, REST APIs, and full-stack development. I hold a B.Tech in Artificial Intelligence & Machine Learning (CGPA: 8.2) and have hands-on experience building backend systems and AI-powered applications. I have presented my research on Brain Tumor Detection using ResNet at the 2nd International IEEE Conference, a milestone achievement in my academic journey. I am passionate about learning Spring AI, cloud technologies, and scalable software design, and I enjoy building real-world solutions that create impact.');
  bioForm = '';
  
  // Section headings
  sectionHeadings = signal<{
    welcomeTitle: string;
    welcomeSubtitle: string;
    galleryTitle: string;
    gallerySubtitle: string;
    achievementsTitle: string;
    achievementsSubtitle: string;
  }>({
    welcomeTitle: 'Welcome to My World',
    welcomeSubtitle: 'Full Stack Developer | Spring Boot | Angular | AI',
    galleryTitle: 'Gallery',
    gallerySubtitle: 'A visual showcase of my work and projects',
    achievementsTitle: 'Achievements & Certifications',
    achievementsSubtitle: 'Recognition and milestones in my career'
  });
  headingForm: Partial<{
    welcomeTitle: string;
    welcomeSubtitle: string;
    galleryTitle: string;
    gallerySubtitle: string;
    achievementsTitle: string;
    achievementsSubtitle: string;
  }> = {};
  
  // Profile images carousel - Add your images to src/assets/images/ folder
  profileImages = signal<string[]>([
    'assets/images/profile1.jpg',  // Add your profile images to src/assets/images/ folder
    'assets/images/profile2.jpg',
    'assets/images/profile3.jpg'
  ]);
  currentProfileImageIndex = 0;
  profileImageInterval: any;
  newProfileImageUrl = '';
  selectedProfileImageFile: File | null = null;
  selectedGalleryImageFile: File | null = null;
  selectedAchievementBackgroundFile: File | null = null;
  // Gallery items - using signal for reactivity
  galleryItems = signal<GalleryItem[]>([
    {
      id: '1',
      title: 'Project Showcase',
      imageUrl: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Project+1',
      description: 'Subscription Management System',
      category: 'Web Application'
    },
    {
      id: '2',
      title: 'AI Chatbot',
      imageUrl: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=AI+Chatbot',
      description: 'Spring AI Chatbot Implementation',
      category: 'AI/ML'
    },
    {
      id: '3',
      title: 'Medical Imaging',
      imageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Brain+Tumor+Detection',
      description: 'ResNet-based Brain Tumor Detection',
      category: 'Deep Learning'
    },
    {
      id: '4',
      title: 'Full Stack App',
      imageUrl: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Full+Stack',
      description: 'Modern Web Application',
      category: 'Web Development'
    },
    {
      id: '5',
      title: 'API Development',
      imageUrl: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=API+Design',
      description: 'RESTful API Architecture',
      category: 'Backend'
    },
    {
      id: '6',
      title: 'UI/UX Design',
      imageUrl: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=UI+Design',
      description: 'Modern User Interface',
      category: 'Frontend'
    }
  ]);

  // Achievements - using signal for reactivity
  achievements = signal<Achievement[]>([
    {
      id: '1',
      title: 'Certified Java Developer',
      description: 'Oracle Certified Professional Java SE Developer',
      icon: '🏆',
      date: '2023',
      organization: 'Oracle'
    },
    {
      id: '2',
      title: 'Best Project Award',
      description: 'Won best project award for Subscription Management System',
      icon: '🥇',
      date: '2024',
      organization: 'Tech Innovation Summit'
    },
    {
      id: '3',
      title: 'AI/ML Specialist',
      description: 'Completed advanced course in Machine Learning and Deep Learning',
      icon: '🎓',
      date: '2024',
      organization: 'Coursera'
    },
    {
      id: '4',
      title: 'Open Source Contributor',
      description: 'Active contributor to multiple open-source projects',
      icon: '🌟',
      date: '2023-2024',
      organization: 'GitHub'
    },
    {
      id: '5',
      title: 'Hackathon Winner',
      description: 'First place in regional coding hackathon',
      icon: '💻',
      date: '2023',
      organization: 'Tech Community'
    },
    {
      id: '6',
      title: 'Published Research',
      description: 'Co-authored paper on AI in Medical Imaging',
      icon: '📄',
      date: '2024',
      organization: 'IEEE'
    }
  ]);

  // Additional custom sections (editable from admin, rendered on both routes)
  sections = signal<HomeSection[]>([]);

  // Contact form
  contactForm: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Determine mode from route data
    let routeData = this.route.snapshot.data;
    if (!routeData['secureMode'] && this.route.parent) {
      routeData = this.route.parent.snapshot.data;
    }
    this.secureMode.set(routeData['secureMode'] === true);
    
    // Start profile image carousel (changes every 3 seconds)
    this.startProfileCarousel();

    // Load persisted content (gallery, achievements, custom sections)
    this.loadFromStorage();
  }

  ngOnDestroy(): void {
    // Clear intervals when component is destroyed
    if (this.profileImageInterval) {
      clearInterval(this.profileImageInterval);
    }
  }

  startProfileCarousel(): void {
    if (this.profileImages().length > 1) {
      this.profileImageInterval = setInterval(() => {
        this.currentProfileImageIndex = (this.currentProfileImageIndex + 1) % this.profileImages().length;
      }, 3000); // Change every 3 seconds
    }
  }

  /**
   * Local storage helpers so edits made in /secure/home
   * are reflected when viewing the public home page.
   */
  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      // Seed storage with initial values
      this.saveToStorage();
      return;
    }

    try {
      const data = JSON.parse(stored) as HomePageData;
      if (data.galleryItems) {
        this.galleryItems.set(data.galleryItems);
      }
      if (data.achievements) {
        this.achievements.set(data.achievements);
      }
      if (data.sections) {
        this.sections.set(data.sections);
      }
      if (data.bioData) {
        this.bioData.set(data.bioData);
      }
      if (data.profileImages && data.profileImages.length > 0) {
        this.profileImages.set(data.profileImages);
      }
      if (data.sectionHeadings) {
        this.sectionHeadings.set({
          welcomeTitle: data.sectionHeadings.welcomeTitle || this.sectionHeadings().welcomeTitle,
          welcomeSubtitle: data.sectionHeadings.welcomeSubtitle || this.sectionHeadings().welcomeSubtitle,
          galleryTitle: data.sectionHeadings.galleryTitle || this.sectionHeadings().galleryTitle,
          gallerySubtitle: data.sectionHeadings.gallerySubtitle || this.sectionHeadings().gallerySubtitle,
          achievementsTitle: data.sectionHeadings.achievementsTitle || this.sectionHeadings().achievementsTitle,
          achievementsSubtitle: data.sectionHeadings.achievementsSubtitle || this.sectionHeadings().achievementsSubtitle
        });
      }
    } catch (e) {
      console.error('Error loading home page data from storage', e);
    }
  }

  private saveToStorage(): void {
    const data: HomePageData = {
      galleryItems: this.galleryItems(),
      achievements: this.achievements(),
      sections: this.sections(),
      bioData: this.bioData(),
      profileImages: this.profileImages(),
      sectionHeadings: this.sectionHeadings()
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving home page data from storage', e);
    }
  }

  // Explicit "Save Page" action for admin mode
  savePage(): void {
    if (!this.secureMode()) {
      return;
    }
    if (confirm('Do you want to save all Home page changes?')) {
      this.saveToStorage();
      alert('Home page saved successfully.');
    }
  }

  onSubmit(): void {
    if (!this.contactForm.name.trim() || !this.contactForm.email.trim() || !this.contactForm.message.trim()) {
      this.submitError = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.contactForm.email)) {
      this.submitError = 'Please enter a valid email address';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = false;

    this.contactService.sendMessage(this.contactForm).subscribe({
      next: (success) => {
        this.isSubmitting = false;
        if (success) {
          this.submitSuccess = true;
          this.contactForm = { name: '', email: '', message: '' };
          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        } else {
          this.submitError = 'Failed to send message. Please try again.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to send message. Please try again.';
        console.error('Contact form error:', error);
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Admin editing methods
  startEditGallery(item: GalleryItem): void {
    if (this.secureMode() && !confirm('Do you want to edit this gallery item?')) {
      return;
    }
    this.editingGallery.set(item.id);
    this.galleryForm = { ...item };
  }

  cancelEditGallery(): void {
    this.editingGallery.set(null);
    this.galleryForm = {};
    this.selectedGalleryImageFile = null;
  }

  saveGallery(): void {
    if (this.secureMode() && !confirm('Do you want to save changes to this gallery item?')) {
      return;
    }
    if (this.editingGallery()) {
      if (this.selectedGalleryImageFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageDataUrl = e.target.result;
          this.galleryForm.imageUrl = imageDataUrl;
          this.finalizeGallerySave();
        };
        reader.readAsDataURL(this.selectedGalleryImageFile);
      } else {
        this.finalizeGallerySave();
      }
    }
  }

  private finalizeGallerySave(): void {
    const items = this.galleryItems();
    const index = items.findIndex(item => item.id === this.editingGallery());
    if (index !== -1) {
      items[index] = { ...items[index], ...this.galleryForm } as GalleryItem;
      this.galleryItems.set([...items]);
    }
    this.selectedGalleryImageFile = null;
    this.cancelEditGallery();
    this.saveToStorage();
  }

  onGalleryImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedGalleryImageFile = input.files[0];
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galleryForm.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedGalleryImageFile);
    }
  }

  deleteGalleryItem(id: string): void {
    if (this.secureMode() && !confirm('Are you sure you want to remove this gallery item?')) {
      return;
    }
    const items = this.galleryItems().filter(item => item.id !== id);
    this.galleryItems.set(items);
    this.saveToStorage();
  }

  startAddGalleryItem(): void {
    this.addingGalleryItem.set(true);
    this.galleryForm = {};
    this.selectedGalleryImageFile = null;
  }

  cancelAddGalleryItem(): void {
    this.addingGalleryItem.set(false);
    this.galleryForm = {};
    this.selectedGalleryImageFile = null;
  }

  addGalleryItem(): void {
    if (!this.galleryForm.title && !this.galleryForm.imageUrl && !this.selectedGalleryImageFile) {
      return;
    }
    
    if (this.selectedGalleryImageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageDataUrl = e.target.result;
        const newItem: GalleryItem = {
          id: Date.now().toString(),
          title: this.galleryForm.title || 'New Item',
          imageUrl: imageDataUrl,
          description: this.galleryForm.description,
          category: this.galleryForm.category
        };
        this.galleryItems.set([...this.galleryItems(), newItem]);
        this.selectedGalleryImageFile = null;
        this.galleryForm = {};
        this.addingGalleryItem.set(false);
        this.saveToStorage();
      };
      reader.readAsDataURL(this.selectedGalleryImageFile);
    } else if (this.galleryForm.imageUrl) {
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        title: this.galleryForm.title || 'New Item',
        imageUrl: this.galleryForm.imageUrl,
        description: this.galleryForm.description,
        category: this.galleryForm.category
      };
      this.galleryItems.set([...this.galleryItems(), newItem]);
      this.galleryForm = {};
      this.addingGalleryItem.set(false);
      this.saveToStorage();
    }
  }

  startEditAchievement(achievement: Achievement): void {
    if (this.secureMode() && !confirm('Do you want to edit this achievement?')) {
      return;
    }
    this.editingAchievement.set(achievement.id);
    this.achievementForm = { ...achievement };
  }

  cancelEditAchievement(): void {
    this.editingAchievement.set(null);
    this.achievementForm = {};
    this.selectedAchievementBackgroundFile = null;
  }

  saveAchievement(): void {
    if (this.secureMode() && !confirm('Do you want to save changes to this achievement?')) {
      return;
    }
    if (this.editingAchievement()) {
      if (this.selectedAchievementBackgroundFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageDataUrl = e.target.result;
          this.achievementForm.backgroundImage = imageDataUrl;
          this.finalizeAchievementSave();
        };
        reader.readAsDataURL(this.selectedAchievementBackgroundFile);
      } else {
        this.finalizeAchievementSave();
      }
    }
  }

  private finalizeAchievementSave(): void {
    const items = this.achievements();
    const index = items.findIndex(item => item.id === this.editingAchievement());
    if (index !== -1) {
      items[index] = { ...items[index], ...this.achievementForm } as Achievement;
      this.achievements.set([...items]);
    }
    this.selectedAchievementBackgroundFile = null;
    this.cancelEditAchievement();
    this.saveToStorage();
  }

  onAchievementBackgroundFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedAchievementBackgroundFile = input.files[0];
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.achievementForm.backgroundImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedAchievementBackgroundFile);
    }
  }

  deleteAchievement(id: string): void {
    if (this.secureMode() && !confirm('Are you sure you want to remove this achievement?')) {
      return;
    }
    const items = this.achievements().filter(item => item.id !== id);
    this.achievements.set(items);
    this.saveToStorage();
  }

  startAddAchievement(): void {
    this.addingAchievement.set(true);
    this.achievementForm = {};
    this.selectedAchievementBackgroundFile = null;
  }

  cancelAddAchievement(): void {
    this.addingAchievement.set(false);
    this.achievementForm = {};
    this.selectedAchievementBackgroundFile = null;
  }

  addAchievement(): void {
    if (!this.achievementForm.title) {
      return;
    }
    
    if (this.selectedAchievementBackgroundFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageDataUrl = e.target.result;
        const newAchievement: Achievement = {
          id: Date.now().toString(),
          title: this.achievementForm.title || 'New Achievement',
          description: this.achievementForm.description || '',
          icon: this.achievementForm.icon || '🏆',
          date: this.achievementForm.date,
          organization: this.achievementForm.organization,
          backgroundImage: imageDataUrl
        };
        this.achievements.set([...this.achievements(), newAchievement]);
        this.selectedAchievementBackgroundFile = null;
        this.achievementForm = {};
        this.addingAchievement.set(false);
        this.saveToStorage();
      };
      reader.readAsDataURL(this.selectedAchievementBackgroundFile);
    } else {
      const newAchievement: Achievement = {
        id: Date.now().toString(),
        title: this.achievementForm.title || 'New Achievement',
        description: this.achievementForm.description || '',
        icon: this.achievementForm.icon || '🏆',
        date: this.achievementForm.date,
        organization: this.achievementForm.organization,
        backgroundImage: this.achievementForm.backgroundImage
      };
      this.achievements.set([...this.achievements(), newAchievement]);
      this.achievementForm = {};
      this.addingAchievement.set(false);
      this.saveToStorage();
    }
  }

  // Custom section editing
  startAddSection(): void {
    if (this.secureMode() && !confirm('Do you want to create a new custom section?')) {
      return;
    }
    this.sectionForm = {
      title: '',
      subtitle: '',
      content: ''
    };
    this.editingSection.set('new');
  }

  startEditSection(section: HomeSection): void {
    if (this.secureMode() && !confirm('Do you want to edit this custom section?')) {
      return;
    }
    this.sectionForm = { ...section };
    this.editingSection.set(section.id);
  }

  cancelEditSection(): void {
    this.editingSection.set(null);
    this.sectionForm = {};
  }

  saveSection(): void {
    if (this.secureMode() && !confirm('Do you want to save this custom section?')) {
      return;
    }
    if (!this.sectionForm.title || !this.sectionForm.content) {
      return;
    }

    const sections = [...this.sections()];
    if (this.editingSection() === 'new') {
      const newSection: HomeSection = {
        id: Date.now().toString(),
        title: this.sectionForm.title,
        subtitle: this.sectionForm.subtitle,
        content: this.sectionForm.content
      };
      sections.push(newSection);
    } else {
      const index = sections.findIndex(s => s.id === this.editingSection());
      if (index !== -1) {
        sections[index] = {
          ...sections[index],
          ...this.sectionForm,
          id: sections[index].id
        } as HomeSection;
      }
    }

    this.sections.set(sections);
    this.cancelEditSection();
    this.saveToStorage();
  }

  deleteSection(id: string): void {
    if (this.secureMode() && !confirm('Are you sure you want to remove this custom section?')) {
      return;
    }
    const remaining = this.sections().filter(s => s.id !== id);
    this.sections.set(remaining);
    this.saveToStorage();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      console.log('Logged out successfully');
    }).catch(error => {
      console.error('Error navigating to login:', error);
    });
  }

  // Bio Data editing
  startEditBio(): void {
    this.bioForm = this.bioData();
    this.editingBio.set(true);
  }

  cancelEditBio(): void {
    this.editingBio.set(false);
    this.bioForm = '';
  }

  saveBio(): void {
    if (this.bioForm.trim()) {
      this.bioData.set(this.bioForm);
      this.editingBio.set(false);
      this.saveToStorage();
    }
  }

  // Profile Images management
  startEditProfileImages(): void {
    this.editingProfileImages.set(true);
    this.newProfileImageUrl = '';
  }

  cancelEditProfileImages(): void {
    this.editingProfileImages.set(false);
    this.newProfileImageUrl = '';
  }

  addProfileImage(): void {
    if (this.selectedProfileImageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageDataUrl = e.target.result;
        this.profileImages.set([...this.profileImages(), imageDataUrl]);
        this.selectedProfileImageFile = null;
        this.newProfileImageUrl = '';
        this.saveToStorage();
      };
      reader.readAsDataURL(this.selectedProfileImageFile);
    } else if (this.newProfileImageUrl.trim()) {
      this.profileImages.set([...this.profileImages(), this.newProfileImageUrl.trim()]);
      this.newProfileImageUrl = '';
      this.saveToStorage();
    }
  }

  onProfileImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedProfileImageFile = input.files[0];
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProfileImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedProfileImageFile);
    }
  }

  removeProfileImage(index: number): void {
    const images = this.profileImages().filter((_, i) => i !== index);
    this.profileImages.set(images);
    if (this.currentProfileImageIndex >= images.length) {
      this.currentProfileImageIndex = 0;
    }
    this.saveToStorage();
  }

  // Section Headings editing
  startEditHeading(headingType: 'welcome' | 'gallery' | 'achievements'): void {
    this.editingHeading.set(headingType);
    const headings = this.sectionHeadings();
    if (headingType === 'welcome') {
      this.headingForm = {
        welcomeTitle: headings.welcomeTitle,
        welcomeSubtitle: headings.welcomeSubtitle
      };
    } else if (headingType === 'gallery') {
      this.headingForm = {
        galleryTitle: headings.galleryTitle,
        gallerySubtitle: headings.gallerySubtitle
      };
    } else if (headingType === 'achievements') {
      this.headingForm = {
        achievementsTitle: headings.achievementsTitle,
        achievementsSubtitle: headings.achievementsSubtitle
      };
    }
  }

  cancelEditHeading(): void {
    this.editingHeading.set(null);
    this.headingForm = {};
  }

  saveHeading(): void {
    if (this.editingHeading()) {
      const current = this.sectionHeadings();
      const updated = { ...current, ...this.headingForm };
      this.sectionHeadings.set(updated);
      this.cancelEditHeading();
      this.saveToStorage();
    }
  }
}

