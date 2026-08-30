import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "Owner" | "Admin" | "Data Scientist" | "Analyst" | "Viewer";
  avatar?: string;
}

export type Plan = "free" | "pro" | "enterprise";

export interface Workspace {
  id: string;
  name: string;
  role: string;
  plan?: Plan;
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
  setWorkspaces: (workspaces: Workspace[]) => void;
  updateCurrentPlan: (plan: Plan) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeWorkspace: null,
      workspaces: [],
      isAuthenticated: false,
      isGuest: false,

      setAuth: (user, token, workspaces) =>
        set({
          user,
          token,
          workspaces: workspaces || [
            { id: "ws_default", name: `${user.name}'s Workspace`, role: "Owner", plan: "free" },
          ],
          activeWorkspace: workspaces?.[0] || {
            id: "ws_default",
            name: `${user.name}'s Workspace`,
            role: "Owner",
            plan: "free",
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

      setWorkspaces: (workspaces) => set({ workspaces }),

      updateCurrentPlan: (plan) =>
        set((state) => {
          if (!state.activeWorkspace) return state;
          return {
            activeWorkspace: { ...state.activeWorkspace, plan },
            workspaces: state.workspaces.map((w) =>
              w.id === state.activeWorkspace!.id ? { ...w, plan } : w
            ),
          };
        }),

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
