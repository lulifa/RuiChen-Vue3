import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  SettingDefinitionDto,
  SettingDefinitionCreateDto,
  SettingDefinitionUpdateDto,
  SettingDefinitionGetListInput
} from "./model";

export const GetAsyncByName = (name: string) => {
  return http.get<SettingDefinitionDto>(
    baseUrlApi(`setting-management/settings/definitions/${name}`)
  );
};

export const GetListAsyncByInput = (input: SettingDefinitionGetListInput) => {
  return http.get<ListResultDto<SettingDefinitionDto>>(
    baseUrlApi(`setting-management/settings/definitions`),
    {
      params: input
    }
  );
};

export const CreateAsyncByInput = (input: SettingDefinitionCreateDto) => {
  return http.post<SettingDefinitionDto>(
    baseUrlApi(`setting-management/settings/definitions`),
    {
      data: input
    }
  );
};

export const UpdateAsyncByNameAndInput = (
  name: string,
  input: SettingDefinitionUpdateDto
) => {
  return http.put<SettingDefinitionDto>(
    baseUrlApi(`setting-management/settings/definitions/${name}`),
    {
      data: input
    }
  );
};

export const DeleteOrRestoreAsyncByName = (name: string) => {
  return http.delete(
    baseUrlApi(`setting-management/settings/definitions/${name}`)
  );
};
