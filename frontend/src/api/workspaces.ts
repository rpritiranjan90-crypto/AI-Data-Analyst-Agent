import api from "./axios";

export interface WorkspaceInfo {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  role: string;
}

export interface MemberInfo {
  user_id: string;
  email: string;
  name: string;
  role: string;
  joined_at: string;
}

export interface InviteResult {
  success: boolean;
  message: string;
  invite_token?: string;
}

export async function listWorkspaces(): Promise<WorkspaceInfo[]> {
  const res = await api.get<{ success: boolean; workspaces: WorkspaceInfo[] }>("/workspaces");
  return res.data.workspaces;
}

export async function createWorkspace(name: string): Promise<WorkspaceInfo> {
  const res = await api.post<{ success: boolean; workspace: WorkspaceInfo }>("/workspaces", { name });
  return res.data.workspace;
}

export async function renameWorkspace(workspaceId: string, name: string): Promise<void> {
  await api.patch(`/workspaces/${workspaceId}`, { name });
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}`);
}

export async function listMembers(workspaceId: string): Promise<MemberInfo[]> {
  const res = await api.get<{ success: boolean; members: MemberInfo[] }>(`/workspaces/${workspaceId}/members`);
  return res.data.members;
}

export async function inviteMember(workspaceId: string, email: string): Promise<InviteResult> {
  const res = await api.post<InviteResult>(`/workspaces/${workspaceId}/invite`, { email });
  return res.data;
}

export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  role: "owner" | "admin" | "member" | "viewer"
): Promise<void> {
  await api.post(`/workspaces/${workspaceId}/members/${userId}/role`, { role });
}

export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
}
