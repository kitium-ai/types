/**
 * Organization and Team Types
 * Multi-tenancy and team management types
 */

import type { UserRole, Permission } from './auth';

/**
 * Organization tiers/plans
 */
export enum OrganizationPlan {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

/**
 * Organization status
 */
export enum OrganizationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

/**
 * Organization billing period
 */
export enum BillingPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

/**
 * Core organization entity
 */
export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly logo?: string;
  readonly logoUrl?: string;
  readonly website?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly country?: string;
  readonly state?: string;
  readonly city?: string;
  readonly address?: string;
  readonly postalCode?: string;
  readonly timezone: string;
  readonly plan: OrganizationPlan;
  readonly status: OrganizationStatus;
  readonly seats: number;
  readonly maxSeats: number;
  readonly features: readonly string[];
  readonly owner: {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
  };
  readonly members: number;
  readonly teams: number;
  readonly billingPeriod: BillingPeriod;
  readonly trialEndsAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Organization settings
 */
export interface OrganizationSettings {
  readonly organizationId: string;
  readonly allowPublicSignup: boolean;
  readonly allowInviteOnly: boolean;
  readonly enforceSSO: boolean;
  readonly requireMFA: boolean;
  readonly defaultRole: UserRole;
  readonly allowTeamCreation: boolean;
  readonly allowProjectCreation: boolean;
  readonly dataResidency: 'us' | 'eu' | 'ap' | 'custom';
  readonly dataEncryption: boolean;
  readonly auditLoggingEnabled: boolean;
  readonly retentionPolicyDays: number;
  readonly ipWhitelist?: readonly string[];
  readonly apiRateLimitPerHour: number;
  readonly customDomain?: string;
  readonly brandingCustomization: boolean;
  readonly darkModeEnabled: boolean;
}

/**
 * Organization member with role assignment
 */
export interface OrganizationMember {
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatar?: string;
  };
  readonly role: UserRole;
  readonly permissions: readonly Permission[];
  readonly teamIds: readonly string[];
  readonly joinedAt: Date;
  readonly lastActiveAt?: Date;
  readonly isOwner: boolean;
}

/**
 * Team entity for grouping and managing projects
 */
export interface Team {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly description?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly members: number;
  readonly projects: number;
  readonly projects_limit: number;
  readonly created_by: string;
  readonly is_public: boolean;
  readonly is_archived: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly archivedAt?: Date;
}

/**
 * Team member with specific role
 */
export interface TeamMember {
  readonly id: string;
  readonly teamId: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatar?: string;
  };
  readonly role: UserRole;
  readonly permissions: readonly Permission[];
  readonly joinedAt: Date;
  readonly lastActiveAt?: Date;
}

/**
 * Team settings
 */
export interface TeamSettings {
  readonly teamId: string;
  readonly organizationId: string;
  readonly allowPublicProjects: boolean;
  readonly allowMemberInvitation: boolean;
  readonly defaultMemberRole: UserRole;
  readonly allowTeamLeadModeration: boolean;
  readonly slackIntegration?: {
    readonly enabled: boolean;
    readonly webhookUrl: string;
    readonly channel: string;
  };
  readonly githubIntegration?: {
    readonly enabled: boolean;
    readonly organization?: string;
  };
}

/**
 * Department structure within organization
 */
export interface Department {
  readonly id: string;
  readonly organizationId: string;
  readonly parentDepartmentId?: string;
  readonly name: string;
  readonly description?: string;
  readonly head?: string; // User ID
  readonly members: number;
  readonly budget?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Organization resource quota
 */
export interface ResourceQuota {
  readonly organizationId: string;
  readonly storageQuotaGB: number;
  readonly storageUsedGB: number;
  readonly apiCallsPerDay: number;
  readonly apiCallsUsedToday: number;
  readonly usersLimit: number;
  readonly usersUsed: number;
  readonly projectsLimit: number;
  readonly projectsUsed: number;
  readonly webhooksLimit: number;
  readonly webhooksUsed: number;
  readonly integrationsLimit: number;
  readonly integrationsUsed: number;
  readonly customDomainsLimit: number;
  readonly customDomainsUsed: number;
  readonly ssoLimit: number;
  readonly ssoUsed: number;
  readonly lastUpdatedAt: Date;
}

/**
 * Organization audit log entry
 */
export interface OrganizationAuditLog {
  readonly id: string;
  readonly organizationId: string;
  readonly actorId: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly changes?: Record<string, unknown>;
  readonly metadata?: Record<string, unknown>;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly status: 'success' | 'failure';
  readonly timestamp: Date;
}

/**
 * Request to create organization
 */
export interface CreateOrganizationRequest {
  readonly name: string;
  readonly slug?: string;
  readonly description?: string;
  readonly website?: string;
  readonly country?: string;
  readonly timezone?: string;
  readonly plan?: OrganizationPlan;
}

/**
 * Request to update organization
 */
export interface UpdateOrganizationRequest {
  readonly name?: string;
  readonly description?: string;
  readonly logo?: string;
  readonly website?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly country?: string;
  readonly state?: string;
  readonly city?: string;
  readonly address?: string;
  readonly postalCode?: string;
  readonly timezone?: string;
}

/**
 * Request to invite user to organization
 */
export interface InviteOrganizationMemberRequest {
  readonly email: string;
  readonly role: UserRole;
  readonly permissions?: readonly Permission[];
  readonly teamIds?: readonly string[];
}

/**
 * Request to create team
 */
export interface CreateTeamRequest {
  readonly name: string;
  readonly description?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly projectsLimit?: number;
}

/**
 * Request to update team
 */
export interface UpdateTeamRequest {
  readonly name?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly isPublic?: boolean;
  readonly isArchived?: boolean;
}

/**
 * Organization invitation for external users
 */
export interface OrganizationInvite {
  readonly id: string;
  readonly organizationId: string;
  readonly email: string;
  readonly invitedBy: string;
  readonly role: UserRole;
  readonly permissions: readonly Permission[];
  readonly teamIds?: readonly string[];
  readonly token: string;
  readonly expiresAt: Date;
  readonly acceptedAt?: Date;
  readonly status: 'pending' | 'accepted' | 'rejected' | 'expired';
  readonly createdAt: Date;
}
