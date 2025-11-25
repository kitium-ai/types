/**
 * User Types
 * Core user profile and account management types
 */

import type { UserRole, Permission, MFAConfig, AuthMethod } from './auth';
import type { OrganizationId, SupportedLocale, TeamId, UserId } from './primitives';

/**
 * Account status for user lifecycle management
 */
export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
  PENDING_VERIFICATION = 'pending_verification',
  PENDING_INVITATION = 'pending_invitation',
}

/**
 * User preferences for notifications and settings
 */
export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook',
  SLACK = 'slack',
  TEAMS = 'teams',
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  readonly email: {
    readonly productUpdates: boolean;
    readonly securityAlerts: boolean;
    readonly billingNotifications: boolean;
    readonly teamInvitations: boolean;
    readonly weeklyDigest: boolean;
  };
  readonly sms: {
    readonly enabled: boolean;
    readonly criticalAlertsOnly: boolean;
  };
  readonly inApp: {
    readonly enabled: boolean;
  };
  readonly slack?: {
    readonly enabled: boolean;
    readonly webhookUrl: string;
    readonly channels: readonly string[];
  };
  readonly teams?: {
    readonly enabled: boolean;
    readonly webhookUrl: string;
  };
  readonly timezone: string;
  readonly language: SupportedLocale;
}

/**
 * User profile information
 */
export interface UserProfile {
  readonly id: UserId;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly avatar?: string;
  readonly avatarUrl?: string;
  readonly bio?: string;
  readonly title?: string;
  readonly department?: string;
  readonly company?: string;
  readonly location?: string;
  readonly phone?: string;
  readonly timezone: string;
  readonly language: SupportedLocale;
  readonly twoFactorEnabled: boolean;
  readonly emailVerified: boolean;
  readonly phoneVerified: boolean;
  readonly lastLogin?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Complete user account entity
 */
export interface User extends UserProfile {
  readonly status: AccountStatus;
  readonly roles: readonly UserRole[];
  readonly permissions: readonly Permission[];
  readonly mfaConfig?: MFAConfig;
  readonly notificationPreferences: NotificationPreferences;
  readonly authenticatedWith: readonly AuthMethod[];
  readonly isEmailVerified: boolean;
  readonly isPhoneVerified: boolean;
  readonly isSuperAdmin: boolean;
  readonly deletedAt?: Date;
}

/**
 * User invitation for onboarding
 */
export interface UserInvitation {
  readonly id: string;
  readonly email: string;
  readonly invitedBy: string;
  readonly organizationId: OrganizationId;
  readonly teamIds?: readonly TeamId[];
  readonly roles: readonly UserRole[];
  readonly permissions: readonly Permission[];
  readonly token: string;
  readonly expiresAt: Date;
  readonly acceptedAt?: Date;
  readonly acceptedBy?: string;
  readonly rejectedAt?: Date;
  readonly status: 'pending' | 'accepted' | 'rejected' | 'expired';
  readonly createdAt: Date;
}

/**
 * User account settings
 */
export interface UserSettings {
  readonly userId: UserId;
  readonly privateProfile: boolean;
  readonly allowEmailMarketing: boolean;
  readonly twoFactorRequired: boolean;
  readonly sessionTimeout: number; // in minutes
  readonly activityLogging: boolean;
  readonly dataRetention: number; // in days
  readonly loginAttemptLimit: number;
  readonly loginAttemptWindow: number; // in minutes
  readonly passwordExpiryDays?: number;
  readonly passwordMinLength: number;
  readonly passwordRequireUppercase: boolean;
  readonly passwordRequireNumbers: boolean;
  readonly passwordRequireSpecialChars: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * User activity log entry
 */
export interface UserActivityLog {
  readonly id: string;
  readonly userId: UserId;
  readonly organizationId: OrganizationId;
  readonly action: string;
  readonly resource: string;
  readonly resourceId: string;
  readonly changes?: Record<string, unknown>;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly status: 'success' | 'failure';
  readonly errorMessage?: string;
  readonly timestamp: Date;
}

/**
 * User authentication history
 */
export interface AuthenticationHistory {
  readonly id: string;
  readonly userId: UserId;
  readonly method: AuthMethod;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly status: 'success' | 'failed' | 'mfa_required';
  readonly failureReason?: string;
  readonly timestamp: Date;
  readonly sessionId?: string;
}

/**
 * User profile update request
 */
export interface UpdateUserProfileRequest {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly bio?: string;
  readonly title?: string;
  readonly department?: string;
  readonly company?: string;
  readonly location?: string;
  readonly phone?: string;
  readonly timezone?: string;
  readonly language?: SupportedLocale;
}

/**
 * User registration request
 */
export interface UserRegistrationRequest {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptTerms: boolean;
  readonly acceptPrivacy: boolean;
  readonly companyName?: string;
  readonly timezone?: string;
  readonly language?: SupportedLocale;
}

/**
 * User export data request for GDPR compliance
 */
export interface UserDataExportRequest {
  readonly userId: UserId;
  readonly format: 'json' | 'csv' | 'xml';
  readonly includeActivityLogs: boolean;
  readonly includeSessions: boolean;
  readonly includeAuthHistory: boolean;
  readonly requestedAt: Date;
}

/**
 * User deletion request with compliance
 */
export interface UserDeletionRequest {
  readonly userId: UserId;
  readonly reason?: string;
  readonly anonymize: boolean;
  readonly retentionDays: number;
  readonly requestedAt: Date;
  readonly requestedBy: string;
}

/**
 * User workspace preferences
 */
export interface WorkspacePreferences {
  readonly userId: UserId;
  readonly defaultOrganizationId: OrganizationId;
  readonly defaultTeamId?: TeamId;
  readonly sidebarCollapsed: boolean;
  readonly themeMode: 'light' | 'dark' | 'auto';
  readonly compactView: boolean;
  readonly showOnboarding: boolean;
  readonly recentViews: readonly string[];
  readonly pinnedItems: readonly string[];
}

/**
 * User device information for device tracking
 */
export interface UserDevice {
  readonly id: string;
  readonly userId: UserId;
  readonly deviceName: string;
  readonly deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  readonly osType: string;
  readonly osVersion: string;
  readonly browserName: string;
  readonly browserVersion: string;
  readonly ipAddress: string;
  readonly isCurrentDevice: boolean;
  readonly lastActiveAt: Date;
  readonly createdAt: Date;
  readonly trustedUntil?: Date;
}
