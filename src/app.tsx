import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProjectsView from "./pages/ProjectsView";
import ContentView from "./pages/ContentView";
import AiAssistantView from "./pages/AiAssistantView";
import GalleryView from "./components/GalleryView";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfileModal from "./components/ProfileModal";

// App version from package.json
const APP_VERSION = "1.0.0";

export default function App() {
  const { t } = useTranslation();
  //1-projects 2-content 3-ai 4-prompts
  const [activeTab, setActiveTab] = useState("projects");

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is authenticated (for now just check localStorage)
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  // User profile state
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("userEmail") || "";
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(
    () => {
      return localStorage.getItem("userProfilePicture") || null;
    }
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load dark mode from localStorage on initial render
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Abstract Series",
      description: "Exploration of geometric forms",
      deadline: "2025-11-01",
      steps: [
        { id: 1, text: "Sketch concepts", done: true },
        { id: 2, text: "Color palette selection", done: true },
        { id: 3, text: "Create 5 pieces", done: false },
      ],
      status: "in-progress",
    },
  ]);

  const [contentIdeas, setContentIdeas] = useState([
    {
      id: 1,
      title: "Process video - Abstract Series",
      platform: "youtube",
      deadline: "2025-10-20",
      done: false,
    },
    {
      id: 2,
      title: "Time-lapse reel",
      platform: "tiktok",
      deadline: "2025-10-18",
      done: false,
    },
  ]);

  const [prompts, setPrompts] = useState([
    {
      id: 1,
      title: "Cyberpunk Cityscape",
      text: "Neon-lit futuristic city with flying cars, rain-slicked streets, holographic advertisements, dramatic perspective, highly detailed, digital art",
      saved: "2025-10-10",
    },
    {
      id: 2,
      title: "Forest Spirit",
      text: "Ethereal forest guardian made of leaves and light, bioluminescent plants, mystical atmosphere, fantasy art, soft color palette",
      saved: "2025-10-12",
    },
  ]);

  // Convert prompts to ideas format (only id and text)
  const ideas = prompts.map((p) => ({ id: p.id, text: p.text }));

  const [quickNotes, setQuickNotes] = useState([
    {
      id: 1,
      text: "Draw a series of vintage botanical illustrations",
      date: "2025-10-14",
    },
    { id: 2, text: "Experiment with watercolor portraits", date: "2025-10-15" },
  ]);

  const [newNote, setNewNote] = useState("");

  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([]);

  const [chatInput, setChatInput] = useState("");

  // Save dark mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    setChatMessages([
      {
        role: "assistant",
        text: t("ai.welcomeMessage"),
      },
    ]);
  }, [i18n.language, t]);

  const addChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([
        ...chatMessages,
        { role: "user", text: chatInput },
        {
          role: "assistant",
          text: 'Here\'s a prompt idea based on your request: "A vibrant abstract composition featuring flowing geometric shapes, bold color gradients from deep blues to warm oranges, with dynamic movement and energy, digital art, high detail."',
        },
      ]);
      setChatInput("");
    }
  };

  const toggleStep = (projectId: number, stepId: number) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              steps: p.steps.map((s) =>
                s.id === stepId ? { ...s, done: !s.done } : s
              ),
            }
          : p
      )
    );
  };

  const addProject = (project: Omit<(typeof projects)[0], "id">) => {
    const newProject = {
      ...project,
      id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
    };
    setProjects([...projects, newProject]);
  };

  const addContent = (content: Omit<(typeof contentIdeas)[0], "id">) => {
    const newContent = {
      ...content,
      id:
        contentIdeas.length > 0
          ? Math.max(...contentIdeas.map((c) => c.id)) + 1
          : 1,
    };
    setContentIdeas([...contentIdeas, newContent]);
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const toggleContent = (id: number) => {
    setContentIdeas(
      contentIdeas.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const addIdea = (text: string) => {
    const newPrompt = {
      id: prompts.length > 0 ? Math.max(...prompts.map((p) => p.id)) + 1 : 1,
      title: "",
      text: text,
      saved: new Date().toISOString().split("T")[0],
    };
    setPrompts([...prompts, newPrompt]);
  };

  const deleteIdea = (id: number) => {
    setPrompts(prompts.filter((p) => p.id !== id));
  };

  const reorderIdeas = (
    reorderedIdeas: Array<{ id: number; text: string }>
  ) => {
    // Map the reordered ideas back to prompts, preserving other properties
    const reorderedPrompts = reorderedIdeas.map((idea) => {
      const originalPrompt = prompts.find((p) => p.id === idea.id);
      return (
        originalPrompt || {
          id: idea.id,
          title: "",
          text: idea.text,
          saved: new Date().toISOString().split("T")[0],
        }
      );
    });
    setPrompts(reorderedPrompts);
  };

  // Authentication handlers (mock for now - will be replaced with API calls)
  const handleLogin = async (email: string, password: string) => {
    // TODO: Replace with actual API call
    console.log("Login attempt:", { email, password });

    // Mock authentication - for now just set authenticated
    // In production, this will call the backend API
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    // TODO: Replace with actual API call
    console.log("Register attempt:", { name, email, password });

    // Mock registration - for now just set authenticated
    // In production, this will call the backend API
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    setUserEmail(email);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfilePicture");
    setIsAuthenticated(false);
    setUserEmail("");
    setUserName("");
    setUserProfilePicture(null);
    setAuthPage("login");
  };

  // Profile handlers (mock for now - will be replaced with API calls)
  const handleUpdateName = async (newName: string) => {
    // TODO: Replace with actual API call
    console.log("Update name:", newName);
    localStorage.setItem("userName", newName);
    setUserName(newName);
  };

  const handleUpdateEmail = async (newEmail: string) => {
    // TODO: Replace with actual API call
    console.log("Update email:", newEmail);
    localStorage.setItem("userEmail", newEmail);
    setUserEmail(newEmail);
  };

  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    // TODO: Replace with actual API call
    console.log("Update password:", { currentPassword, newPassword });
    // In production, this will call the backend API
  };

  const handleUpdateProfilePicture = async (file: File) => {
    // TODO: Replace with actual API call
    console.log("Update profile picture:", file.name);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const pictureUrl = reader.result as string;
      localStorage.setItem("userProfilePicture", pictureUrl);
      setUserProfilePicture(pictureUrl);
    };
    reader.readAsDataURL(file);

    // In production, upload to server and get URL
  };

  const handleRemoveProfilePicture = async () => {
    // TODO: Replace with actual API call
    console.log("Remove profile picture");
    localStorage.removeItem("userProfilePicture");
    setUserProfilePicture(null);
  };

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {authPage === "login" ? (
          <LoginPage
            darkMode={darkMode}
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthPage("register")}
          />
        ) : (
          <RegisterPage
            darkMode={darkMode}
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthPage("login")}
          />
        )}
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
        setDarkMode={setDarkMode}
        darkMode={darkMode}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userName={userName}
        userProfilePicture={userProfilePicture || undefined}
        appVersion={APP_VERSION}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTab={activeTab}
          darkMode={darkMode}
          onAddProject={addProject}
          onAddContent={addContent}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "projects" && (
            <ProjectsView
              projects={projects}
              darkMode={darkMode}
              onToggleStep={toggleStep}
              onDeleteProject={deleteProject}
            />
          )}

          {activeTab === "content" && (
            <ContentView
              contentIdeas={contentIdeas}
              darkMode={darkMode}
              onToggleContent={toggleContent}
            />
          )}

          {activeTab === "ai" && (
            <AiAssistantView
              chatMessages={chatMessages}
              chatInput={chatInput}
              darkMode={darkMode}
              onInputChange={setChatInput}
              onSendMessage={addChatMessage}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryView
              darkMode={darkMode}
              ideas={ideas}
              onAddIdea={addIdea}
              onDeleteIdea={deleteIdea}
              onReorderIdeas={reorderIdeas}
            />
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        darkMode={darkMode}
        currentName={userName}
        currentEmail={userEmail}
        currentProfilePicture={userProfilePicture || undefined}
        onUpdateName={handleUpdateName}
        onUpdateEmail={handleUpdateEmail}
        onUpdatePassword={handleUpdatePassword}
        onUpdateProfilePicture={handleUpdateProfilePicture}
        onRemoveProfilePicture={handleRemoveProfilePicture}
      />
    </div>
  );
}
