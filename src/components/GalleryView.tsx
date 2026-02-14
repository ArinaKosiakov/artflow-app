import React, { useState } from 'react';
import { Plus, Trash2, Pencil, GripVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import AddIdeaModal from './AddIdeaModal';
import { Prompt } from "../types/types";

interface Idea {
  id: string;
  text: string;
}

interface GalleryViewProps {
  darkMode: boolean;
  ideas: Idea[];
  onAddIdea: (text: string) => void;
  onEditIdea?: (id: string, text: string) => void;
  onDeleteIdea: (id: string) => void;
  onReorderIdeas: (ideas: Idea[]) => void;
}

export default function GalleryView({
  darkMode,
  ideas,
  onAddIdea,
  onEditIdea,
  onDeleteIdea,
  onReorderIdeas,
}: GalleryViewProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newIdeas = [...ideas];
    const [removed] = newIdeas.splice(draggedIndex, 1);
    newIdeas.splice(dropIndex, 0, removed);
    onReorderIdeas(newIdeas);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const openEditModal = (idea: Idea) => {
    setEditingIdea(idea);
  };

  const closeEditModal = () => {
    setEditingIdea(null);
  };

  const handleEditSave = (text: string) => {
    if (editingIdea && text.trim()) {
      onEditIdea?.(editingIdea.id, text.trim());
      closeEditModal();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add new idea button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`rounded-xl shadow-sm border-2 border-dashed p-6 hover:shadow-md transition-all cursor-pointer flex items-center justify-center min-h-[140px] ${
            darkMode
              ? "border-gray-600 hover:border-gray-500 bg-gray-800 border-gray-700"
              : "border-gray-300 hover:border-gray-400 bg-white border-gray-200"
          }`}
        >
          <Plus
            className={`w-10 h-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </button>

        {/* Idea cards - same style as ProjectCard */}
        {ideas.map((idea, index) => (
          <div
            key={idea.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`cursor-move ${draggedIndex === index ? "opacity-50" : ""} ${
              dragOverIndex === index ? "ring-2 ring-purple-500 rounded-xl" : ""
            }`}
          >
            <div
              className={`${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-xl shadow-sm border p-6 hover:shadow-md transition-all relative group`}
            >
              {/* Top row: message + drag handle + edit/delete (like ProjectCard header) */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0 pr-2">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    } whitespace-pre-wrap break-words`}
                  >
                    {idea.text}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title={t("common.drag")}
                  >
                    <GripVertical className="w-4 h-4" />
                  </span>
                  {onEditIdea && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(idea);
                      }}
                      className={`${
                        darkMode
                          ? "text-gray-500 hover:text-purple-400"
                          : "text-gray-400 hover:text-purple-500"
                      } transition-colors`}
                      title={t("common.edit")}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteIdea(idea.id);
                    }}
                    className={`${
                      darkMode
                        ? "text-gray-500 hover:text-red-400"
                        : "text-gray-400 hover:text-red-500"
                    } transition-colors`}
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddIdea}
        darkMode={darkMode}
      />

      <AddIdeaModal
        isOpen={!!editingIdea}
        onClose={closeEditModal}
        onSave={handleEditSave}
        darkMode={darkMode}
        initialText={editingIdea?.text}
        titleKey="gallery.editIdea.title"
      />
    </>
  );
}
