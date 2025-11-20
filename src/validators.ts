/**
 * Validation Schemas
 * Zod-based validators for all types in the package
 * Single source of truth for validation logic
 */

import { z } from 'zod';

/**
 * Common validators
 */
const EmailValidator = z.string().email('Invalid email format');
const URLValidator = z.string().url('Invalid URL format').optional();
const UUIDValidator = z.string().uuid('Invalid UUID format');
const DateValidator = z.date().or(z.string().datetime());
const PositiveNumberValidator = z.number().positive('Must be positive');
const PercentageValidator = z.number().min(0).max(100, 'Must be between 0 and 100');

/**
 * Auth validators
 */
export const AuthMethodSchema = z.enum(['email', 'google', 'github', 'microsoft', 'saml', 'oidc']);
export const UserRoleSchema = z.enum(['super_admin', 'admin', 'owner', 'manager', 'member', 'viewer', 'guest']);
export const PermissionSchema = z.enum([
  'org:create',
  'org:read',
  'org:update',
  'org:delete',
  'org:invite',
  'org:settings',
  'user:create',
  'user:read',
  'user:update',
  'user:delete',
  'user:role:manage',
  'product:create',
  'product:read',
  'product:update',
  'product:delete',
  'product:publish',
  'billing:read',
  'billing:update',
  'billing:invoice',
  'team:create',
  'team:read',
  'team:update',
  'team:delete',
  'team:invite',
  'settings:read',
  'settings:update',
  'settings:integrations',
  'analytics:read',
  'analytics:export',
  'audit:read',
  'audit:export',
]);

export const LoginCredentialsSchema = z.object({
  email: EmailValidator,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const PasswordResetRequestSchema = z.object({
  email: EmailValidator,
});

export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const MFAVerificationSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
  method: z.enum(['totp', 'sms', 'email']),
  rememberDevice: z.boolean().optional(),
});

export const APIKeySchema = z.object({
  name: z.string().min(1).max(255),
  permissions: z.array(PermissionSchema),
  expiresAt: DateValidator.optional(),
});

/**
 * User validators
 */
export const AccountStatusSchema = z.enum(['active', 'inactive', 'suspended', 'deleted', 'pending_verification', 'pending_invitation']);

export const NotificationChannelSchema = z.enum(['email', 'sms', 'in_app', 'webhook', 'slack', 'teams']);

export const NotificationPreferencesSchema = z.object({
  email: z.object({
    productUpdates: z.boolean(),
    securityAlerts: z.boolean(),
    billingNotifications: z.boolean(),
    teamInvitations: z.boolean(),
    weeklyDigest: z.boolean(),
  }),
  sms: z.object({
    enabled: z.boolean(),
    criticalAlertsOnly: z.boolean(),
  }),
  inApp: z.object({
    enabled: z.boolean(),
  }),
  slack: z.object({
    enabled: z.boolean(),
    webhookUrl: URLValidator,
    channels: z.array(z.string()),
  }).optional(),
  teams: z.object({
    enabled: z.boolean(),
    webhookUrl: URLValidator,
  }).optional(),
  timezone: z.string(),
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ru']),
});

export const UserRegistrationSchema = z.object({
  email: EmailValidator,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8),
  acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  acceptPrivacy: z.boolean().refine((v) => v === true, 'You must accept the privacy policy'),
  companyName: z.string().max(255).optional(),
  timezone: z.string().optional(),
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ru']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const UpdateUserProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  avatar: z.string().optional(),
  bio: z.string().max(500).optional(),
  title: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().regex(/^\+?1?\d{9,15}$/, 'Invalid phone number format').optional(),
  timezone: z.string().optional(),
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ru']).optional(),
});

export const UserProfileSchema = z.object({
  id: UUIDValidator,
  email: EmailValidator,
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  avatar: z.string().optional(),
  avatarUrl: URLValidator,
  bio: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string(),
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ru']),
  twoFactorEnabled: z.boolean(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  lastLogin: DateValidator.optional(),
  createdAt: DateValidator,
  updatedAt: DateValidator,
});

export const UserSchema = UserProfileSchema.extend({
  status: AccountStatusSchema,
  roles: z.array(UserRoleSchema),
  permissions: z.array(PermissionSchema),
  mfaConfig: z.object({
    enabled: z.boolean(),
    method: z.enum(['totp', 'sms', 'email']),
    secret: z.string().optional(),
    phoneNumber: z.string().optional(),
    backupCodes: z.array(z.string()).optional(),
    verified: z.boolean(),
    createdAt: DateValidator,
  }).optional(),
  notificationPreferences: NotificationPreferencesSchema,
  authenticatedWith: z.array(AuthMethodSchema),
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  isSuperAdmin: z.boolean(),
  deletedAt: DateValidator.optional(),
});

/**
 * Organization validators
 */
export const OrganizationPlanSchema = z.enum(['free', 'starter', 'professional', 'enterprise', 'custom']);
export const OrganizationStatusSchema = z.enum(['active', 'inactive', 'suspended', 'deleted']);

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format').optional(),
  description: z.string().max(500).optional(),
  website: URLValidator,
  country: z.string().length(2).optional(),
  timezone: z.string().optional(),
  plan: OrganizationPlanSchema.optional(),
});

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional(),
  logo: z.string().optional(),
  website: URLValidator,
  email: EmailValidator.optional(),
  phone: z.string().optional(),
  country: z.string().length(2).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  timezone: z.string().optional(),
});

export const OrganizationSchema = z.object({
  id: UUIDValidator,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  logoUrl: URLValidator,
  website: URLValidator,
  email: EmailValidator.optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  timezone: z.string(),
  plan: OrganizationPlanSchema,
  status: OrganizationStatusSchema,
  seats: z.number().int().positive(),
  maxSeats: z.number().int().positive(),
  features: z.array(z.string()),
  owner: z.object({
    id: UUIDValidator,
    email: EmailValidator,
    firstName: z.string(),
    lastName: z.string(),
  }),
  members: z.number().int().nonnegative(),
  teams: z.number().int().nonnegative(),
  billingPeriod: z.enum(['monthly', 'yearly', 'custom']),
  trialEndsAt: DateValidator.optional(),
  createdAt: DateValidator,
  updatedAt: DateValidator,
});

/**
 * Product validators
 */
export const ProductStatusSchema = z.enum(['draft', 'in_development', 'beta', 'released', 'deprecated', 'archived', 'discontinued']);

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10).max(2000),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateFeatureSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10),
  tier: z.enum(['free', 'starter', 'professional', 'enterprise', 'all']),
  priority: z.number().int().min(1).max(5),
  epic: UUIDValidator.optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
});

/**
 * Billing validators
 */
export const SubscriptionStatusSchema = z.enum(['active', 'trial', 'past_due', 'paused', 'canceled', 'expired', 'pending']);
export const PaymentStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed']);
export const InvoiceStatusSchema = z.enum(['draft', 'sent', 'viewed', 'partial_paid', 'paid', 'overdue', 'canceled', 'refunded']);

export const CreateSubscriptionSchema = z.object({
  planId: UUIDValidator,
  billingCycle: z.enum(['monthly', 'quarterly', 'annually', 'custom']),
  paymentMethodId: UUIDValidator.optional(),
  trialDays: z.number().int().positive().optional(),
  discountCode: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const UpdateSubscriptionSchema = z.object({
  planId: UUIDValidator.optional(),
  billingCycle: z.enum(['monthly', 'quarterly', 'annually', 'custom']).optional(),
  autoRenew: z.boolean().optional(),
  paymentMethodId: UUIDValidator.optional(),
  metadata: z.record(z.any()).optional(),
});

export const PricingPlanSchema = z.object({
  id: UUIDValidator,
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  price: z.object({
    amount: PositiveNumberValidator,
    currency: z.string().length(3),
    interval: z.enum(['monthly', 'quarterly', 'annually', 'custom']),
  }),
  setupFee: PositiveNumberValidator.optional(),
  tier: z.enum(['free', 'starter', 'professional', 'enterprise']),
  maxUsers: z.number().int().positive().optional(),
  maxProjects: z.number().int().positive().optional(),
  maxStorage: z.number().int().positive().optional(),
  maxApiCalls: z.number().int().positive().optional(),
  supportLevel: z.enum(['community', 'standard', 'premium', 'enterprise']),
  slaUptimePercent: PercentageValidator.optional(),
  isPublic: z.boolean(),
  createdAt: DateValidator,
  updatedAt: DateValidator,
});

/**
 * API validators
 */
export const ListQueryParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  filter: z.record(z.any()).optional(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
});

export const FileUploadSchema = z.object({
  id: UUIDValidator,
  name: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  url: z.string().url(),
  uploadedAt: DateValidator,
  uploadedBy: UUIDValidator,
  metadata: z.object({
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    duration: z.number().positive().optional(),
  }).optional(),
});

export const WebhookConfigSchema = z.object({
  id: UUIDValidator,
  organizationId: UUIDValidator,
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().min(32),
  headers: z.record(z.string()).optional(),
  isActive: z.boolean(),
  retryPolicy: z.object({
    maxRetries: z.number().int().positive(),
    backoffMultiplier: PositiveNumberValidator,
    initialDelayMs: z.number().int().positive(),
  }).optional(),
  lastTriggeredAt: DateValidator.optional(),
  createdAt: DateValidator,
  updatedAt: DateValidator,
});

/**
 * Error validators
 */
export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
  value: z.any().optional(),
  constraint: z.string().optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  status: z.number().int(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
    fieldErrors: z.array(ValidationErrorSchema).optional(),
    suggestion: z.string().optional(),
  }),
  timestamp: z.string(),
  requestId: z.string().optional(),
  path: z.string().optional(),
  method: z.string().optional(),
});

/**
 * Type extraction for validators (internal use only)
 * To avoid naming conflicts with domain types, these types are not exported.
 * Users can infer types directly from schemas using: z.infer<typeof SchemaName>
 *
 * Examples:
 * import { LoginCredentialsSchema } from '@kitium-ai/types';
 * type LoginCredsType = z.infer<typeof LoginCredentialsSchema>;
 */

/**
 * Validation helper utilities
 */
export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return {
    parse: (data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } => {
      try {
        const parsedData = schema.parse(data);
        return { success: true, data: parsedData };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error };
        }
        throw error;
      }
    },
    validate: (data: unknown): T => {
      return schema.parse(data);
    },
    safeParse: (data: unknown): z.SafeParseReturnType<unknown, T> => {
      return schema.safeParse(data);
    },
  };
};

/**
 * Pre-instantiated validators for common types
 */
export const Validators = {
  loginCredentials: createValidator(LoginCredentialsSchema),
  userRegistration: createValidator(UserRegistrationSchema),
  updateUserProfile: createValidator(UpdateUserProfileSchema),
  createOrganization: createValidator(CreateOrganizationSchema),
  updateOrganization: createValidator(UpdateOrganizationSchema),
  createProduct: createValidator(CreateProductSchema),
  createFeature: createValidator(CreateFeatureSchema),
  createSubscription: createValidator(CreateSubscriptionSchema),
  updateSubscription: createValidator(UpdateSubscriptionSchema),
  listQueryParams: createValidator(ListQueryParamsSchema),
  fileUpload: createValidator(FileUploadSchema),
  webhookConfig: createValidator(WebhookConfigSchema),
};
