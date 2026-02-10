import { Settings } from "electron";

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined" && (window as any).__ARTFLOW_API_URL__) {
    return (window as any).__ARTFLOW_API_URL__;
  }
  return "http://localhost:3001";
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
  password: string
): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
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
  password: string
): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await res.json();
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
interface userProfile {
  name:string;
  email:string;
  profilePicture:string;
}
export async function getProfile(): Promise<userProfile> {
  const res = await fetch(`${getApiBaseUrl()}/api/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Profile failed");
  }
  return json.data;
}
export async function updateProfile(profile:userProfile): Promise<userProfile> {
  const res = await fetch(`${getApiBaseUrl()}/api/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(profile)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Profile failed");
  }
  return json.data;
}
export async function deleteProfile(): Promise<userProfile> {
  const res = await fetch(`${getApiBaseUrl()}/api/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
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
interface userSettings {
  darkMode:boolean;
  language:"string";
}  

export async function getSettings(): Promise<userSettings> {
  const res = await fetch(`${getApiBaseUrl()}/api/settings`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Settings failed");
  }
  return json.data;
}
export async function updateSettings(settings:userSettings): Promise<Settings> {
  const res = await fetch(`${getApiBaseUrl()}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(settings)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Settings failed");
  }
  return json.data;
}
export async function deleteSettings(settings:userSettings): Promise<Settings> {
  const res = await fetch(`${getApiBaseUrl()}/api/settings`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(settings)
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
interface Prompts {
  id:string;
  title:string;
  text:string;
  order:number;
  saved:string;
}
export async function getPrompts(promptId?:string): Promise<Prompts> {
  const res = await fetch(`${getApiBaseUrl()}/api/prompts${promptId ? `/${promptId}`:''}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompts failed");
  }
  return json.data;
}
export async function createPrompts(prompts:Prompts): Promise<Prompts> {
  const res = await fetch(`${getApiBaseUrl()}/api/prompts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prompts)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompts failed");
  }
  return json.data;
}
export async function updatePrompts(prompts:Prompts): Promise<Prompts> {
  const res = await fetch(`${getApiBaseUrl()}/api/prompts/${prompts.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(prompts)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompts failed");
  }
  return json.data;
}
export async function deletePromp(prompts:Prompts): Promise<Prompts> {
  const res = await fetch(`${getApiBaseUrl()}/api/prompts/${prompts.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Profile failed");
  }
  return json.data;
}
export async function reorderPrompts(prompts:Prompts): Promise<Prompts> {
  const res = await fetch(`${getApiBaseUrl()}/api/prompts`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(prompts)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Prompts failed");
  }
  return json.data;
}
/**
 * Content Ideas
 */ 
enum Platform {
  YOUTUBE = "youtube",
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
}
interface ContentIdeas {
  id:string
  title:string
  platform?: Platform
  deadline:string
  done:boolean
  details:string
  order:number
}

export async function getContentIdeas(): Promise<ContentIdeas> {
  const res = await fetch(`${getApiBaseUrl()}/api/ideas`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas fetch failed");
  }
  return json.data;
}
export async function getContentIdeaById(id:string): Promise<ContentIdeas> {
  const res = await fetch(`${getApiBaseUrl()}/api/ideas/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas fetch failed");
  }
  return json.data;
}
export async function createContentIdea(contentIdea:ContentIdeas): Promise<ContentIdeas> {
  const res = await fetch(`${getApiBaseUrl()}/api/ideas`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(contentIdea)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas createfailed");
  }
  return json.data;
}
export async function updateContentIdea(contentIdea:ContentIdeas): Promise<ContentIdeas> {
  const res = await fetch(`${getApiBaseUrl()}/api/ideas/${contentIdea.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(contentIdea)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas update failed");
  }
  return json.data;
}
export async function toggleContentIdea(contentIdea:ContentIdeas): Promise<ContentIdeas> {
  const res = await fetch(`${getApiBaseUrl()}/api/ideas/${contentIdea.id}/toggle`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(contentIdea)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas toggle failed");
  }
  return json.data;
}
export async function deleteContentIdea(contentIdea:ContentIdeas): Promise<ContentIdeas> {
  const res = await fetch(`${getApiBaseUrl()}/api/ideas/${contentIdea.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Content Ideas delete failed");
  }
  return json.data;
}


/**
 * Projects
 */ 
enum ProjectStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

interface ProjectsSteps {
  id:string
  text:string
  done:boolean
  order:number
}
interface Projects {
  id:string
  title:string
  description:string
  deadline:string
  status:ProjectStatus
  order:number
  steps:ProjectsSteps[]
}
export async function getProjects(): Promise<Projects> {
  const res = await fetch(`${getApiBaseUrl()}/api/projects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects fetch failed");
  }
  return json.data;
}
export async function getProjectById(id:string): Promise<Projects> {
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
export async function createProject(contentIdea:Projects): Promise<Projects> {
  const res = await fetch(`${getApiBaseUrl()}/api/projects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(contentIdea)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects create failed");
  }
  return json.data;
}
export async function updateProject(project:Projects): Promise<Projects> {
  const res = await fetch(`${getApiBaseUrl()}/api/projects/${project.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(project)
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
  stepId: string
): Promise<ProjectsSteps> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/projects/${projectId}/${stepId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Project step toggle failed");
  }
  return json.data;
}
export async function deleteproject(project:Projects): Promise<Projects> {
  const res = await fetch(`${getApiBaseUrl()}/api/projects/${project.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Projects delete failed");
  }
  return json.data;
}



/**
 * ChatMessages
 */ 
