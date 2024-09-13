import type { User } from "@/api/identity/identity-user/model";

interface FormItemProps extends User {
  password: string;
  menuType: number;
  roleOptions: Array<any>;
}
interface FormProps {
  formInline: Partial<FormItemProps>;
}

interface RoleFormItemProps {
  username: string;
  nickname: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: Record<number, unknown>[];
}
interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
