import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Content {
  id: number;
  title: string;
  platform: string;
  deadline: string;
  done: boolean;
  details?: string;
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: Omit<Content, 'id'>) => void;
  darkMode: boolean;
}

export default function AddContentModal({ isOpen, onClose, onSave, darkMode }: AddContentModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [deadline, setDeadline] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        platform: platform,
        deadline: deadline || new Date().toISOString().split('T')[0],
        done: false,
        details: details.trim(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setPlatform('youtube');
    setDeadline('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('content.addContent.title')}
          </h2>
          <button
            onClick={handleClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('content.addContent.contentTitle')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder={t('content.addContent.contentTitle')}
            />
          </div>

          {/* Platform and Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('content.addContent.platform')}
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="youtube">{t('content.addContent.platformOptions.youtube')}</option>
                <option value="tiktok">{t('content.addContent.platformOptions.tiktok')}</option>
                <option value="instagram">{t('content.addContent.platformOptions.instagram')}</option>
                <option value="twitter">{t('content.addContent.platformOptions.twitter')}</option>
                <option value="facebook">{t('content.addContent.platformOptions.facebook')}</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('content.addContent.deadline')}
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('content.addContent.details')}
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
              placeholder={t('content.addContent.detailsPlaceholder')}
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
            {t('content.addContent.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('content.addContent.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
