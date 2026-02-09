import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit } from 'lucide-react';

interface DualInputAreaProps {
  onSend: (topic: string, perspective: string) => void;
  isLoading: boolean;
}

export const DualInputArea: React.FC<DualInputAreaProps> = ({ onSend, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [perspective, setPerspective] = useState('');
  const topicRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && perspective.trim() && !isLoading) {
      onSend(topic, perspective);
      setTopic('');
      setPerspective('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'topic' | 'perspective') => {
    if (e.key === 'Enter' && e.metaKey) {
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] p-4 md:p-6 pb-8">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
        
        <div className="grid md:grid-cols-2 gap-4">
            {/* Box 1: Topic */}
            <div className="space-y-2 group">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 transition-colors group-focus-within:text-indigo-600">
                    <Sparkles size={14} className="text-indigo-400" /> What do you want to explore?
                </label>
                <div className="relative">
                    <textarea
                        ref={topicRef}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'topic')}
                        placeholder="E.g., The concept of entropy"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-24 text-sm leading-relaxed"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Box 2: Perspective */}
            <div className="space-y-2 group">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 transition-colors group-focus-within:text-emerald-600">
                    <BrainCircuit size={14} className="text-emerald-400" /> Your Perspective
                </label>
                <div className="relative flex flex-col h-24 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                    <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200">
                        <span className="text-xs font-medium text-slate-500 italic">"The way I see it is..."</span>
                    </div>
                    <textarea
                        value={perspective}
                        onChange={(e) => setPerspective(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'perspective')}
                        placeholder="...that it measures disorder in a system."
                        className="w-full flex-grow bg-transparent border-none px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:ring-0 resize-none text-sm leading-relaxed"
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-slate-400 hidden md:block">
                <span className="font-medium text-slate-500">ProTip:</span> CMD + Enter to send
            </p>
            <button
                type="submit"
                disabled={!topic.trim() || !perspective.trim() || isLoading}
                className="ml-auto flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Thinking...</span>
                    </>
                ) : (
                    <>
                        <span>Submit Thoughts</span>
                        <Send size={16} />
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
};