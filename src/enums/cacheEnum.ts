export const ABP_TENANT_KEY = "ABP_TENANT_";

export const ABP_APP_KEY = "ABP_APP_";

export const ABP_API_KEY = "ABP_API_";

export const TOKEN_KEY = "TOKEN__";

export const REFRESH_TOKEN_KEY = "REFRESH_TOKEN_";

export const USER_INFO_KEY = "USER__INFO__";

export const ROLES_KEY = "ROLES__KEY__";

export const PERMISSIONS_KEY = "PERMISSIONS_KEY_";

/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const MULTIPLE_TABS_KEY = "multiple-tabs";
