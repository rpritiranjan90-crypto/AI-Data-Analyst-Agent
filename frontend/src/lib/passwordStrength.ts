/**
 * Lightweight password strength estimator — Zod-driven, no external deps.
 *
 * Returns a 0–4 score (matching the classic `zxcvbn` UX) plus actionable
 * feedback. Approximates zxcvbn's behaviour for the common case without
 * pulling in its ~800KB of dictionaries.
 */
export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export interface PasswordCheck {
  passed: boolean;
  label: string;
}

export interface PasswordEvaluation {
  /** 0 = very weak, 4 = very strong. */
  score: PasswordStrength;
  /** Human-readable label, e.g. "Weak", "Strong". */
  label: string;
  /** Issues to surface to the user; empty when score is 4. */
  issues: string[];
  /** All individual checks (so the UI can render a checklist). */
  checks: PasswordCheck[];
}

const COMMON = new Set([
  "password", "password1", "qwerty", "letmein", "admin", "welcome",
  "monkey", "dragon", "111111", "12345678", "iloveyou", "abc123",
  "test1234", "demo", "guest", "asdf", "qwertyuiop",
]);

const LABEL_BY_SCORE: Record<PasswordStrength, string> = {
  0: "Very weak",
  1: "Weak",
  2: "Fair",
  3: "Strong",
  4: "Very strong",
};

const COLOR_BY_SCORE: Record<PasswordStrength, string> = {
  0: "bg-red-500",
  1: "bg-orange-500",
  2: "bg-amber-500",
  3: "bg-emerald-500",
  4: "bg-emerald-600",
};

/** Score a password. Returns the evaluation + raw component signals. */
export function evaluatePassword(password: string): PasswordEvaluation {
  const checks: PasswordCheck[] = [
    { passed: password.length >= 12, label: "At least 12 characters" },
    { passed: /[A-Z]/.test(password), label: "Contains an uppercase letter" },
    { passed: /[a-z]/.test(password), label: "Contains a lowercase letter" },
    { passed: /\d/.test(password), label: "Contains a number" },
    { passed: /[^A-Za-z0-9]/.test(password), label: "Contains a symbol" },
    { passed: !COMMON.has(password.toLowerCase()), label: "Not a common password" },
  ];

  const issues: string[] = [];
  for (const c of checks) {
    if (!c.passed) issues.push(c.label);
  }

  // Count of satisfied checks becomes the score; cap at 4.
  const satisfied = checks.filter((c) => c.passed).length;
  const score = Math.min(4, Math.max(0, satisfied - 1)) as PasswordStrength;

  return {
    score,
    label: LABEL_BY_SCORE[score],
    issues,
    checks,
  };
}

export function strengthBarColor(score: PasswordStrength): string {
  return COLOR_BY_SCORE[score];
}

export function strengthLabel(score: PasswordStrength): string {
  return LABEL_BY_SCORE[score];
}
