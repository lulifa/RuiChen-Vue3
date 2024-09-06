import { http } from "@/utils/http";
const {
  VITE_CLIENT_ID,
  VITE_CLIENT_SECRET,
  VITE_GRANT_TYPE_PASSWORD,
  VITE_GRANT_TYPE_PHONE,
  VITE_GRANT_TYPE_PORTAL,
  VITE_SCOPE
} = import.meta.env;
import { ContentTypeEnum } from "@/enums/httpEnum";

import type {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  LoginByPhoneParams
} from "./model";

export const loginApi = (params: LoginParams) => {
  const tokenParams = {
    client_id: VITE_CLIENT_ID,
    client_secret: VITE_CLIENT_SECRET,
    scope: VITE_SCOPE,
    grant_type: VITE_GRANT_TYPE_PASSWORD,
    username: params.username,
    password: params.password,
    enterpriseId: params.enterpriseId,
    TwoFactorProvider: params.twoFactorProvider,
    TwoFactorCode: params.twoFactorCode
  };
  return http.post<LoginResultModel>("connect/token", {
    params: tokenParams,
    headers: {
      "Content-Type": ContentTypeEnum.FORM_URLENCODED
    }
  });
};

export const loginPhoneApi = (params: LoginByPhoneParams) => {
  const tokenParams = {
    client_id: VITE_CLIENT_ID,
    client_secret: VITE_CLIENT_SECRET,
    grant_type: VITE_GRANT_TYPE_PHONE,
    phone_number: params.phoneNumber,
    phone_verify_code: params.code
  };
  return http.post<LoginResultModel>("connect/token", {
    params: tokenParams,
    headers: {
      "Content-Type": ContentTypeEnum.FORM_URLENCODED
    }
  });
};

export const getUserInfo = () => {
  return http.get<GetUserInfoModel>("connect/userinfo");
};
