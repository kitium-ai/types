/**
 * Database Entity Types
 * Core entity types for database persistence layer
 * Single source of truth for database schema mapping
 */

import type {
  AccountStatus,
  AuthMethod,
  UserRole,
  Permission,
  OrganizationPlan,
  OrganizationStatus,
  BillingPeriod,
  SubscriptionStatus,
  BillingCycle,
  PaymentStatus,
  InvoiceStatus,
  ProductStatus,
  FeatureStatus,
  FeatureTier,
  ReleaseType,
  TaxType,
  PaymentMethodType,
} from './index';

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}

/**
 * Auditable entity with audit trail
 */
export interface AuditableEntity extends BaseEntity {
  readonly createdBy: string;
  readonly updatedBy?: string;
  readonly deletedAt?: Date;
  readonly deletedBy?: string;
}

/**
 * User database entity
 */
export interface UserEntity extends AuditableEntity {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly passwordHash: string;
  readonly status: AccountStatus;
  readonly roles: readonly UserRole[];
  readonly permissions: readonly Permission[];
  readonly avatar?: string;
  readonly bio?: string;
  readonly title?: string;
  readonly department?: string;
  readonly company?: string;
  readonly location?: string;
  readonly phone?: string;
  readonly timezone: string;
  readonly language: 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh' | 'ru';
  readonly emailVerified: boolean;
  readonly emailVerifiedAt?: Date;
  readonly phoneVerified: boolean;
  readonly phoneVerifiedAt?: Date;
  readonly twoFactorEnabled: boolean;
  readonly lastLogin?: Date;
  readonly lastLoginIp?: string;
  readonly loginAttempts: number;
  readonly loginAttemptsResetAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * User settings database entity
 */
export interface UserSettingsEntity extends BaseEntity {
  readonly userId: string;
  readonly privateProfile: boolean;
  readonly allowEmailMarketing: boolean;
  readonly twoFactorRequired: boolean;
  readonly sessionTimeout: number;
  readonly activityLogging: boolean;
  readonly dataRetention: number;
  readonly loginAttemptLimit: number;
  readonly loginAttemptWindow: number;
  readonly passwordExpiryDays?: number;
  readonly passwordMinLength: number;
  readonly passwordRequireUppercase: boolean;
  readonly passwordRequireNumbers: boolean;
  readonly passwordRequireSpecialChars: boolean;
}

/**
 * User notification preferences database entity
 */
export interface NotificationPreferencesEntity extends BaseEntity {
  readonly userId: string;
  readonly emailProductUpdates: boolean;
  readonly emailSecurityAlerts: boolean;
  readonly emailBillingNotifications: boolean;
  readonly emailTeamInvitations: boolean;
  readonly emailWeeklyDigest: boolean;
  readonly smsEnabled: boolean;
  readonly smsCriticalAlertsOnly: boolean;
  readonly inAppEnabled: boolean;
  readonly slackEnabled: boolean;
  readonly slackWebhookUrl?: string;
  readonly slackChannels?: readonly string[];
  readonly teamsEnabled: boolean;
  readonly teamsWebhookUrl?: string;
  readonly timezone: string;
  readonly language: 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh' | 'ru';
}

/**
 * Authentication history database entity
 */
export interface AuthenticationHistoryEntity extends BaseEntity {
  readonly userId: string;
  readonly method: AuthMethod;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly status: 'success' | 'failed' | 'mfa_required';
  readonly failureReason?: string;
  readonly sessionId?: string;
}

/**
 * Session database entity
 */
export interface SessionEntity extends BaseEntity {
  readonly userId: string;
  readonly organizationId: string;
  readonly teamIds: readonly string[];
  readonly roles: readonly UserRole[];
  readonly permissions: readonly Permission[];
  readonly authMethod: AuthMethod;
  readonly expiresAt: Date;
  readonly lastActivityAt: Date;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly isActive: boolean;
  readonly revokedAt?: Date;
}

/**
 * API Key database entity
 */
export interface APIKeyEntity extends AuditableEntity {
  readonly userId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly keyHash: string;
  readonly secretHash: string;
  readonly permissions: readonly Permission[];
  readonly lastUsedAt?: Date;
  readonly expiresAt?: Date;
  readonly isActive: boolean;
}

/**
 * Organization database entity
 */
export interface OrganizationEntity extends AuditableEntity {
  readonly name: string;
  readonly slug: string;
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
  readonly timezone: string;
  readonly plan: OrganizationPlan;
  readonly status: OrganizationStatus;
  readonly seats: number;
  readonly maxSeats: number;
  readonly features: readonly string[];
  readonly ownerId: string;
  readonly members: number;
  readonly teams: number;
  readonly billingPeriod: BillingPeriod;
  readonly trialEndsAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Organization settings database entity
 */
export interface OrganizationSettingsEntity extends BaseEntity {
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
 * Organization member database entity
 */
export interface OrganizationMemberEntity extends BaseEntity {
  readonly organizationId: string;
  readonly userId: string;
  readonly role: UserRole;
  readonly permissions: readonly Permission[];
  readonly teamIds: readonly string[];
  readonly joinedAt: Date;
  readonly lastActiveAt?: Date;
  readonly isOwner: boolean;
  readonly invitedBy?: string;
}

/**
 * Team database entity
 */
export interface TeamEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly name: string;
  readonly description?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly members: number;
  readonly projects: number;
  readonly projectsLimit: number;
  readonly isPublic: boolean;
  readonly isArchived: boolean;
  readonly archivedAt?: Date;
}

/**
 * Team member database entity
 */
export interface TeamMemberEntity extends BaseEntity {
  readonly teamId: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly role: UserRole;
  readonly permissions: readonly Permission[];
  readonly joinedAt: Date;
  readonly lastActiveAt?: Date;
}

/**
 * Product database entity
 */
export interface ProductEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly icon?: string;
  readonly color?: string;
  readonly status: ProductStatus;
  readonly productVersion: string;
  readonly ownerId: string;
  readonly teamId?: string;
  readonly category?: string;
  readonly tags: readonly string[];
  readonly documentation?: string;
  readonly supportEmail?: string;
  readonly features: number;
  readonly releases: number;
  readonly visibility: 'private' | 'internal' | 'public';
  readonly isArchived: boolean;
  readonly archivedAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Feature database entity
 */
export interface FeatureEntity extends AuditableEntity {
  readonly productId: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly status: FeatureStatus;
  readonly tier: FeatureTier;
  readonly ownerId: string;
  readonly epicId?: string;
  readonly priority: number;
  readonly estimatedHours?: number;
  readonly developmentHours?: number;
  readonly tags: readonly string[];
  readonly documentation?: string;
  readonly dependsOn?: readonly string[];
  readonly relatedFeatures?: readonly string[];
  readonly acceptanceCriteria?: readonly string[];
  readonly testCases?: readonly string[];
  readonly usageCount: number;
  readonly adoptionRate: number;
  readonly satisfactionScore: number;
  readonly targetReleaseVersion?: string;
  readonly actualReleaseVersion?: string;
  readonly releaseDate?: Date;
  readonly deprecatedAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Release database entity
 */
export interface ReleaseEntity extends AuditableEntity {
  readonly productId: string;
  readonly releaseVersion: string;
  readonly releaseType: ReleaseType;
  readonly name: string;
  readonly description: string;
  readonly changelog: string;
  readonly features: readonly string[];
  readonly bugFixes: readonly string[];
  readonly improvements: readonly string[];
  readonly releaseDate: Date;
  readonly releasedById: string;
  readonly status: 'draft' | 'scheduled' | 'released' | 'rollback';
  readonly downloadUrl?: string;
  readonly documentationUrl?: string;
  readonly breakingChanges?: readonly string[];
  readonly migrationsGuide?: string;
  readonly supportedUntil?: Date;
  readonly rollbackVersion?: string;
  readonly rollbackReason?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Subscription database entity
 */
export interface SubscriptionEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly customerId: string;
  readonly planId: string;
  readonly status: SubscriptionStatus;
  readonly billingCycle: BillingCycle;
  readonly currentPeriodStart: Date;
  readonly currentPeriodEnd: Date;
  readonly trialStart?: Date;
  readonly trialEnd?: Date;
  readonly canceledAt?: Date;
  readonly cancelReason?: string;
  readonly autoRenew: boolean;
  readonly collectionMethod: 'send_invoice' | 'charge_automatically';
  readonly defaultPaymentMethodId?: string;
  readonly itemCount: number;
  readonly totalPrice: number;
  readonly currency: string;
  readonly discountCode?: string;
  readonly discountPercentOff?: number;
  readonly discountAmountOff?: number;
  readonly discountRecurring: boolean;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Payment method database entity
 */
export interface PaymentMethodEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly type: PaymentMethodType;
  readonly isDefault: boolean;
  readonly billingName?: string;
  readonly billingEmail?: string;
  readonly billingPhone?: string;
  readonly billingLine1?: string;
  readonly billingLine2?: string;
  readonly billingCity?: string;
  readonly billingState?: string;
  readonly billingCountry?: string;
  readonly billingPostalCode?: string;
  readonly cardLast4?: string;
  readonly cardBrand?: string;
  readonly cardExpiryMonth?: number;
  readonly cardExpiryYear?: number;
  readonly bankLast4?: string;
  readonly bankName?: string;
  readonly bankAccountType?: 'checking' | 'savings';
  readonly bankRoutingNumber?: string;
  readonly paypalEmail?: string;
  readonly verificationStatus: 'unverified' | 'pending' | 'verified' | 'failed';
  readonly verificationAttempts: number;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Invoice database entity
 */
export interface InvoiceEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly customerId: string;
  readonly number: string;
  readonly status: InvoiceStatus;
  readonly subscriptionId?: string;
  readonly subtotal: number;
  readonly discountCode?: string;
  readonly discountAmount?: number;
  readonly taxType?: TaxType;
  readonly taxPercentage?: number;
  readonly taxAmount?: number;
  readonly total: number;
  readonly currency: string;
  readonly paidAmount: number;
  readonly dueDate: Date;
  readonly issuedAt: Date;
  readonly sentAt?: Date;
  readonly paidAt?: Date;
  readonly viewedAt?: Date;
  readonly dueInDays: number;
  readonly description?: string;
  readonly notes?: string;
  readonly pdfUrl?: string;
  readonly receiptUrl?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Payment transaction database entity
 */
export interface PaymentTransactionEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly invoiceId?: string;
  readonly paymentMethodId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly type: 'charge' | 'refund' | 'adjustment';
  readonly description: string;
  readonly failureReason?: string;
  readonly retryCount: number;
  readonly lastRetried?: Date;
  readonly reference?: string;
  readonly receiptId?: string;
  readonly receiptUrl?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Webhook configuration database entity
 */
export interface WebhookConfigEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly url: string;
  readonly events: readonly string[];
  readonly secretHash: string;
  readonly headers?: Record<string, string>;
  readonly isActive: boolean;
  readonly maxRetries: number;
  readonly backoffMultiplier: number;
  readonly initialDelayMs: number;
  readonly lastTriggeredAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Webhook delivery log database entity
 */
export interface WebhookDeliveryEntity extends BaseEntity {
  readonly webhookId: string;
  readonly event: string;
  readonly payloadHash: string;
  readonly statusCode?: number;
  readonly responseHash?: string;
  readonly error?: string;
  readonly retryCount: number;
  readonly nextRetryAt?: Date;
  readonly deliveredAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Audit log database entity
 */
export interface AuditLogEntity extends BaseEntity {
  readonly organizationId: string;
  readonly actorId: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly changesHash?: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly status: 'success' | 'failure';
  readonly errorMessage?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Activity log database entity
 */
export interface ActivityLogEntity extends BaseEntity {
  readonly userId: string;
  readonly organizationId: string;
  readonly action: string;
  readonly resource: string;
  readonly resourceId: string;
  readonly changesHash?: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly status: 'success' | 'failure';
  readonly errorMessage?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * File upload database entity
 */
export interface FileUploadEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly size: number;
  readonly storageUrl: string;
  readonly publicUrl: string;
  readonly uploadedById: string;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly checksum: string;
  readonly isPublic: boolean;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Error log database entity
 */
export interface ErrorLogEntity extends BaseEntity {
  readonly code: string;
  readonly severity: 'info' | 'warning' | 'error' | 'critical';
  readonly message: string;
  readonly stack?: string;
  readonly userId?: string;
  readonly organizationId?: string;
  readonly requestId?: string;
  readonly method?: string;
  readonly path?: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly resolved: boolean;
  readonly resolvedAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Email template database entity
 */
export interface EmailTemplateEntity extends AuditableEntity {
  readonly organizationId: string;
  readonly name: string;
  readonly subject: string;
  readonly htmlBody: string;
  readonly plainTextBody: string;
  readonly variables: readonly string[];
  readonly isActive: boolean;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Feature flag database entity
 */
export interface FeatureFlagEntity extends BaseEntity {
  readonly name: string;
  readonly description?: string;
  readonly enabled: boolean;
  readonly percentage?: number;
  readonly userIds?: readonly string[];
  readonly organizationIds?: readonly string[];
  readonly regions?: readonly string[];
  readonly expiresAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Rate limit config database entity
 */
export interface RateLimitConfigEntity extends BaseEntity {
  readonly organizationId?: string;
  readonly userId?: string;
  readonly endpoint: string;
  readonly requestsPerSecond?: number;
  readonly requestsPerMinute?: number;
  readonly requestsPerHour?: number;
  readonly requestsPerDay?: number;
  readonly concurrentRequests?: number;
  readonly burstLimit?: number;
  readonly whitelistedIps?: readonly string[];
}

/**
 * Map entity types to their keys
 */
export type EntityMap = {
  users: UserEntity;
  userSettings: UserSettingsEntity;
  notificationPreferences: NotificationPreferencesEntity;
  authenticationHistory: AuthenticationHistoryEntity;
  sessions: SessionEntity;
  apiKeys: APIKeyEntity;
  organizations: OrganizationEntity;
  organizationSettings: OrganizationSettingsEntity;
  organizationMembers: OrganizationMemberEntity;
  teams: TeamEntity;
  teamMembers: TeamMemberEntity;
  products: ProductEntity;
  features: FeatureEntity;
  releases: ReleaseEntity;
  subscriptions: SubscriptionEntity;
  paymentMethods: PaymentMethodEntity;
  invoices: InvoiceEntity;
  paymentTransactions: PaymentTransactionEntity;
  webhookConfigs: WebhookConfigEntity;
  webhookDeliveries: WebhookDeliveryEntity;
  auditLogs: AuditLogEntity;
  activityLogs: ActivityLogEntity;
  fileUploads: FileUploadEntity;
  errorLogs: ErrorLogEntity;
  emailTemplates: EmailTemplateEntity;
  featureFlags: FeatureFlagEntity;
  rateLimitConfigs: RateLimitConfigEntity;
};

/**
 * Generic repository interface for type-safe database operations
 */
export interface Repository<T extends BaseEntity> {
  readonly create: (entity: Omit<T, keyof BaseEntity>) => Promise<T>;
  readonly findById: (id: string) => Promise<T | null>;
  readonly findAll: (filters?: Partial<T>, limit?: number, offset?: number) => Promise<T[]>;
  readonly update: (id: string, updates: Partial<Omit<T, keyof BaseEntity>>) => Promise<T>;
  readonly delete: (id: string) => Promise<boolean>;
  readonly exists: (id: string) => Promise<boolean>;
  readonly count: (filters?: Partial<T>) => Promise<number>;
}
