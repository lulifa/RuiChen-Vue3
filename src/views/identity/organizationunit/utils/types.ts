import type { OrganizationUnit } from "@/api/identity/identity-organizationunit/model";

interface FormItemProps extends OrganizationUnit {
  higherDeptOptions: Array<any>;
}
interface FormProps {
  formInline: Partial<FormItemProps>;
}

export type { FormItemProps, FormProps };
