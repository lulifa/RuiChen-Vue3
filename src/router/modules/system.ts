export default {
  path: "/system",
  redirect: "/system/role/index",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: 1
  },
  children: [
    {
      path: "/system/platform/menu/index",
      name: "SystemPlatformMenu",
      component: () => import("@/views/platform/menu/index.vue"),
      meta: {
        icon: "ep:menu",
        extraIcon: "IF-pure-iconfont-new svg",
        title: "菜单管理",
        showParent: true,
        roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      component: () => import("@/views/identity/role/index.vue"),
      meta: {
        icon: "ri:admin-fill",
        extraIcon: "IF-pure-iconfont-new svg",
        title: "角色管理",
        showParent: true,
        roles: ["admin"]
      }
    },
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
        title: "组织机构",
        showParent: true,
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
