import React from 'react';
import { Calendar, Trash2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

interface ProjectCardProps {
  project: Project;
  darkMode: boolean;
  onToggleStep: (projectId: number, stepId: number) => void;
  onDelete: (id: number) => void;
}

export default function ProjectCard({ project, darkMode, onToggleStep, onDelete }: ProjectCardProps) {
  const { t } = useTranslation();
  const completedSteps = project.steps.filter(s => s.done).length;
  const progress = (completedSteps / project.steps.length) * 100;
  
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-md transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{project.title}</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>{project.description}</p>
          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Calendar className="w-4 h-4" />
            <span>{t('projects.due')} {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </div>
        <button onClick={() => onDelete(project.id)} className={`${darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors`}>
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('projects.progress')}</span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{completedSteps}/{project.steps.length}</span>
        </div>
        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        {project.steps.map((step) => (
          <div key={step.id} className={`flex items-center gap-3 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
            <button 
              onClick={() => onToggleStep(project.id, step.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                step.done 
                  ? 'bg-purple-500 border-purple-500' 
                  : `${darkMode ? 'border-gray-600 hover:border-purple-400' : 'border-gray-300 hover:border-purple-400'}`
              }`}
            >
              {step.done && <Check className="w-3 h-3 text-white" />}
            </button>
            <span className={`text-sm ${step.done ? `line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}` : `${darkMode ? 'text-gray-300' : 'text-gray-700'}`}`}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

