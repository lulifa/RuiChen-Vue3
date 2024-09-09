import { defineStore } from "pinia";
import { USER_INFO_KEY, ROLES_KEY, PERMISSIONS_KEY } from "@/enums/cacheEnum";

import {
  type userType,
  type tokenType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  loginApi,
  loginRefreshApi,
  getUserInfo
} from "@/api/system/system-user";
import type {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel
} from "@/api/system/system-user/model";
import { useMultiTagsStoreHook } from "./multiTags";
import {
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  hasAuthPerms
} from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    userInfo: null,
    sso: false,
    roles: [],
    permissions: [],
    isRemembered: false,
    loginDay: 7
  }),
  getters: {
    getToken(): tokenType {
      return getAuthToken();
    },
    getUserInfo(state): GetUserInfoModel {
      return (
        state.userInfo ||
        storageLocal().getItem<GetUserInfoModel>(USER_INFO_KEY)
      );
    },
    getSso(state): boolean {
      return state.sso === true;
    },
    getRoles(state): Array<string> {
      return state.roles.length > 0
        ? state.roles
        : storageLocal().getItem(ROLES_KEY);
    },
    getPermissions(state): Array<string> {
      return state.permissions.length > 0
        ? state.permissions
        : storageLocal().getItem(PERMISSIONS_KEY);
    },
    getIsRemembered(state): boolean {
      return state.isRemembered === true;
    },
    getLoginDay(state): number {
      return state.loginDay;
    }
  },
  actions: {
    setToken(data: tokenType) {
      setAuthToken(data);
    },
    removeToken() {
      removeAuthToken();
    },
    setUserInfo(userInfo: GetUserInfoModel) {
      this.userInfo = userInfo;
      storageLocal().setItem(USER_INFO_KEY, userInfo);
    },
    setRoles(roles: Array<string>) {
      this.roles = roles;
      storageLocal().setItem(ROLES_KEY, roles);
    },
    setPermissions(permissions: Array<string>) {
      this.permissions = permissions;
      storageLocal().setItem(PERMISSIONS_KEY, permissions);
    },
    setIsRemember(bool: boolean) {
      this.isRemembered = bool;
    },
    setLoginDay(value: number) {
      this.loginDay = Number(value);
    },
    formatToken(token: string) {
      return "Bearer " + token;
    },
    hasPerms(value: string | Array<string>): boolean {
      return hasAuthPerms(value);
    },
    /** 登入 */
    async loginApi(params: LoginParams): Promise<LoginResultModel> {
      try {
        const res = await loginApi(params);
        if (res.access_token && res.refresh_token) {
          const openiddictToken = {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            expires: res.expires_in
          };
          await this.setToken(openiddictToken);
          await this.getUserInfoAction();
        }
        return res;
      } catch (error) {
        throw error;
      }
    },

    /** 刷新 token */
    async handRefreshToken(params: any): Promise<LoginResultModel> {
      try {
        const res = await loginRefreshApi(params);
        if (res.access_token && res.refresh_token) {
          const openiddictToken = {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            expires: res.expires_in
          };
          await this.setToken(openiddictToken);
          await this.getUserInfoAction();
        }

        return res;
      } catch (error) {
        throw error;
      }
    },
    async getUserInfoAction() {
      const userInfo = await getUserInfo();
      // TODO  获取abpStore 初始化abp相关代码
      let currentUser = userInfo;
      const outgoingUserInfo: { [key: string]: any } = {
        // 从 currentuser 接口获取
        userId: currentUser.id,
        username: currentUser.userName,
        roles: ["admin"],
        // roles: currentUser.roles,
        // 从 userinfo 端点获取
        realName: userInfo?.nickname,
        phoneNumber: userInfo?.phone_number,
        phoneNumberConfirmed: userInfo?.phone_number_verified === "True",
        email: userInfo?.email,
        emailConfirmed: userInfo?.email_verified === "True"
      };
      if (userInfo?.avatarUrl) {
        // outgoingUserInfo.avatar = formatUrl(userInfo.avatarUrl);
        outgoingUserInfo.avatar = userInfo.avatarUrl;
      }
      if (userInfo?.picture) {
        // outgoingUserInfo.avatar = formatUrl(userInfo.picture);
        outgoingUserInfo.avatar = userInfo.picture;
      }
      this.setUserInfo(outgoingUserInfo);
      this.setRoles(outgoingUserInfo.roles);
      this.setPermissions(outgoingUserInfo.permissions);

      return outgoingUserInfo;
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.userinfo = null;
      this.roles = [];
      this.permissions = [];
      this.removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
