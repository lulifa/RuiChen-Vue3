import type { Role } from "@/api/identity/identity-role/model";

interface FormItemProps extends Role {}
interface FormProps {
  formInline: Partial<FormItemProps>;
}

export type { FormItemProps, FormProps };
