import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ContactForm } from '../models/home.models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  /**
   * Send contact message - ready for backend integration
   */
  sendMessage(contactForm: ContactForm): Observable<boolean> {
    // TODO: Replace with actual HTTP call to backend
    // return this.http.post<{ success: boolean }>('/api/contact', contactForm)
    //   .pipe(
    //     map(response => response.success),
    //     catchError(() => of(false))
    //   );

    // Mock implementation
    console.log('Contact form submitted:', contactForm);
    return of(true).pipe(delay(1000));
  }
}

