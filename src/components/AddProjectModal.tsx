import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
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

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  darkMode: boolean;
}

export default function AddProjectModal({ isOpen, onClose, onSave, darkMode }: AddProjectModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('not-started');
  const [steps, setSteps] = useState<Array<{ id: number; text: string; done: boolean }>>([]);
  const [stepText, setStepText] = useState('');

  if (!isOpen) return null;

  const handleAddStep = () => {
    if (stepText.trim()) {
      setSteps([...steps, { id: Date.now(), text: stepText, done: false }]);
      setStepText('');
    }
  };

  const handleRemoveStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        deadline: deadline || new Date().toISOString().split('T')[0],
        steps: steps,
        status: status,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setStatus('not-started');
    setSteps([]);
    setStepText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('projects.addProject.title')}
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
              {t('projects.addProject.projectTitle')} *
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
              placeholder={t('projects.addProject.projectTitle')}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('projects.addProject.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
              placeholder={t('projects.addProject.description')}
            />
          </div>

          {/* Deadline and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('projects.addProject.deadline')}
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
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('projects.addProject.status')}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="not-started">{t('projects.addProject.statusOptions.notStarted')}</option>
                <option value="in-progress">{t('projects.addProject.statusOptions.inProgress')}</option>
                <option value="completed">{t('projects.addProject.statusOptions.completed')}</option>
              </select>
            </div>
          </div>

          {/* Steps */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('projects.addProject.steps')}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={stepText}
                onChange={(e) => setStepText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder={t('projects.addProject.stepPlaceholder')}
              />
              <button
                onClick={handleAddStep}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('projects.addProject.addStep')}
              </button>
            </div>
            {steps.length > 0 && (
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {step.text}
                    </span>
                    <button
                      onClick={() => handleRemoveStep(step.id)}
                      className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            {t('projects.addProject.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('projects.addProject.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
