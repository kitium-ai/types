/**
 * Utility Types and Helpers
 * Common utility types for type-safe development
 */

/**
 * Result type for operations that can succeed or fail
 */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * Optional type alias for nullable values
 */
export type Optional<T> = T | null | undefined;

/**
 * Readonly version of a type
 */
export type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K];
};

/**
 * Mutable version of a readonly type
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K];
};

/**
 * Omit multiple keys from a type
 */
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

/**
 * Pick multiple keys from a type
 */
export type PickMultiple<T, K extends keyof T> = Pick<T, K>;

/**
 * Partial type for partial updates
 */
export type PartialRecord<K extends string | number | symbol, T> = Partial<Record<K, T>>;

/**
 * Required type for making optional fields required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Type-safe dictionary/map
 */
export interface Dictionary<T> {
  readonly [key: string]: T;
}

/**
 * Tuple type
 */
export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? readonly T[]
    : TupleOf<T, N, readonly []>
  : never;
// eslint-disable-next-line @typescript-eslint/naming-convention
type TupleOf<T, N extends number, R extends readonly unknown[]> = R['length'] extends N
  ? R
  : TupleOf<T, N, readonly [...R, T]>;

/**
 * Async function type
 */
export type AsyncFunction<T = void, R = void> = (args: T) => Promise<R>;

/**
 * Function that returns a value
 */
export type Fn<T, R = void> = (args: T) => R;

/**
 * Generic callback type
 */
export type Callback<T = void> = (error: Error | null, result?: T) => void;

/**
 * Predicate function type
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparator function type
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Mapper function type
 */
export type Mapper<T, R> = (value: T, index: number) => R;

/**
 * Reducer function type
 */
export type Reducer<T, R> = (accumulator: R, current: T, index: number) => R;

/**
 * Generic event emitter interface
 */
export interface EventEmitter<T extends Record<string, unknown>> {
  readonly on: <E extends keyof T>(event: E, listener: (data: T[E]) => void) => void;
  readonly off: <E extends keyof T>(event: E, listener: (data: T[E]) => void) => void;
  readonly emit: <E extends keyof T>(event: E, data: T[E]) => void;
  readonly once: <E extends keyof T>(event: E, listener: (data: T[E]) => void) => void;
}

/**
 * Timer utilities type
 */
export interface Timer {
  readonly id: string;
  readonly startTime: Date;
  readonly duration: number;
  readonly isRunning: boolean;
  readonly elapsed: number;
}

/**
 * Paginated list utility
 */
export interface Page<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly nextPage: number | null;
  readonly previousPage: number | null;
}

/**
 * Tree node type
 */
export interface TreeNode<T> {
  readonly value: T;
  readonly children?: readonly TreeNode<T>[];
  readonly parent?: TreeNode<T>;
}

/**
 * Graph edge type
 */
export interface GraphEdge<T = unknown> {
  readonly from: string;
  readonly to: string;
  readonly weight?: number;
  readonly data?: T;
}

/**
 * Range type
 */
export interface Range {
  readonly start: number;
  readonly end: number;
  readonly step?: number;
}

/**
 * Interval type
 */
export interface Interval {
  readonly start: Date;
  readonly end: Date;
}

/**
 * Duration type
 */
export interface Duration {
  readonly days?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly milliseconds?: number;
}

/**
 * Coordinate type
 */
export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

/**
 * 3D Coordinate type
 */
export interface Coordinate3D extends Coordinate {
  readonly z: number;
}

/**
 * Size type
 */
export interface Size {
  readonly width: number;
  readonly height: number;
}

/**
 * Rectangle type
 */
export interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Color type
 */
export interface Color {
  readonly r: number; // 0-255
  readonly g: number; // 0-255
  readonly b: number; // 0-255
  readonly a?: number; // 0-1
}

/**
 * Version type
 */
export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease?: string;
  readonly build?: string;
}

/**
 * Localized string type
 */
export interface LocalizedString {
  readonly en: string;
  readonly es?: string;
  readonly fr?: string;
  readonly de?: string;
  readonly it?: string;
  readonly ja?: string;
  readonly zh?: string;
  readonly ru?: string;
  readonly [key: string]: string | undefined;
}

/**
 * Money type with currency
 */
export interface Money {
  readonly amount: number;
  readonly currency: string; // ISO 4217
  readonly displayFormat?: string;
}

/**
 * Percentage type
 */
export interface Percentage {
  readonly value: number; // 0-100
  readonly decimals?: number;
}

/**
 * Status code type
 */
export enum StatusCode {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Priority level
 */
export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  TRIVIAL = 'trivial',
}

/**
 * Severity level
 */
export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

/**
 * Generic identity interface
 */
export interface Identity {
  readonly id: string;
}

/**
 * Timestamped interface
 */
export interface Timestamped {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Deletable interface
 */
export interface Deletable {
  readonly deletedAt?: Date;
  readonly isDeleted: boolean;
}

/**
 * Auditable interface
 */
export interface Auditable {
  readonly createdAt: Date;
  readonly createdBy: string;
  readonly updatedAt: Date;
  readonly updatedBy: string;
  readonly deletedAt?: Date;
  readonly deletedBy?: string;
}

/**
 * Versioned interface
 */
export interface Versioned {
  readonly version: number;
  readonly previousVersions?: readonly Record<string, unknown>[];
}

/**
 * Taggable interface
 */
export interface Taggable {
  readonly tags: readonly string[];
}

/**
 * Metadata interface
 */
export interface Metadata {
  readonly [key: string]: unknown;
}

/**
 * Entity base type
 */
export interface Entity extends Identity, Timestamped {
  readonly metadata?: Metadata;
}

/**
 * AuditableEntity base type
 */
export interface AuditableEntity extends Entity, Auditable {
  readonly metadata?: Metadata;
}

/**
 * Deferred/Promise-like type
 */
export interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T | PromiseLike<T>) => void;
  readonly reject: (reason?: unknown) => void;
}

/**
 * Observable type
 */
export interface Observable<T> {
  readonly subscribe: (observer: Observer<T>) => ObserverSubscription;
}

/**
 * Observer type
 */
export interface Observer<T> {
  readonly next: (value: T) => void;
  readonly error: (error: Error) => void;
  readonly complete: () => void;
}

/**
 * Observer subscription type (for RxJS-like patterns)
 */
export interface ObserverSubscription {
  readonly unsubscribe: () => void;
  readonly closed: boolean;
}

/**
 * Constructor type
 */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;

/**
 * Class type
 */
export type Class<T = unknown> = Constructor<T>;

/**
 * Serializable type
 */
export interface Serializable {
  readonly toJSON: () => unknown;
  readonly toString: () => string;
}

/**
 * Cloneable type
 */
export interface Cloneable<T> {
  readonly clone: () => T;
}

/**
 * Comparable type
 */
export interface Comparable<T> {
  readonly compareTo: (other: T) => number;
  readonly equals: (other: T) => boolean;
}

/**
 * Hashable type
 */
export interface Hashable {
  readonly hashCode: () => number;
}

/**
 * Strategy pattern type
 */
export interface Strategy<T> {
  readonly execute: (context: unknown) => T;
}
