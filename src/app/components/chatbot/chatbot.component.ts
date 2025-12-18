import { Component, signal, inject, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage, ChatRequest } from '../../models/chat.models';
import { AgentCapabilitiesComponent } from '../agent-capabilities/agent-capabilities.component';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, AgentCapabilitiesComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  private chatService = inject(ChatService);
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  isOpen = signal<boolean>(false);
  messages = signal<ChatMessage[]>([
    {
      text: 'Hello! I\'m LLA AI Bot, your personalized AI assistant. I can help you with information about Abbana Durga Prasad, including his profile, projects, skills, and technologies. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
      isRefusal: false
    }
  ]);
  userInput = '';
  isTyping = signal<boolean>(false);
  conversationId?: string;
  private shouldScroll = false;

  ngOnInit(): void {
    // Initialize conversation if needed
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen.update(value => !value);
    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage(): void {
    const message = this.userInput.trim();
    if (!message || this.isTyping()) return;

    // Add user message
    this.messages.update(msgs => [...msgs, {
      text: message,
      isUser: true,
      timestamp: new Date(),
      isRefusal: false
    }]);

    this.userInput = '';
    this.isTyping.set(true);
    this.shouldScroll = true;

    // Call backend API via service
    const request: ChatRequest = {
      message: message,
      conversationId: this.conversationId
    };

    this.chatService.sendMessage(request).subscribe(response => {
      // Detect if this is a refusal message
      const isRefusal = this.chatService.isRefusalMessage(response.reply);

      // Add bot response
      this.messages.update(msgs => [...msgs, {
        text: response.reply,
        isUser: false,
        timestamp: new Date(),
        isRefusal: isRefusal,
        sources: response.sources
      }]);
      
      this.isTyping.set(false);
      this.shouldScroll = true;
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  formatMessage(text: string): string {
    // Simple formatting - can be enhanced for markdown or links
    return text.replace(/\n/g, '<br>');
  }
}

