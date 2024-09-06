import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  PermissionProvider,
  PermissionResult,
  UpdatePermissions
} from "./model";

export const get = (provider: PermissionProvider) => {
  return http.get<PermissionResult>(
    baseUrlApi("/api/permission-management/permissions"),
    { params: provider }
  );
};

export const update = (
  provider: PermissionProvider,
  input: UpdatePermissions
) => {
  return http.put(baseUrlApi("/api/permission-management/permissions"), {
    data: input,
    params: provider
  });
};
