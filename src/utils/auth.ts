import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";
import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  MULTIPLE_TABS_KEY
} from "@/enums/cacheEnum";
import type { tokenType } from "@/store/types";

/** 获取`token` */
export const getToken = () => {
  const tokenString = Cookies.get(`${TOKEN_KEY}`);
  const retokenString = Cookies.get(`${REFRESH_TOKEN_KEY}`);
  const tokenData = tokenString ? JSON.parse(tokenString) : null;
  const retokenData = retokenString ? JSON.parse(retokenString) : null;

  if (tokenData && retokenData) {
    return {
      accessToken: tokenData.accessToken,
      expires: tokenData.expires,
      refreshToken: retokenData.refreshToken
    };
  }
  const storeData = storageLocal().getItem<tokenType>(REFRESH_TOKEN_KEY);
  if (storeData) {
    return {
      accessToken: storeData.accessToken,
      expires: storeData.expires,
      refreshToken: storeData.refreshToken
    };
  }
};

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息cookie里（过期自动销毁）
 * 将`refreshToken`、`expires`信息放在localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export const setToken = (data: tokenType) => {
  const { isRemembered, loginDay } = useUserStoreHook();
  const { accessToken, refreshToken, expires } = data;
  // 计算过期时间戳（毫秒）
  const expms = expires > 0 ? Date.now() + expires * 1000 : 0;
  const expdays = expms > 0 ? (expms - Date.now()) / 86400000 : undefined;

  // 构建 Cookies 内容
  const tokenCookie = JSON.stringify({
    accessToken: accessToken,
    expires: expms
  });
  const refreshtokenCookie = JSON.stringify({
    refreshToken: refreshToken,
    expires: expms
  });

  // 设置 Cookies 的选项
  const cookieOptions = expms > 0 ? { expires: expdays } : undefined;

  // 设置 Token 和 RefreshToken Cookies
  Cookies.set(TOKEN_KEY, tokenCookie, cookieOptions);
  Cookies.set(REFRESH_TOKEN_KEY, refreshtokenCookie, cookieOptions);

  // 设置 MULTIPLETABSKEY，根据是否记住用户来确定过期时间
  Cookies.set(
    MULTIPLE_TABS_KEY,
    "true",
    isRemembered ? { expires: loginDay } : {}
  );

  // 设置 Localstorage 存储 refreshToken 和 expires
  storageLocal().setItem(REFRESH_TOKEN_KEY, {
    refreshToken: refreshToken,
    expires: expms
  });
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(MULTIPLE_TABS_KEY);
  storageLocal().removeItem(REFRESH_TOKEN_KEY);
};

export const formatToken = (token: string) => {
  return "Bearer " + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  const isAuths = isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
  return isAuths ? true : false;
};
