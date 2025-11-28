/**
 * Test Helpers for @kitiumai/types
 * Using latest @kitiumai/vitest-helpers 2.0 APIs
 *
 * This file provides reusable test utilities for testing types and validators.
 * All async helpers, builders, factories, and utilities are from vitest-helpers
 * which provides a complete testing toolkit for Vitest.
 */

import {
  createBuilder,
  createFactory,
  createDeferred,
  waitFor,
  sleep,
  retry,
  createTestError,
  type Builder,
  type Factory,
} from '@kitiumai/vitest-helpers';

import type {
  User,
  Organization,
  Product,
  PricingPlan,
  APIResponse,
  LoginCredentials,
} from '../src/index';

/**
 * User Builder - Creates test users with @kitiumai/test-core 2.0 Builder pattern
 */
export const UserBuilder: Builder<User> = createBuilder<User>({
  id: () => `user-${Math.random().toString(36).substr(2, 9)}` as User['id'],
  email: () => `test-${Date.now()}@example.com`,
  emailVerified: () => true,
  name: () => 'Test User',
  createdAt: () => new Date(),
  updatedAt: () => new Date(),
  role: () => 'user',
  status: () => 'active',
  metadata: () => ({}),
});

/**
 * Organization Builder - Creates test organizations
 */
export const OrganizationBuilder: Builder<Organization> = createBuilder<Organization>({
  id: () => `org-${Math.random().toString(36).substr(2, 9)}` as Organization['id'],
  name: () => `Test Organization ${Date.now()}`,
  slug: () => `test-org-${Date.now()}`,
  ownerId: () => `user-${Math.random().toString(36).substr(2, 9)}` as User['id'],
  createdAt: () => new Date(),
  updatedAt: () => new Date(),
  status: () => 'active',
  settings: () => ({}),
  metadata: () => ({}),
});

/**
 * Product Builder - Creates test products
 */
export const ProductBuilder: Builder<Product> = createBuilder<Product>({
  id: () => `prod-${Math.random().toString(36).substr(2, 9)}` as Product['id'],
  name: () => `Test Product ${Date.now()}`,
  slug: () => `test-product-${Date.now()}`,
  description: () => 'Test product description',
  organizationId: () => `org-${Math.random().toString(36).substr(2, 9)}` as Organization['id'],
  createdAt: () => new Date(),
  updatedAt: () => new Date(),
  status: () => 'active',
  features: () => [],
  metadata: () => ({}),
});

/**
 * API Response Factory - Creates test API responses
 */
export const createSuccessResponse = <T>(data: T): APIResponse<T> => ({
  success: true,
  status: 200,
  data,
  timestamp: new Date().toISOString() as any,
});

export const createErrorResponse = (message: string, code?: string): APIResponse<never> => ({
  success: false,
  status: 400,
  error: {
    message,
    code: code || 'TEST_ERROR',
    timestamp: new Date().toISOString() as any,
  },
  timestamp: new Date().toISOString() as any,
});

/**
 * Login Credentials Factory
 */
export const LoginCredentialsFactory: Factory<LoginCredentials> = createFactory<LoginCredentials>({
  email: () => `test-${Date.now()}@example.com`,
  password: () => 'TestPassword123!',
});

/**
 * Async Test Helpers using @kitiumai/test-core 2.0
 */

/**
 * Wait for a condition to be true with timeout
 * Uses the new waitFor from test-core 2.0
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeoutMs = 5000,
  intervalMs = 100
): Promise<void> {
  await waitFor(condition, { timeout: timeoutMs, interval: intervalMs });
}

/**
 * Create a deferred promise for async testing
 * Uses the new createDeferred from test-core 2.0
 */
export function createDeferredTest<T = void>() {
  return createDeferred<T>();
}

/**
 * Retry an operation with exponential backoff
 * Uses the new retry from test-core 2.0
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 100
): Promise<T> {
  return retry(operation, {
    maxAttempts,
    delay: delayMs,
    backoff: 'exponential',
  });
}

/**
 * Sleep utility for tests
 * Uses the new sleep from test-core 2.0
 */
export async function sleepTest(ms: number): Promise<void> {
  await sleep(ms);
}

/**
 * Type Guard Test Helpers
 */

/**
 * Assert that a value is of a specific type
 * Throws a test error if the assertion fails
 */
export function assertType<T>(
  value: unknown,
  typeName: string,
  validator: (val: unknown) => val is T
): asserts value is T {
  if (!validator(value)) {
    throw createTestError(`Expected value to be of type ${typeName}`, {
      value,
      expectedType: typeName,
    });
  }
}

/**
 * Validator Test Helpers
 */

/**
 * Test if a validator accepts valid data
 */
export function expectValidData<T>(
  validator: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: any } },
  validData: unknown
): void {
  const result = validator.safeParse(validData);
  if (!result.success) {
    throw createTestError('Expected validator to accept valid data', {
      validData,
      error: result.error,
    });
  }
}

/**
 * Test if a validator rejects invalid data
 */
export function expectInvalidData(
  validator: { safeParse: (data: unknown) => { success: boolean; error?: any } },
  invalidData: unknown
): void {
  const result = validator.safeParse(invalidData);
  if (result.success) {
    throw createTestError('Expected validator to reject invalid data', {
      invalidData,
    });
  }
}

/**
 * Batch Testing Helper
 * Create multiple test instances quickly
 */
export function createBatch<T>(factory: Factory<T>, count: number): T[] {
  return Array.from({ length: count }, () => factory.build());
}

/**
 * Mock Date Helper
 * Create predictable dates for testing
 */
export function createTestDate(offset = 0): Date {
  const baseDate = new Date('2024-01-01T00:00:00.000Z');
  return new Date(baseDate.getTime() + offset);
}

/**
 * Reset Test State
 * Helper to reset test state between tests
 */
export function resetTestState(): void {
  // Clear any global state if needed
  // This can be extended based on the specific test requirements
}
