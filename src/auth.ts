/**
 * Authentication Types
 * Core authentication and user session types for enterprise SaaS applications
 */

/**
 * Supported authentication methods
 */
export enum AuthMethod {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  MICROSOFT = 'microsoft',
  SAML = 'saml',
  OIDC = 'oidc',
}

/**
 * User roles with hierarchical permissions
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  OWNER = 'owner',
  MANAGER = 'manager',
  MEMBER = 'member',
  VIEWER = 'viewer',
  GUEST = 'guest',
}

/**
 * Detailed permission types for granular access control
 */
export enum Permission {
  // Organization permissions
  ORG_CREATE = 'org:create',
  ORG_READ = 'org:read',
  ORG_UPDATE = 'org:update',
  ORG_DELETE = 'org:delete',
  ORG_INVITE = 'org:invite',
  ORG_SETTINGS = 'org:settings',

  // User management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_ROLE_MANAGE = 'user:role:manage',

  // Product permissions
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  PRODUCT_PUBLISH = 'product:publish',

  // Billing permissions
  BILLING_READ = 'billing:read',
  BILLING_UPDATE = 'billing:update',
  BILLING_INVOICE = 'billing:invoice',

  // Team permissions
  TEAM_CREATE = 'team:create',
  TEAM_READ = 'team:read',
  TEAM_UPDATE = 'team:update',
  TEAM_DELETE = 'team:delete',
  TEAM_INVITE = 'team:invite',

  // Settings permissions
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',
  SETTINGS_INTEGRATIONS = 'settings:integrations',

  // Analytics permissions
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',

  // Audit permissions
  AUDIT_READ = 'audit:read',
  AUDIT_EXPORT = 'audit:export',
}

/**
 * JWT Token payload structure
 */
export interface JWTPayload {
  readonly sub: string; // Subject (user ID)
  readonly email: string;
  readonly aud: string; // Audience
  readonly iss: string; // Issuer
  readonly iat: number; // Issued at
  readonly exp: number; // Expiration time
  readonly roles: readonly UserRole[];
  readonly permissions: readonly Permission[];
  readonly orgId: string;
  readonly teamIds: readonly string[];
}

/**
 * Session information stored after authentication
 */
export interface Session {
  readonly id: string;
  readonly userId: string;
  readonly orgId: string;
  readonly teamIds: readonly string[];
  readonly roles: readonly UserRole[];
  readonly permissions: readonly Permission[];
  readonly authMethod: AuthMethod;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly lastActivityAt: Date;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly isActive: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

/**
 * OAuth authentication request
 */
export interface OAuthRequest {
  readonly provider: AuthMethod;
  readonly redirectUri: string;
  readonly state: string;
  readonly nonce?: string;
  readonly scope?: string;
}

/**
 * OAuth callback response
 */
export interface OAuthCallback {
  readonly provider: AuthMethod;
  readonly code: string;
  readonly state: string;
  readonly idToken?: string;
}

/**
 * SAML configuration for SSO
 */
export interface SAMLConfig {
  readonly entryPoint: string;
  readonly issuer: string;
  readonly cert: string;
  readonly privateKey: string;
  readonly signatureAlgorithm: 'sha1' | 'sha256';
  readonly digestAlgorithm: 'sha1' | 'sha256';
}

/**
 * OIDC configuration
 */
export interface OIDCConfig {
  readonly discoveryUrl: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly scope: string;
  readonly responseType: 'code' | 'id_token';
  readonly responseMode?: 'query' | 'fragment' | 'form_post';
}

/**
 * Authentication response with tokens
 */
export interface AuthResponse {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresIn: number;
  readonly tokenType: 'Bearer' | 'Basic';
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
  };
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  readonly refreshToken: string;
  readonly clientId: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  readonly email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirm {
  readonly token: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

/**
 * Multi-factor authentication (MFA) configuration
 */
export interface MFAConfig {
  readonly enabled: boolean;
  readonly method: 'totp' | 'sms' | 'email';
  readonly secret?: string;
  readonly phoneNumber?: string;
  readonly backupCodes?: readonly string[];
  readonly verified: boolean;
  readonly createdAt: Date;
}

/**
 * MFA verification request
 */
export interface MFAVerification {
  readonly code: string;
  readonly method: 'totp' | 'sms' | 'email';
  readonly rememberDevice?: boolean;
}

/**
 * API Key for authentication
 */
export interface APIKey {
  readonly id: string;
  readonly userId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly key: string;
  readonly secret: string;
  readonly permissions: readonly Permission[];
  readonly lastUsedAt?: Date;
  readonly expiresAt?: Date;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  readonly enabled: boolean;
  readonly requestsPerMinute: number;
  readonly requestsPerHour: number;
  readonly requestsPerDay: number;
  readonly burstLimit?: number;
}

/**
 * Authorization context for request handling
 */
export interface AuthorizationContext {
  readonly userId: string;
  readonly orgId: string;
  readonly teamIds: readonly string[];
  readonly roles: readonly UserRole[];
  readonly permissions: readonly Permission[];
  readonly session: Session;
}
