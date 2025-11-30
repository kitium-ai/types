# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.1] - 2025-11-30

### Added

updated kitiumai packages with patched version

## [v2.0.0] - 2025-11-28

### Added

- Documentation examples that show how to consume the stable `@kitium-ai/types/v1` entrypoint, opt into the experimental surface, and validate payloads with branded primitives.
- API reference section outlining the major subpath exports and the dedicated logger package location.

## [1.0.0] - 2025-11-21

### Added

#### Core Type System

- **Domain Models** - Comprehensive business entity types across all domains:
  - User management (User, UserProfile, UserSettings, NotificationPreferences)
  - Organization & Team management (Organization, Team, OrganizationMember, TeamMember)
  - Product management (Product, Feature, Release, Issue, Milestone, Epic)
  - Billing & Subscriptions (Subscription, Invoice, PaymentMethod, Refund, DiscountCode)
  - Authentication (Session, APIKey, MFAConfig, AuthResponse)

#### Validation Layer (Zod-based)

- **Validation Schemas** (`src/validators.ts`) with 30+ Zod validators:
  - Authentication validators: `LoginCredentialsSchema`, `PasswordResetConfirmSchema`, `MFAVerificationSchema`, `APIKeySchema`
  - User validators: `UserRegistrationSchema`, `UpdateUserProfileSchema`, `NotificationPreferencesSchema`
  - Organization validators: `CreateOrganizationSchema`, `UpdateOrganizationSchema`, `OrganizationSchema`
  - Product validators: `CreateProductSchema`, `CreateFeatureSchema`
  - Billing validators: `CreateSubscriptionSchema`, `UpdateSubscriptionSchema`, `PricingPlanSchema`
  - API validators: `ListQueryParamsSchema`, `FileUploadSchema`, `WebhookConfigSchema`
  - Error validators: `ValidationErrorSchema`, `ErrorResponseSchema`

- **Validator Helper Functions**:
  - `createValidator<T>()` - Factory function for creating type-safe validators
  - `Validators` namespace - Pre-instantiated validators for common types
  - Support for `.parse()`, `.safeParse()`, and `.validate()` methods
  - Type inference support: `z.infer<typeof SchemaName>`

#### Database Entity Types

- **Database Entity Definitions** (`src/entities.ts`):
  - `BaseEntity` - Core entity interface with id, timestamps, and version
  - `AuditableEntity` - Extended entity with full audit trail (createdBy, updatedBy, deletedAt, deletedBy)
  - 25+ domain-specific database entities:
    - User entities: `UserEntity`, `UserSettingsEntity`, `NotificationPreferencesEntity`, `AuthenticationHistoryEntity`, `SessionEntity`, `APIKeyEntity`
    - Organization entities: `OrganizationEntity`, `OrganizationSettingsEntity`, `OrganizationMemberEntity`
    - Team entities: `TeamEntity`, `TeamMemberEntity`
    - Product entities: `ProductEntity`, `FeatureEntity`, `ReleaseEntity`
    - Billing entities: `SubscriptionEntity`, `PaymentMethodEntity`, `InvoiceEntity`, `PaymentTransactionEntity`
    - Infrastructure entities: `WebhookConfigEntity`, `WebhookDeliveryEntity`, `AuditLogEntity`, `ActivityLogEntity`, `FileUploadEntity`, `ErrorLogEntity`, `EmailTemplateEntity`, `FeatureFlagEntity`, `RateLimitConfigEntity`

- **Generic Repository Pattern**:
  - `Repository<T>` interface for type-safe data access
  - Standard CRUD operations: create, read, update, delete, exists, count
  - EntityMap type for managing entity relationships

#### API Request/Response Types

- Standard API communication patterns:
  - `APIResponse<T>` - Standardized response wrapper with success flag
  - `PaginatedResponse<T>` - Pagination support with metadata
  - `ListQueryParams` - Standardized query parameters for list endpoints
  - `RequestContext` - Request context information
  - `FileUpload` - File upload metadata
  - `WebhookPayload` & `WebhookConfig` - Webhook management
  - `HealthCheck`, `RateLimitInfo`, `CacheControl`, `CORSConfig` - Infrastructure types

#### Authentication & Authorization

- Comprehensive authentication types:
  - `JWTPayload` - JWT token structure
  - `Session` - User session information
  - `LoginCredentials` - Login request type
  - `OAuthRequest` & `OAuthCallback` - OAuth flow types
  - `SAMLConfig` & `OIDCConfig` - Enterprise SSO configuration
  - `AuthResponse` - Authentication response with tokens
  - `RefreshTokenRequest`, `PasswordResetRequest`, `PasswordResetConfirm` - Auth flow types
  - `MFAConfig` & `MFAVerification` - Multi-factor authentication

#### Role-Based Access Control

- **UserRole** enum with 7 hierarchical roles:
  - SUPER_ADMIN, ADMIN, OWNER, MANAGER, MEMBER, VIEWER, GUEST

- **Permission** enum with 32 granular permissions:
  - Organization: ORG_CREATE, ORG_READ, ORG_UPDATE, ORG_DELETE, ORG_INVITE, ORG_SETTINGS
  - User: USER_CREATE, USER_READ, USER_UPDATE, USER_DELETE, USER_ROLE_MANAGE
  - Product: PRODUCT_CREATE, PRODUCT_READ, PRODUCT_UPDATE, PRODUCT_DELETE, PRODUCT_PUBLISH
  - Team: TEAM_CREATE, TEAM_READ, TEAM_UPDATE, TEAM_DELETE, TEAM_INVITE
  - Billing: BILLING_READ, BILLING_UPDATE, BILLING_INVOICE
  - Settings: SETTINGS_READ, SETTINGS_UPDATE, SETTINGS_INTEGRATIONS
  - Analytics: ANALYTICS_READ, ANALYTICS_EXPORT
  - Audit: AUDIT_READ, AUDIT_EXPORT

#### Billing & Subscription Types

- **Subscription Management**:
  - `PricingPlan` - Plan definitions with features and pricing
  - `Subscription` - Subscription records with billing cycle
  - `SubscriptionLineItem` - Line items for subscriptions
  - `PaymentMethod` - Multiple payment method types (credit card, bank, PayPal, etc.)
  - `Invoice` - Invoice generation and tracking
  - `PaymentTransaction` - Transaction records
  - `Refund` - Refund management
  - `DiscountCode` - Coupon and discount codes
  - `BillingAddress` - Billing address management
  - `UsageRecord` - Usage-based billing

- **Billing Enums**:
  - `SubscriptionStatus`: ACTIVE, TRIAL, PAST_DUE, PAUSED, CANCELED, EXPIRED, PENDING
  - `BillingCycle`: MONTHLY, QUARTERLY, ANNUALLY, CUSTOM
  - `PaymentMethodType`: CREDIT_CARD, DEBIT_CARD, BANK_ACCOUNT, DIGITAL_WALLET, PAYPAL, WIRE_TRANSFER, CHECK
  - `PaymentStatus`: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, DISPUTED
  - `InvoiceStatus`: DRAFT, SENT, VIEWED, PARTIAL_PAID, PAID, OVERDUE, CANCELED, REFUNDED
  - `TaxType`: VAT, GST, HST, PST, SALES_TAX, USE_TAX

#### Error Handling

- **Error Types**:
  - `ApplicationError` - Base error interface with severity levels
  - Specialized error types:
    - `AuthenticationException` - Auth-related errors
    - `ValidationException` - Validation errors with field details
    - `ResourceNotFoundException` - 404-style errors
    - `ConflictException` - Conflict/duplicate resource errors
    - `QuotaExceededException` - Quota limit errors
    - `RateLimitException` - Rate limiting errors
    - `PaymentException` - Payment processing errors

- **Error Enums**:
  - `ErrorCode` - 40+ error codes for different scenarios
  - `ErrorSeverity` - Severity levels (INFO, WARNING, ERROR, CRITICAL)

- **Error Infrastructure**:
  - `ValidationError` - Field-level validation error details
  - `ValidationResult` - Validation results with error/warning lists
  - `ValidationRule` - Field validation rule definitions
  - `ValidationSchema` - Schema for validation configuration
  - `ErrorResponse` - Standard error response format
  - `ErrorLog` - Error logging and tracking
  - `ErrorEvent` - Error event for tracking services

#### Utility Types

- **Generic Utility Types**:
  - `Result<T, E>` - Success/failure result type
  - `Optional<T>` - Nullable type alias
  - `Readonly<T>` / `Mutable<T>` - Immutability helpers
  - `Dictionary<T>` - Type-safe map/dictionary
  - `Page<T>` - Paginated list utility
  - `TreeNode<T>` - Tree structure type
  - `GraphEdge<T>` - Graph edge type

- **Function Types**:
  - `AsyncFunction<T, R>` - Async function signature
  - `Fn<T, R>` - Function signature
  - `Callback<T>` - Generic callback type
  - `Predicate<T>` - Boolean predicate type
  - `Comparator<T>` - Comparison function
  - `Mapper<T, R>` - Mapping function
  - `Reducer<T, R>` - Reducer function

- **Data Structure Types**:
  - `Coordinate` & `Coordinate3D` - 2D/3D coordinates
  - `Size` & `Rectangle` - Dimension types
  - `Color` - RGB color with alpha
  - `Version` - Semantic versioning
  - `Duration` & `Interval` - Time-related types
  - `Money` - Currency amount
  - `Percentage` - Percentage with decimals
  - `LocalizedString` - Multi-language support

- **Pattern Types**:
  - `EventEmitter<T>` - Generic event emitter
  - `Observable<T>` & `Observer<T>` - Observer pattern
  - `ObserverSubscription` - Subscription management (renamed from Subscription)
  - `Deferred<T>` - Promise-like deferred type
  - `Strategy<T>` - Strategy pattern interface
  - `Cloneable<T>` & `Comparable<T>` - Object capabilities
  - `Serializable` & `Hashable` - Object serialization
  - `Auditable` & `Versioned` - Audit and versioning support

- **Base Entity Mixins**:
  - `Entity` - Basic identity + timestamps
  - `AuditableEntity` - Full audit trail
  - `Identity` - Just id
  - `Timestamped` - Created/updated timestamps
  - `Deletable` - Soft delete support
  - `Taggable` - Tag support
  - `Metadata` - Arbitrary metadata

#### Product & Feature Management

- **Product Lifecycle**:
  - `Product` - Product definition with versioning
  - `ProductVersion` - Version tracking with release types
  - `Feature` - Feature definition with priority and tier
  - `Epic` - Epic for grouping features
  - `Release` - Release management
  - `Issue` - Bug/feature issue tracking
  - `Milestone` - Roadmap milestone

- **Product Enums**:
  - `ProductStatus`: DRAFT, IN_DEVELOPMENT, BETA, RELEASED, DEPRECATED, ARCHIVED, DISCONTINUED
  - `FeatureStatus`: PLANNED, IN_PROGRESS, TESTING, READY, RELEASED, DEPRECATED, ARCHIVED
  - `FeatureTier`: FREE, STARTER, PROFESSIONAL, ENTERPRISE, ALL
  - `ReleaseType`: MAJOR, MINOR, PATCH, BETA, ALPHA, RC

- **Metrics & Analytics**:
  - `ProductUsageMetrics` - Usage tracking
  - `FeatureAdoption` - Feature adoption rates
  - `FeatureRequest` - User feature requests

#### Dependencies

- **Zod** (^3.22.4) - Runtime schema validation and type inference

#### Package Configuration

- Comprehensive `package.json` with:
  - ESM and CommonJS export support
  - Per-module exports for tree-shaking
  - TypeScript declaration files
  - Pre-build type checking
  - Build and linting scripts

#### Documentation

- **README.md** - Comprehensive documentation including:
  - Architecture overview
  - Installation instructions
  - Complete usage examples
  - Security best practices
  - Advanced patterns
  - Type testing examples
  - Contributing guidelines

### Changed

- Renamed `Subscription` to `ObserverSubscription` in utils.ts to avoid naming conflicts with billing Subscription type

### Technical Details

#### TypeScript Configuration

- Target: ES2020
- Strict mode enabled
- Comprehensive tsconfig with:
  - Declaration maps
  - Source maps
  - Type checking strictness
  - Module resolution

#### Export Strategy

- **Main entry point** - All public types
- **Namespaced exports**:
  - `ValidatorSchemas` - All Zod schemas
  - `Entities` - All database entity types
  - `Validators` - Pre-instantiated validator objects
- **Per-module exports** - For better tree-shaking

#### Code Quality

- TypeScript strict mode compliance
- ESLint configuration
- Type safety throughout
- Immutable types using readonly modifiers
- Comprehensive JSDoc documentation

### Verified

- ✅ All TypeScript compilation checks pass
- ✅ No unused variables or imports
- ✅ Type-safe exports with zero conflicts
- ✅ Package builds successfully
- ✅ No circular dependencies

## [Unreleased]

### Planned Features

- Additional validation schemas for emerging domains
- Database migration utilities
- ORM integration examples (TypeORM, Prisma)
- Testing utilities and test types
- GraphQL type definitions
- OpenAPI/Swagger integration
- Performance monitoring types
- Audit trail querying utilities
- Multi-tenancy utilities

### Future Improvements

- Add optional peer dependency on @kitium-ai/schemas for schema composition
- Integration examples with popular SaaS frameworks
- Plugin system for custom validators
- Type generation utilities
- Breaking change detection tools
