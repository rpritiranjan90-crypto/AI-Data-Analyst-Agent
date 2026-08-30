import api from "./axios";

export interface CheckoutSession {
  success: boolean;
  checkout_url: string;
}

export interface PortalSession {
  success: boolean;
  portal_url: string;
}

export interface ConfirmResponse {
  success: boolean;
  plan: "pro" | "enterprise" | "free";
  customer_id?: string;
}

export async function startCheckout(plan: "pro" | "enterprise"): Promise<string> {
  const res = await api.post<CheckoutSession>("/billing/checkout", { plan });
  return res.data.checkout_url;
}

export async function openPortal(returnUrl?: string): Promise<string> {
  const res = await api.post<PortalSession>("/billing/portal", { return_url: returnUrl });
  return res.data.portal_url;
}

export async function confirmCheckout(sessionId: string): Promise<ConfirmResponse> {
  const res = await api.post<ConfirmResponse>(`/billing/confirm?session_id=${encodeURIComponent(sessionId)}`);
  return res.data;
}
