import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type { ApplicationApiDescriptionModel } from "./model";

export const GetAsyncByModelAPI = (model?: { includeTypes?: boolean }) => {
  return http.get<ApplicationApiDescriptionModel>(
    baseUrlApi("abp/api-definition"),
    { params: model }
  );
};
