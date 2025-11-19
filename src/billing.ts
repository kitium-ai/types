/**
 * Billing and Subscription Types
 * Payment processing, subscriptions, and invoice management
 */

/**
 * Subscription status
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  PAST_DUE = 'past_due',
  PAUSED = 'paused',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

/**
 * Billing cycle period
 */
export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  CUSTOM = 'custom',
}

/**
 * Payment method type
 */
export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_ACCOUNT = 'bank_account',
  DIGITAL_WALLET = 'digital_wallet',
  PAYPAL = 'paypal',
  WIRE_TRANSFER = 'wire_transfer',
  CHECK = 'check',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}

/**
 * Invoice status
 */
export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PARTIAL_PAID = 'partial_paid',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
}

/**
 * Tax type
 */
export enum TaxType {
  VAT = 'vat',
  GST = 'gst',
  HST = 'hst',
  PST = 'pst',
  SALES_TAX = 'sales_tax',
  USE_TAX = 'use_tax',
}

/**
 * Pricing plan entity
 */
export interface PricingPlan {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly price: {
    readonly amount: number;
    readonly currency: string;
    readonly interval: BillingCycle;
  };
  readonly setupFee?: number;
  readonly tier: 'free' | 'starter' | 'professional' | 'enterprise';
  readonly maxUsers?: number;
  readonly maxProjects?: number;
  readonly maxStorage?: number; // in GB
  readonly maxApiCalls?: number; // per month
  readonly supportLevel: 'community' | 'standard' | 'premium' | 'enterprise';
  readonly slaUptimePercent?: number;
  readonly isPublic: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Subscription entity
 */
export interface Subscription {
  readonly id: string;
  readonly organizationId: string;
  readonly customerId: string;
  readonly plan: PricingPlan;
  readonly status: SubscriptionStatus;
  readonly billingCycle: BillingCycle;
  readonly currentPeriodStart: Date;
  readonly currentPeriodEnd: Date;
  readonly trialStart?: Date;
  readonly trialEnd?: Date;
  readonly canceledAt?: Date;
  readonly cancelReason?: string;
  readonly autoRenew: boolean;
  readonly collectionMethod: 'send_invoice' | 'charge_automatically';
  readonly paymentMethod?: PaymentMethod;
  readonly defaultPaymentMethod?: string; // Payment method ID
  readonly itemCount: number;
  readonly totalPrice: number;
  readonly currency: string;
  readonly discount?: {
    readonly code: string;
    readonly percentOff?: number;
    readonly amountOff?: number;
    readonly recurring: boolean;
  };
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Subscription line item
 */
export interface SubscriptionLineItem {
  readonly id: string;
  readonly subscriptionId: string;
  readonly priceId: string;
  readonly price: number;
  readonly quantity: number;
  readonly description: string;
  readonly interval: BillingCycle;
  readonly intervalCount: number;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Payment method
 */
export interface PaymentMethod {
  readonly id: string;
  readonly organizationId: string;
  readonly type: PaymentMethodType;
  readonly isDefault: boolean;
  readonly billing_details?: {
    readonly name?: string;
    readonly email?: string;
    readonly phone?: string;
    readonly address?: {
      readonly line1: string;
      readonly line2?: string;
      readonly city: string;
      readonly state?: string;
      readonly country: string;
      readonly postal_code: string;
    };
  };
  readonly card?: {
    readonly last4: string;
    readonly brand: string;
    readonly expiryMonth: number;
    readonly expiryYear: number;
  };
  readonly bankAccount?: {
    readonly last4: string;
    readonly bankName: string;
    readonly accountType: 'checking' | 'savings';
    readonly routingNumber?: string;
  };
  readonly paypal?: {
    readonly email: string;
  };
  readonly verification?: {
    readonly status: 'unverified' | 'pending' | 'verified' | 'failed';
    readonly attempts: number;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Invoice entity
 */
export interface Invoice {
  readonly id: string;
  readonly organizationId: string;
  readonly customerId: string;
  readonly number: string;
  readonly status: InvoiceStatus;
  readonly subscriptionId?: string;
  readonly items: readonly InvoiceLineItem[];
  readonly subtotal: number;
  readonly discount?: {
    readonly code: string;
    readonly amount: number;
  };
  readonly tax?: {
    readonly type: TaxType;
    readonly percentage: number;
    readonly amount: number;
  };
  readonly total: number;
  readonly currency: string;
  readonly paidAmount: number;
  readonly dueDate: Date;
  readonly issuedAt: Date;
  readonly sentAt?: Date;
  readonly paidAt?: Date;
  readonly viewedAt?: Date;
  readonly dueInDays: number;
  readonly description?: string;
  readonly notes?: string;
  readonly pdf_url?: string;
  readonly receipt_url?: string;
  readonly payment?: {
    readonly id: string;
    readonly method: PaymentMethodType;
    readonly status: PaymentStatus;
    readonly amount: number;
    readonly paidAt: Date;
  };
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Invoice line item
 */
export interface InvoiceLineItem {
  readonly id: string;
  readonly invoiceId: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly amount: number;
  readonly discount?: number;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Payment transaction
 */
export interface PaymentTransaction {
  readonly id: string;
  readonly organizationId: string;
  readonly invoiceId?: string;
  readonly paymentMethodId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly type: 'charge' | 'refund' | 'adjustment';
  readonly description: string;
  readonly failureReason?: string;
  readonly retryCount: number;
  readonly lastRetried?: Date;
  readonly reference?: string;
  readonly receipt?: {
    readonly id: string;
    readonly url: string;
  };
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Refund entity
 */
export interface Refund {
  readonly id: string;
  readonly transactionId: string;
  readonly invoiceId: string;
  readonly organizationId: string;
  readonly amount: number;
  readonly currency: string;
  readonly reason: string;
  readonly status: 'pending' | 'processed' | 'failed' | 'rejected';
  readonly requestedBy: string; // User ID
  readonly processedBy?: string; // User ID
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly processedAt?: Date;
}

/**
 * Discount/Coupon entity
 */
export interface DiscountCode {
  readonly id: string;
  readonly code: string;
  readonly description?: string;
  readonly type: 'percentage' | 'fixed_amount';
  readonly value: number; // percentage or amount
  readonly maxUses?: number;
  readonly timesUsed: number;
  readonly validFrom: Date;
  readonly validUntil: Date;
  readonly minPurchaseAmount?: number;
  readonly applicablePlans?: readonly string[]; // Plan IDs
  readonly applicableCountries?: readonly string[];
  readonly oneTimeUse: boolean;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Billing address entity
 */
export interface BillingAddress {
  readonly id: string;
  readonly organizationId: string;
  readonly fullName: string;
  readonly line1: string;
  readonly line2?: string;
  readonly city: string;
  readonly state?: string;
  readonly country: string;
  readonly postalCode: string;
  readonly isDefault: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Request to create subscription
 */
export interface CreateSubscriptionRequest {
  readonly planId: string;
  readonly billingCycle: BillingCycle;
  readonly paymentMethodId?: string;
  readonly trialDays?: number;
  readonly discountCode?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Request to update subscription
 */
export interface UpdateSubscriptionRequest {
  readonly planId?: string;
  readonly billingCycle?: BillingCycle;
  readonly autoRenew?: boolean;
  readonly paymentMethodId?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Usage-based billing record
 */
export interface UsageRecord {
  readonly id: string;
  readonly subscriptionId: string;
  readonly organizationId: string;
  readonly metric: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly timestamp: Date;
  readonly period: {
    readonly start: Date;
    readonly end: Date;
  };
}

/**
 * Billing notification
 */
export interface BillingNotification {
  readonly id: string;
  readonly organizationId: string;
  readonly type: 'payment_failed' | 'invoice_created' | 'invoice_overdue' | 'renewal_reminder' | 'subscription_ending';
  readonly title: string;
  readonly message: string;
  readonly status: 'pending' | 'sent' | 'failed';
  readonly sentAt?: Date;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
}
