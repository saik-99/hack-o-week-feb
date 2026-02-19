import React, { useState } from 'react';
import { ChatMessage, LoadingState } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ChatInterface } from './components/ChatInterface';
import { generateCalendarResponse } from './services/geminiService';

const App: React.FC = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);

  const handleImageSelected = (base64: string) => {
    setImageBase64(base64);
    // Add initial greeting from system
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        text: 'I have analyzed the calendar. I can help you find dates, exam schedules for specific semesters (e.g., Sem 2, 4, 6, 8), and holiday lists. What would you like to know?',
        timestamp: new Date(),
        entities: { dates: [], semesters: [], courses: [], events: [] }
      }
    ]);
  };

  const handleReset = () => {
    setImageBase64(null);
    setMessages([]);
    setLoadingState(LoadingState.IDLE);
  };

  const handleSendMessage = async (text: string) => {
    if (!imageBase64) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoadingState(LoadingState.RESPONDING);

    try {
      // Call Gemini API
      const response = await generateCalendarResponse(
        imageBase64, 
        messages.concat(userMsg), // Pass full history including new message
        text
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        entities: response.entities
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error while analyzing the calendar. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              A
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">AcademiCal AI</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {!imageBase64 ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
            <div className="max-w-2xl w-full text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Your Intelligent <span className="text-brand-600">Calendar Assistant</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Upload your academic calendar (image/screenshot). Our AI will parse the dates, exams, and semesters, allowing you to ask questions naturally.
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} />
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Entity Recognition</h3>
                <p className="text-sm text-slate-500">Automatically detects semesters, course codes, and exam types from your questions.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart Scheduling</h3>
                <p className="text-sm text-slate-500">Ask "When is the Sem 4 MSE?" and get precise dates instantly extracted from the grid.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Contextual Chat</h3>
                <p className="text-sm text-slate-500">The AI understands the specific layout of academic calendars, including headers and merged cells.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
            {/* Image Preview Panel */}
            <div className="hidden lg:flex flex-col w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Calendar Source</h3>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
              </div>
              <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-auto p-4 relative">
                 {/* Simple Pan/Zoom simulation via container */}
                 <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={`data:image/png;base64,${imageBase64}`} 
                      alt="Uploaded Calendar" 
                      className="max-w-full max-h-full object-contain rounded shadow-lg"
                    />
                 </div>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="w-full lg:w-1/2 h-full">
              <ChatInterface 
                messages={messages} 
                loadingState={loadingState}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;