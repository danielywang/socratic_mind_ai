export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  // For user messages, we store the structured parts for display
  structuredInput?: {
    topic: string;
    perspective: string;
  };
}

export interface ChatSession {
  messages: Message[];
}

export type LoadingState = 'idle' | 'thinking' | 'streaming' | 'error';
