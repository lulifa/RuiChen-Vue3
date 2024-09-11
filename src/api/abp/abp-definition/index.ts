import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type { ApplicationApiDescriptionModel } from "./model";

export const getApiDefinition = (model?: { includeTypes?: boolean }) => {
  return http.get<ApplicationApiDescriptionModel>(
    baseUrlApi("abp/api-definition"),
    { params: model }
  );
};
