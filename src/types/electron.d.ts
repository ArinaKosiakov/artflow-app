export interface ElectronAPI {
  storage: {
    getAll: () => Promise<any>;
    getProjects: () => Promise<any[]>;
    getContentIdeas: () => Promise<any[]>;
    getPrompts: () => Promise<any[]>;
    getChatMessages: () => Promise<any[]>;
    getDarkMode: () => Promise<boolean>;
    setProjects: (projects: any[]) => Promise<void>;
    setContentIdeas: (contentIdeas: any[]) => Promise<void>;
    setPrompts: (prompts: any[]) => Promise<void>;
    setChatMessages: (messages: any[]) => Promise<void>;
    setDarkMode: (darkMode: boolean) => Promise<void>;
    saveAll: (data: any) => Promise<void>;
    clear: () => Promise<void>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

