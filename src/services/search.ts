/**
 * Search Service Types
 * Types for search engine integration and document indexing
 */

/**
 * Document to be indexed and searched
 */
export interface SearchDocument {
  readonly id: string | number;
  readonly content: string;
  readonly metadata?: Record<string, unknown>;
  readonly timestamp?: number;
}

/**
 * Search query options
 */
export interface SearchOptions {
  /** Maximum number of results to return */
  readonly limit?: number;
  /** Starting offset for pagination */
  readonly offset?: number;
  /** Minimum relevance score (0-1) */
  readonly minScore?: number;
  /** Fields to search in metadata */
  readonly metadataFilters?: Record<string, unknown>;
  /** Whether to use fuzzy matching */
  readonly fuzzyMatch?: boolean;
  /** Boost factor for exact matches */
  readonly exactMatchBoost?: number;
}

/**
 * Search result
 */
export interface SearchResult {
  readonly id: string | number;
  readonly content: string;
  readonly score: number;
  readonly metadata?: Record<string, unknown>;
  readonly highlights?: readonly string[];
}

/**
 * Search engine options
 */
export interface SearchEngineOptions {
  /** Enable stemming for word matching */
  readonly stemming?: boolean;
  /** Case-sensitive search */
  readonly caseSensitive?: boolean;
  /** Maximum document size in characters */
  readonly maxDocumentSize?: number;
  /** Maximum results per query */
  readonly maxResults?: number;
}

/**
 * Index metadata
 */
export interface IndexMetadata {
  readonly documentCount: number;
  readonly indexSize: number;
  readonly lastUpdated: number;
  readonly version: string;
}

/**
 * Search error types
 */
export enum SearchErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INDEX_ERROR = 'INDEX_ERROR',
  QUERY_ERROR = 'QUERY_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
}
