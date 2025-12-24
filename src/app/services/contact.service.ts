import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContactForm } from '../models/home.models';

interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/contact';

  /**
   * Send contact message to backend
   */
  sendMessage(contactForm: ContactForm): Observable<boolean> {
    return this.http.post<ContactResponse>(this.API_URL, contactForm, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .pipe(
        map(response => {
          // Handle both 'success' and 'isSuccess' property names
          return response.success !== undefined ? response.success : (response as any).isSuccess || false;
        }),
        catchError(error => {
          console.error('Error sending contact message:', error);
          if (error.status === 0) {
            console.error('CORS error or network issue. Make sure backend is running and CORS is configured.');
          }
          return of(false);
        })
      );
  }
}

