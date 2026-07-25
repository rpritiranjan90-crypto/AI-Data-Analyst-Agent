import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: {
        id: "usr_admin_001",
        email: "admin@aianalyst.com",
        name: "Data Analyst Admin",
        role: "Administrator",
      },
      isAuthenticated: true,

      setAuth: (token, user) => {
        localStorage.setItem("ai_analyst_jwt_token", token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("ai_analyst_jwt_token");
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "ai-analyst-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
