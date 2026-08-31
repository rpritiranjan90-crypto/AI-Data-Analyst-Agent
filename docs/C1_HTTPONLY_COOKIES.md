# C1 — Move JWT to httpOnly Cookies (Implementation Spec)

> **Finding:** C1 in `docs/PRODUCTION_READINESS.md`
> **Goal:** Eliminate the XSS-token-theft vector by storing the access token in an `httpOnly; Secure; SameSite=Strict` cookie that JS cannot read.
> **Strategy:** Keep a short-lived access token in the cookie (or as `Authorization` header) and a long-lived refresh token in a separate `httpOnly` cookie. The refresh token is rotated on every refresh.
> **Scope:** Backend `auth_service.py` + `routes/auth.py` + CORS + axios on the frontend.

---

## 1. Why cookies (and not just keep localStorage)

- `localStorage` is readable by any JS that runs in our origin. A single XSS payload (a malicious file name rendered as HTML, a compromised npm dep) exfiltrates the token immediately.
- `httpOnly` cookies are invisible to `document.cookie` and to all JS — even XSS cannot read them. The browser only sends them on matching requests to the same origin.
- We still need a CSRF defense. `SameSite=Strict` is sufficient for our flow (no third-party links into our API).

---

## 2. Token model — two cookies

| Cookie | Purpose | TTL | httpOnly | Secure | SameSite | Scope |
|---|---|---|---|---|---|---|
| `ada_access` | Short-lived access token (sent as `Authorization: Bearer …` for now) | 15 min | **No** (kept as Bearer for cross-tab consistency) | Yes | Strict | `/` |
| `ada_refresh` | Refresh token, rotated on every `/auth/refresh` | 7 days | **Yes** | Yes | Strict | `/auth/refresh` (path-scoped) |

**Why two cookies:**
- The access token is short-lived → if exfiltrated, blast radius is small.
- The refresh token never leaves the server; the browser just sends the cookie to `/auth/refresh`.
- The refresh cookie is path-scoped to `/auth/refresh` so it never leaks to other endpoints.
- Frontend code never reads either cookie — they are just attached automatically by the browser.

**Why `SameSite=Strict`:** our app never receives deep links from third-party sites that need to be authenticated. Strict blocks CSRF outright.

**Why NOT store the access token in the body:** the axios client uses `Authorization: Bearer …` headers everywhere today. Storing the access token in a non-`httpOnly` cookie would be visible to JS — same XSS problem. Two options:

- **Option A (recommended, simpler):** Set `ada_access` as a normal `Secure; SameSite=Strict` cookie and have the axios request interceptor copy the cookie value into the `Authorization` header on every request. Refresh happens silently when the cookie expires.
- **Option B (purer):** Make the access token `httpOnly` too and have the backend read the cookie itself. This means dropping the `Authorization` header everywhere — bigger refactor, and breaks the existing `get_current_user` dependency in 50+ routes.

**We pick Option A.** The access token still lives in JS memory (the axios header), but the cookie-rotation pattern means it expires in 15 min and is rotated by the refresh flow. XSS can read it for 15 min max, instead of 7 days.

---

## 3. Backend changes

### 3.1 New functions in `app/services/auth_service.py`

```python
ACCESS_TOKEN_TTL_SECONDS = 15 * 60        # 15 minutes
REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 3600  # 7 days

def create_access_token(user_id, email, workspaces, *, active_workspace_id=None) -> str:
    # Same as today, but exp = now + ACCESS_TOKEN_TTL_SECONDS (15 min).
    ...

def create_refresh_token(user_id: str) -> tuple[str, str]:
    """
    Returns (refresh_token, token_id).
    - token_id is a random id stored in the user record so we can revoke.
    - refresh_token = sign({sub, jti, exp}, REFRESH_SECRET).
    """
    ...

def decode_refresh_token(token: str) -> dict[str, Any] | None:
    """Verify signature, exp, and that jti is still active for the user."""
    ...

def rotate_refresh_token(user_id: str) -> str:
    """Invalidate the old jti and issue a new refresh token."""
    ...
```

**Storage:** A `refresh_tokens: dict[user_id, set[jti]]` (or a `refresh_tokens` table in Supabase). The set of active jtis per user. On rotate, remove the old jti and insert the new one.

**Separate secret:** `REFRESH_TOKEN_SECRET` env var, distinct from `JWT_SECRET`. The refresh secret is the high-trust one — the access secret only needs to last 15 min.

### 3.2 New endpoint in `routes/auth.py`

```python
@router.post("/refresh", summary="Refresh access token")
def refresh(request: Request) -> dict[str, Any]:
    """
    Reads the `ada_refresh` cookie. If valid and not revoked, returns a new
    access token AND a new (rotated) refresh cookie. Caller does NOT need to
    send the access cookie — refresh is path-scoped.
    """
    raw = request.cookies.get("ada_refresh")
    if not raw:
        raise HTTPException(401, "No refresh token")

    payload = auth.decode_refresh_token(raw)
    if not payload:
        raise HTTPException(401, "Invalid or expired refresh token")

    user_id = payload["sub"]
    if not auth.is_jti_active(user_id, payload["jti"]):
        # Reuse detection: revoke ALL refresh tokens for this user.
        auth.revoke_all_refresh_tokens(user_id)
        raise HTTPException(401, "Refresh token reuse detected. Please sign in again.")

    user = auth.get_user_by_id(user_id)
    workspaces = auth.get_user_workspaces(user_id)
    if not user:
        raise HTTPException(401, "User not found")

    # Issue new access token (returned in body, frontend stores in memory).
    new_access = auth.create_access_token(
        user_id=user["id"],
        email=user["email"],
        workspaces=workspaces,
        active_workspace_id=auth.get_active_workspace_id(user_id, payload),
    )

    # Rotate: invalidate old jti, mint new refresh.
    new_refresh, _ = auth.rotate_refresh_token(user_id)

    response = JSONResponse({
        "success": True,
        "token": new_access,
        "user": _user_to_dict(user, workspaces),
        "workspaces": [...],
    })
    _set_refresh_cookie(response, new_refresh)
    return response
```

### 3.3 Modify `login` and `register`

```python
def login(...) -> Response:
    ...
    access = auth.create_access_token(...)
    refresh, _ = auth.create_refresh_token(user["id"])

    response = JSONResponse({
        "success": True,
        # NOTE: do NOT include `token` in body. The access token now arrives
        # in the `ada_access` cookie. The frontend axios interceptor reads
        # document.cookie to set the Authorization header on each request.
        "user": ...,
        "workspaces": [...],
    })
    _set_access_cookie(response, access)
    _set_refresh_cookie(response, refresh)
    return response
```

### 3.4 Cookie helper

```python
def _set_access_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="ada_access",
        value=token,
        max_age=ACCESS_TOKEN_TTL_SECONDS,
        httponly=False,            # readable by JS so axios can build the header
        secure=True,               # in prod
        samesite="strict",
        path="/",
    )

def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="ada_refresh",
        value=token,
        max_age=REFRESH_TOKEN_TTL_SECONDS,
        httponly=True,             # invisible to JS
        secure=True,
        samesite="strict",
        path="/auth/refresh",      # path-scoped: only sent to refresh endpoint
    )
```

In development (`APP_ENV != "production"`), `secure=False` so the cookie works over `http://localhost`.

### 3.5 Logout — invalidate the refresh token

```python
@router.post("/logout", summary="Logout and revoke refresh tokens")
def logout(request: Request) -> dict[str, Any]:
    raw = request.cookies.get("ada_refresh")
    if raw:
        payload = auth.decode_refresh_token(raw)
        if payload:
            auth.revoke_all_refresh_tokens(payload["sub"])
    response = JSONResponse({"success": True})
    response.delete_cookie("ada_access", path="/")
    response.delete_cookie("ada_refresh", path="/auth/refresh")
    return response
```

### 3.6 CORS — already configured

`app/main.py` already has `allow_credentials=True` and a specific origin allowlist. No changes needed.

### 3.7 Env vars

Add to `.env.example` and `render.yaml`:

```
REFRESH_TOKEN_SECRET=<at-least-32-chars>
ACCESS_TOKEN_SECRET=<optional; defaults to JWT_SECRET>
```

If `REFRESH_TOKEN_SECRET` is missing in production, refuse to start (same guard as `JWT_SECRET`).

---

## 4. Frontend changes

### 4.1 New axios behavior (`src/api/axios.ts`)

```ts
// On every request, copy the access cookie into the Authorization header.
api.interceptors.request.use((config) => {
  const token = readAccessCookie(); // reads document.cookie for "ada_access"
  if (token && !isJwtExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: call /auth/refresh (which reads the httpOnly cookie), then retry.
// On logout: call /auth/logout.
```

The existing `inFlightRefresh` singleton + `__isRefresh` flag pattern stays the same — only the response shape changes (no `access_token` in body any more, but the backend still returns it for one release so the frontend can migrate).

### 4.2 Auth service (`src/services/authService.ts`)

```ts
export async function refreshToken(): Promise<string> {
  const res = await api.post<{ token?: string }>("/auth/refresh");
  // Backwards-compat: if the server still returns the token in the body, use
  // it. Otherwise read the new cookie.
  const fromBody = res.data?.token;
  if (fromBody) return fromBody;
  const fromCookie = readAccessCookie();
  if (!fromCookie) throw new Error("No access token after refresh");
  return fromCookie;
}
```

### 4.3 authStore hydration (`src/store/authStore.ts`)

```ts
onRehydrateStorage: () => (state) => {
  if (!state) return;
  const cookieToken = readAccessCookie();
  if (cookieToken && !isJwtExpired(cookieToken)) {
    state.token = cookieToken;     // use cookie, not localStorage
    state.isAuthenticated = true;
    return;
  }
  // No cookie or expired: try silent refresh.
  refreshToken()
    .then((t) => {
      state.token = t;
      state.isAuthenticated = true;
    })
    .catch(() => {
      state.token = null;
      state.isAuthenticated = false;
    });
}
```

### 4.4 Remove localStorage writes

In `LoginPage.tsx`, `SignupPage.tsx`, `authStore.logout()`:
- Drop `localStorage.setItem("ai_analyst_jwt_token", …)` everywhere.
- Drop `localStorage.removeItem("ai_analyst_jwt_token", …)` in `logout()` — the server-side cookie deletion is the source of truth now.
- Delete the item once for users who have an old token persisted: on next page load, if the cookie is present, `localStorage.removeItem`.

### 4.5 The `readAccessCookie` helper

```ts
function readAccessCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)ada_access=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
```

---

## 5. Migration plan (zero-downtime)

The current frontend reads `localStorage.getItem("ai_analyst_jwt_token")`. The new backend will set the cookie. Roll out in this order:

1. **Backend deploys** with the new endpoints, BUT also keeps returning the `token` field in the body. Both old and new frontends keep working. CORS already permits credentials.
2. **Frontend deploys** to read from the cookie first, fall back to localStorage if missing. Drop the `localStorage.setItem` in `setAuth`.
3. **Frontend deploys again** to remove the localStorage fallback path entirely.
4. **Backend deploys** to stop returning `token` in the body.

At every step, existing users with a localStorage token keep working.

---

## 6. Files touched

| File | Change |
|---|---|
| `backend/app/services/auth_service.py` | New: `create_refresh_token`, `decode_refresh_token`, `rotate_refresh_token`, `revoke_all_refresh_tokens`, `is_jti_active`. Change `TOKEN_EXPIRE_SECONDS` → `ACCESS_TOKEN_TTL_SECONDS=900`. Add `REFRESH_TOKEN_TTL_SECONDS=604800`. |
| `backend/app/routes/auth.py` | New: `/auth/refresh`, `/auth/logout`. Modify: `login`, `register` to set cookies via `JSONResponse`. |
| `backend/app/main.py` | No change (CORS already correct). |
| `backend/.env.example` | Add `REFRESH_TOKEN_SECRET`. |
| `frontend/src/api/axios.ts` | Read token from cookie; call `/auth/logout`. |
| `frontend/src/services/authService.ts` | Update `refreshToken()` for the new shape. |
| `frontend/src/store/authStore.ts` | Hydrate from cookie; remove localStorage writes. |
| `frontend/src/lib/cookie.ts` (new) | `readAccessCookie()`. |
| `frontend/src/pages/Auth/{Login,Signup}Page.tsx` | Drop `localStorage.setItem`. |

---

## 7. Test plan

**Backend (pytest):**
- `test_refresh_rotation` — login → refresh returns new access + new refresh; old refresh is invalid.
- `test_refresh_reuse_revokes_all` — login twice, use old refresh, second user is logged out.
- `test_logout_clears_cookies` — logout → `Set-Cookie: ada_refresh=; Max-Age=0`.
- `test_login_sets_cookies` — response has both `ada_access` and `ada_refresh` with correct flags.
- `test_csrf_blocked` — third-party origin cannot call `/auth/refresh` without the cookie (path-scoped + SameSite=Strict).

**Frontend (vitest):**
- `axios.interceptor` — when cookie is present, request has `Authorization: Bearer …`.
- `authStore.onRehydrateStorage` — calls `/auth/refresh` if cookie missing but refresh cookie present.
- `Logout` — calls `/auth/logout`, then clears state.

**Manual smoke (Playwright):**
- Sign up → see auth-only UI, Network tab shows `Set-Cookie` for both.
- Hard refresh → still authenticated (cookie persists).
- Delete the access cookie in DevTools → next API call hits `/auth/refresh` silently.
- Sign out → both cookies are gone, redirect to `/login`.

---

## 8. Rollback

- Backend: revert the deploy. Old frontend still reads `localStorage`, ignores cookies.
- Frontend: revert the deploy. Old backend still returns the token in the body, the new `readAccessCookie` simply returns null in old browsers and falls through to the 401 path — which the user notices as a forced re-login, not a crash.

---

## 9. Effort

~2 days backend, ~1 day frontend, ~0.5 day test + manual smoke.
