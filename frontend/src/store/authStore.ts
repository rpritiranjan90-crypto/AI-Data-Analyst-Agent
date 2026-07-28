import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "Owner" | "Admin" | "Data Scientist" | "Analyst" | "Viewer";
  avatar?: string;
}

export interface Workspace {
  id: string;
  name: string;
  role: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  isAuthenticated: boolean;
  isGuest: boolean;
  setAuth: (user: UserProfile, token: string, workspaces?: Workspace[]) => void;
  setGuestMode: (isGuest: boolean) => void;
  setActiveWorkspace: (ws: Workspace) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: "usr_enterprise_demo",
        email: "analyst@enterprise.com",
        name: "Lead Enterprise Analyst",
        role: "Owner",
      },
      token: "demo_jwt_token_sample",
      activeWorkspace: {
        id: "ws_default",
        name: "Acme Analytics Workspace",
        role: "Owner",
      },
      workspaces: [
        { id: "ws_default", name: "Acme Analytics Workspace", role: "Owner" },
        { id: "ws_finance", name: "Finance & Accounting", role: "Admin" },
        { id: "ws_marketing", name: "Growth Marketing", role: "Analyst" },
      ],
      isAuthenticated: true,
      isGuest: false,

      setAuth: (user, token, workspaces) =>
        set({
          user,
          token,
          workspaces: workspaces || [
            { id: "ws_default", name: `${user.name}'s Workspace`, role: "Owner" },
          ],
          activeWorkspace: workspaces?.[0] || {
            id: "ws_default",
            name: `${user.name}'s Workspace`,
            role: "Owner",
          },
          isAuthenticated: true,
          isGuest: false,
        }),

      setGuestMode: (isGuest) =>
        set({
          isGuest,
          isAuthenticated: !isGuest,
          user: isGuest
            ? { id: "usr_guest", email: "guest@demo.com", name: "Guest User", role: "Analyst" }
            : null,
        }),

      setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),

      logout: () =>
        set({
          user: null,
          token: null,
          activeWorkspace: null,
          workspaces: [],
          isAuthenticated: false,
          isGuest: true,
        }),
    }),
    {
      name: "ada-auth-storage",
    }
  )
);
