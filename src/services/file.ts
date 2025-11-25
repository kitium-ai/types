/**
 * File Service Types
 * Types for file storage, upload, and management services
 */

/**
 * File metadata information
 */
export interface FileMetadata {
  /** Unique file identifier */
  readonly id: string;
  /** Original filename */
  readonly originalName: string;
  /** Stored filename (sanitized) */
  readonly storedName: string;
  /** MIME type */
  readonly mimeType: string;
  /** File size in bytes */
  readonly size: number;
  /** Upload timestamp */
  readonly uploadedAt: Date;
  /** Uploader identifier (user ID, system, etc.) */
  readonly uploadedBy?: string;
  /** Storage path/key */
  readonly path: string;
  /** File checksum (SHA-256) */
  readonly checksum?: string;
  /** CDN URL (CloudFront signed URL) */
  readonly cdnUrl?: string;
  /** CDN URL expiration timestamp */
  readonly cdnUrlExpiration?: Date;
  /** Custom metadata */
  readonly metadata?: Record<string, unknown>;
  /** Tenant/organization ID for multi-tenancy */
  readonly tenantId?: string;
}

/**
 * File upload options
 */
export interface UploadOptions {
  /** Original filename */
  readonly filename: string;
  /** MIME type */
  readonly mimeType?: string;
  /** File size in bytes */
  readonly size?: number;
  /** Uploader identifier */
  readonly uploadedBy?: string;
  /** Custom metadata */
  readonly metadata?: Record<string, unknown>;
  /** Tenant ID for multi-tenancy */
  readonly tenantId?: string;
  /** Override default validation rules */
  readonly validationOverrides?: Partial<ValidationConfig>;
}

/**
 * Validation configuration
 */
export interface ValidationConfig {
  /** Maximum file size in bytes */
  readonly maxFileSize: number;
  /** Allowed MIME types (empty array = all allowed) */
  readonly allowedMimeTypes: readonly string[];
  /** Blocked MIME types */
  readonly blockedMimeTypes: readonly string[];
  /** Allowed file extensions (empty array = all allowed) */
  readonly allowedExtensions: readonly string[];
  /** Blocked file extensions */
  readonly blockedExtensions: readonly string[];
  /** Validate file content matches extension */
  readonly validateFileContent: boolean;
}

/**
 * CloudFront configuration
 */
export interface CloudFrontConfig {
  /** CloudFront domain name */
  readonly domainName: string;
  /** CloudFront key pair ID */
  readonly keyPairId: string;
  /** CloudFront private key (PEM format) */
  readonly privateKey: string;
  /** URL expiration time in seconds (default: 1 hour) */
  readonly expiration?: number;
}

/**
 * File processing configuration
 */
export interface FileProcessingConfig {
  /** Enable image optimization */
  readonly enableImageOptimization?: boolean;
  /** Image optimization options */
  readonly imageOptimization?: {
    /** Enable thumbnail generation */
    readonly generateThumbnail?: boolean;
    /** Thumbnail width in pixels */
    readonly thumbnailWidth?: number;
    /** Thumbnail height in pixels */
    readonly thumbnailHeight?: number;
    /** Enable format conversion to WebP */
    readonly convertToWebP?: boolean;
    /** Max image width for optimization */
    readonly maxWidth?: number;
    /** Max image height for optimization */
    readonly maxHeight?: number;
  };
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  /** Storage type */
  readonly type: 'local' | 's3' | 'custom';
  /** Base path for local storage */
  readonly basePath?: string;
  /** S3 configuration */
  readonly s3?: {
    readonly bucket: string;
    readonly region: string;
    readonly accessKeyId?: string;
    readonly secretAccessKey?: string;
    readonly endpoint?: string;
  };
  /** CloudFront configuration */
  readonly cloudFront?: CloudFrontConfig;
  /** File processing configuration */
  readonly fileProcessing?: FileProcessingConfig;
  /** Create directories if they don't exist */
  readonly createDirectories?: boolean;
}

/**
 * Service configuration
 */
export interface FileServiceConfig {
  /** Storage configuration */
  readonly storage: StorageConfig;
  /** Validation configuration */
  readonly validation: ValidationConfig;
  /** Enable audit logging */
  readonly enableAuditLog: boolean;
  /** Enable metrics collection */
  readonly enableMetrics: boolean;
  /** Temporary directory for processing */
  readonly tempDirectory?: string;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  /** Timestamp */
  readonly timestamp: Date;
  /** Action performed */
  readonly action: 'upload' | 'download' | 'delete' | 'access_denied';
  /** File ID */
  readonly fileId?: string;
  /** User/system identifier */
  readonly actor?: string;
  /** Tenant ID */
  readonly tenantId?: string;
  /** Success status */
  readonly success: boolean;
  /** Error message if failed */
  readonly error?: string;
  /** Additional metadata */
  readonly metadata?: Record<string, unknown>;
}

/**
 * Service metrics
 */
export interface ServiceMetrics {
  /** Total uploads */
  readonly totalUploads: number;
  /** Total downloads */
  readonly totalDownloads: number;
  /** Total bytes uploaded */
  readonly totalBytesUploaded: number;
  /** Total bytes downloaded */
  readonly totalBytesDownloaded: number;
  /** Failed operations */
  readonly failedOperations: number;
  /** Average upload time (ms) */
  readonly avgUploadTime: number;
  /** Average download time (ms) */
  readonly avgDownloadTime: number;
}

/**
 * File service error types
 */
export enum FileServiceErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  CHECKSUM_MISMATCH = 'CHECKSUM_MISMATCH',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
