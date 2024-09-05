import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  Register,
  PhoneRegister,
  PhoneResetPassword,
  SendPhoneSigninCodeInput,
  SendEmailSigninCodeInput,
  SendPhoneRegisterCodeInput,
  SendPhoneResetPasswordCodeInput,
  GetTwoFactorProvidersInput
} from "./model";
import type { User } from "@/api/identity/identity-user/model";

export const passwordRegister = (input: Register) => {
  return http.post<User>(baseUrlApi("account/register"), { data: input });
};

export const phoneRegister = (input: PhoneRegister) => {
  return http.post(baseUrlApi("account/phone/register"), {
    data: input
  });
};

export const resetPassword = (input: PhoneResetPassword) => {
  return http.put(baseUrlApi("account/phone/reset-password"), {
    data: input
  });
};

export const sendPhoneSigninCode = (input: SendPhoneSigninCodeInput) => {
  return http.post(baseUrlApi("account/phone/send-signin-code"), {
    data: input
  });
};

export const sendEmailSigninCode = (input: SendEmailSigninCodeInput) => {
  return http.post(baseUrlApi("account/email/send-signin-code"), {
    data: input
  });
};

export const sendPhoneRegisterCode = (input: SendPhoneRegisterCodeInput) => {
  return http.post(baseUrlApi("account/phone/send-register-code"), {
    data: input
  });
};

export const sendPhoneResetPasswordCode = (
  input: SendPhoneResetPasswordCodeInput
) => {
  return http.post(baseUrlApi("account/phone/send-password-reset-code"), {
    data: input
  });
};

export const getTwoFactorProviders = (input: GetTwoFactorProvidersInput) => {
  return http.get<ListResultDto<NameValue<string>>>(
    baseUrlApi(`account/two-factor-providers?userId=${input.userId}`)
  );
};
