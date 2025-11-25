/**
 * Role-Based Access Control (RBAC) Types
 * Enhanced RBAC types for fine-grained permission management
 */

/**
 * Permission definition interface (for RBAC permission objects)
 * Note: This is different from the Permission enum in auth.ts which defines permission strings
 */
export interface PermissionDefinition {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly resource: string;
  readonly action: string; // e.g., 'read', 'write', 'delete', 'admin'
  readonly metadata?: Record<string, unknown>;
}

/**
 * Role interface
 */
export interface Role {
  readonly id: string;
  readonly orgId: string;
  readonly name: string;
  readonly description?: string;
  readonly permissions: readonly PermissionDefinition[];
  readonly isSystem?: boolean; // System roles cannot be modified
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Custom role assignment
 */
export interface CustomRole {
  readonly id: string;
  readonly orgId: string;
  readonly userId: string;
  readonly roleId: string;
  readonly role: Role;
  readonly assignedAt: Date;
}

/**
 * Permission check request
 */
export interface PermissionCheck {
  readonly resource: string;
  readonly action: string;
  readonly orgId?: string;
}

/**
 * RBAC configuration
 */
export interface RBACConfig {
  readonly enabled: boolean;
  readonly defaultRoles?: readonly string[]; // IDs of default roles to assign
  readonly customRolesAllowed?: boolean;
  readonly hierarchySupport?: boolean;
}

/**
 * Role record (database representation)
 */
export interface RoleRecord {
  readonly id: string;
  readonly orgId: string;
  readonly name: string;
  readonly description?: string;
  readonly permissions: readonly PermissionDefinition[];
  readonly isSystem: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Custom role record (database representation)
 */
export interface CustomRoleRecord {
  readonly id: string;
  readonly orgId: string;
  readonly userId: string;
  readonly roleId: string;
  readonly assignedAt: Date;
}
