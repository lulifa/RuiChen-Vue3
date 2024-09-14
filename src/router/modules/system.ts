export default {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: 1
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      component: () => import("@/views/identity/user/index.vue"),
      meta: {
        icon: "ri:admin-line",
        title: "用户管理",
        showParent: true,
        roles: ["admin"]
      }
    },
    {
      path: "/system/organizationunit/index",
      name: "SystemOrganizationUnit",
      component: () => import("@/views/identity/organizationunit/index.vue"),
      meta: {
        icon: "ri:git-branch-line",
        title: "部门管理",
        showParent: true,
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
