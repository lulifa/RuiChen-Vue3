import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export const getAsyncRoutes = () => {
  return http.get<ListResultDto<RouteConfigsTable>>(
    baseUrlApi(`platform/menus/by-current-user?framework=Vue Pure Admin`)
  );
};
