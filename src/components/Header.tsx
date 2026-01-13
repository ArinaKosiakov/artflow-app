import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AddProjectModal from './AddProjectModal';
import AddContentModal from './AddContentModal';

interface Step {
  id: number;
  text: string;
  done: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string;
  steps: Step[];
  status: string;
}

interface Content {
  id: number;
  title: string;
  platform: string;
  deadline: string;
  done: boolean;
  details?: string;
}

interface HeaderProps {
  activeTab: string;
  darkMode: boolean;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onAddContent: (content: Omit<Content, 'id'>) => void;
}

export default function Header({ activeTab, darkMode, onAddProject, onAddContent }: HeaderProps) {
  const { t } = useTranslation();
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);

    const getTitle = () => {
    switch (activeTab) {
      case 'projects': return t('header.artProjects');
      case 'content': return t('header.contentCalendar');
      case 'ai': return t('header.aiAssistant');
      case 'gallery': return t('header.ideasPrompts');
      default: return '';
    }
  };

  const getDescription = () => {
    switch (activeTab) {
      case 'projects': return t('header.projectsDescription');
      case 'content': return t('header.contentDescription');
      case 'ai': return t('header.aiDescription');
      case 'gallery': return t('header.galleryDescription');
      default: return '';
    }
  };

  const createNewProject = () => {
    setShowNewProject(true);
  };

  const addNewContent = () => {
    setShowNewContent(true);
  };

  return (
    <>
      <div className={`h-28 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 transition-colors flex items-center`}>
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {getTitle()}
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
              {getDescription()}
            </p>
          </div>
          {activeTab === 'projects' && (
            <button 
              onClick={() => createNewProject()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow font-medium"
            >
              <Plus className="w-5 h-5" />
              {t('header.newProject')}
            </button>
          )}
          {activeTab === 'content' && (
            <button 
              onClick={() => addNewContent()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow font-medium"
            >
              <Plus className="w-5 h-5" />
              {t('header.newContent')}
            </button>
          )}
        </div>
      </div>
      <AddProjectModal
        isOpen={showNewProject}
        onClose={() => setShowNewProject(false)}
        onSave={onAddProject}
        darkMode={darkMode}
      />
      <AddContentModal
        isOpen={showNewContent}
        onClose={() => setShowNewContent(false)}
        onSave={onAddContent}
        darkMode={darkMode}
      />
    </>
  );
}

