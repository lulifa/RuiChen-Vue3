import { computed } from "vue";
import type { OptionsType } from "@/components/ReSegmented";

export const menuTypeOptions = computed(() => {
  const options: Array<OptionsType> = [
    {
      label: "用户信息",
      icon: "ri:admin-line",
      value: 0
    },
    {
      label: "角色信息",
      icon: "ri:admin-fill",
      value: 1
    },
    {
      label: "机构信息",
      icon: "ri:git-branch-line",
      value: 2
    }
  ];
  return options;
});
