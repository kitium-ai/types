/**
 * @kitium-ai/types
 * Enterprise-ready TypeScript types and interfaces for Kitium AI Product SaaS
 *
 * This package provides comprehensive, type-safe interfaces for building scalable
 * SaaS applications with proper authentication, billing, organization management,
 * and API communication patterns.
 *
 * Single Source of Truth:
 * - Domain models define core business entities
 * - API types for request/response contracts
 * - Database entities for persistence layer
 * - Validators for runtime type checking and validation
 * - Utilities for type transformations and helpers
 */

// Re-export authentication and authorization types
export * from './auth';

// Re-export user management types
export * from './user';

// Re-export organization and team types
export * from './organization';

// Re-export product and feature management types
export * from './product';

// Re-export billing and subscription types
export * from './billing';

// Re-export API communication types
export * from './api';

// Re-export error handling and validation types
export * from './errors';

// Re-export utility types and helpers
export * from './utils';

// Primitive helpers and branded identifiers
export * from './primitives';

// Re-export service types (email, file, search, database)
export * from './services';

// Export validators and entities as namespaced modules
export { VALIDATORS } from './validators';
export type { ValidatorTypes } from './validators';
export type * as ValidatorSchemas from './validators';
export type * as Entities from './entities';

// Re-export logger types and utilities from @kitiumai/logger 2.0
export type * from './logger';
export {
  LogLevel,
  LoggerType,
  HealthStatus,
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
} from './logger';
