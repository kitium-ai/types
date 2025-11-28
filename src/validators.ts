/**
 * Validation Schemas
 * Zod-based validators for all types in the package
 * Single source of truth for validation logic
 */

import { z } from 'zod';

import { AuthMethod, Permission, UserRole } from './auth';
import { HTTPMethod } from './api';
import { BillingCycle, InvoiceStatus, PaymentStatus, SubscriptionStatus } from './billing';
import { OrganizationPlan, OrganizationStatus, BillingPeriod } from './organization';
import { FeatureTier, ProductStatus } from './product';
import { AccountStatus, NotificationChannel } from './user';
import {
  BatchId,
  BatchItemId,
  Brand,
  FileUploadId,
  IsoDateTimeString,
  OrganizationId,
  PaginationCursor,
  RequestId,
  SUPPORTED_LOCALES,
  UserId,
  WebhookDeliveryId,
  WebhookId,
} from './primitives';

/**
 * Common validators
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const EMAIL_VALIDATOR = z.string().email('Invalid email format');
// eslint-disable-next-line @typescript-eslint/naming-convention
const URL_VALIDATOR = z.string().url('Invalid URL format').optional();
// eslint-disable-next-line @typescript-eslint/naming-convention
const ISO_DATETIME_VALIDATOR = z
  .string()
  .datetime()
  .transform((value) => value as IsoDateTimeString);
// eslint-disable-next-line @typescript-eslint/naming-convention
const UUID_VALIDATOR = z.string().uuid('Invalid UUID format');
// eslint-disable-next-line @typescript-eslint/naming-convention
const DATE_VALIDATOR = z.date().or(ISO_DATETIME_VALIDATOR);
// eslint-disable-next-line @typescript-eslint/naming-convention
const POSITIVE_NUMBER_VALIDATOR = z.number().positive('Must be positive');
// eslint-disable-next-line @typescript-eslint/naming-convention
const PERCENTAGE_VALIDATOR = z.number().min(0).max(100, 'Must be between 0 and 100');
// eslint-disable-next-line @typescript-eslint/naming-convention
const CURSOR_VALIDATOR = z
  .string()
  .min(10, 'Cursor must be at least 10 characters')
  .transform((value) => value as PaginationCursor);
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOCALE_SCHEMA = z.enum(SUPPORTED_LOCALES);
// eslint-disable-next-line @typescript-eslint/naming-convention
const HTTP_METHOD_SCHEMA = z.nativeEnum(HTTPMethod);

const createBrandedId = <B extends string>(_brand: B) =>
  z.string().uuid('Invalid UUID format').transform((value) => value as Brand<string, B>);

const REQUEST_ID_SCHEMA = createBrandedId<RequestId['__brand']>('id:request');
const WEBHOOK_ID_SCHEMA = createBrandedId<WebhookId['__brand']>('id:webhook');
const WEBHOOK_DELIVERY_ID_SCHEMA = createBrandedId<WebhookDeliveryId['__brand']>('id:webhook-delivery');
const FILE_UPLOAD_ID_SCHEMA = createBrandedId<FileUploadId['__brand']>('id:file-upload');
const BATCH_ID_SCHEMA = createBrandedId<BatchId['__brand']>('id:batch');
const BATCH_ITEM_ID_SCHEMA = createBrandedId<BatchItemId['__brand']>('id:batch-item');
const USER_ID_SCHEMA = createBrandedId<UserId['__brand']>('id:user');
const ORGANIZATION_ID_SCHEMA = createBrandedId<OrganizationId['__brand']>('id:organization');

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
  id: FILE_UPLOAD_ID_SCHEMA,
  name: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  url: z.string().url(),
  uploadedAt: ISO_DATETIME_VALIDATOR,
  uploadedBy: USER_ID_SCHEMA,
  metadata: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      duration: z.number().positive().optional(),
    })
    .optional(),
});

export const WebhookPayloadSchema = z.object({
  id: WEBHOOK_ID_SCHEMA,
  event: z.string(),
  timestamp: ISO_DATETIME_VALIDATOR,
  data: z.record(z.unknown()),
  previousData: z.record(z.unknown()).optional(),
  organizationId: ORGANIZATION_ID_SCHEMA,
  userId: USER_ID_SCHEMA.optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const WebhookConfigSchema = z.object({
  id: WEBHOOK_ID_SCHEMA,
  organizationId: ORGANIZATION_ID_SCHEMA,
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
  lastTriggeredAt: ISO_DATETIME_VALIDATOR.optional(),
  createdAt: ISO_DATETIME_VALIDATOR,
  updatedAt: ISO_DATETIME_VALIDATOR,
});

export const WebhookDeliverySchema = z.object({
  id: WEBHOOK_DELIVERY_ID_SCHEMA,
  webhookId: WEBHOOK_ID_SCHEMA,
  event: z.string(),
  payload: WebhookPayloadSchema,
  statusCode: z.number().int().optional(),
  response: z.string().optional(),
  error: z.string().optional(),
  retryCount: z.number().int().nonnegative(),
  nextRetryAt: ISO_DATETIME_VALIDATOR.optional(),
  deliveredAt: ISO_DATETIME_VALIDATOR.optional(),
  timestamp: ISO_DATETIME_VALIDATOR,
});

export const RequestContextSchema = z.object({
  requestId: REQUEST_ID_SCHEMA,
  userId: USER_ID_SCHEMA.optional(),
  organizationId: ORGANIZATION_ID_SCHEMA.optional(),
  ipAddress: z.string(),
  userAgent: z.string(),
  origin: z.string().optional(),
  timestamp: ISO_DATETIME_VALIDATOR,
});

export const BatchRequestItemSchema = z.object({
  id: BATCH_ITEM_ID_SCHEMA,
  method: HTTP_METHOD_SCHEMA,
  path: z.string(),
  body: z.unknown().optional(),
  headers: z.record(z.string()).optional(),
});

export const BatchRequestSchema = z.object({
  id: BATCH_ID_SCHEMA,
  requests: z.array(BatchRequestItemSchema),
});

export const BatchResponseItemSchema = z.object({
  id: BATCH_ITEM_ID_SCHEMA,
  status: z.number().int(),
  body: z.unknown(),
  headers: z.record(z.string()).optional(),
});

export const BatchResponseSchema = z.object({
  id: BATCH_ID_SCHEMA,
  responses: z.array(BatchResponseItemSchema),
  timestamp: ISO_DATETIME_VALIDATOR,
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
  timestamp: ISO_DATETIME_VALIDATOR,
  requestId: REQUEST_ID_SCHEMA.optional(),
  path: z.string().optional(),
  method: z.string().optional(),
});

export const SCHEMA_REGISTRY = {
  loginCredentials: LoginCredentialsSchema,
  passwordResetRequest: PasswordResetRequestSchema,
  passwordResetConfirm: PasswordResetConfirmSchema,
  mfaVerification: MFAVerificationSchema,
  apiKey: APIKeySchema,
  userRegistration: UserRegistrationSchema,
  updateUserProfile: UpdateUserProfileSchema,
  userProfile: UserProfileSchema,
  user: UserSchema,
  createOrganization: CreateOrganizationSchema,
  updateOrganization: UpdateOrganizationSchema,
  organization: OrganizationSchema,
  createProduct: CreateProductSchema,
  createFeature: CreateFeatureSchema,
  createSubscription: CreateSubscriptionSchema,
  updateSubscription: UpdateSubscriptionSchema,
  pricingPlan: PricingPlanSchema,
  listQueryParams: ListQueryParamsSchema,
  fileUpload: FileUploadSchema,
  webhookPayload: WebhookPayloadSchema,
  webhookConfig: WebhookConfigSchema,
  webhookDelivery: WebhookDeliverySchema,
  requestContext: RequestContextSchema,
  batchRequestItem: BatchRequestItemSchema,
  batchRequest: BatchRequestSchema,
  batchResponseItem: BatchResponseItemSchema,
  batchResponse: BatchResponseSchema,
  errorResponse: ErrorResponseSchema,
} as const satisfies Record<string, z.ZodTypeAny>;

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
export const VALIDATORS = Object.fromEntries(
  Object.entries(SCHEMA_REGISTRY).map(([key, schema]) => [key, createValidator(schema as z.ZodSchema)])
) as {
  [K in keyof typeof SCHEMA_REGISTRY]: ReturnType<typeof createValidator<z.infer<(typeof SCHEMA_REGISTRY)[K]>>>;
};

/**
 * Type exports for validators (using module pattern instead of namespace)
 * Use: import type { ValidatorTypes } from '@kitiumai/types';
 * Then: type LoginCreds = ValidatorTypes['loginCredentials'];
 */

export type ValidatorTypes = {
  [K in keyof typeof SCHEMA_REGISTRY]: z.infer<(typeof SCHEMA_REGISTRY)[K]>;
};
