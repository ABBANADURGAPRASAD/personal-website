import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ImageUploadResponse {
  imageUrl: string;
  message: string;
}

interface ErrorResponse {
  error: string;
}

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = 'http://localhost:8080/api/images';

  /**
   * Upload a profile image
   */
  uploadProfileImage(file: File): Observable<string> {
    return this.uploadImage(file, '/profile');
  }

  /**
   * Upload a gallery image
   */
  uploadGalleryImage(file: File): Observable<string> {
    return this.uploadImage(file, '/gallery');
  }

  /**
   * Upload an achievement background image
   */
  uploadAchievementImage(file: File): Observable<string> {
    return this.uploadImage(file, '/achievement');
  }

  /**
   * Generic image upload method
   */
  private uploadImage(file: File, endpoint: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ImageUploadResponse>(`${this.API_BASE_URL}${endpoint}`, formData)
      .pipe(
        map(response => {
          // Return full URL (backend returns /api/images/...)
          return `http://localhost:8080${response.imageUrl}`;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error uploading image:', error);
          const errorMessage = error.error?.error || error.message || 'Failed to upload image';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Delete an image from the server
   */
  deleteImage(imagePath: string): Observable<boolean> {
    // Extract the path part from full URL if needed
    let path = imagePath;
    if (imagePath.startsWith('http://localhost:8080')) {
      path = imagePath.replace('http://localhost:8080', '');
    }

    return this.http.delete<{ message: string }>(`${this.API_BASE_URL}`, {
      params: { path }
    }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting image:', error);
        return throwError(() => new Error('Failed to delete image'));
      })
    );
  }
}

