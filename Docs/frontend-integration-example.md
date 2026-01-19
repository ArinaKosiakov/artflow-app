# Esempio Integrazione Frontend-Backend

## Service Layer per API Calls

### File: src/services/api.ts

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper per fetch con autenticazione
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  register: async (email: string, password: string, name?: string) => {
    const data = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getMe: () => fetchWithAuth('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getAll: () => fetchWithAuth('/projects'),
  
  getById: (id: string) => fetchWithAuth(`/projects/${id}`),
  
  create: (project: any) => fetchWithAuth('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  }),
  
  update: (id: string, project: any) => fetchWithAuth(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  }),
  
  delete: (id: string) => fetchWithAuth(`/projects/${id}`, {
    method: 'DELETE',
  }),
  
  toggleStep: (projectId: string, stepId: string) => 
    fetchWithAuth(`/projects/${projectId}/steps/${stepId}`, {
      method: 'PUT',
    }),
};

// Content Ideas API
export const contentIdeasAPI = {
  getAll: () => fetchWithAuth('/content-ideas'),
  
  create: (content: any) => fetchWithAuth('/content-ideas', {
    method: 'POST',
    body: JSON.stringify(content),
  }),
  
  update: (id: string, content: any) => fetchWithAuth(`/content-ideas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(content),
  }),
  
  delete: (id: string) => fetchWithAuth(`/content-ideas/${id}`, {
    method: 'DELETE',
  }),
  
  toggle: (id: string) => fetchWithAuth(`/content-ideas/${id}/toggle`, {
    method: 'PUT',
  }),
};

// Prompts API
export const promptsAPI = {
  getAll: () => fetchWithAuth('/prompts'),
  
  create: (prompt: any) => fetchWithAuth('/prompts', {
    method: 'POST',
    body: JSON.stringify(prompt),
  }),
  
  update: (id: string, prompt: any) => fetchWithAuth(`/prompts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(prompt),
  }),
  
  delete: (id: string) => fetchWithAuth(`/prompts/${id}`, {
    method: 'DELETE',
  }),
  
  reorder: (prompts: Array<{ id: string; order: number }>) => 
    fetchWithAuth('/prompts/reorder', {
      method: 'PUT',
      body: JSON.stringify({ prompts }),
    }),
};

// Chat API
export const chatAPI = {
  getMessages: (conversationId?: string) => {
    const url = conversationId 
      ? `/chat/messages?conversationId=${conversationId}`
      : '/chat/messages';
    return fetchWithAuth(url);
  },
  
  sendMessage: (message: { text: string; conversationId?: string }) => 
    fetchWithAuth('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    }),
};

// Settings API
export const settingsAPI = {
  get: () => fetchWithAuth('/settings'),
  
  update: (settings: { darkMode?: boolean; language?: string }) => 
    fetchWithAuth('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

// Profile API
export const profileAPI = {
  get: () => fetchWithAuth('/profile'),
  
  updateName: (name: string) => fetchWithAuth('/profile/name', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  }),
  
  updateEmail: (email: string, password: string) => fetchWithAuth('/profile/email', {
    method: 'PUT',
    body: JSON.stringify({ email, password }),
  }),
  
  updatePassword: (currentPassword: string, newPassword: string) => 
    fetchWithAuth('/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  
  uploadPicture: async (file: File) => {
    const formData = new FormData();
    formData.append('picture', file);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/profile/picture`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },
  
  removePicture: () => fetchWithAuth('/profile/picture', {
    method: 'DELETE',
  }),
};
```

## Context per Autenticazione

### File: src/contexts/AuthContext.tsx

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  name?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se l'utente è già autenticato
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const data = await authAPI.register(email, password, name);
    setUser(data.user);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Hook Personalizzato per Data Fetching

### File: src/hooks/useProjects.ts

```typescript
import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

interface Project {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  status: string;
  steps: Array<{ id: string; text: string; done: boolean }>;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const newProject = await projectsAPI.create(project);
      setProjects([...projects, newProject]);
      return newProject;
    } catch (err) {
      throw err;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const updated = await projectsAPI.update(id, project);
      setProjects(projects.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const toggleStep = async (projectId: string, stepId: string) => {
    try {
      const updatedStep = await projectsAPI.toggleStep(projectId, stepId);
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            steps: project.steps.map(step =>
              step.id === stepId ? updatedStep : step
            )
          };
        }
        return project;
      }));
    } catch (err) {
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    toggleStep,
    refetch: loadProjects,
  };
};
```

## Esempio di Modifica app.tsx

```typescript
// Prima (dati in memoria)
const [projects, setProjects] = useState([...]);

// Dopo (con hook personalizzato)
import { useProjects } from './hooks/useProjects';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading, addProject, deleteProject, toggleStep } = useProjects();

  // Se non autenticato, mostra login
  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  // Resto del componente...
}
```

## Alternativa: React Query (Consigliato)

### Installazione
```bash
npm install @tanstack/react-query
```

### Setup Provider

```typescript
// src/main.tsx o src/index.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

### Esempio con React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '../services/api';

export const useProjects = () => {
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll(),
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      projectsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects,
    isLoading,
    error,
    addProject: createMutation.mutate,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
  };
};
```

## Variabili d'Ambiente

### File: .env (frontend)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### File: .env.example
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Protezione Routes

### File: src/components/ProtectedRoute.tsx

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
```

## Esempio Integrazione ProfileModal

### File: src/components/ProfileModal.tsx (aggiornato con API)

```typescript
import { profileAPI } from '../services/api';

// Nel componente ProfileModal, sostituire le funzioni mock con:

const handleUpdateName = async () => {
  if (!validateName() || !onUpdateName || isUpdatingName) return;
  
  setIsUpdatingName(true);
  try {
    await profileAPI.updateName(name.trim());
    await onUpdateName(name.trim()); // Callback per aggiornare stato locale
    setEmailErrors({});
  } catch (error) {
    console.error('Error updating name:', error);
  } finally {
    setIsUpdatingName(false);
  }
};

const handleUpdateEmail = async () => {
  if (!validateEmail() || !onUpdateEmail || isUpdatingEmail) return;
  
  setIsUpdatingEmail(true);
  try {
    // Nota: l'API richiede anche la password corrente per sicurezza
    await profileAPI.updateEmail(newEmail, currentPassword);
    await onUpdateEmail(newEmail);
    setNewEmail('');
    setEmailErrors({});
  } catch (error) {
    console.error('Error updating email:', error);
  } finally {
    setIsUpdatingEmail(false);
  }
};

const handleUpdatePassword = async () => {
  if (!validatePassword() || !onUpdatePassword || isUpdatingPassword) return;
  
  setIsUpdatingPassword(true);
  try {
    await profileAPI.updatePassword(currentPassword, newPassword);
    await onUpdatePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    setIsUpdatingPassword(false);
  }
};

const handleUpdateProfilePicture = async (file: File) => {
  setIsUpdatingPicture(true);
  try {
    const result = await profileAPI.uploadPicture(file);
    await onUpdateProfilePicture(file); // Callback per aggiornare stato locale
    setProfilePicture(result.profilePicture);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    setProfilePicture(currentProfilePicture || null);
  } finally {
    setIsUpdatingPicture(false);
  }
};

const handleRemoveProfilePicture = async () => {
  setIsUpdatingPicture(true);
  try {
    await profileAPI.removePicture();
    await onRemoveProfilePicture();
    setProfilePicture(null);
  } catch (error) {
    console.error('Error removing profile picture:', error);
  } finally {
    setIsUpdatingPicture(false);
  }
};
```

## Note sulla Struttura Sidebar

La Sidebar è strutturata come segue:
- **Header**: Logo e nome app
- **Navigation**: Bottoni per Projects, Content, AI, Gallery
- **Profile Section**: Direttamente sotto la navigazione, separata da una linea
  - Mostra avatar/foto profilo
  - Mostra "Profile" come titolo
  - Mostra nome utente sotto
- **Bottom Section**: In fondo con `mt-auto`
  - Dark Mode toggle
  - Logout button
  - Versione app (es: "Version 1.0.0")

