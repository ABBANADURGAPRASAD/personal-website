export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRefusal?: boolean;
  sources?: string[];
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  sources?: string[];
}

export interface AgentStatus {
  isActive: boolean;
  strictScopeEnabled: boolean;
  currentProfile?: string;
}

export interface ProfileData {
  name: string;
  professionalIdentity: string;
  technologies: string[];
  skills: string[];
  education?: string;
  workExperience?: string;
  projects?: string[];
}

export interface TechnologyStack {
  backend: string[];
  aiMl: string[];
  databases: string[];
  frontend: string[];
  tools: string[];
}

export interface AgentCapability {
  id: string;
  title: string;
  description: string;
  action: () => void;
  icon?: string;
}

