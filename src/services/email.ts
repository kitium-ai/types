/**
 * Email Service Types
 * Types for email service integration and email sending
 */

/**
 * Supported email providers
 */
export enum EmailProvider {
  SMTP = 'smtp',
  AWS_SES = 'aws-ses',
  SENDGRID = 'sendgrid',
}

/**
 * Email attachment interface
 */
export interface EmailAttachment {
  readonly filename: string;
  readonly content?: Buffer | string;
  readonly contentType?: string;
  readonly encoding?: string;
  readonly contentDisposition?: 'attachment' | 'inline';
}

/**
 * Email recipient interface
 */
export interface EmailRecipient {
  readonly email: string;
  readonly name?: string;
}

/**
 * Email request interface
 */
export interface EmailRequest {
  readonly from: EmailRecipient | string;
  readonly to: EmailRecipient | EmailRecipient[] | string | string[];
  readonly cc?: EmailRecipient | EmailRecipient[] | string | string[];
  readonly bcc?: EmailRecipient | EmailRecipient[] | string | string[];
  readonly subject: string;
  readonly html?: string;
  readonly text?: string;
  readonly replyTo?: EmailRecipient | string;
  readonly attachments?: readonly EmailAttachment[];
  readonly headers?: Record<string, string>;
  readonly priority?: 'high' | 'normal' | 'low';
  readonly encrypted?: boolean;
  readonly tags?: readonly string[];
  readonly metadata?: Record<string, unknown>;
}

/**
 * Email response interface
 */
export interface EmailResponse {
  readonly id: string;
  readonly status: 'sent' | 'queued' | 'failed';
  readonly provider: EmailProvider;
  readonly timestamp: Date;
  readonly to: readonly string[];
  readonly messageId?: string;
  readonly error?: EmailError;
}

/**
 * Email error interface
 */
export interface EmailError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly retryable: boolean;
}

/**
 * Provider configuration interface
 */
export interface ProviderConfig {
  readonly provider: EmailProvider;
  readonly [key: string]: unknown;
}

/**
 * SMTP configuration
 */
export interface SMTPConfig extends ProviderConfig {
  readonly provider: EmailProvider.SMTP;
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly auth?: {
    readonly user: string;
    readonly pass: string;
  };
  readonly from?: string;
  readonly pool?: {
    readonly maxConnections: number;
    readonly maxMessages: number;
    readonly rateDelta: number;
    readonly rateLimit: number;
  };
}

/**
 * AWS SES configuration
 */
export interface AWSConfig extends ProviderConfig {
  readonly provider: EmailProvider.AWS_SES;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region?: string;
  readonly from?: string;
}

/**
 * SendGrid configuration
 */
export interface SendGridConfig extends ProviderConfig {
  readonly provider: EmailProvider.SENDGRID;
  readonly apiKey: string;
  readonly from?: string;
}

/**
 * Email service configuration
 */
export interface EmailServiceConfig {
  readonly primary: ProviderConfig;
  readonly fallback?: readonly ProviderConfig[];
  readonly encryption?: {
    readonly enabled: boolean;
    readonly algorithm?: string;
    readonly key?: string;
  };
  readonly logging?: {
    readonly enabled: boolean;
    readonly level?: 'error' | 'warn' | 'info' | 'debug';
  };
  readonly rateLimit?: {
    readonly enabled: boolean;
    readonly maxEmails: number;
    readonly windowMs: number;
  };
  readonly retry?: {
    readonly enabled: boolean;
    readonly maxAttempts: number;
    readonly delayMs: number;
  };
  readonly queue?: {
    readonly enabled: boolean;
    readonly maxRetries: number;
    readonly processingInterval: number;
  };
}

/**
 * Email template interface
 */
export interface EmailTemplate {
  readonly name: string;
  readonly subject: string;
  readonly html: string;
  readonly text?: string;
  readonly variables: readonly string[];
}

/**
 * Email template render options
 */
export interface TemplateRenderOptions {
  readonly templateName: string;
  readonly variables: Record<string, unknown>;
}
