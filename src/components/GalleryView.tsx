import React, { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import AddIdeaModal from './AddIdeaModal';

interface Idea {
  id: number;
  text: string;
}

interface GalleryViewProps {
  darkMode: boolean;
  ideas: Idea[];
  onAddIdea: (text: string) => void;
  onDeleteIdea: (id: number) => void;
  onReorderIdeas: (ideas: Idea[]) => void;
}

export default function GalleryView({ 
  darkMode, 
  ideas, 
  onAddIdea, 
  onDeleteIdea,
  onReorderIdeas 
}: GalleryViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Add new idea button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`aspect-square rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center border-2 border-dashed ${
            darkMode
              ? "border-gray-600 hover:border-gray-500 bg-gray-800/50"
              : "border-gray-300 hover:border-gray-400 bg-white/50"
          }`}
        >
          <Plus
            className={`w-12 h-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </button>

        {/* Ideas */}
        {ideas.map((idea, index) => (
          <div
            key={idea.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`aspect-square rounded-xl shadow-sm hover:shadow-md transition-all cursor-move relative group p-[2px] bg-gradient-to-br from-purple-200 to-pink-200 ${
              draggedIndex === index ? "opacity-50" : ""
            } ${dragOverIndex === index ? "ring-2 ring-purple-500" : ""}`}
          >
            <div
              className="w-full h-full rounded-[10px] relative"
              style={{
                background: darkMode
                  ? "rgba(31, 41, 55, 0.7)"
                  : "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              {/* Drag handle */}
              <div
                className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteIdea(idea.id);
                }}
                className={`absolute top-2 left-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                  darkMode
                    ? "text-gray-400 hover:text-red-400 bg-gray-700/50 hover:bg-gray-700"
                    : "text-gray-500 hover:text-red-500 bg-gray-100/50 hover:bg-gray-200"
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Drag handle */}
              <div
                className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteIdea(idea.id);
                }}
                className={`absolute top-2 left-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
                  darkMode
                    ? "text-gray-400 hover:text-red-400 bg-gray-700/50 hover:bg-gray-700"
                    : "text-gray-500 hover:text-red-500 bg-gray-100/50 hover:bg-gray-200"
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Idea text */}
              <div className="p-4 h-full flex items-center justify-center">
                <p
                  className={`text-sm text-center line-clamp-6 ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {idea.text}
                </p>
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
    </>
  );
}

