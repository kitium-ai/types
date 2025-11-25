/**
 * Validation Schemas
 * Zod-based validators for all types in the package
 * Single source of truth for validation logic
 */

import { z } from 'zod';

import { AuthMethod, Permission, UserRole } from './auth';
import { BillingCycle, InvoiceStatus, PaymentStatus, SubscriptionStatus } from './billing';
import { OrganizationPlan, OrganizationStatus, BillingPeriod } from './organization';
import { FeatureTier, ProductStatus } from './product';
import { AccountStatus, NotificationChannel } from './user';
import { SUPPORTED_LOCALES } from './primitives';

/**
 * Common validators
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const EMAIL_VALIDATOR = z.string().email('Invalid email format');
// eslint-disable-next-line @typescript-eslint/naming-convention
const URL_VALIDATOR = z.string().url('Invalid URL format').optional();
// eslint-disable-next-line @typescript-eslint/naming-convention
const UUID_VALIDATOR = z.string().uuid('Invalid UUID format');
// eslint-disable-next-line @typescript-eslint/naming-convention
const DATE_VALIDATOR = z.date().or(z.string().datetime());
// eslint-disable-next-line @typescript-eslint/naming-convention
const POSITIVE_NUMBER_VALIDATOR = z.number().positive('Must be positive');
// eslint-disable-next-line @typescript-eslint/naming-convention
const PERCENTAGE_VALIDATOR = z.number().min(0).max(100, 'Must be between 0 and 100');
// eslint-disable-next-line @typescript-eslint/naming-convention
const CURSOR_VALIDATOR = z.string().min(10, 'Cursor must be at least 10 characters');
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOCALE_SCHEMA = z.enum(SUPPORTED_LOCALES);

/**
 * Auth validators
 */
export const AuthMethodSchema = z.nativeEnum(AuthMethod);
export const UserRoleSchema = z.nativeEnum(UserRole);
export const PermissionSchema = z.nativeEnum(Permission);

export const LoginCredentialsSchema = z.object({
  email: EMAIL_VALIDATOR,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const PasswordResetRequestSchema = z.object({
  email: EMAIL_VALIDATOR,
});

export const PasswordResetConfirmSchema = z
  .object({
    token: z.string().min(10),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
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
  expiresAt: DATE_VALIDATOR.optional(),
});

/**
 * User validators
 */
export const AccountStatusSchema = z.nativeEnum(AccountStatus);

export const NotificationChannelSchema = z.nativeEnum(NotificationChannel);

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
  slack: z
    .object({
      enabled: z.boolean(),
      webhookUrl: URL_VALIDATOR,
      channels: z.array(z.string()),
    })
    .optional(),
  teams: z
    .object({
      enabled: z.boolean(),
      webhookUrl: URL_VALIDATOR,
    })
    .optional(),
  timezone: z.string(),
  language: LOCALE_SCHEMA,
});

export const UserRegistrationSchema = z
  .object({
    email: EMAIL_VALIDATOR,
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
    acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
    acceptPrivacy: z.boolean().refine((v) => v === true, 'You must accept the privacy policy'),
    companyName: z.string().max(255).optional(),
    timezone: z.string().optional(),
    language: LOCALE_SCHEMA.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
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
  phone: z
    .string()
    .regex(/^\+?1?\d{9,15}$/, 'Invalid phone number format')
    .optional(),
  timezone: z.string().optional(),
  language: LOCALE_SCHEMA.optional(),
});

export const UserProfileSchema = z.object({
  id: UUID_VALIDATOR,
  email: EMAIL_VALIDATOR,
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  avatar: z.string().optional(),
  avatarUrl: URL_VALIDATOR,
  bio: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string(),
  language: LOCALE_SCHEMA,
  twoFactorEnabled: z.boolean(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  lastLogin: DATE_VALIDATOR.optional(),
  createdAt: DATE_VALIDATOR,
  updatedAt: DATE_VALIDATOR,
});

export const UserSchema = UserProfileSchema.extend({
  status: AccountStatusSchema,
  roles: z.array(UserRoleSchema),
  permissions: z.array(PermissionSchema),
  mfaConfig: z
    .object({
      enabled: z.boolean(),
      method: z.enum(['totp', 'sms', 'email']),
      secret: z.string().optional(),
      phoneNumber: z.string().optional(),
      backupCodes: z.array(z.string()).optional(),
      verified: z.boolean(),
      createdAt: DATE_VALIDATOR,
    })
    .optional(),
  notificationPreferences: NotificationPreferencesSchema,
  authenticatedWith: z.array(AuthMethodSchema),
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  isSuperAdmin: z.boolean(),
  deletedAt: DATE_VALIDATOR.optional(),
});

/**
 * Organization validators
 */
export const OrganizationPlanSchema = z.nativeEnum(OrganizationPlan);
export const OrganizationStatusSchema = z.nativeEnum(OrganizationStatus);

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format')
    .optional(),
  description: z.string().max(500).optional(),
  website: URL_VALIDATOR,
  country: z.string().length(2).optional(),
  timezone: z.string().optional(),
  plan: OrganizationPlanSchema.optional(),
});

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional(),
  logo: z.string().optional(),
  website: URL_VALIDATOR,
  email: EMAIL_VALIDATOR.optional(),
  phone: z.string().optional(),
  country: z.string().length(2).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  timezone: z.string().optional(),
});

export const OrganizationSchema = z.object({
  id: UUID_VALIDATOR,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  logoUrl: URL_VALIDATOR,
  website: URL_VALIDATOR,
  email: EMAIL_VALIDATOR.optional(),
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
    id: UUID_VALIDATOR,
    email: EMAIL_VALIDATOR,
    firstName: z.string(),
    lastName: z.string(),
  }),
  members: z.number().int().nonnegative(),
  teams: z.number().int().nonnegative(),
  billingPeriod: z.nativeEnum(BillingPeriod),
  trialEndsAt: DATE_VALIDATOR.optional(),
  createdAt: DATE_VALIDATOR,
  updatedAt: DATE_VALIDATOR,
});

/**
 * Product validators
 */
export const ProductStatusSchema = z.nativeEnum(ProductStatus);

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().min(10).max(2000),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateFeatureSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().min(10),
  tier: z.nativeEnum(FeatureTier),
  priority: z.number().int().min(1).max(5),
  epic: UUID_VALIDATOR.optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
});

/**
 * Billing validators
 */
export const SubscriptionStatusSchema = z.nativeEnum(SubscriptionStatus);
export const PaymentStatusSchema = z.nativeEnum(PaymentStatus);
export const InvoiceStatusSchema = z.nativeEnum(InvoiceStatus);

export const CreateSubscriptionSchema = z.object({
  planId: UUID_VALIDATOR,
  billingCycle: z.nativeEnum(BillingCycle),
  paymentMethodId: UUID_VALIDATOR.optional(),
  trialDays: z.number().int().positive().optional(),
  discountCode: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const UpdateSubscriptionSchema = z.object({
  planId: UUID_VALIDATOR.optional(),
  billingCycle: z.nativeEnum(BillingCycle).optional(),
  autoRenew: z.boolean().optional(),
  paymentMethodId: UUID_VALIDATOR.optional(),
  metadata: z.record(z.any()).optional(),
});

export const PricingPlanSchema = z.object({
  id: UUID_VALIDATOR,
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  price: z.object({
    amount: POSITIVE_NUMBER_VALIDATOR,
    currency: z.string().length(3),
    interval: z.nativeEnum(BillingCycle),
  }),
  setupFee: POSITIVE_NUMBER_VALIDATOR.optional(),
  tier: z.enum(['free', 'starter', 'professional', 'enterprise']),
  maxUsers: z.number().int().positive().optional(),
  maxProjects: z.number().int().positive().optional(),
  maxStorage: z.number().int().positive().optional(),
  maxApiCalls: z.number().int().positive().optional(),
  supportLevel: z.enum(['community', 'standard', 'premium', 'enterprise']),
  slaUptimePercent: PERCENTAGE_VALIDATOR.optional(),
  isPublic: z.boolean(),
  createdAt: DATE_VALIDATOR,
  updatedAt: DATE_VALIDATOR,
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
  cursor: CURSOR_VALIDATOR.optional(),
});

export const FileUploadSchema = z.object({
  id: UUID_VALIDATOR,
  name: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  url: z.string().url(),
  uploadedAt: DATE_VALIDATOR,
  uploadedBy: UUID_VALIDATOR,
  metadata: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      duration: z.number().positive().optional(),
    })
    .optional(),
});

export const WebhookConfigSchema = z.object({
  id: UUID_VALIDATOR,
  organizationId: UUID_VALIDATOR,
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().min(32),
  headers: z.record(z.string()).optional(),
  isActive: z.boolean(),
  retryPolicy: z
    .object({
      maxRetries: z.number().int().positive(),
      backoffMultiplier: POSITIVE_NUMBER_VALIDATOR,
      initialDelayMs: z.number().int().positive(),
    })
    .optional(),
  lastTriggeredAt: DATE_VALIDATOR.optional(),
  createdAt: DATE_VALIDATOR,
  updatedAt: DATE_VALIDATOR,
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
export const createValidator = <T>(
  schema: z.ZodSchema<T>
): {
  parse: (data: unknown) => { success: true; data: T } | { success: false; error: z.ZodError };
  validate: (data: unknown) => T;
  safeParse: (data: unknown) => z.SafeParseReturnType<unknown, T>;
} => {
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
// eslint-disable-next-line @typescript-eslint/naming-convention
export const VALIDATORS = {
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

/**
 * Type exports for validators (using module pattern instead of namespace)
 * Use: import type { ValidatorTypes } from '@kitiumai/types';
 * Then: type LoginCreds = ValidatorTypes['loginCredentials'];
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type ValidatorTypes = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  loginCredentials: z.infer<typeof LoginCredentialsSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  passwordResetRequest: z.infer<typeof PasswordResetRequestSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  passwordResetConfirm: z.infer<typeof PasswordResetConfirmSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mfaVerification: z.infer<typeof MFAVerificationSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  apiKey: z.infer<typeof APIKeySchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userRegistration: z.infer<typeof UserRegistrationSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updateUserProfile: z.infer<typeof UpdateUserProfileSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userProfile: z.infer<typeof UserProfileSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user: z.infer<typeof UserSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  createOrganization: z.infer<typeof CreateOrganizationSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updateOrganization: z.infer<typeof UpdateOrganizationSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  organization: z.infer<typeof OrganizationSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  createProduct: z.infer<typeof CreateProductSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  createFeature: z.infer<typeof CreateFeatureSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  createSubscription: z.infer<typeof CreateSubscriptionSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updateSubscription: z.infer<typeof UpdateSubscriptionSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  pricingPlan: z.infer<typeof PricingPlanSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  listQueryParams: z.infer<typeof ListQueryParamsSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  fileUpload: z.infer<typeof FileUploadSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  webhookConfig: z.infer<typeof WebhookConfigSchema>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  errorResponse: z.infer<typeof ErrorResponseSchema>;
};
