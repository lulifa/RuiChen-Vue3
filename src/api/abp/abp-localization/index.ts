import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export const GetAsyncByInputAPI = (input: {
  cultureName: string;
  onlyDynamics?: boolean;
}) => {
  return http.get<ApplicationLocalizationDto>(
    baseUrlApi("abp/application-localization"),
    { params: input }
  );
};
