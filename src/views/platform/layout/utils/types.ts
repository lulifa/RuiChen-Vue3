import type { Layout } from "@/api/platform/layouts/model";

interface FormItemProps extends Layout {}
interface FormProps {
  formInline: Partial<FormItemProps>;
  frameworkOptions: Array<any>;
  dataOptions: Array<any>;
}

export type { FormItemProps, FormProps };
