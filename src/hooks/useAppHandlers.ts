import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import { Prompt } from "../types/types";
import {
  login,
  register,
  setStoredToken,
  clearStoredToken,
  updateProfile,
  updatePassword,
  createProject,
  updateProject,
  deleteProjectById,
  toggleProjectStep,
  updateSettings,
  deleteContentIdea,
  updateContentIdea,
  createContentIdea,
  toggleContentIdea,
  updatePrompts,
  createPrompts,
  deletePrompt,
  reorderPrompts,
} from "../services/api";
import type { Projects, Platform } from "../services/api";
import { toaster } from "../components/ui/toaster";

export interface ContentIdea {
  id: string;
  title: string;
  platform: Platform;
  deadline: string;
  done: boolean;
  details: string;
  order: number;
}

export interface UserInfo {
  email: string;
  name: string;
  profilePicture: string | null;
}

export interface AppSettings {
  darkMode: boolean;
  language: string;
}

export interface UseAppHandlersParams {
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthPage: React.Dispatch<React.SetStateAction<"login" | "register">>;
  projects: Projects[];
  setProjects: React.Dispatch<React.SetStateAction<Projects[]>>;
  setProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingProject: React.Dispatch<React.SetStateAction<Projects | null>>;
  contentIdeas: ContentIdea[];
  setContentIdeas: React.Dispatch<React.SetStateAction<ContentIdea[]>>;
  setContentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingContent: React.Dispatch<React.SetStateAction<ContentIdea | null>>;
  prompts: Prompt[];
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
  setPromptsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingPrompts: React.Dispatch<React.SetStateAction<Prompt | null>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  userInfo: UserInfo;
  chatMessages: Array<{ role: "user" | "assistant"; text: string }>;
  setChatMessages: React.Dispatch<
    React.SetStateAction<Array<{ role: "user" | "assistant"; text: string }>>
  >;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  welcomeMessage: string;
  setLoginError?: (message: string | null) => void;
  setRegisterError?: (message: string | null) => void;
  setIsSavingProject?: (value: boolean) => void;
  setIsSavingContent?: (value: boolean) => void;
}

/**
 * Custom hook that encapsulates all app event handlers.
 * Keeps app.tsx focused on layout and wiring while handler logic lives here.
 */
export function useAppHandlers(params: UseAppHandlersParams) {
  const {
    setUserInfo,
    setIsAuthenticated,
    setAuthPage,
    projects,
    setProjects,
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
    setChatMessages,
    chatInput,
    setChatInput,
    chatMessages,
    welcomeMessage,
    setLoginError,
    setRegisterError,
    setIsSavingProject,
    setIsSavingContent,
  } = params;

  const toggleStep = useCallback(
    async (projectId: string, stepId: string) => {
      try {
        await toggleProjectStep(projectId, stepId);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  steps: p.steps.map((s) =>
                    s.id === stepId ? { ...s, done: !s.done } : s,
                  ),
                }
              : p,
          ),
        );
      } catch (e) {
        toaster.create({
          description: "Toggle step failed",
          type: "error",
        });
      }
    },
    [setProjects],
  );

  const saveProject = useCallback(
    async (
      projectData: Omit<Projects, "id"> & {
        steps: Array<{ id?: string; text: string; done: boolean }>;
      },
      id?: string,
    ) => {
      setIsSavingProject?.(true);
      try {
        const status = (projectData.status || "not_started").replace(/-/g, "_");
        const order = "order" in projectData ? Number(projectData.order) : 0;
        if (id) {
          const updatePayload: Projects = {
            id,
            title: projectData.title,
            description: projectData.description,
            deadline: projectData.deadline,
            status,
            order,
            steps: projectData.steps.map(
              (s: { id?: string; text: string; done: boolean }, i: number) => ({
                id: s.id ?? `temp-${i}`,
                text: s.text,
                done: s.done,
                order: i,
              }),
            ),
          };
          const updated = await updateProject(updatePayload);
          setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        } else {
          const created = await createProject({
            title: projectData.title,
            description: projectData.description,
            deadline: projectData.deadline,
            status,
            order,
            steps: projectData.steps.map(
              (s: { text: string; done: boolean }) => ({
                text: s.text,
                done: s.done,
              }),
            ),
          });
          setProjects((prev) => [...prev, created]);
        }
        setProjectModalOpen(false);
        setEditingProject(null);
        toaster.create({
          description: "Your project has been saved successfully",
          type: "success",
        });
      } catch (e) {
        toaster.create({
          description:
            "Save project failed: " +
            (e instanceof Error ? e.message : "Unknown error"),
          type: "error",
        });
      } finally {
        setIsSavingProject?.(false);
      }
    },
    [setProjects, setProjectModalOpen, setEditingProject, setIsSavingProject],
  );

  const saveContent = useCallback(
    async (contentData: Omit<ContentIdea, "id">, id?: string) => {
      try {
        setIsSavingContent?.(true);
        if (id !== undefined) {
          const updated = await updateContentIdea({
            ...contentData,
            id,
          });
          setContentIdeas((prev) =>
            prev.map((c) => (c.id === id ? updated : c)),
          );
        } else {
          const created = await createContentIdea({
            ...contentData,
            id: uuid(),
          });
          setContentIdeas((prev) => [...prev, created]);
        }
        setContentModalOpen(false);
        setEditingContent(null);
        toaster.create({
          description: "Your content has been saved successfully",
          type: "success",
        });
      } catch (e) {
        toaster.create({
          description: "Save contentfailed",
          type: "error",
        });
      } finally {
        setIsSavingContent?.(false);
      }
    },
    [
      setContentIdeas,
      setContentModalOpen,
      setEditingContent,
      setIsSavingContent,
    ],
  );

  const openProjectModal = useCallback(
    (project?: Projects | null) => {
      setEditingProject(project ?? null);
      setProjectModalOpen(true);
    },
    [setEditingProject, setProjectModalOpen],
  );

  const openContentModal = useCallback(
    (content?: ContentIdea | null) => {
      setEditingContent(content ?? null);
      setContentModalOpen(true);
    },
    [setEditingContent, setContentModalOpen],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const project = projects.find((p) => p.id === id);
      if (!project) return;
      try {
        await deleteProjectById(project);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toaster.create({
          description: "Your project has been deleted successfully",
          type: "success",
        });
      } catch (e) {
        toaster.create({
          description:
            "Delete project failed: " +
            (e instanceof Error ? e.message : "Unknown error"),
          type: "error",
        });
      }
    },
    [projects, setProjects],
  );

  const deleteContent = useCallback(
    async (id: string) => {
      try {
        await deleteContentIdea(id);
        setContentIdeas((prev) => prev.filter((c) => c.id !== id));
        toaster.create({
          description: "Your content has been deleted successfully",
          type: "success",
        });
      } catch (e) {
        toaster.create({
          description: "Delete content failed:",
          type: "error",
        });
      }
    },
    [setContentIdeas],
  );

  const toggleContent = useCallback(
    async (id: string) => {
      try {
        const updated = await toggleContentIdea(id);
        setContentIdeas((prev) =>
          prev.map((c) => (c.id === id ? updated : c)),
        );
      } catch (e) {
        console.error("Toggle content failed:", e);
        toaster.create({
          description: "Toggle content failed:",
          type: "error",
        });
      }
    },
    [setContentIdeas],
  );

  const addPrompt = useCallback(
    async (
      prompt: Omit<Prompt, "id"> & { order: number },
      id?: string,
    ) => {
      try {
        const order = "order" in prompt ? Number(prompt.order) : 0;
        if (id) {
          const updatePayload: Prompt = {
            id,
            title: prompt.title,
            text: prompt.text,
            saved: prompt.saved,
            order,
          };
          const updated = await updatePrompts(updatePayload);
          setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        } else {
          const created = await createPrompts({
            id: uuid(),
            title: prompt.title,
            text: prompt.text,
            order: prompt.order,
            saved: prompt.saved,
          });
          setPrompts((prev) => [...prev, created]);
        }
        setPromptsModalOpen(false);
        setEditingPrompts(null);
        toaster.create({
          description: "Your prompt has been saved successfully",
          type: "success",
        });
      } catch (e) {
        console.error("Save Prompt failed:", e);
        toaster.create({
          description: "Save prompt failed:",
          type: "error",
        });
      }
    },
    [setPrompts, setPromptsModalOpen, setEditingPrompts],
  );

  // Wrapper for GalleryView - simplified API (just text)
  const addIdea = useCallback(
    async (text: string) => {
      try {
        const nextOrder =
          prompts.length === 0 ? 0 : Math.max(...prompts.map((p) => p.order)) + 1;
        const newPrompt = {
          id: uuid(),
          title: "",
          text,
          saved: new Date().toISOString().split("T")[0],
          order: nextOrder,
        };
        const created = await createPrompts(newPrompt);
        setPrompts((prev) => [...prev, created]);
      } catch (e) {
        console.error("Add idea failed:", e);
        toaster.create({
          description: "Add idea failed:",
          type: "error",
        });
      }
    },
    [prompts, setPrompts],
  );

  // Wrapper for GalleryView - edit by id and text
  const editIdea = useCallback(
    async (id: string, text: string) => {
      try {
        const prompt = prompts.find((p) => p.id === id);
        if (!prompt) return;
        const updated = await updatePrompts({ ...prompt, text });
        setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        toaster.create({
          description: "Your prompt has been edited successfully",
          type: "success",
        });
      } catch (e) {
        console.error("Edit idea failed:", e);
        toaster.create({
          description: "Edit idea failed:",
          type: "error",
        });
      }
    },
    [prompts, setPrompts],
  );

  const editPrompt = useCallback(
    async (id: string, text: string) => {
      try {
        const prompt = prompts.find((p) => p.id === id);
        if (!prompt) return;
        const updated = await updatePrompts({ ...prompt, text });
        setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        toaster.create({
          description: "Your prompt has been edited successfully",
          type: "success",
        });
      } catch (e) {
        console.error("Edit prompt failed:", e);
        toaster.create({
          description: "Edit prompt failed:",
          type: "error",
        });
      }
    },
    [prompts, setPrompts],
  );

  // Wrapper for GalleryView - delete by id
  const deleteIdea = useCallback(
    async (id: string) => {
      try {
        await deletePrompt(id);
        setPrompts((prev) =>
          prev
            .filter((p) => p.id !== id)
            .map((p, index) => ({ ...p, order: index })),
        );
        toaster.create({
          description: "Your idea has been deleted successfully",
          type: "success",
        });
      } catch (e) {
        console.error("Delete idea failed:", e);
        toaster.create({
          description: "Delete idea failed:",
          type: "error",
        });
      }
    },
    [setPrompts],
  );

  const deletePromptHandler = useCallback(
    async (id: string) => {
      try {
        await deletePrompt(id);
        setPrompts((prev) =>
          prev
            .filter((p) => p.id !== id)
            .map((p, index) => ({ ...p, order: index })),
        );
      } catch (e) {
        console.error("Delete prompt failed:", e);
        toaster.create({
          description: "Delete prompt failed:",
          type: "error",
        });
      }
    },
    [setPrompts],
  );

  // Wrapper for GalleryView - reorder with simplified interface
  const reorderIdeas = useCallback(
    async (reorderedIdeas: Array<{ id: string; text: string }>) => {
      try {
        const reorderedWithOrder = reorderedIdeas.map((idea, index) => ({
          id: idea.id,
          order: index,
        }));
        const updated = await reorderPrompts(reorderedWithOrder);
        setPrompts(updated);
      } catch (e) {
        console.error("Reorder ideas failed:", e);
        toaster.create({
          description: "Reorder ideas failed:",
          type: "error",
        });
      }
    },
    [setPrompts],
  );

  const reorderPrompt = useCallback(
    async (reorderedIdeas: Array<{ id: string; text: string }>) => {
      try {
        const reorderedWithOrder = reorderedIdeas.map((idea, index) => ({
          id: idea.id,
          order: index,
        }));
        const updated = await reorderPrompts(reorderedWithOrder);
        setPrompts(updated);
      } catch (e) {
        console.error("Reorder prompts failed:", e);
        toaster.create({
          description: "Reorder prompts failed:",
          type: "error",
        });
      }
    },
    [setPrompts],
  );

  const addChatMessage = useCallback(() => {
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
  }, [chatInput, chatMessages, setChatMessages, setChatInput]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoginError?.(null);
      try {
        const { user, token } = await login(email, password);
        setStoredToken(token);
        setUserInfo({
          email: user.email,
          name: user.name || "",
          profilePicture: user.profilePicture || null,
        });
        setIsAuthenticated(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        console.error("Login error:", error);
        setLoginError?.(message);
      }
    },
    [setUserInfo, setIsAuthenticated, setLoginError],
  );

  const handleRegister = useCallback(
    async (name: string, email: string, password: string) => {
      setRegisterError?.(null);
      try {
        const { user, token } = await register(name, email, password);
        setStoredToken(token);
        setUserInfo({
          email: user.email,
          name: user.name || "",
          profilePicture: user.profilePicture || null,
        });
        setIsAuthenticated(true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
        console.error("Register error:", error);
        setRegisterError?.(message);
      }
    },
    [setUserInfo, setIsAuthenticated, setRegisterError],
  );

  const handleLogout = useCallback(() => {
    clearStoredToken();
    setUserInfo({ email: "", name: "", profilePicture: null });
    setIsAuthenticated(false);
    setAuthPage("login");
  }, [setUserInfo, setIsAuthenticated, setAuthPage]);

  const handleUpdateName = useCallback(
    async (newName: string) => {
      try {
        const updated = await updateProfile({
          name: newName,
        });
        setUserInfo((prev) => ({ ...prev, name: updated.name }));
        toaster.create({
          description: "Your name has been updated successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Update name error:", error);
        toaster.create({
          description: "Update name failed",
          type: "error",
        });
      }
    },
    [setUserInfo],
  );

  const handleUpdateEmail = useCallback(
    async (newEmail: string) => {
      try {
        const updated = await updateProfile({
          email: newEmail,
        });
        setUserInfo((prev) => ({ ...prev, email: updated.email }));
        toaster.create({
          description: "Your email has been updated successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Update email error:", error);
        toaster.create({
          description: "Update email failed",
          type: "error",
        });
      }
    },
    [setUserInfo],
  );

  const handleUpdatePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<void> => {
      try {
        await updatePassword({ currentPassword, newPassword });
        toaster.create({
          description: "Your password has been updated successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Update password error:", error);
        toaster.create({
          description: "Update password failed",
          type: "error",
        });
        throw error; // Re-throw to let the UI handle the error
      }
    },
    [],
  );

  const handleUpdateProfilePicture = useCallback(
    async (filename: string) => {
      try {
        // Only predefined pictures (e.g. "1.png", "2.png", etc.)
        const updated = await updateProfile({ profilePicture: filename });
        setUserInfo((prev) => ({
          ...prev,
          profilePicture: updated.profilePicture || null,
        }));
      } catch (error) {
        console.error("Update profile picture error:", error);
        toaster.create({
          description: "Update profile picture failed",
          type: "error",
        });
        throw error;
      }
    },
    [setUserInfo],
  );

  const handleRemoveProfilePicture = useCallback(async () => {
    try {
      const updated = await updateProfile({
        profilePicture: null,
      });
      setUserInfo((prev) => ({
        ...prev,
        profilePicture: updated.profilePicture || null,
      }));
    } catch (error) {
      console.error("Remove profile picture error:", error);
      toaster.create({
        description: "Remove profile picture failed",
        type: "error",
      });
    }
  }, [setUserInfo]);

  const setDarkMode = useCallback(
    async (value: boolean) => {
      try {
        await updateSettings({ ...settings, darkMode: value });
        setSettings((prev) => ({ ...prev, darkMode: value }));
      } catch (e) {
        console.error("Update settings error:", e);
        toaster.create({
          description: "Update settings error",
          type: "error",
        });
        
      }
    },
    [settings, setSettings],
  );

  return {
    toggleStep,
    saveProject,
    saveContent,
    openProjectModal,
    openContentModal,
    deleteProject,
    deleteContent,
    toggleContent,
    addPrompt,
    editPrompt,
    deletePrompt: deletePromptHandler,
    reorderPrompt,
    // GalleryView wrappers
    addIdea,
    editIdea,
    deleteIdea,
    reorderIdeas,
    addChatMessage,
    handleLogin,
    handleRegister,
    handleLogout,
    handleUpdateName,
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateProfilePicture,
    handleRemoveProfilePicture,
    setDarkMode,
  };
}
