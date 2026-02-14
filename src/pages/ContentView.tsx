import React from 'react';
import { useTranslation } from "react-i18next";
import { Calendar, Youtube, Video, Check, Trash2, Pencil } from "lucide-react";
import { ContentIdea } from "../hooks/useAppHandlers";

interface Content {
  id: string;
  title: string;
  platform?: string;
  deadline: string;
  done: boolean;
  details: string;
  order: number;
}

interface ContentViewProps {
  contentIdeas: Content[];
  darkMode: boolean;
  onToggleContent: (id: string) => void;
  onDeleteContent: (id: string) => void;
  onEditContent: (content: Content) => void;
  onSaveContent: (content: Omit<ContentIdea, "id">, id?: string) => void;
}

export default function ContentView({
  contentIdeas,
  darkMode,
  onToggleContent,
  onDeleteContent,
  onEditContent,
  onSaveContent,
}: ContentViewProps) {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl">
      <div className="space-y-4">
        {contentIdeas.map((content) => (
          <div
            key={content.id}
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-6 hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => onToggleContent(content.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    content.done
                      ? "bg-purple-500 border-purple-500"
                      : `${darkMode ? "border-gray-600 hover:border-purple-400" : "border-gray-300 hover:border-purple-400"}`
                  }`}
                >
                  {content.done && <Check className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${content.done ? `line-through ${darkMode ? "text-gray-500" : "text-gray-400"}` : `${darkMode ? "text-white" : "text-gray-800"}`}`}
                  >
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div
                      className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {content.platform === "youtube" ? (
                        <Youtube className="w-4 h-4" />
                      ) : (
                        <Video className="w-4 h-4" />
                      )}
                      <span className="capitalize">{content.platform}</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(content.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditContent(content)}
                    className={`${darkMode ? "text-gray-500 hover:text-purple-400" : "text-gray-400 hover:text-purple-500"} transition-colors`}
                    title={t("common.edit")}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteContent(content.id)}
                    className={`${darkMode ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"} transition-colors`}
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
    </div>
  );
}

