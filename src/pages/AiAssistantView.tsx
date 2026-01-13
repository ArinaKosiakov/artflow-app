import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAssistantViewProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  darkMode: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function AiAssistantView({ 
  chatMessages, 
  chatInput, 
  darkMode, 
  onInputChange, 
  onSendMessage 
}: AiAssistantViewProps) {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className={`flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border mb-4 overflow-hidden flex flex-col`}>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl px-6 py-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'}`
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
              placeholder={t('ai.placeholder')}
              className={`flex-1 px-4 py-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <button 
              onClick={onSendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-shadow font-medium"
            >
              {t('ai.send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

