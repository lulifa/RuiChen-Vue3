interface FormItemProps {
  id: string;
  selectedIds: Array<any>;
}
interface FormProps {
  formInline: Partial<FormItemProps>;
}

export type { FormItemProps, FormProps };
