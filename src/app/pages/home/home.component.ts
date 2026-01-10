import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryItem, Achievement, ContactForm, HomeSection, HomePageData } from '../../models/home.models';
import { ContactService } from '../../services/contact.service';
import { ImageUploadService } from '../../services/image-upload.service';
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
  
  // Profile images carousel - Images from src/assets/images/profile folder
  profileImages = signal<string[]>([
    'assets/images/profile/profile2.png',
    'assets/images/profile/profile3.jpeg',
    'assets/images/profile/profile1.jpg'
  ]);
  currentProfileImageIndex = 0;
  profileImageInterval: any;
  newProfileImageUrl = '';
  selectedProfileImageFile: File | null = null;
  selectedGalleryImageFile: File | null = null;
  selectedAchievementBackgroundFile: File | null = null;
  uploadingImage = signal<boolean>(false); // Track upload status
  // Gallery items - using signal for reactivity
  // Add your gallery images to src/assets/images/gallery/ folder and update imageUrl paths
  galleryItems = signal<GalleryItem[]>([
    {
      id: '1',
      title: 'personal-website',
      imageUrl: '', // Add image path: 'assets/images/gallery/project1.jpg'
      description: 'Intelligent Personal Website with AI Assistant, Projects & Achievements',
      category: 'Web Application'
    },
    {
      id: '2',
      title: 'Ollama Full Stack Chat Application',
      imageUrl: 'ollama ai img.png', // Add image path: 'assets/images/gallery/chatbot.jpg'
      description: 'Spring AI Chatbot Implementation',
      category: 'AI/ML'
    },
    {
      id: '3',
      title: 'Brain Tumor Detection using ResNet',
      imageUrl: '', // Add image path: 'assets/images/gallery/medical.jpg'
      description: 'image classification model for brain tumor detection',
      category: 'Deep Learning'
    },
    {
      id: '4',
      title: 'screenrecorder web application',
      imageUrl: '', // Add image path: 'assets/images/gallery/fullstack.jpg'
      description: 'screenrecorder web application with database',
      category: 'Web Development'
    },
    {
      id: '5',
      title: 'blog management system',
      imageUrl: '', // Add image path: 'assets/images/gallery/api.jpg'
      description: 'blog management system with spring boot and angular',
      category: 'Web Development'
    },
    {
      id: '6',
      title: 'Object Detection using YOLOv8',
      imageUrl: '', // Add image path: 'assets/images/gallery/ui.jpg'
      description: 'Object detection using YOLOv8',
      category: 'Deep Learning'
    }
  ]);

  // Achievements - using signal for reactivity
  achievements = signal<Achievement[]>([
    {
      id: '1',
      title: 'Java TalentNext 2025',
      description: 'Java TalentNext 2025 development certificate',
      icon: '🏆',
      date: '2025',
      organization: 'wipro'
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
    private imageUploadService: ImageUploadService,
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
        // Move to next image in the array
        this.currentProfileImageIndex = (this.currentProfileImageIndex + 1) % this.profileImages().length;
      }, 3000); // Change every 3 seconds
    }
  }

  // Handle image load error - show NO_IMAGE_FOUND placeholder
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement;
    
    // Check if placeholder already exists
    if (parent && !parent.querySelector('.no-image-placeholder')) {
      img.style.display = 'none';
      
      // Create a text placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'no-image-placeholder';
      placeholder.textContent = 'NO_IMAGE_FOUND';
      placeholder.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 200px;
        background: #f0f0f0;
        color: #999;
        font-size: 14px;
        font-weight: 500;
        border: 2px dashed #ccc;
        border-radius: 8px;
      `;
      
      parent.appendChild(placeholder);
    }
  }

  /**
   * Local storage helpers so edits made in /secure/home
   * are reflected when viewing the public home page.
   */
  private loadFromStorage(): void {
    // Check if we're in browser environment (not SSR)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      // Seed storage with initial values
      this.saveToStorage();
      return;
    }

    try {
      const data = JSON.parse(stored) as HomePageData;
      
      // Merge gallery items: keep existing items, add new ones from initial data
      if (data.galleryItems) {
        const storedIds = new Set(data.galleryItems.map(item => item.id));
        const initialGalleryItems = this.galleryItems();
        const newItems = initialGalleryItems.filter(item => !storedIds.has(item.id));
        const mergedGalleryItems = [...data.galleryItems, ...newItems];
        
        // Filter out placeholder URLs and replace with empty strings
        const cleanedGalleryItems = mergedGalleryItems.map(item => ({
          ...item,
          imageUrl: item.imageUrl && item.imageUrl.includes('via.placeholder.com') ? '' : (item.imageUrl || '')
        }));
        this.galleryItems.set(cleanedGalleryItems);
        // Save merged data back to localStorage
        this.saveToStorage();
      } else {
        // No stored gallery items, use initial values
        this.saveToStorage();
      }
      
      // Merge achievements: keep existing items, add new ones from initial data
      if (data.achievements) {
        const storedIds = new Set(data.achievements.map(item => item.id));
        const initialAchievements = this.achievements();
        const newItems = initialAchievements.filter(item => !storedIds.has(item.id));
        const mergedAchievements = [...data.achievements, ...newItems];
        this.achievements.set(mergedAchievements);
        this.saveToStorage();
      } else {
        // No stored achievements, use initial values
        this.saveToStorage();
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
      // On error, reset to initial values
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    // Check if we're in browser environment (not SSR)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

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
        this.uploadingImage.set(true);
        this.imageUploadService.uploadGalleryImage(this.selectedGalleryImageFile).subscribe({
          next: (imageUrl) => {
            this.galleryForm.imageUrl = imageUrl;
            this.uploadingImage.set(false);
            this.finalizeGallerySave();
          },
          error: (error) => {
            console.error('Error uploading gallery image:', error);
            let errorMessage = 'Failed to upload image';
            if (error.message && error.message.includes('413')) {
              errorMessage = 'Image file is too large. Maximum size is 20MB. Please choose a smaller image.';
            } else if (error.message) {
              errorMessage = error.message;
            }
            alert(errorMessage);
            this.uploadingImage.set(false);
          }
        });
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
      const file = input.files[0];
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      
      if (file.size > maxSize) {
        alert(`Image file is too large. Maximum size is 20MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB. Please choose a smaller image.`);
        input.value = ''; // Clear the input
        return;
      }
      
      this.selectedGalleryImageFile = file;
      // Preview the image using object URL (temporary, not Base64)
      const objectUrl = URL.createObjectURL(this.selectedGalleryImageFile);
      this.galleryForm.imageUrl = objectUrl;
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
      this.uploadingImage.set(true);
      this.imageUploadService.uploadGalleryImage(this.selectedGalleryImageFile).subscribe({
        next: (imageUrl) => {
          const newItem: GalleryItem = {
            id: Date.now().toString(),
            title: this.galleryForm.title || 'New Item',
            imageUrl: imageUrl,
            description: this.galleryForm.description,
            category: this.galleryForm.category
          };
          this.galleryItems.set([...this.galleryItems(), newItem]);
          this.selectedGalleryImageFile = null;
          this.galleryForm = {};
          this.addingGalleryItem.set(false);
          this.uploadingImage.set(false);
          this.saveToStorage();
        },
        error: (error) => {
          console.error('Error uploading gallery image:', error);
          let errorMessage = 'Failed to upload image';
          if (error.message && error.message.includes('413')) {
            errorMessage = 'Image file is too large. Maximum size is 20MB. Please choose a smaller image.';
          } else if (error.message) {
            errorMessage = error.message;
          }
          alert(errorMessage);
          this.uploadingImage.set(false);
        }
      });
    } else if (this.galleryForm.imageUrl) {
      // External URL - store directly
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        title: this.galleryForm.title || 'New Item',
        imageUrl: this.galleryForm.imageUrl,
        description: this.galleryForm.description,
        category: this.galleryForm.category
      };
      this.galleryItems.set([...this.galleryItems(), newItem]);
      this.selectedGalleryImageFile = null;
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
        this.uploadingImage.set(true);
        this.imageUploadService.uploadAchievementImage(this.selectedAchievementBackgroundFile).subscribe({
          next: (imageUrl) => {
            this.achievementForm.backgroundImage = imageUrl;
            this.uploadingImage.set(false);
            this.finalizeAchievementSave();
          },
          error: (error) => {
            console.error('Error uploading achievement image:', error);
            let errorMessage = 'Failed to upload image';
            if (error.message && error.message.includes('413')) {
              errorMessage = 'Image file is too large. Maximum size is 20MB. Please choose a smaller image.';
            } else if (error.message) {
              errorMessage = error.message;
            }
            alert(errorMessage);
            this.uploadingImage.set(false);
          }
        });
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
      const file = input.files[0];
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      
      if (file.size > maxSize) {
        alert(`Image file is too large. Maximum size is 20MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB. Please choose a smaller image.`);
        input.value = ''; // Clear the input
        return;
      }
      
      this.selectedAchievementBackgroundFile = file;
      // Preview the image using object URL (temporary, not Base64)
      const objectUrl = URL.createObjectURL(this.selectedAchievementBackgroundFile);
      this.achievementForm.backgroundImage = objectUrl;
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
      this.uploadingImage.set(true);
      this.imageUploadService.uploadProfileImage(this.selectedProfileImageFile).subscribe({
        next: (imageUrl) => {
          // Add new image to the profile images array
          const updatedImages = [...this.profileImages(), imageUrl];
          this.profileImages.set(updatedImages);
          
          // Set current index to the newly added image so it's immediately visible
          this.currentProfileImageIndex = updatedImages.length - 1;
          
          // Restart carousel to include the new image
          if (this.profileImageInterval) {
            clearInterval(this.profileImageInterval);
          }
          this.startProfileCarousel();
          
          this.selectedProfileImageFile = null;
          this.newProfileImageUrl = '';
          this.uploadingImage.set(false);
          this.saveToStorage();
        },
          error: (error) => {
            console.error('Error uploading profile image:', error);
            let errorMessage = 'Failed to upload image';
            if (error.message && error.message.includes('413')) {
              errorMessage = 'Image file is too large. Maximum size is 20MB. Please choose a smaller image.';
            } else if (error.message) {
              errorMessage = error.message;
            }
            alert(errorMessage);
            this.uploadingImage.set(false);
          }
      });
    } else if (this.newProfileImageUrl.trim()) {
      // External URL - store directly
      const updatedImages = [...this.profileImages(), this.newProfileImageUrl.trim()];
      this.profileImages.set(updatedImages);
      
      // Set current index to the newly added image so it's immediately visible
      this.currentProfileImageIndex = updatedImages.length - 1;
      
      // Restart carousel to include the new image
      if (this.profileImageInterval) {
        clearInterval(this.profileImageInterval);
      }
      this.startProfileCarousel();
      
      this.newProfileImageUrl = '';
      this.saveToStorage();
    }
  }

  onProfileImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      
      if (file.size > maxSize) {
        alert(`Image file is too large. Maximum size is 20MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB. Please choose a smaller image.`);
        input.value = ''; // Clear the input
        return;
      }
      
      this.selectedProfileImageFile = file;
      // Preview the image using object URL (temporary, not Base64)
      const objectUrl = URL.createObjectURL(this.selectedProfileImageFile);
      this.newProfileImageUrl = objectUrl;
      // Clean up object URL when component is destroyed or image is uploaded
    }
  }

  removeProfileImage(index: number): void {
    const images = this.profileImages().filter((_, i) => i !== index);
    this.profileImages.set(images);
    
    // Adjust current index if needed
    if (this.currentProfileImageIndex >= images.length) {
      this.currentProfileImageIndex = 0;
    } else if (this.currentProfileImageIndex > index) {
      // If we removed an image before the current one, adjust index
      this.currentProfileImageIndex--;
    }
    
    // Restart carousel with updated images
    if (this.profileImageInterval) {
      clearInterval(this.profileImageInterval);
    }
    this.startProfileCarousel();
    
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

