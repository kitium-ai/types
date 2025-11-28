# @kitium-ai/types

Enterprise-ready TypeScript types and interfaces for Kitium AI SaaS platform. Provides a **single source of truth** for all types across your application.

## Overview

This package provides a comprehensive, type-safe type system designed for scalable SaaS applications. It ensures consistency across:

- **Domain Models** - Core business entities
- **API Contracts** - Request/response types
- **Database Entities** - Persistence layer mappings
- **Validators** - Runtime validation with Zod
- **Utilities** - Reusable type helpers

## Quickstart

Use the stable, versioned entrypoint for production and the experimental surface when you want access to preview contracts:

```typescript
// Stable contract pinned to the current major surface
import { User, APIResponse, VALIDATORS, Identifier } from '@kitium-ai/types/v1';

const payload: APIResponse<User> = {
  success: true,
  status: 200,
  data: {
    id: Identifier('user_123'),
    email: 'user@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    status: 'active',
    roles: ['member'],
    permissions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  timestamp: new Date().toISOString(),
};

// Opt-in preview surface (safe to tree-shake away)
import { stability } from '@kitium-ai/types/experimental';
console.log(`Using ${stability} contracts`);

// Runtime validation with branded primitives
const result = VALIDATORS.userRegistration.safeParse({
  email: 'user@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
  password: 'Supers3cret!',
  confirmPassword: 'Supers3cret!',
  acceptTerms: true,
  acceptPrivacy: true,
});
```

## Installation

```bash
npm install @kitium-ai/types
yarn add @kitium-ai/types
```

### Dependencies

- **zod** (^3.22.4) - Runtime validation and type inference

### Versioned entrypoints

- `@kitium-ai/types/v1` — pinned stable contract for production consumers
- `@kitium-ai/types/experimental` — opt-in preview surface isolated from the stable API

### Logging

Logger utilities now live in [`@kitiumai/logger`](https://www.npmjs.com/package/@kitiumai/logger) to keep this package focused on transport-safe types.

## API references

The package ships typed, runtime-safe entrypoints to mirror your platform surface area:

- `@kitium-ai/types` — full domain and API surface (auth, users, organizations, billing, products, errors, utilities)
- `@kitium-ai/types/v1` — stable, versioned alias of the primary surface
- `@kitium-ai/types/experimental` — opt-in preview exports for early adopters
- `@kitium-ai/types/auth`, `@kitium-ai/types/organization`, `@kitium-ai/types/product`, `@kitium-ai/types/billing` — focused domain bundles
- `@kitium-ai/types/api` — request/response contracts, pagination helpers, webhook payloads
- `@kitium-ai/types/primitives` — branded identifiers (`Identifier`, `IsoDateTimeString`, `Uuid`) and helper utilities
- `@kitium-ai/types/errors` — error codes, severities, and response contracts
- `@kitium-ai/types/utils` — cross-cutting helpers (`Result`, `Pagination`, collection helpers)
- `VALIDATORS` namespace — pre-built Zod schemas for runtime validation across auth, billing, product, and webhook flows

## Architecture

### 1. Domain Models (Business Logic)

Core entity types representing your business domain:

```typescript
import { User, Organization, Product } from '@kitium-ai/types';

const user: User = {
  id: 'user-123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  // ... more properties
};
```

**Key entities:**

- `User` - User profile with authentication status
- `Organization` - Multi-tenant organization
- `Team` - Teams within organizations
- `Product` - Product definitions
- `Subscription` - Billing subscriptions
- `Invoice` - Invoice records
- `Session` - User sessions

### 2. API Types

Request/response contracts for API communication:

```typescript
import {
  UserRegistrationRequest,
  UpdateUserProfileRequest,
  APIResponse,
  PaginatedResponse,
} from '@kitium-ai/types';

// Request types
const registrationData: UserRegistrationRequest = {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'SecurePassword123!',
  confirmPassword: 'SecurePassword123!',
  acceptTerms: true,
  acceptPrivacy: true,
};

// Response wrapper
const response: APIResponse<User> = {
  success: true,
  status: 200,
  data: user,
  timestamp: new Date().toISOString(),
};

// Paginated responses
const paginated: PaginatedResponse<User> = {
  items: [user1, user2],
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 100,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: false,
  },
};
```

**Key request/response types:**

- `CreateOrganizationRequest` / `UpdateOrganizationRequest`
- `CreateProductRequest` / `CreateFeatureRequest`
- `CreateSubscriptionRequest` / `UpdateSubscriptionRequest`
- `ListQueryParams` - Standardized list query parameters
- `FileUpload` - File upload metadata
- `WebhookConfig` - Webhook configuration
- `APIResponse<T>` - Standard response wrapper
- `PaginatedResponse<T>` - Paginated results

### 3. Validators (Runtime Validation)

Zod-based schemas for runtime validation and type safety:

```typescript
import { Validators, UserRegistrationSchema } from '@kitium-ai/types';
import { z } from 'zod';

// Option 1: Using pre-instantiated validators
const registrationResult = Validators.userRegistration.safeParse(data);
if (!registrationResult.success) {
  console.error(registrationResult.error.errors);
}

// Option 2: Direct schema validation
try {
  const validatedData = UserRegistrationSchema.parse(data);
  console.log('Valid:', validatedData);
} catch (error) {
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      console.log(`${err.path}: ${err.message}`);
    });
  }
}

// Option 3: Type inference
type UserRegistrationType = z.infer<typeof UserRegistrationSchema>;

// Option 4: Safe parsing
const result = UserRegistrationSchema.safeParse(data);
if (result.success) {
  const validated = result.data; // Type-safe
}
```

**Available validators:**

- Authentication: `LoginCredentialsSchema`, `PasswordResetConfirmSchema`, `MFAVerificationSchema`
- Users: `UserRegistrationSchema`, `UpdateUserProfileSchema`
- Organizations: `CreateOrganizationSchema`, `UpdateOrganizationSchema`
- Products: `CreateProductSchema`, `CreateFeatureSchema`
- Billing: `CreateSubscriptionSchema`, `UpdateSubscriptionSchema`, `PricingPlanSchema`
- API: `ListQueryParamsSchema`, `FileUploadSchema`, `WebhookConfigSchema`
- And many more...

### 4. Database Entities

Type-safe database entity definitions for your persistence layer:

```typescript
import type { Entities } from '@kitium-ai/types';

// Access entity types via the Entities namespace
type UserDB = Entities.UserEntity;
type OrganizationDB = Entities.OrganizationEntity;
type SubscriptionDB = Entities.SubscriptionEntity;

// Create database entities
const userEntity: UserDB = {
  id: 'user-123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  passwordHash: 'hash...',
  status: 'active',
  roles: ['member'],
  permissions: ['org:read', 'user:read'],
  timezone: 'UTC',
  language: 'en',
  emailVerified: true,
  phoneVerified: false,
  twoFactorEnabled: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'system',
  version: 1,
};
```

**Entity features:**

- `BaseEntity` - Core fields (id, timestamps, version)
- `AuditableEntity` - Extends BaseEntity with audit trail
- Specific entities with database-optimized fields
- `Repository<T>` interface for type-safe data access

**Key database entities:**

- `UserEntity` - User with password hash
- `OrganizationEntity` - Organization data
- `TeamEntity` - Team management
- `ProductEntity` - Product definitions
- `SubscriptionEntity` - Subscription records
- `InvoiceEntity` - Invoice data
- `AuditLogEntity` - Audit trail
- And more...

### 5. Enums for Type Safety

Comprehensive enums for constants:

```typescript
import {
  AccountStatus,
  UserRole,
  Permission,
  OrganizationPlan,
  SubscriptionStatus,
  PaymentStatus,
  ProductStatus,
  FeatureStatus,
} from '@kitium-ai/types';

const userRole: UserRole = UserRole.MEMBER;
const planType: OrganizationPlan = OrganizationPlan.PROFESSIONAL;
const subscriptionStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE;
const paymentStatus: PaymentStatus = PaymentStatus.COMPLETED;
```

## Usage Examples

### Example 1: User Registration

```typescript
import { UserRegistrationSchema, UserEntity, Validators } from '@kitium-ai/types';

// Frontend: Validate user input
async function handleUserRegistration(formData: unknown) {
  const validation = Validators.userRegistration.safeParse(formData);

  if (!validation.success) {
    // Handle validation errors
    return { error: validation.error.errors };
  }

  // Send validated data to API
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(validation.data),
  });

  return response.json();
}

// Backend: Create database entity
function createUserEntity(validatedData: UserRegistration): UserEntity {
  return {
    id: generateId(),
    email: validatedData.email,
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    passwordHash: hashPassword(validatedData.password),
    status: 'pending_verification',
    roles: ['member'],
    permissions: ['user:read', 'org:read'],
    timezone: validatedData.timezone || 'UTC',
    language: validatedData.language || 'en',
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    version: 1,
  };
}
```

### Example 2: API Response Handling

```typescript
import { APIResponse, User, PaginatedResponse } from '@kitium-ai/types';

// Type-safe API response handler
async function fetchUser(id: string): Promise<APIResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  const data: APIResponse<User> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch user');
  }

  return data; // data.data is type User
}

// Type-safe paginated list handler
async function fetchUsers(page: number) {
  const response = await fetch(`/api/users?page=${page}`);
  const data: APIResponse<PaginatedResponse<User>> = await response.json();

  if (!data.success) throw new Error('Failed to fetch users');

  const pagination = data.data!.pagination;
  console.log(`Page ${pagination.page} of ${pagination.totalPages}`);

  return data.data!.items; // Array<User>
}
```

### Example 3: Form Validation

```typescript
import { UpdateUserProfileSchema, Validators } from '@kitium-ai/types';

function handleProfileUpdate(formData: FormData) {
  const data = Object.fromEntries(formData);

  // Option 1: Direct validation
  try {
    const validated = UpdateUserProfileSchema.parse(data);
    // Use validated data
  } catch (error) {
    // Handle validation errors
  }

  // Option 2: Safe validation with error mapping
  const result = Validators.updateUserProfile.safeParse(data);

  if (result.success) {
    // Send to API
  } else {
    // Display field errors
    const fieldErrors = result.error.flatten();
    return { fieldErrors: fieldErrors.fieldErrors };
  }
}
```

### Example 4: Database Operations

```typescript
import type { Entities } from '@kitium-ai/types';

// Type-safe repository pattern
class UserRepository implements Repository<UserEntity> {
  async create(user: Omit<UserEntity, keyof BaseEntity>): Promise<UserEntity> {
    const entity: UserEntity = {
      ...user,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    // Save to database
    await db.users.insert(entity);
    return entity;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return db.users.findOne({ id });
  }

  async update(
    id: string,
    updates: Partial<Omit<UserEntity, keyof BaseEntity>>
  ): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');

    const updated: UserEntity = {
      ...user,
      ...updates,
      updatedAt: new Date(),
      version: user.version + 1,
    };

    await db.users.update({ id }, updated);
    return updated;
  }
}
```

## Module Structure

```
@kitium-ai/types
├── auth.ts           # Authentication & authorization types
├── user.ts           # User management types
├── organization.ts   # Organization & team types
├── product.ts        # Product management types
├── billing.ts        # Billing & subscription types
├── api.ts            # API request/response types
├── errors.ts         # Error handling types
├── utils.ts          # Utility types & helpers
├── validators.ts     # Zod validation schemas
├── entities.ts       # Database entity types
└── index.ts          # Main exports
```

## Type Export Patterns

### Pattern 1: Import Domain Types

```typescript
// Import specific types
import { User, Organization, Product } from '@kitium-ai/types';

// Use in application
const user: User = getUser();
```

### Pattern 2: Import API Request Types

```typescript
import { CreateOrganizationRequest, UpdateUserProfileRequest } from '@kitium-ai/types';

// Strongly typed API calls
async function createOrganization(data: CreateOrganizationRequest) {
  // ...
}
```

### Pattern 3: Use Validators Module

```typescript
import { Validators, ValidatorSchemas } from '@kitium-ai/types';
import { z } from 'zod';

// Pre-instantiated validators
Validators.userRegistration.safeParse(data);

// Or use schemas directly
type MyType = z.infer<typeof ValidatorSchemas.UserRegistrationSchema>;
```

### Pattern 4: Use Entity Types

```typescript
import type { Entities } from '@kitium-ai/types';

type UserDB = Entities.UserEntity;
type OrganizationDB = Entities.OrganizationEntity;

// Implement repositories
class UserDB implements Repository<Entities.UserEntity> {
  // ...
}
```

## Security Best Practices

### 1. Always Validate User Input

```typescript
// ✅ Good
const validated = UserRegistrationSchema.parse(userInput);

// ❌ Bad - Don't trust user input
const user = userInput as User;
```

### 2. Use Enums for Authorization

```typescript
// ✅ Good - Type-safe permission checking
if (user.permissions.includes(Permission.ORG_ADMIN)) {
  // Allow operation
}

// ❌ Bad - String magic
if (user.permissions.includes('admin')) {
  // Allow operation
}
```

### 3. Never Expose Sensitive Fields

```typescript
// ✅ Good - Exclude sensitive fields
type SafeUser = Omit<User, 'passwordHash' | 'mfaSecret'>;

// ❌ Bad - Expose all fields
const response = { data: user };
```

### 4. Validate Before Database Operations

```typescript
// ✅ Good - Validate request
const validated = CreateUserSchema.parse(request.body);
const user = await userRepository.create(validated);

// ❌ Bad - No validation
const user = await userRepository.create(request.body);
```

### 5. Use Immutable Types

```typescript
// Domain types use 'readonly' to prevent mutations
export interface User {
  readonly id: string;
  readonly email: string;
  readonly roles: readonly UserRole[]; // Read-only array
}
```

## Advanced Usage

### Custom Validator Creation

```typescript
import { createValidator } from '@kitium-ai/types';
import { z } from 'zod';

const CustomSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
});

const customValidator = createValidator(CustomSchema);
const result = customValidator.safeParse(data);
```

### Extending Types

```typescript
import { User } from '@kitium-ai/types';

// Extend user with application-specific fields
interface AppUser extends User {
  readonly customField: string;
}

// Use in application
const appUser: AppUser = {
  ...baseUser,
  customField: 'value',
};
```

### Type Guards

```typescript
import { User, Admin } from '@kitium-ai/types';

// Type guard for user role
function isAdmin(user: User): boolean {
  return user.roles.includes(UserRole.ADMIN);
}

// Usage
if (isAdmin(user)) {
  // Perform admin operations
}
```

## Error Handling

### Using Error Types

```typescript
import {
  ErrorCode,
  ApplicationError,
  ValidationException,
  ResourceNotFoundException,
} from '@kitium-ai/types';

// Create typed error
const error: ValidationException = {
  code: ErrorCode.VALIDATION_FAILED,
  statusCode: 422,
  message: 'Validation failed',
  severity: ErrorSeverity.ERROR,
  validationErrors: [
    {
      field: 'email',
      message: 'Invalid email format',
      code: 'INVALID_EMAIL',
    },
  ],
  timestamp: new Date(),
};

// Handle error responses
function handleError(error: ApplicationError) {
  console.error(`[${error.code}] ${error.message}`);

  if (error instanceof ValidationException) {
    // Handle validation errors
  } else if (error instanceof ResourceNotFoundException) {
    // Handle 404 errors
  }
}
```

## Testing

### Type Testing with TypeScript

```typescript
import { User, Organization } from '@kitium-ai/types';

// This will fail at compile time if types don't match
const testType = (user: User, org: Organization) => {
  // TypeScript validates everything
};
```

### Validation Testing

```typescript
import { UserRegistrationSchema } from '@kitium-ai/types';
import { describe, it, expect } from 'vitest';

describe('UserRegistrationSchema', () => {
  it('should validate correct registration data', () => {
    const data = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      acceptTerms: true,
      acceptPrivacy: true,
    };

    expect(() => UserRegistrationSchema.parse(data)).not.toThrow();
  });

  it('should reject invalid emails', () => {
    const data = {
      email: 'invalid-email',
      // ... other fields
    };

    expect(() => UserRegistrationSchema.parse(data)).toThrow();
  });
});
```

## Contributing

When adding new types:

1. **Choose the right module** - Place types in appropriate module (auth, user, organization, etc.)
2. **Add validation schema** - Add Zod schema to validators.ts
3. **Add database entity** - Add entity type to entities.ts if needed
4. **Update exports** - Ensure types are properly exported from index.ts
5. **Add documentation** - Include JSDoc comments with examples
6. **Run type-check** - Verify no TypeScript errors: `npm run type-check`
7. **Build and test** - Build package: `npm run build`

## License

MIT - See LICENSE file

## Support

For issues and feature requests, please visit: https://github.com/kitium-ai/types

## Related Packages

- [@kitium-ai/api](https://github.com/kitium-ai/api) - API server implementation
- [@kitium-ai/web](https://github.com/kitium-ai/web) - Web application
- [@kitium-ai/sdk](https://github.com/kitium-ai/sdk) - JavaScript SDK

## Changelog

### 1.0.0 (Current)

- Initial release with comprehensive type system
- Zod-based validators for runtime validation
- Database entity types for persistence layer
- Unified single source of truth for all types
- Full TypeScript strict mode support
