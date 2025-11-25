/**
 * Error Handling and Validation Types
 * Enterprise-grade error handling and validation schemas
 */

/**
 * Error codes for application errors
 */
export enum ErrorCode {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_EXPIRED_TOKEN = 'AUTH_EXPIRED_TOKEN',
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_NOT_PROVIDED = 'AUTH_TOKEN_NOT_PROVIDED',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  AUTH_ACCOUNT_SUSPENDED = 'AUTH_ACCOUNT_SUSPENDED',
  AUTH_MFA_REQUIRED = 'AUTH_MFA_REQUIRED',
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  VALIDATION_SCHEMA_ERROR = 'VALIDATION_SCHEMA_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_URL = 'INVALID_URL',
  INVALID_FORMAT = 'INVALID_FORMAT',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  FIELD_TOO_SHORT = 'FIELD_TOO_SHORT',
  INVALID_DATE = 'INVALID_DATE',
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',

  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_DELETED = 'RESOURCE_DELETED',
  RESOURCE_EXPIRED = 'RESOURCE_EXPIRED',

  // Organization errors
  ORG_NOT_FOUND = 'ORG_NOT_FOUND',
  ORG_QUOTA_EXCEEDED = 'ORG_QUOTA_EXCEEDED',
  ORG_SEAT_LIMIT_EXCEEDED = 'ORG_SEAT_LIMIT_EXCEEDED',
  ORG_FEATURE_NOT_AVAILABLE = 'ORG_FEATURE_NOT_AVAILABLE',

  // Billing errors
  BILLING_PAYMENT_FAILED = 'BILLING_PAYMENT_FAILED',
  BILLING_INVALID_CARD = 'BILLING_INVALID_CARD',
  BILLING_CARD_DECLINED = 'BILLING_CARD_DECLINED',
  BILLING_INSUFFICIENT_FUNDS = 'BILLING_INSUFFICIENT_FUNDS',
  BILLING_SUBSCRIPTION_EXPIRED = 'BILLING_SUBSCRIPTION_EXPIRED',
  BILLING_INVOICE_OVERDUE = 'BILLING_INVOICE_OVERDUE',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  CONCURRENT_REQUEST_LIMIT = 'CONCURRENT_REQUEST_LIMIT',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  BAD_GATEWAY = 'BAD_GATEWAY',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Third-party errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  PAYMENT_PROVIDER_ERROR = 'PAYMENT_PROVIDER_ERROR',
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
  STORAGE_SERVICE_ERROR = 'STORAGE_SERVICE_ERROR',

  // Operation errors
  OPERATION_FAILED = 'OPERATION_FAILED',
  OPERATION_TIMEOUT = 'OPERATION_TIMEOUT',
  OPERATION_CONFLICT = 'OPERATION_CONFLICT',
  INVALID_OPERATION_STATE = 'INVALID_OPERATION_STATE',

  // File errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',

  // General errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  GONE = 'GONE',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  DEPRECATED = 'DEPRECATED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Application Error class
 */
export interface ApplicationError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly message: string;
  readonly severity: ErrorSeverity;
  readonly details?: Record<string, unknown>;
  readonly cause?: Error;
  readonly timestamp: Date;
  readonly requestId?: string;
  readonly userId?: string;
  readonly organizationId?: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly value?: unknown;
  readonly constraint?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
  readonly warnings?: readonly string[];
  readonly data?: Record<string, unknown>;
}

/**
 * Field validation rule
 */
export interface ValidationRule {
  readonly field: string;
  readonly type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'email'
    | 'url'
    | 'enum'
    | 'array'
    | 'object';
  readonly required: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly enum?: readonly unknown[];
  readonly custom?: (value: unknown) => boolean;
  readonly message?: string;
  readonly allowNull: boolean;
  readonly allowEmpty: boolean;
}

/**
 * Schema for validation
 */
export interface ValidationSchema {
  readonly fields: Record<string, ValidationRule>;
  readonly strict: boolean;
  readonly stripUnknown: boolean;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  readonly success: false;
  readonly status: number;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
    readonly fieldErrors?: readonly ValidationError[];
    readonly suggestion?: string;
  };
  readonly timestamp: string;
  readonly requestId?: string;
  readonly path?: string;
  readonly method?: string;
}

/**
 * Detailed error information for logging
 */
export interface ErrorLog {
  readonly id: string;
  readonly timestamp: Date;
  readonly code: ErrorCode;
  readonly severity: ErrorSeverity;
  readonly message: string;
  readonly stack?: string;
  readonly context?: {
    readonly userId?: string;
    readonly organizationId?: string;
    readonly requestId?: string;
    readonly method?: string;
    readonly path?: string;
    readonly ipAddress?: string;
    readonly userAgent?: string;
  };
  readonly metadata?: Record<string, unknown>;
  readonly userId?: string;
  readonly organizationId?: string;
  readonly resolved: boolean;
}

/**
 * Custom exception types
 */
export interface AuthenticationException extends ApplicationError {
  readonly code:
    | ErrorCode.AUTH_INVALID_CREDENTIALS
    | ErrorCode.AUTH_EXPIRED_TOKEN
    | ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS;
}

export interface ValidationException extends ApplicationError {
  readonly code: ErrorCode.VALIDATION_FAILED | ErrorCode.VALIDATION_SCHEMA_ERROR;
  readonly validationErrors: readonly ValidationError[];
}

export interface ResourceNotFoundException extends ApplicationError {
  readonly code: ErrorCode.RESOURCE_NOT_FOUND | ErrorCode.RESOURCE_DELETED;
  readonly resourceType: string;
  readonly resourceId: string;
}

export interface ConflictException extends ApplicationError {
  readonly code: ErrorCode.RESOURCE_CONFLICT | ErrorCode.RESOURCE_ALREADY_EXISTS;
  readonly conflictingFields: readonly string[];
}

export interface QuotaExceededException extends ApplicationError {
  readonly code: ErrorCode.ORG_QUOTA_EXCEEDED | ErrorCode.QUOTA_EXCEEDED;
  readonly limit: number;
  readonly current: number;
  readonly remaining: number;
}

export interface RateLimitException extends ApplicationError {
  readonly code: ErrorCode.RATE_LIMIT_EXCEEDED;
  readonly limit: number;
  readonly remaining: number;
  readonly resetAt: Date;
  readonly retryAfter: number;
}

export interface PaymentException extends ApplicationError {
  readonly code: ErrorCode.BILLING_PAYMENT_FAILED | ErrorCode.BILLING_CARD_DECLINED;
  readonly paymentMethod?: string;
  readonly transactionId?: string;
}

/**
 * Assertion result
 */
export interface AssertionResult {
  readonly passed: boolean;
  readonly message?: string;
  readonly expectedValue?: unknown;
  readonly actualValue?: unknown;
}

/**
 * Sanitization options
 */
export interface SanitizationOptions {
  readonly removeHtml: boolean;
  readonly removeSql: boolean;
  readonly removeSpecialChars: boolean;
  readonly trimWhitespace: boolean;
  readonly lowercase: boolean;
  readonly uppercase: boolean;
  readonly maxLength?: number;
  readonly allowedCharacters?: string;
}

/**
 * Input sanitizer interface
 */
export interface InputSanitizer {
  readonly sanitize: (input: string, options: Partial<SanitizationOptions>) => string;
  readonly validate: (input: string, rule: ValidationRule) => ValidationResult;
  readonly escapeHtml: (input: string) => string;
  readonly escapeSql: (input: string) => string;
}

/**
 * Error event for error tracking
 */
export interface ErrorEvent {
  readonly id: string;
  readonly timestamp: Date;
  readonly code: ErrorCode;
  readonly message: string;
  readonly userId?: string;
  readonly organizationId?: string;
  readonly context?: Record<string, unknown>;
  readonly tags?: readonly string[];
  readonly fingerprint?: string;
  readonly resolved: boolean;
}
