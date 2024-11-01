interface ContextMenuItemModel {
  // 标题
  label: string;
  //图标
  icon?: string;
  // 隐藏
  hidden?: boolean;
  //禁用
  disabled?: boolean;
  //事件
  handler?: Fn;
  //分割线
  divider?: boolean;
  //子集
  children?: ContextMenuItemModel[];
}

export type { ContextMenuItemModel };
