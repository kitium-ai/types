/**
 * Two-Factor Authentication (2FA) Types
 * Types for TOTP, SMS, and backup code authentication
 */

/**
 * Two-factor authentication method
 */
export type TwoFactorMethod = 'totp' | 'sms' | 'backup-code';

/**
 * Two-factor authentication configuration
 */
export interface TwoFactorConfig {
  readonly enabled: boolean;
  readonly required?: boolean; // Mandatory 2FA for all users
  readonly methods: readonly TwoFactorMethod[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly grace_period_days?: number; // Days to enable 2FA after first login
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly backup_codes_count?: number; // Number of backup codes to generate
  readonly sms?: {
    readonly provider: 'twilio' | 'aws-sns' | 'custom';
    readonly apiKey?: string;
    readonly apiSecret?: string;
    readonly from?: string;
  };
  readonly totp?: {
    readonly issuer: string;
    readonly algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
    readonly digits?: number; // 6 or 8 digit codes
    readonly period?: number; // Time period in seconds (default 30)
  };
}

/**
 * Two-factor device
 */
export interface TwoFactorDevice {
  readonly id: string;
  readonly userId: string;
  readonly method: TwoFactorMethod;
  readonly name?: string;
  readonly verified: boolean;
  readonly lastUsedAt?: Date;
  readonly createdAt: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * TOTP device (authenticator app)
 */
export interface TOTPDevice extends TwoFactorDevice {
  readonly method: 'totp';
  readonly secret: string; // Encrypted secret for authenticator apps
  readonly backupCodesUsed: readonly string[]; // Used backup code IDs
}

/**
 * SMS device
 */
export interface SMSDevice extends TwoFactorDevice {
  readonly method: 'sms';
  readonly phoneNumber: string;
  readonly verificationCode?: string;
  readonly verificationCodeExpiresAt?: Date;
}

/**
 * Backup code
 */
export interface BackupCode {
  readonly id: string;
  readonly userId: string;
  readonly code: string; // Hashed code
  readonly used: boolean;
  readonly usedAt?: Date;
  readonly createdAt: Date;
}

/**
 * Two-factor session
 */
export interface TwoFactorSession {
  readonly id: string;
  readonly userId: string;
  readonly sessionId: string;
  readonly deviceId: string;
  readonly method: TwoFactorMethod;
  readonly verificationCode?: string;
  readonly attemptCount: number;
  readonly maxAttempts: number;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly completedAt?: Date;
}

/**
 * Two-factor challenge
 */
export interface TwoFactorChallenge {
  readonly challengeId: string;
  readonly userId: string;
  readonly method: TwoFactorMethod;
  readonly deviceId: string;
  readonly expiresAt: Date;
  readonly verificationCode?: string;
  readonly attemptCount: number;
  readonly maxAttempts: number;
}

/**
 * Enroll two-factor input
 */
export interface EnrollTwoFactorInput {
  readonly userId: string;
  readonly method: TwoFactorMethod;
  readonly phoneNumber?: string; // For SMS
  readonly name?: string; // Device name
}

/**
 * Verify two-factor input
 */
export interface VerifyTwoFactorInput {
  readonly userId: string;
  readonly deviceId: string;
  readonly code: string;
  readonly sessionId?: string;
  readonly rememberDevice?: boolean; // Remember device for 30 days
}

/**
 * Two-factor status
 */
export interface TwoFactorStatus {
  readonly userId: string;
  readonly enabled: boolean;
  readonly enrolledAt?: Date;
  readonly devices: readonly TwoFactorDevice[];
  readonly backupCodesCount: number;
  readonly backupCodesUsedCount: number;
}
