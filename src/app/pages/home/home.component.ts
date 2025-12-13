import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryItem, Achievement, ContactForm } from '../../models/home.models';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Profile images carousel - Add your images to src/assets/images/ folder
  profileImages: string[] = [
    'assets/images/profile1.jpg',  // Add your profile images to src/assets/images/ folder
    'assets/images/profile2.jpg',
    'assets/images/profile3.jpg'
  ];
  currentProfileImageIndex = 0;
  profileImageInterval: any;
  // Gallery items
  galleryItems: GalleryItem[] = [
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
  ];

  // Achievements
  achievements: Achievement[] = [
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
  ];

  // Contact form
  contactForm: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // Start profile image carousel (changes every 3 seconds)
    this.startProfileCarousel();
  }

  ngOnDestroy(): void {
    // Clear intervals when component is destroyed
    if (this.profileImageInterval) {
      clearInterval(this.profileImageInterval);
    }
  }

  startProfileCarousel(): void {
    if (this.profileImages.length > 1) {
      this.profileImageInterval = setInterval(() => {
        this.currentProfileImageIndex = (this.currentProfileImageIndex + 1) % this.profileImages.length;
      }, 3000); // Change every 3 seconds
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
}

