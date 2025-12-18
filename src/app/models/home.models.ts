export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  category?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  date?: string;
  organization?: string;
  backgroundImage?: string;
}

// Generic editable section on the home page (for "new sections")
export interface HomeSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
}

// Shape of persisted home page data
export interface HomePageData {
  galleryItems: GalleryItem[];
  achievements: Achievement[];
  sections: HomeSection[];
  bioData?: string;
  profileImages?: string[];
  sectionHeadings?: {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    galleryTitle?: string;
    gallerySubtitle?: string;
    achievementsTitle?: string;
    achievementsSubtitle?: string;
  };
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

