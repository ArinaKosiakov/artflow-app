import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProjectsView from "./pages/ProjectsView";
import ContentView from "./pages/ContentView";
import GalleryView from "./components/GalleryView";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfileModal from "./components/ProfileModal";
import { Prompt } from "./types/types";
import { Toaster, toaster } from "./components/ui/toaster";
import {
  getStoredToken,
  authMe,
  getSettings,
  getProjects,
  getContentIdeas,
  getPrompts,
} from "./services/api";
import type { Projects } from "./services/api";
import { useAppHandlers, type ContentIdea } from "./hooks/useAppHandlers";
import { getProfilePictureUrl } from "./lib/profilePictures";

// App version from package.json
const APP_VERSION = "1.0.0";

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("projects");

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return getStoredToken() !== null;
  });
  const [authPage, setAuthPage] = useState<"login" | "register">("login");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    profilePicture: null as string | null,
  });
  const [settings, setSettings] = useState({
    darkMode: false,
    language: "en",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authMe();
        if (user) {
          setUserInfo({
            email: user.email,
            name: user.name || "",
            profilePicture: user.profilePicture || null,
          });
          setIsAuthenticated(true);
        } else {
          setUserInfo({
            email: "",
            name: "",
            profilePicture: null,
          });
          setIsAuthenticated(false);
          setAuthPage("login");
        }
      } catch (e) {
        toaster.create({
          description: "failed to load user",
          type: "error",
        });
      }
    };
    const loadSettings = async () => {
      if (!isAuthenticated) return;
      try {
        const settings = await getSettings();
        if (settings) {
          setSettings({
            darkMode: settings.darkMode,
            language: settings.language,
          });
        } else {
          setSettings({ darkMode: false, language: "en" });
        }
      } catch (error) {
        toaster.create({
          description: "Failed to load settings",
          type: "error",
        });
      }
    };
    const loadContentIdeas = async () => {
      if (!isAuthenticated) return;
      try {
        const list = await getContentIdeas();
        setContentIdeas(Array.isArray(list) ? list : []);
      } catch (e) {
        toaster.create({
          description: "Failed to load content ideas",
          type: "error",
        });
      }
    };
    const loadPrompts = async () => {
      if (!isAuthenticated) return;
      try {
        const list = await getPrompts();
        setPrompts(Array.isArray(list) ? list : []);
      } catch (e) {
        toaster.create({
          description: "Failed to load prompts",
          type: "error",
        });
      }
    };

    loadUser();
    loadSettings();
    loadContentIdeas();
    loadPrompts();
  }, []);

  // Reload projects when user becomes authenticated (e.g. after login)
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadProjects = async () => {
      setProjectsLoading(true);
      setContentLoading(true);
      setPromptsLoading(true);
      setSettingsLoading(true);
      try {
        const list = await getProjects();
        setProjects(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Failed to load projects:", e);
        toaster.create({
          description: "Failed to load projects",
          type: "error",
        });
      } finally {
        setProjectsLoading(false);
        setContentLoading(false);
        setPromptsLoading(false);
        setSettingsLoading(false);
      }
    };
    loadProjects();
  }, [isAuthenticated]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);

  const [projectsLoading, setProjectsLoading] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Projects | null>(null);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentIdea | null>(
    null,
  );
  const [promptsModalOpen, setPromptsModalOpen] = useState(false);
  const [editingPrompts, setEditingPrompts] = useState<Prompt | null>(null);
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  const ideas = (prompts ?? []).map((p) => ({ id: p.id, text: p.text }));

  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([]);

  const [chatInput, setChatInput] = useState("");

  const handlers = useAppHandlers({
    setUserInfo,
    setIsAuthenticated,
    setAuthPage,
    projects,
    setProjects,
    setIsSavingProject,
    setProjectModalOpen,
    setEditingProject,
    contentIdeas,
    setContentIdeas,
    setContentModalOpen,
    setEditingContent,
    prompts,
    setPrompts,
    setPromptsModalOpen,
    setEditingPrompts,
    settings,
    setSettings,
    userInfo,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    welcomeMessage: t("ai.welcomeMessage"),
    setLoginError,
    setRegisterError,
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(settings.darkMode));
  }, [settings.darkMode]);

  useEffect(() => {
    setChatMessages([{ role: "assistant", text: t("ai.welcomeMessage") }]);
  }, [i18n.language, t]);

  const darkMode = settings.darkMode;

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {authPage === "login" ? (
          <LoginPage
            darkMode={darkMode}
            onLogin={handlers.handleLogin}
            onSwitchToRegister={() => {
              setAuthPage("register");
              setLoginError(null);
            }}
            serverError={loginError}
            onClearError={() => setLoginError(null)}
          />
        ) : (
          <RegisterPage
            darkMode={darkMode}
            onRegister={handlers.handleRegister}
            onSwitchToLogin={() => {
              setAuthPage("login");
              setRegisterError(null);
            }}
            serverError={registerError}
            onClearError={() => setRegisterError(null)}
          />
        )}
        <Toaster />
      </>
    );
  }

  return (
    <div
      className={`h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"} flex overflow-hidden transition-colors`}
    >
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setDarkMode={handlers.setDarkMode}
        darkMode={darkMode}
        onLogout={handlers.handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userName={userInfo.name}
        userProfilePicture={
          getProfilePictureUrl(userInfo.profilePicture) ?? undefined
        }
        appVersion={APP_VERSION}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTab={activeTab}
          darkMode={darkMode}
          isProjectModalOpen={projectModalOpen}
          editingProject={editingProject}
          onOpenProjectModal={() => handlers.openProjectModal(null)}
          onCloseProjectModal={() => {
            setProjectModalOpen(false);
            setEditingProject(null);
          }}
          onSaveProject={handlers.saveProject}
          isContentModalOpen={contentModalOpen}
          editingContent={editingContent}
          onOpenContentModal={() => handlers.openContentModal(null)}
          onCloseContentModal={() => {
            setContentModalOpen(false);
            setEditingContent(null);
          }}
          onSaveContent={handlers.saveContent}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "projects" && (
            <ProjectsView
              projects={projects}
              darkMode={darkMode}
              projectsLoading={projectsLoading}
              isSavingProject={isSavingProject}
              onToggleStep={handlers.toggleStep}
              onDeleteProject={handlers.deleteProject}
              onEditProject={handlers.openProjectModal}
            />
          )}

          {activeTab === "content" && (
            <ContentView
              onDeleteContent={handlers.deleteContent}
              contentIdeas={contentIdeas}
              darkMode={darkMode}
              onToggleContent={handlers.toggleContent}
              onEditContent={handlers.openContentModal}
              onSaveContent={handlers.saveContent}
              isSavingContent={isSavingContent}
              contentLoading={contentLoading}
            />
          )}

          {/* {activeTab === "ai" && (
            <AiAssistantView
              chatMessages={chatMessages}
              chatInput={chatInput}
              darkMode={darkMode}
              onInputChange={setChatInput}
              onSendMessage={addChatMessage}
            />
          )} */}

          {activeTab === "gallery" && (
            <GalleryView
              loading={promptsLoading}
              darkMode={darkMode}
              ideas={ideas}
              onAddIdea={handlers.addIdea}
              onEditIdea={handlers.editIdea}
              onDeleteIdea={handlers.deleteIdea}
              onReorderIdeas={handlers.reorderIdeas}
            />
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        loading={settingsLoading}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        darkMode={darkMode}
        currentName={userInfo.name}
        currentEmail={userInfo.email}
        currentProfilePicture={userInfo.profilePicture || undefined}
        onUpdateName={handlers.handleUpdateName}
        onUpdateEmail={handlers.handleUpdateEmail}
        onUpdatePassword={handlers.handleUpdatePassword}
        onUpdateProfilePicture={handlers.handleUpdateProfilePicture}
        onRemoveProfilePicture={handlers.handleRemoveProfilePicture}
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
