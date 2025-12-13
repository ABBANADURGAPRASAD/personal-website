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
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

