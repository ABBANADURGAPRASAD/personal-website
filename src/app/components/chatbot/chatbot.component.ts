import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  isOpen = signal<boolean>(false);
  messages = signal<ChatMessage[]>([
    {
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  userInput = '';
  isTyping = signal<boolean>(false);

  toggleChat(): void {
    this.isOpen.update(value => !value);
  }

  sendMessage(): void {
    const message = this.userInput.trim();
    if (!message) return;

    // Add user message
    this.messages.update(msgs => [...msgs, {
      text: message,
      isUser: true,
      timestamp: new Date()
    }]);

    this.userInput = '';
    this.isTyping.set(true);

    // Simulate AI response (replace with actual AI service call)
    setTimeout(() => {
      const response = this.generateResponse(message);
      this.messages.update(msgs => [...msgs, {
        text: response,
        isUser: false,
        timestamp: new Date()
      }]);
      this.isTyping.set(false);
    }, 1000);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private generateResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Simple response logic (replace with actual AI integration)
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m here to help you. You can ask me about the portfolio, projects, skills, or anything else!';
    }

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('project')) {
      return 'You can view the portfolio by clicking "View Portfolio" or navigating to /portfolio. The portfolio includes projects, skills, and profile information.';
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
      return 'The portfolio showcases various skills including Java, Spring Boot, Angular, TypeScript, Python, and AI/ML technologies. Check out the portfolio page for details!';
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      return 'You can contact through the contact form on the home page. Fill in your name, email, and message, and I\'ll get back to you!';
    }

    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return 'The portfolio includes detailed information about projects, achievements, and professional experience. Explore the portfolio and achievements sections!';
    }

    if (lowerMessage.includes('help')) {
      return 'I can help you with:\n• Information about the portfolio\n• Questions about projects and skills\n• Contact information\n• Navigation help\n\nWhat would you like to know?';
    }

    // Default response
    return 'Thank you for your message! I\'m an AI assistant helping with portfolio information. You can ask me about projects, skills, contact details, or anything else related to this portfolio.';
  }
}

