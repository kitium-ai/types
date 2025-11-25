import type { OrganizationId, ProductId, FeatureId, UserId, TeamId } from './primitives';

/**
 * Product and Feature Types
 * Core product, feature, and project management types
 */

/**
 * Product status
 */
export enum ProductStatus {
  DRAFT = 'draft',
  IN_DEVELOPMENT = 'in_development',
  BETA = 'beta',
  RELEASED = 'released',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
  DISCONTINUED = 'discontinued',
}

/**
 * Feature status
 */
export enum FeatureStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  READY = 'ready',
  RELEASED = 'released',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
}

/**
 * Feature tier visibility
 */
export enum FeatureTier {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  ALL = 'all',
}

/**
 * Release type/version strategy
 */
export enum ReleaseType {
  MAJOR = 'major',
  MINOR = 'minor',
  PATCH = 'patch',
  BETA = 'beta',
  ALPHA = 'alpha',
  RC = 'rc',
}

/**
 * Core product entity
 */
export interface Product {
  readonly id: ProductId;
  readonly organizationId: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly icon?: string;
  readonly color?: string;
  readonly status: ProductStatus;
  readonly version: string;
  readonly currentVersion: ProductVersion;
  readonly owner: UserId;
  readonly team?: {
    readonly id: TeamId;
    readonly name: string;
  };
  readonly category?: string;
  readonly tags: readonly string[];
  readonly documentation?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly documentation_url?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly support_email?: string;
  readonly features: number;
  readonly releases: number;
  readonly visibility: 'private' | 'internal' | 'public';
  readonly isArchived: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly archivedAt?: Date;
}

/**
 * Product version
 */
export interface ProductVersion {
  readonly id: string;
  readonly productId: ProductId;
  readonly version: string;
  readonly releaseType: ReleaseType;
  readonly name: string;
  readonly description: string;
  readonly changelog?: string;
  readonly features: readonly FeatureId[]; // Feature IDs
  readonly releaseDate: Date;
  readonly downloadUrl?: string;
  readonly documentationUrl?: string;
  readonly breakingChanges?: readonly string[];
  readonly deprecations?: readonly string[];
  readonly migrationsGuide?: string;
  readonly isStable: boolean;
  readonly supportedUntil?: Date;
  readonly createdAt: Date;
}

/**
 * Feature entity
 */
export interface Feature {
  readonly id: FeatureId;
  readonly productId: ProductId;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly status: FeatureStatus;
  readonly tier: FeatureTier;
  readonly owner: UserId; // User ID
  readonly epic?: string; // Epic ID
  readonly priority: number; // 1-5, higher = more important
  readonly estimatedHours?: number;
  readonly developmentHours?: number;
  readonly tags: readonly string[];
  readonly documentation?: string;
  readonly dependsOn?: readonly FeatureId[]; // Feature IDs
  readonly relatedFeatures?: readonly FeatureId[]; // Feature IDs
  readonly acceptanceCriteria?: readonly string[];
  readonly testCases?: readonly string[];
  readonly metrics?: {
    readonly usage: number;
    readonly adoption: number;
    readonly satisfaction: number;
  };
  readonly targetReleaseVersion?: string;
  readonly actualReleaseVersion?: string;
  readonly releaseDate?: Date;
  readonly deprecatedAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Epic for grouping related features
 */
export interface Epic {
  readonly id: string;
  readonly productId: ProductId;
  readonly name: string;
  readonly description: string;
  readonly owner: UserId; // User ID
  readonly features: readonly FeatureId[]; // Feature IDs
  readonly targetReleaseVersion: string;
  readonly startDate?: Date;
  readonly targetEndDate?: Date;
  readonly actualEndDate?: Date;
  readonly status: 'planning' | 'in_progress' | 'complete' | 'on_hold';
  readonly budget?: number;
  readonly actualCost?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Release entity
 */
export interface Release {
  readonly id: string;
  readonly productId: ProductId;
  readonly version: string;
  readonly releaseType: ReleaseType;
  readonly name: string;
  readonly description: string;
  readonly changelog: string;
  readonly features: readonly FeatureId[]; // Feature IDs
  readonly bugFixes: readonly string[]; // Bug IDs
  readonly improvements: readonly string[]; // Improvement IDs
  readonly releaseDate: Date;
  readonly releasedBy: UserId; // User ID
  readonly status: 'draft' | 'scheduled' | 'released' | 'rollback';
  readonly downloadUrl?: string;
  readonly documentationUrl?: string;
  readonly breakingChanges?: readonly string[];
  readonly migrationsGuide?: string;
  readonly supportedUntil?: Date;
  readonly rollbackVersion?: string;
  readonly rollbackReason?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Bug/Issue entity
 */
export interface Issue {
  readonly id: string;
  readonly productId: ProductId;
  readonly title: string;
  readonly description: string;
  readonly issueType: 'bug' | 'feature' | 'improvement' | 'task' | 'documentation';
  readonly status: 'open' | 'in_progress' | 'testing' | 'resolved' | 'closed' | 'wontfix';
  readonly priority: 'critical' | 'high' | 'medium' | 'low';
  readonly assignee?: UserId; // User ID
  readonly reporter: UserId; // User ID
  readonly labels: readonly string[];
  readonly estimatedHours?: number;
  readonly actualHours?: number;
  readonly dueDate?: Date;
  readonly relatedFeatures?: readonly FeatureId[]; // Feature IDs
  readonly relatedIssues?: readonly string[]; // Issue IDs
  readonly attachments?: readonly {
    readonly id: string;
    readonly name: string;
    readonly url: string;
  }[];
  readonly comments: number;
  readonly resolution?: string;
  readonly resolvedAt?: Date;
  readonly closedAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Roadmap milestone
 */
export interface Milestone {
  readonly id: string;
  readonly productId: ProductId;
  readonly name: string;
  readonly description?: string;
  readonly targetDate: Date;
  readonly features: readonly FeatureId[]; // Feature IDs
  readonly percentComplete: number;
  readonly status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Request to create product
 */
export interface CreateProductRequest {
  readonly name: string;
  readonly slug?: string;
  readonly description: string;
  readonly category?: string;
  readonly tags?: readonly string[];
}

/**
 * Request to create feature
 */
export interface CreateFeatureRequest {
  readonly name: string;
  readonly slug?: string;
  readonly description: string;
  readonly tier: FeatureTier;
  readonly priority: number;
  readonly epic?: string;
  readonly acceptanceCriteria?: readonly string[];
}

/**
 * Request to create release
 */
export interface CreateReleaseRequest {
  readonly version: string;
  readonly releaseType: ReleaseType;
  readonly name: string;
  readonly description: string;
  readonly changelog: string;
  readonly features: readonly string[];
  readonly bugFixes?: readonly string[];
  readonly releaseDate: Date;
}

/**
 * Request to create issue
 */
export interface CreateIssueRequest {
  readonly title: string;
  readonly description: string;
  readonly issueType: 'bug' | 'feature' | 'improvement' | 'task' | 'documentation';
  readonly priority: 'critical' | 'high' | 'medium' | 'low';
  readonly assignee?: string;
  readonly labels?: readonly string[];
  readonly estimatedHours?: number;
  readonly dueDate?: Date;
}

/**
 * Feature request from users
 */
export interface FeatureRequest {
  readonly id: string;
  readonly productId: ProductId;
  readonly title: string;
  readonly description: string;
  readonly upvotes: number;
  readonly downvotes: number;
  readonly userUpvoted?: boolean;
  readonly requestedBy: UserId; // User ID
  readonly status: 'new' | 'planned' | 'in_progress' | 'completed' | 'declined';
  readonly linkedFeature?: FeatureId; // Feature ID
  readonly comments: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Product usage metrics
 */
export interface ProductUsageMetrics {
  readonly productId: ProductId;
  readonly date: Date;
  readonly activeUsers: number;
  readonly totalRequests: number;
  readonly errorRate: number;
  readonly averageResponseTime: number;
  readonly uptime: number;
  readonly topFeatures: readonly {
    readonly featureId: FeatureId;
    readonly name: string;
    readonly usage: number;
  }[];
  readonly createdAt: Date;
}

/**
 * Feature adoption metrics
 */
export interface FeatureAdoption {
  readonly featureId: FeatureId;
  readonly productId: ProductId;
  readonly activationDate: Date;
  readonly uniqueUsers: number;
  readonly totalUsage: number;
  readonly adoptionRate: number;
  readonly retentionRate: number;
  readonly lastUpdatedAt: Date;
}
