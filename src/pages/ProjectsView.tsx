import React, { useState, useMemo } from "react";
import { FolderOpen, Search, X, Calendar } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { useTranslation } from "react-i18next";
import CustomSpinner from "../components/CustomSpinner";

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
  projectsLoading?: boolean;
  isSavingProject?: boolean;
  onToggleStep: (projectId: string, stepId: string) => void;
  onDeleteProject: (id: string) => void;
  onEditProject: (project: Project) => void;
}

export default function ProjectsView({
  projects,
  darkMode,
  projectsLoading = false,
  isSavingProject = false,
  onToggleStep,
  onDeleteProject,
  onEditProject,
}: ProjectsViewProps) {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesName = project.title
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      const deadline = project.deadline ? new Date(project.deadline) : null;
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      const matchesFrom = !from || (deadline && deadline >= from);
      const matchesTo = !to || (deadline && deadline <= to);

      return matchesName && matchesFrom && matchesTo;
    });
  }, [projects, nameFilter, dateFrom, dateTo]);

  const hasActiveFilters = nameFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setNameFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const inputBase = `w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400"
  }`;

  return (
    <div className="relative">
      {(projectsLoading || isSavingProject) && (
        <CustomSpinner darkMode={darkMode} />
      )}

      {/* Filter Bar */}
      <div
        className={`mb-6 p-4 rounded-xl border ${
          darkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Name filter */}
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder={t("common.filterByName") ?? "Filter by name…"}
              className={`${inputBase} pl-9`}
            />
          </div>

          {/* Date from */}
          <div className="relative sm:w-44">
            <Calendar
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`${inputBase} pl-9`}
              title={t("projects.deadlineFrom") ?? "Deadline from"}
            />
          </div>

          {/* Date to */}
          <div className="relative sm:w-44">
            <Calendar
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`${inputBase} pl-9`}
              title={t("projects.deadlineTo") ?? "Deadline to"}
            />
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-600"
              }`}
            >
              <X className="w-4 h-4" />
              {t("common.clear") ?? "Clear"}
            </button>
          )}
        </div>

        {/* Results count */}
        {hasActiveFilters && (
          <p
            className={`mt-2 text-xs ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {filteredProjects.length} of {projects.length}{" "}
            {t("projects.results") ?? "projects"}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            darkMode={darkMode}
            onToggleStep={onToggleStep}
            onDelete={onDeleteProject}
            onEdit={onEditProject}
          />
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-2 text-center py-20">
            <FolderOpen
              className={`w-16 h-16 ${
                darkMode ? "text-gray-600" : "text-gray-300"
              } mx-auto mb-4`}
            />
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              {hasActiveFilters
                ? (t("projects.noResults") ?? "No projects match your filters.")
                : t("projects.noProjects")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
