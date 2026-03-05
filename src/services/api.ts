declare global {
  interface Window {
    __ARTFLOW_API_URL__?: string;
  }
}

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined" && window.__ARTFLOW_API_URL__) {
    return window.__ARTFLOW_API_URL__;
  }
  // Use 127.0.0.1 so Electron reliably reaches the backend (avoids IPv6 localhost issues)
  return "http://127.0.0.1:3001";
};

const AUTH_TOKEN_KEY = "authToken";

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Auth
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  password: string;
  profilePicture: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthMeResponse {
  success: boolean;
  data: AuthUser;
}

export interface LoginRegisterResponse {
  success: boolean;
  data: { user: AuthUser; token: string };
}

export interface HealthResponse {
  success: boolean;
  devSkipLogin?: boolean;
}

export async function getHealthConfig(): Promise<HealthResponse> {
  const res = await fetch(`${getApiBaseUrl()}/health`);
  if (!res.ok) return { success: false };
  return res.json();
}

export async function authMe(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  const res = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    clearStoredToken();
    return null;
  }
  if (!res.ok) {
    return null;
  }

  const json: AuthMeResponse = await res.json();
  if (json.success && json.data) return json.data;
  return null;
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    const msg =
      err instanceof TypeError && (err as Error).message?.includes("fetch")
        ? "Cannot reach server.s"
        : (err as Error).message || "Login failed";
    throw new Error(msg);
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || "Login failed");
  }
  if (!json.success || !json.data?.token || !json.data?.user) {
    throw new Error("Invalid response");
  }
  return { user: json.data.user, token: json.data.token };
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  } catch (err) {
    const msg =
      err instanceof TypeError && (err as Error).message?.includes("fetch")
        ? "Cannot reach server."
        : (err as Error).message || "Registration failed";
    throw new Error(msg);
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || "Registration failed");
  }
  if (!json.success || !json.data?.token || !json.data?.user) {
    throw new Error("Invalid response");
  }
  return { user: json.data.user, token: json.data.token };
}
/**
 * Profile
 */
export interface UserProfile {
  name: string;
  email: string;
  profilePicture: string | null;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function getProfile(): Promise<UserProfile> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Profile failed");
  }
  return json.data;
}

export async function updateProfile(
  profile: Partial<UserProfile> & { profilePicture?: string | null },
): Promise<UserProfile> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(profile),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Profile update failed");
  }
  return json.data;
}

export async function updatePassword(
  payload: UpdatePasswordPayload,
): Promise<{ success: boolean }> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/profile/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Password update failed");
  }
  return json;
}

export async function deleteProfile(): Promise<UserProfile> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/profile`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Profile failed");
  }
  return json.data;
}

/**
 * Settings
 */
export interface UserSettings {
  darkMode: boolean;
  language: string;
}

export async function getSettings(): Promise<UserSettings> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Settings failed");
  }
  return json.data;
}
export async function updateSettings(
  settings: UserSettings,
): Promise<UserSettings> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(settings),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Settings failed");
  }
  return json.data;
}
export async function deleteSettings(
  settings: UserSettings,
): Promise<UserSettings> {
  const res = await fetch(`${getApiBaseUrl()}/api/settings`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Settings failed");
  }
  return json.data;
}
/**
 * Prompts
 */
export interface Prompts {
  id: string;
  title: string;
  text: string;
  order: number;
  saved: string;
}

export async function getPrompts(): Promise<Prompts[]> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/prompts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompts fetch failed");
  }
  return Array.isArray(json.data) ? json.data : [];
}

export async function getPromptById(promptId: string): Promise<Prompts> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/prompts/${promptId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompt fetch failed");
  }
  return json.data;
}

export async function createPrompts(prompt: Prompts): Promise<Prompts> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/prompts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(prompt),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompt create failed");
  }
  return json.data;
}

export async function updatePrompts(prompt: Prompts): Promise<Prompts> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/prompts/${prompt.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(prompt),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompt update failed");
  }
  return json.data;
}

export async function deletePrompt(id: string): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/prompts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompt delete failed");
  }
}

export async function reorderPrompts(
  prompts: Array<{ id: string; order: number }>,
): Promise<Prompts[]> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/prompts/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ prompts }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompts reorder failed");
  }
  return json.data;
}
/**
 * Content Ideas
 */
export enum Platform {
  YOUTUBE = "youtube",
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
}
interface ContentIdeas {
  id: string;
  title: string;
  platform: Platform;
  deadline: string;
  done: boolean;
  details: string;
  order: number;
}

export async function getContentIdeas(): Promise<ContentIdeas[]> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/content-ideas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas fetch failed");
  }
  return Array.isArray(json.data) ? json.data : [];
}
export async function getContentIdeaById(id: string): Promise<ContentIdeas> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/content-ideas/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas fetch failed");
  }
  return json.data;
}
export async function createContentIdea(
  contentIdea: ContentIdeas,
): Promise<ContentIdeas> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/content-ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(contentIdea),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas create failed");
  }
  return json.data;
}
export async function updateContentIdea(
  contentIdea: ContentIdeas,
): Promise<ContentIdeas> {
  const token = getStoredToken();
  const res = await fetch(
    `${getApiBaseUrl()}/api/content-ideas/${contentIdea.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(contentIdea),
    },
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas update failed");
  }
  return json.data;
}
export async function toggleContentIdea(id: string): Promise<ContentIdeas> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/content-ideas/${id}/toggle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas toggle failed");
  }
  return json.data;
}
export async function deleteContentIdea(id: string): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/content-ideas/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas delete failed");
  }
}

/**
 * Projects
 */
export interface ProjectsSteps {
  id: string;
  text: string;
  done: boolean;
  order: number;
}
export interface Projects {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  order: number;
  steps: ProjectsSteps[];
}
export async function getProjects(): Promise<Projects[]> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects fetch failed");
  }
  return Array.isArray(json.data) ? json.data : [];
}
export async function getProjectById(id: string): Promise<Projects> {
  const res = await fetch(`${getApiBaseUrl()}/api/projects/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects fetch failed");
  }
  return json.data;
}
/** Payload for creating a project; steps may omit id/order (backend generates them). */
export type CreateProjectPayload = Omit<Projects, "id" | "steps"> & {
  steps: Array<{ text: string; done?: boolean }>;
};
export async function createProject(
  project: CreateProjectPayload,
): Promise<Projects> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(project),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects create failed");
  }
  return json.data;
}
export async function updateProject(project: Projects): Promise<Projects> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/projects/${project.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(project),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects update failed");
  }
  return json.data;
}
/** Toggle done state of a single step. Uses project id and step id. */
export async function toggleProjectStep(
  projectId: string,
  stepId: string,
): Promise<ProjectsSteps> {
  const token = getStoredToken();
  const res = await fetch(
    `${getApiBaseUrl()}/api/projects/${projectId}/${stepId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Project step toggle failed");
  }
  return json.data;
}
export async function deleteProjectById(project: Projects): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/api/projects/${project.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects delete failed");
  }
}

/**
 * ChatMessages
 */
