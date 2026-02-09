import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Bot, User, Quote, Lightbulb } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser && message.structuredInput) {
    return (
      <div className="flex flex-col items-end mb-8 w-full animate-fade-in-up">
        <div className="max-w-3xl w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-50 flex items-center gap-3">
             <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <User size={18} />
             </div>
             <span className="font-semibold text-indigo-900 text-sm tracking-wide uppercase">Student's Inquiry</span>
          </div>
          
          <div className="p-6 grid gap-6 md:grid-cols-2">
            {/* Topic Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb size={14} /> Topic / Question
              </h4>
              <p className="text-slate-800 font-medium leading-relaxed">
                {message.structuredInput.topic}
              </p>
            </div>

            {/* Perspective Section */}
            <div className="space-y-2 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-200 rounded-full md:hidden"></div>
                <div className="pl-4 md:pl-0 md:border-l md:border-slate-100 md:ml-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Quote size={14} /> Perspective
                  </h4>
                  <div className="text-slate-600 italic">
                    <span className="text-indigo-400 font-medium not-italic mr-1">"The way I see it is...</span>
                    {message.structuredInput.perspective}"
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Robustly handle Markdown spacing issues from the API
  // This ensures that "### Header" always has a double newline before it so it renders as a header
  const processedContent = message.content
    .replace(/([^\n])###/g, '$1\n\n###') // If ### follows text directly, add double newline
    .replace(/\n###/g, '\n\n###');       // If ### follows single newline, add another

  return (
    <div className="flex flex-col items-start mb-8 w-full animate-fade-in-up">
      <div className="max-w-3xl w-full flex gap-4">
        <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 shadow-sm">
                <Bot size={20} />
            </div>
        </div>
        
        <div className="flex-grow bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm p-6 relative group">
          {/* We use specific components to override styling exactly how we want it, ensuring H3s pop */}
          <div className="text-slate-600 leading-7 text-sm">
            <ReactMarkdown
              components={{
                h3: ({node, ...props}) => (
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-8 mb-3 first:mt-0" {...props} />
                ),
                p: ({node, ...props}) => (
                  <p className="mb-4 last:mb-0" {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong className="font-bold text-slate-900" {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
                ),
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-emerald-200 bg-emerald-50/30 py-2 px-4 rounded-r-lg my-4 text-slate-700 not-italic" {...props} />
                )
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute -left-1.5 top-0 w-0 h-0 border-t-[10px] border-t-slate-200 border-l-[10px] border-l-transparent" aria-hidden="true"></div>
          <div className="absolute -left-1.5 top-[1px] w-0 h-0 border-t-[9px] border-t-white border-l-[9px] border-l-transparent" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
};