export const AUTH_CONFIG = {
  sessionDurationMs: 8 * 60 * 60 * 1000,
  loginWindowMs: 15 * 60 * 1000,
  emailFailureLimit: 5,
  ipFailureLimit: 20,
  loginFailureRetentionMs: 24 * 60 * 60 * 1000,
} as const;
