import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export const GetAsyncByOptionsAPI = (options?: {
  includeLocalizationResources?: boolean;
}) => {
  return http.get<ApplicationConfigurationDto>(
    baseUrlApi("abp/application-configuration"),
    { params: options }
  );
};
