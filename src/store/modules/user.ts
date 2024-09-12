import { defineStore } from "pinia";
import { USER_INFO_KEY, ROLES_KEY, PERMISSIONS_KEY } from "@/enums/cacheEnum";
import { useAbpStoreWithOut } from "./abp";

import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  loginApi,
  loginRefreshApi,
  loginPhoneApi,
  getUserInfoApi
} from "@/api/system/system-user";
import type {
  LoginParams,
  LoginResultModel,
  LoginByPhoneParams,
  LoginRefreshParams,
  GetUserInfoModel
} from "@/api/system/system-user/model";
import { useMultiTagsStoreHook } from "./multiTags";
import { setToken, removeToken } from "@/utils/auth";

const ls = storageLocal();
const abpStore = useAbpStoreWithOut();

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    userInfo: null,
    sso: false,
    roles: [],
    permissions: [],
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  getters: {
    getUserInfo(state): GetUserInfoModel {
      return state.userInfo || ls.getItem<GetUserInfoModel>(USER_INFO_KEY);
    },
    getSso(state): boolean {
      return state.sso === true;
    },
    getRoles(state): Array<string> {
      return state.roles.length > 0 ? state.roles : ls.getItem(ROLES_KEY);
    },
    getPermissions(state): Array<string> {
      return state.permissions.length > 0
        ? state.permissions
        : ls.getItem(PERMISSIONS_KEY);
    },
    getVerifyCode(state): string {
      return state.verifyCode;
    },
    getCurrentPage(state): number {
      return state.currentPage;
    },
    getIsRemembered(state): boolean {
      return state.isRemembered === true;
    },
    getLoginDay(state): number {
      return state.loginDay;
    }
  },
  actions: {
    setUserInfo(userInfo: GetUserInfoModel) {
      this.userInfo = userInfo;
      ls.setItem(USER_INFO_KEY, userInfo);
    },
    removeUserInfo() {
      this.userInfo = null;
      ls.removeItem(USER_INFO_KEY);
    },
    setRoles(roles: Array<string>) {
      this.roles = roles;
      ls.setItem(ROLES_KEY, roles);
    },
    removeRoles() {
      this.roles = [];
      ls.removeItem(ROLES_KEY);
    },
    setPermissions(permissions: Array<string>) {
      this.permissions = permissions;
      ls.setItem(PERMISSIONS_KEY, permissions);
    },
    removePermissions() {
      this.permissions = [];
      ls.removeItem(PERMISSIONS_KEY);
    },
    /** 存储前端生成的验证码 */
    setVerifyCode(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    setCurrentPage(value: number) {
      this.currentPage = value;
    },
    setIsRemember(bool: boolean) {
      this.isRemembered = bool;
    },
    setLoginDay(value: number) {
      this.loginDay = Number(value);
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
          setToken(openiddictToken);
          await this.getUserInfoAction();

          return res;
        }
      } catch (error) {
        throw error;
      }
    },

    /** 手机 登入 */
    async loginPhoneApi(params: LoginByPhoneParams): Promise<LoginResultModel> {
      try {
        const res = await loginPhoneApi(params);
        if (res.access_token && res.refresh_token) {
          const openiddictToken = {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            expires: res.expires_in
          };
          setToken(openiddictToken);
          await this.getUserInfoAction();
        }
        return res;
      } catch (error) {
        throw error;
      }
    },

    /** 刷新 token */
    async handRefreshToken(
      params: LoginRefreshParams
    ): Promise<LoginResultModel> {
      try {
        const res = await loginRefreshApi(params);
        if (res.access_token && res.refresh_token) {
          const openiddictToken = {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            expires: res.expires_in
          };
          setToken(openiddictToken);
          await this.getUserInfoAction();
        }

        return res;
      } catch (error) {
        throw error;
      }
    },
    async getUserInfoAction(): Promise<GetUserInfoModel> {
      const userInfo = await getUserInfoApi();
      // 获取abpStore 初始化abp相关代码
      const abpStore = useAbpStoreWithOut();
      let currentUser = abpStore.getApplication.currentUser;
      //  避免多次请求接口
      if (userInfo?.sub !== currentUser.id) {
        await abpStore.initlizeAbpApplication();
        currentUser = abpStore.getApplication.currentUser;
      }

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
      removeToken();
      this.removeUserInfo();
      this.removeRoles();
      this.removePermissions();
      abpStore.removeApplication();
      abpStore.removeApiDefinition();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
