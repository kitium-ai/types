/**
 * Database Service Types
 * Types for database configuration and management
 */

/**
 * Connection pool configuration
 */
export interface PoolingConfig {
  readonly min: number;
  readonly max: number;
  readonly idleTimeoutMillis: number;
  readonly connectionTimeoutMillis: number;
  readonly maxUses?: number;
  readonly reapIntervalMillis?: number;
  readonly idleInTransactionSessionTimeoutMillis?: number;
  readonly allowExitOnIdle?: boolean;
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  readonly databaseUrl: string;
  readonly mongodbUrl?: string;
  readonly pooling: PoolingConfig;
  readonly enableLogging?: boolean;
  readonly logLevel?: 'debug' | 'info' | 'warn' | 'error';
  readonly maxRetries?: number;
  readonly retryDelay?: number;
}

/**
 * Migration result
 */
export interface MigrationResult {
  readonly id: string;
  readonly checksum: string;
  readonly finishedAt: Date | null;
  readonly executionTime: number;
  readonly success: boolean;
  readonly logs?: string;
}

/**
 * Seed result
 */
export interface SeedResult {
  readonly success: boolean;
  readonly message: string;
  readonly recordsCreated?: number;
  readonly recordsUpdated?: number;
  readonly errors?: readonly string[];
}
