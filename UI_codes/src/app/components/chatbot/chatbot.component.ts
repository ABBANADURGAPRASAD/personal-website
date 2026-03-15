import { Component, signal, inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage, ChatRequest } from '../../models/chat.models';
import { AgentCapabilitiesComponent } from '../agent-capabilities/agent-capabilities.component';

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, AgentCapabilitiesComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  private chatService = inject(ChatService);
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  isOpen = signal<boolean>(false);
  isMinimized = signal<boolean>(false);
  isFullscreen = signal<boolean>(false);
  isRecording = signal<boolean>(false);
  speechRecognitionSupported = signal<boolean>(false);
  private recognition: SpeechRecognition | null = null;
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
    const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    this.speechRecognitionSupported.set(!!SpeechRecognitionAPI);
    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.userInput = (this.userInput + (this.userInput ? ' ' : '') + transcript).trim();
          }
        }
      };
      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
        }
        this.stopSpeechInput();
      };
      this.recognition.onend = () => {
        if (this.isRecording()) {
          try {
            const start = this.recognition?.start() as Promise<void> | undefined;
            start?.catch(() => {});
          } catch (_) {}
        }
      };
    }
  }

  ngOnDestroy(): void {
    this.stopSpeechInput();
  }

  toggleSpeechInput(): void {
    if (this.isRecording()) {
      this.stopSpeechInput();
    } else {
      this.startSpeechInput();
    }
  }

  private startSpeechInput(): void {
    if (!this.recognition || this.isTyping()) return;
    try {
      this.recognition.start();
      this.isRecording.set(true);
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
    }
  }

  private stopSpeechInput(): void {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch (_) {}
    this.isRecording.set(false);
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
      this.isMinimized.set(false);
      setTimeout(() => this.scrollToBottom(), 100);
    } else {
      this.isFullscreen.set(false);
      this.isMinimized.set(false);
    }
  }

  minimizeChat(): void {
    this.isMinimized.set(true);
    this.isFullscreen.set(false);
  }

  maximizeChat(): void {
    this.isMinimized.set(false);
    this.isFullscreen.set(false);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  toggleFullscreen(): void {
    this.isFullscreen.update(value => !value);
    this.isMinimized.set(false);
    if (this.isFullscreen()) {
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

