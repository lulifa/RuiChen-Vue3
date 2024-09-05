import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  MyProfile,
  UpdateMyProfile,
  ChangePassword,
  ChangePhoneNumber,
  TwoFactorEnabled,
  SendEmailConfirmCode,
  ConfirmEmailInput,
  TwoFactorEnabledInput,
  SendChangePhoneNumberCodeInput,
  AuthenticatorDto,
  VerifyAuthenticatorCodeInput,
  AuthenticatorRecoveryCodeDto
} from "./model";

export const get = () => {
  return http.get<MyProfile>(baseUrlApi("account/my-profile"));
};

export const update = (input: UpdateMyProfile) => {
  return http.put<MyProfile>(baseUrlApi("account/my-profile"), {
    data: input
  });
};

export const changePassword = (input: ChangePassword) => {
  return http.post(baseUrlApi("account/my-profile/change-password"), {
    data: input
  });
};

export const sendEmailConfirmLink = (input: SendEmailConfirmCode) => {
  return http.post(baseUrlApi("account/my-profile/send-email-confirm-link"), {
    data: input
  });
};

export const confirmEmail = (input: ConfirmEmailInput) => {
  return http.put(baseUrlApi("account/my-profile/confirm-email"), {
    data: input
  });
};

export const sendChangePhoneNumberCode = (
  input: SendChangePhoneNumberCodeInput
) => {
  return http.post(
    baseUrlApi("account/my-profile/send-phone-number-change-code"),
    { data: input }
  );
};

export const changePhoneNumber = (input: ChangePhoneNumber) => {
  return http.put(baseUrlApi("account/my-profile/change-phone-number"), {
    data: input
  });
};

export const getTwoFactorEnabled = () => {
  return http.get<TwoFactorEnabled>(
    baseUrlApi("account/my-profile/two-factor")
  );
};

export const changeTwoFactorEnabled = (input: TwoFactorEnabledInput) => {
  return http.put(baseUrlApi("account/my-profile/change-two-factor"), {
    data: input
  });
};

export const getAuthenticator = () => {
  return http.get<AuthenticatorDto>(
    baseUrlApi("account/my-profile/authenticator")
  );
};

export const verifyAuthenticatorCode = (
  input: VerifyAuthenticatorCodeInput
) => {
  return http.post<AuthenticatorRecoveryCodeDto>(
    baseUrlApi("account/my-profile/verify-authenticator-code"),
    { data: input }
  );
};

export const resetAuthenticator = () => {
  return http.post(baseUrlApi("account/my-profile/reset-authenticator"));
};
