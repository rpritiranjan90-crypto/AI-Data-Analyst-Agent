/**
 * Unit tests for authStore — auth state, logout, guest mode, token persistence.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore, type UserProfile, type Workspace } from "../store/authStore";

const mockUser: UserProfile = {
  id: "usr_1",
  email: "test@example.com",
  name: "Test User",
  role: "Owner",
};

const mockWorkspaces: Workspace[] = [
  { id: "ws_1", name: "Personal", role: "Owner", plan: "free" },
  { id: "ws_2", name: "Team", role: "Admin", plan: "pro" },
];

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset to the literal initial state via the store's set() method.
    // We can't use logout() here because logout() flips isGuest to true
    // by design (the C2 fix made it default to guest-on-logout).
    useAuthStore.setState({
      user: null,
      token: null,
      activeWorkspace: null,
      workspaces: [],
      isAuthenticated: false,
      isGuest: false,
    });
    localStorage.clear();
  });

  it("initializes with empty state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.activeWorkspace).toBeNull();
    expect(state.workspaces).toEqual([]);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isGuest).toBe(false);
  });

  describe("setAuth", () => {
    it("stores user, token, and sets authenticated flag", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt_token_abc");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("jwt_token_abc");
      expect(state.isAuthenticated).toBe(true);
      expect(state.isGuest).toBe(false);
    });

    it("creates a default workspace if none provided", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt");

      const state = useAuthStore.getState();
      expect(state.workspaces).toHaveLength(1);
      expect(state.workspaces[0].id).toBe("ws_default");
      expect(state.workspaces[0].name).toBe("Test User's Workspace");
      expect(state.workspaces[0].plan).toBe("free");
      expect(state.activeWorkspace?.id).toBe("ws_default");
    });

    it("uses provided workspaces and selects first as active", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt", mockWorkspaces);

      const state = useAuthStore.getState();
      expect(state.workspaces).toHaveLength(2);
      expect(state.activeWorkspace?.id).toBe("ws_1");
    });
  });

  describe("setGuestMode", () => {
    it("sets isGuest true with a guest user profile", () => {
      useAuthStore.getState().setGuestMode(true);

      const state = useAuthStore.getState();
      expect(state.isGuest).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user?.id).toBe("usr_guest");
      expect(state.user?.role).toBe("Analyst");
    });

    it("clears the user when exiting guest mode", () => {
      useAuthStore.getState().setGuestMode(true);
      useAuthStore.getState().setGuestMode(false);

      const state = useAuthStore.getState();
      expect(state.isGuest).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe("setActiveWorkspace", () => {
    it("switches the active workspace", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt", mockWorkspaces);

      useAuthStore.getState().setActiveWorkspace(mockWorkspaces[1]);

      expect(useAuthStore.getState().activeWorkspace?.id).toBe("ws_2");
    });
  });

  describe("setWorkspaces", () => {
    it("replaces the workspace list", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt", mockWorkspaces);
      const newList: Workspace[] = [
        { id: "ws_99", name: "Enterprise", role: "Owner", plan: "enterprise" },
      ];

      useAuthStore.getState().setWorkspaces(newList);

      expect(useAuthStore.getState().workspaces).toEqual(newList);
    });
  });

  describe("updateCurrentPlan", () => {
    it("updates the plan on the active workspace and the matching entry", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt", mockWorkspaces);

      useAuthStore.getState().updateCurrentPlan("enterprise");

      const state = useAuthStore.getState();
      expect(state.activeWorkspace?.plan).toBe("enterprise");
      const updated = state.workspaces.find((w) => w.id === state.activeWorkspace!.id);
      expect(updated?.plan).toBe("enterprise");
    });

    it("is a no-op when no active workspace", () => {
      const before = useAuthStore.getState();
      useAuthStore.getState().updateCurrentPlan("pro");
      const after = useAuthStore.getState();
      expect(after.workspaces).toEqual(before.workspaces);
    });
  });

  describe("logout", () => {
    it("clears user, token, workspaces, and sets isGuest true", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt_token", mockWorkspaces);
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.activeWorkspace).toBeNull();
      expect(state.workspaces).toEqual([]);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isGuest).toBe(true);
    });

    it("removes the JWT from localStorage so it cannot be re-used", () => {
      useAuthStore.getState().setAuth(mockUser, "jwt_secret", mockWorkspaces);
      // Simulate the axios interceptor persisting the token
      localStorage.setItem("ai_analyst_jwt_token", "jwt_secret");

      useAuthStore.getState().logout();

      // The C2 security fix: logout MUST clear the raw token
      expect(localStorage.getItem("ai_analyst_jwt_token")).toBeNull();
    });
  });

  it("persists state to localStorage", () => {
    useAuthStore.getState().setAuth(mockUser, "jwt_persisted", mockWorkspaces);

    const stored = localStorage.getItem("ada-auth-storage");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.user.id).toBe("usr_1");
    expect(parsed.state.token).toBe("jwt_persisted");
    expect(parsed.state.isAuthenticated).toBe(true);
  });
});