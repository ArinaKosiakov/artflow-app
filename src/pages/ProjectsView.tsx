import React from 'react';
import { FolderOpen } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { useTranslation } from 'react-i18next';

// Project/Step types support string ids from API (see BACKEND_PLAN 3.3)
interface Step {
  id: string;
  text: string;
  done: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
  steps: Step[];
  status: string;
}

interface ProjectsViewProps {
  projects: Project[];
  darkMode: boolean;
  onToggleStep: (projectId: string, stepId: string) => void;
  onDeleteProject: (id: string) => void;
  onEditProject: (project: Project) => void;
}

export default function ProjectsView({
  projects,
  darkMode,
  onToggleStep,
  onDeleteProject,
  onEditProject,
}: ProjectsViewProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          darkMode={darkMode}
          onToggleStep={onToggleStep}
          onDelete={onDeleteProject}
          onEdit={onEditProject}
        />
      ))}
      {projects.length === 0 && (
        <div className="col-span-2 text-center py-20">
          <FolderOpen
            className={`w-16 h-16 ${darkMode ? "text-gray-600" : "text-gray-300"} mx-auto mb-4`}
          />
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            {t("projects.noProjects")}
          </p>
        </div>
      )}
    </div>
  );
}

