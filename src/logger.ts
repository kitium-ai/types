/**
 * Logger Type Integrations
 * Re-exports and extends types from @kitiumai/logger 2.0
 *
 * This module provides type-safe logger configuration and usage patterns
 * that integrate seamlessly with the rest of the type system.
 */

// Re-export core logger types from @kitiumai/logger 2.0
export type {
  ILogger,
  LogEntry,
  LoggerConfig,
  LoggerPreset,
  LokiConfig,
  LogContext,
  StructuredLogEntry,
  LoggerFactoryOptions,
  RetryConfig,
  MetricLabels,
  MetricValue,
  ValidationResult,
  HealthCheckResult,
} from '@kitiumai/logger';

// Re-export logger enums
export { LogLevel, LoggerType, HealthStatus } from '@kitiumai/logger';

// Re-export key logger utilities
export {
  createLogger,
  getLogger,
  initializeLogger,
  LoggerBuilder,
  LoggerFactory,
  getGlobalLogger,
  initGlobalLogger,
  contextManager,
  validateLoggerConfig,
  performHealthCheck,
} from '@kitiumai/logger';

/**
 * Application Logger Configuration
 * Extended configuration for application-level logging with proper typing
 */
export interface AppLoggerConfig extends Omit<LoggerConfig, 'serviceName'> {
  /** Application/service name for log identification */
  serviceName: string;

  /** Environment (development, staging, production) */
  environment?: 'development' | 'staging' | 'production' | 'test';

  /** Enable request correlation IDs */
  enableCorrelation?: boolean;

  /** Enable performance metrics */
  enableMetrics?: boolean;

  /** Enable audit logging for sensitive operations */
  enableAuditLog?: boolean;
}

/**
 * Request Context for logging
 * Type-safe context information for request-scoped logging
 */
export interface RequestLogContext {
  /** Request ID for correlation */
  requestId: string;

  /** User ID if authenticated */
  userId?: string;

  /** Organization ID for multi-tenant apps */
  organizationId?: string;

  /** HTTP method */
  method?: string;

  /** Request path */
  path?: string;

  /** Client IP address */
  ip?: string;

  /** User agent */
  userAgent?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Audit Log Entry
 * Type-safe structure for audit logging
 */
export interface AuditLogEntry {
  /** Timestamp of the event */
  timestamp: Date;

  /** User who performed the action */
  userId: string;

  /** Organization context */
  organizationId?: string;

  /** Action performed */
  action: string;

  /** Resource type affected */
  resourceType: string;

  /** Resource ID affected */
  resourceId?: string;

  /** Status of the action */
  status: 'success' | 'failure' | 'pending';

  /** Additional details */
  details?: Record<string, unknown>;

  /** IP address of the actor */
  ipAddress?: string;

  /** Severity level */
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Performance Metric Entry
 * Type-safe structure for performance logging
 */
export interface PerformanceMetric {
  /** Metric name */
  name: string;

  /** Metric value */
  value: number;

  /** Metric unit (ms, bytes, count, etc.) */
  unit: 'ms' | 'bytes' | 'count' | 'percent' | string;

  /** Timestamp */
  timestamp: Date;

  /** Labels for metric categorization */
  labels?: Record<string, string>;

  /** Threshold exceeded (if applicable) */
  thresholdExceeded?: boolean;
}

/**
 * Logger initialization helper with type safety
 */
export interface LoggerInitOptions {
  /** Service name */
  serviceName: string;

  /** Log level */
  level?: LogLevel;

  /** Enable Loki integration */
  enableLoki?: boolean;

  /** Loki configuration */
  lokiConfig?: LokiConfig;

  /** Enable console logging */
  enableConsole?: boolean;

  /** Enable file logging */
  enableFile?: boolean;

  /** File log path */
  logFilePath?: string;

  /** Enable structured logging */
  structured?: boolean;

  /** Preset configuration to use */
  preset?: LoggerPreset;
}

/**
 * Type guard to check if an error is loggable
 */
export function isLoggableError(error: unknown): error is Error {
  return error instanceof Error && 'message' in error && 'stack' in error;
}

/**
 * Type helper for extracting logger configuration from app config
 */
export type ExtractLoggerConfig<T extends { logger?: unknown }> = T extends {
  logger: infer L;
}
  ? L
  : never;
