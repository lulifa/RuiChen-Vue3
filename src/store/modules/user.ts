import { defineStore } from "pinia";
import { USER_INFO_KEY, ROLES_KEY, PERMISSIONS_KEY } from "@/enums/cacheEnum";
import {
  type GetUserInfoModel,
  LoginParams,
  LoginByPhoneParams
} from "@/api/system/system-user/model";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type UserResult,
  type RefreshTokenResult,
  getLogin,
  refreshTokenApi
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { setToken, removeToken, getToken, hasPerms } from "@/utils/auth";
import type { tokenType } from "../types";

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
      return getToken();
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
      setToken(data);
    },
    removeToken() {
      removeToken();
    },
    setUserinfo(userInfo: GetUserInfoModel) {
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
    hasPerms(value: string | Array<string>) {
      hasPerms(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data?.success) setToken(data.data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
