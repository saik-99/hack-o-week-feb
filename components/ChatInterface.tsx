import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LoadingState } from '../types';
import { EntityChips } from './EntityChips';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  loadingState: LoadingState;
  onSendMessage: (text: string) => void;
  onReset: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  loadingState, 
  onSendMessage,
  onReset
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  useEffect(() => {
    if (loadingState === LoadingState.IDLE) {
      inputRef.current?.focus();
    }
  }, [loadingState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && loadingState === LoadingState.IDLE) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Calendar Assistant
          </h2>
          <p className="text-xs text-slate-500">Ask about dates, exams, and semesters</p>
        </div>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="text-center py-20 opacity-60">
            <div className="bg-white p-4 rounded-xl inline-block shadow-sm mb-4">
               <svg className="w-10 h-10 text-brand-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
               </svg>
            </div>
            <p className="text-slate-500 font-medium">No messages yet.</p>
            <p className="text-slate-400 text-sm mt-1">Try asking: "When is the Sem 4 MSE?"</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              } ${msg.isError ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
            
            {/* Entity Chips Display (Only for AI responses) */}
            {msg.role === 'model' && msg.entities && (
               <div className="ml-1 mt-1 max-w-[85%]">
                 <div className="flex items-center gap-1 mb-1">
                   <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recognized Entities</span>
                   <div className="h-px bg-slate-200 flex-grow"></div>
                 </div>
                 <EntityChips entities={msg.entities} />
               </div>
            )}
            
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {loadingState !== LoadingState.IDLE && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center space-x-2">
               <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about the calendar..."
            className="flex-1 pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-50"
            disabled={loadingState !== LoadingState.IDLE}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loadingState !== LoadingState.IDLE}
            className="absolute right-2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};