import type { IPermission } from "@/api/model";

export class PermissionProvider {
  providerName!: string;
  providerKey?: string;
}

export interface IPermissionGrant {
  allowedProviders: string[];
  grantedProviders: PermissionProvider[];
  displayName: string;
  isGranted: boolean;
  name: string;
  parentName?: string;
}

export class Permission implements IPermissionGrant {
  allowedProviders: string[] = [];
  grantedProviders: PermissionProvider[] = [];
  displayName!: string;
  isGranted!: boolean;
  name!: string;
  parentName?: string;
}

export interface PermissionGroup {
  displayName: string;
  name: string;
  permissions: Permission[];
}

export interface PermissionTree {
  isRoot: boolean;
  /** 权限分组 */
  group: string;
  /** 权限标识 */
  id: string;
  /** 显示名称 */
  name: string;
  /** 是否授权 */
  isGranted?: boolean;
  /** 是否禁用 */
  disabled: boolean;
  /** 子节点 */
  children: PermissionTree[];
  /** 父节点 */
  parentId?: string;
  allowedProviders: string[];
  grantedProviders: PermissionProvider[];
}

export class UpdatePermission implements IPermission {
  name!: string;
  isGranted!: boolean;
}

export class UpdatePermissions {
  permissions!: UpdatePermission[];
}

export class PermissionResult {
  entityDisplayName!: string;
  groups: PermissionGroup[] = [];
}
