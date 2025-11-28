/**
 * Primitive branded helpers shared across transport layers.
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * Reusable identifier helpers for strongly typed IDs.
 */
export type Identifier<Scope extends string> = Brand<string, `id:${Scope}`>;
export type UserId = Identifier<'user'>;
export type OrganizationId = Identifier<'organization'>;
export type TeamId = Identifier<'team'>;
export type ProductId = Identifier<'product'>;
export type SubscriptionId = Identifier<'subscription'>;
export type InvoiceId = Identifier<'invoice'>;
export type FeatureId = Identifier<'feature'>;
export type PlanId = Identifier<'plan'>;
export type ApiKeyId = Identifier<'api-key'>;
export type SessionId = Identifier<'session'>;
export type RequestId = Identifier<'request'>;
export type WebhookId = Identifier<'webhook'>;
export type WebhookDeliveryId = Identifier<'webhook-delivery'>;
export type FileUploadId = Identifier<'file-upload'>;
export type BatchId = Identifier<'batch'>;
export type BatchItemId = Identifier<'batch-item'>;

/**
 * Transport-friendly timestamp helpers (ISO 8601).
 */
export type IsoDateString = Brand<string, 'iso-date'>;
export type IsoDateTimeString = Brand<string, 'iso-datetime'>;
export type PaginationCursor = Brand<string, 'pagination-cursor'>;

const ISO_DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export const isIsoDateTimeString = (value: unknown): value is IsoDateTimeString => {
  return typeof value === 'string' && ISO_DATE_TIME_REGEX.test(value);
};

export const toIsoDateTimeString = (value: Date | IsoDateTimeString): IsoDateTimeString => {
  if (typeof value === 'string') {
    return value as IsoDateTimeString;
  }
  return value.toISOString() as IsoDateTimeString;
};

/**
 * Internationalization primitives.
 */

export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ru'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type LocaleString = SupportedLocale | (string & {});

/**
 * Utility helper for branded strings consumers might need to compose.
 */
export const brand = <T extends string, B extends string>(value: T, _brand: B): Brand<T, B> =>
  value as Brand<T, B>;
