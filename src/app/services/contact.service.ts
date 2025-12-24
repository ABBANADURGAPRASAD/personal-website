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
    return this.http.post<ContactResponse>(this.API_URL, contactForm)
      .pipe(
        map(response => response.success),
        catchError(error => {
          console.error('Error sending contact message:', error);
          return of(false);
        })
      );
  }
}

