// Re-export types from auth.ts directly to avoid circular dependency
export { AuthMethod, UserRole, Permission } from '../auth.js';

export type {
  JWTPayload,
  Session,
  AuthorizationContext,
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
