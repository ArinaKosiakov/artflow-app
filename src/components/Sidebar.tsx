import React from 'react'
import {
  Palette,
  FolderOpen,
  Video,
  MessageSquare,
  BookOpen,
  Sun,
  Moon,
  LogOut,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setDarkMode: (darkMode: boolean) => void;
  darkMode: boolean;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  userName?: string;
  userProfilePicture?: string;
  appVersion?: string;
}

function Sidebar({
  activeTab,
  setActiveTab,
  setDarkMode,
  darkMode,
  onLogout,
  onOpenProfile,
  userName,
  userProfilePicture,
  appVersion = "1.0.0",
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`w-64 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-r flex flex-col transition-colors`}
    >
      <div
        className={`h-28 flex items-center justify-center border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {t("app.name")}
            </h1>
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("app.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col">
        {/* Navigation Buttons */}
        <div>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "projects"
                ? "bg-purple-50 text-purple-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">{t("sidebar.projects")}</span>
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "content"
                ? "bg-purple-50 text-purple-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">{t("sidebar.contentCalendar")}</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "ai"
                ? "bg-purple-50 text-purple-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{t("sidebar.aiAssistant")}</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "gallery"
                ? "bg-purple-50 text-purple-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">{t("sidebar.ideasPrompts")}</span>
          </button>
        </div>

        {/* Profile Section */}
        {onOpenProfile && (
          <div
            className={`mt-2 mt-4 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <button
              onClick={onOpenProfile}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                {userProfilePicture ? (
                  <img
                    src={userProfilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div
                  className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {t("sidebar.profile")}
                </div>
                <div
                  className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {userName || t("sidebar.profile")}
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Bottom Section: Dark Mode, Logout, Version */}
        <div
          className={`mt-auto pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} space-y-2`}
        >
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="font-medium">
              {darkMode ? t("sidebar.lightMode") : t("sidebar.darkMode")}
            </span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                darkMode
                  ? "text-red-400 hover:bg-gray-700"
                  : "text-red-500 hover:bg-gray-50"
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t("sidebar.logout")}</span>
            </button>
          )}
          {/* Version */}
          <div
            className={`px-4 py-2 text-center ${darkMode ? "text-gray-500" : "text-gray-400"} text-xs`}
          >
            {t("sidebar.version")} {appVersion}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar