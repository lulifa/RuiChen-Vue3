import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type { SettingGroupResult, SettingsUpdate } from "./model";

export const getGlobalSettings = () => {
  return http.get<SettingGroupResult>(
    baseUrlApi("setting-management/settings/by-global")
  );
};

export const setGlobalSettings = (payload: SettingsUpdate) => {
  return http.put(baseUrlApi("setting-management/settings/change-global"), {
    data: payload
  });
};

export const getCurrentTenantSettings = () => {
  return http.get<SettingGroupResult>(
    baseUrlApi("setting-management/settings/by-current-tenant")
  );
};

export const setCurrentTenantSettings = (payload: SettingsUpdate) => {
  return http.put(
    baseUrlApi("setting-management/settings/change-current-tenant"),
    { data: payload }
  );
};

export const getCurrentUserSettings = () => {
  return http.get<SettingGroupResult>(
    baseUrlApi("setting-management/settings/by-current-user")
  );
};

export const setCurrentUserSettings = (payload: SettingsUpdate) => {
  return http.put(
    baseUrlApi("setting-management/settings/change-current-user"),
    { data: payload }
  );
};

export const sendTestEmail = (emailAddress: string) => {
  return http.post(baseUrlApi("setting-management/settings/send-test-email"), {
    data: {
      emailAddress: emailAddress
    }
  });
};
