import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  darkMode: boolean;
}

export default function AddIdeaModal({ isOpen, onClose, onSave, darkMode }: AddIdeaModalProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('gallery.addIdea.title')}
          </h2>
          <button
            onClick={handleClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('gallery.addIdea.text')} *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
              placeholder={t('gallery.addIdea.placeholder')}
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 flex justify-end gap-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-600 text-white hover:bg-gray-500' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('gallery.addIdea.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('gallery.addIdea.save')}
          </button>
        </div>
      </div>
    </div>
  );
}


