import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChatRequest, ChatResponse } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/chat';

  /**
   * Send a chat message to the backend AI agent
   */
  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.API_URL, request).pipe(
      catchError(error => {
        console.error('Error calling chat API:', error);
        return of<ChatResponse>({
          reply: 'Sorry, I encountered an error processing your request. Please try again later.',
          sources: []
        });
      })
    );
  }

  /**
   * Check if a response is a refusal message from the agent
   */
  isRefusalMessage(message: string): boolean {
    const refusalIndicators = [
      'I\'m LLA AI Bot, designed specifically',
      'I can only answer questions about',
      'Please ask me something about him instead',
      'outside your scope',
      'outside this scope'
    ];
    
    return refusalIndicators.some(indicator => 
      message.toLowerCase().includes(indicator.toLowerCase())
    );
  }
}

