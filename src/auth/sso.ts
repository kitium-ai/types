/**
 * Single Sign-On (SSO) Types
 * Types for OIDC, SAML, and OAuth SSO integration
 */

/**
 * SSO provider type
 */
export type SSOProviderType = 'saml' | 'oidc' | 'oauth';

/**
 * SSO configuration
 */
export interface SSOConfig {
  readonly enabled: boolean;
  readonly allowMultipleProviders?: boolean; // Allow linking multiple SSO providers
  readonly autoProvision?: boolean; // Auto-create users on first login
  readonly defaultPlan?: string; // Plan to assign to auto-provisioned users
  readonly syncUserData?: boolean; // Sync user profile data from provider
}

/**
 * OIDC provider configuration
 * Note: Properties use snake_case to match OIDC/OAuth2 standard specifications
 */

export interface OIDCProvider {
  readonly id: string;
  readonly type: 'oidc';
  readonly name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly metadata_url: string; // OIDC provider metadata endpoint
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly redirect_uris: readonly string[];
  readonly scopes?: readonly string[]; // Default: ['openid', 'profile', 'email']
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly response_type?: string; // Default: 'code'
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_method?: string; // Default: 'client_secret_basic'
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly claim_mapping?: {
    readonly nameAttribute?: string; // Default: 'name'
    readonly emailAttribute?: string; // Default: 'email'
    readonly pictureAttribute?: string; // Default: 'picture'
    readonly subAttribute?: string; // Default: 'sub'
  };
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * SAML provider configuration
 * Note: Properties use snake_case to match SAML standard specifications
 */

export interface SAMLProvider {
  readonly id: string;
  readonly type: 'saml';
  readonly name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly idp_entity_id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly idp_sso_url: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly idp_slo_url?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly idp_certificate?: string; // Public certificate for signature verification
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly sp_entity_id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly sp_acs_url: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly sp_slo_url?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly signing_cert?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly signing_key?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly encryption_enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly force_authn?: boolean; // Force re-authentication
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly allow_unencrypted_assertion?: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly attribute_mapping?: {
    readonly nameAttribute?: string; // Default: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
    readonly emailAttribute?: string; // Default: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
    readonly pictureAttribute?: string;
    readonly subAttribute?: string; // Default: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
  };
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * SSO session
 */
export interface SSOSession {
  readonly id: string;
  readonly userId: string;
  readonly providerId: string;
  readonly providerType: SSOProviderType;
  readonly providerSubject: string; // Subject ID from provider
  readonly sessionToken?: string; // Session token from provider
  readonly expiresAt: Date;
  readonly linkedAt: Date;
  readonly lastAuthAt: Date;
}

/**
 * SSO link (user-provider association)
 */
export interface SSOLink {
  readonly id: string;
  readonly userId: string;
  readonly providerId: string;
  readonly providerType: SSOProviderType;
  readonly providerSubject: string; // Remote user ID from provider
  readonly providerEmail?: string; // Email from provider
  readonly autoProvisioned?: boolean;
  readonly metadata?: Record<string, unknown>;
  readonly linkedAt: Date;
  readonly lastAuthAt: Date;
}

/**
 * OIDC token response
 * Note: Properties use snake_case to match OAuth2/OIDC standard token response format
 */

export interface OIDCTokenResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly access_token: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_type: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly expires_in?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly refresh_token?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token?: string;
  readonly scope?: string;
}

/**
 * OIDC user info
 * Note: Properties use snake_case to match OIDC standard userinfo claims
 */

export interface OIDCUserInfo {
  readonly sub: string;
  readonly name?: string;
  readonly email?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly email_verified?: boolean;
  readonly picture?: string;
  readonly locale?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * SAML assertion
 */
export interface SAMLAssertion {
  readonly nameID: string;
  readonly sessionIndex?: string;
  readonly notBefore?: Date;
  readonly notOnOrAfter?: Date;
  readonly attributes?: Record<string, unknown>;
  readonly metadata?: Record<string, unknown>;
}
