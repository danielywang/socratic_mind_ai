import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, LoadingState } from './types';
import { generateResponse } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { DualInputArea } from './components/DualInputArea';
import { BookOpen, AlertCircle, Download } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  const handleSendMessage = async (topic: string, perspective: string) => {
    setError(null);
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: `Topic: ${topic}\nPerspective: ${perspective}`, // Stored for API logic if needed separately
      timestamp: Date.now(),
      structuredInput: {
        topic,
        perspective
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setLoadingState('thinking');

    try {
      // Pass the current history + specific parts to the service
      const responseText = await generateResponse(messages, topic, perspective);
      
      const botMessage: Message = {
        id: uuidv4(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the tutor. Please verify your connection or API key and try again.");
    } finally {
      setLoadingState('idle');
    }
  };

  const handleDownloadLogs = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(messages, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "socratic_logs.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-200">
                <BookOpen size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Socratic Mind</h1>
                <p className="text-xs text-slate-500 font-medium">Educational AI Tutor</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={handleDownloadLogs}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                title="Download Debug Logs"
            >
                <Download size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-600">Active Learning Mode</span>
            </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-grow overflow-y-auto px-4 py-8 md:px-6">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-start">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-6 py-12">
               <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-500 mb-4">
                  <BrainCircuitIcon size={40} />
               </div>
               <h2 className="text-3xl font-bold text-slate-800">Ready to expand your mind?</h2>
               <p className="text-slate-600 max-w-md leading-relaxed">
                 Enter a topic you wish to understand better, and articulate your current perspective. I will evaluate your understanding and guide you deeper with Socratic questioning.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full max-w-lg mt-8 opacity-80">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                    <strong className="block text-indigo-600 mb-1">Topic</strong>
                    Why is the sky blue?
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                    <strong className="block text-emerald-600 mb-1">Perspective</strong>
                    <span className="italic text-slate-500">The way I see it is...</span> it's reflecting the ocean water.
                  </div>
               </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loadingState === 'thinking' && (
             <div className="flex flex-col items-start mb-8 w-full animate-pulse">
                <div className="max-w-3xl w-full flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-slate-200 rounded-lg text-slate-400">
                          <div className="w-5 h-5"></div>
                      </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-6 shadow-sm w-full">
                     <div className="h-4 bg-slate-100 rounded w-3/4 mb-3"></div>
                     <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
             </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3 text-red-700 animate-shake">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <DualInputArea onSend={handleSendMessage} isLoading={loadingState !== 'idle'} />
    </div>
  );
};

// Simple Icon component for the empty state
const BrainCircuitIcon = ({ size }: { size: number }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05 L12 20V4.5Z" />
      <path d="M16 8V5c0-1.1.9-2 2-2" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M12 8h8" />
    </svg>
);

export default App;