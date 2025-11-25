// Re-export types from auth.ts directly to avoid circular dependency
export {
  AuthMethod,
  UserRole,
  Permission,
  JWTPayload,
  Session,
  AuthorizationContext,
} from '../auth.js';

export type {
  LoginCredentials,
  OAuthRequest,
  OAuthCallback,
  SAMLConfig,
  OIDCConfig,
  AuthResponse,
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  MFAConfig,
  MFAVerification,
  APIKey,
  RateLimitConfig,
} from '../auth.js';
