import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  PermissionGroupDefinitionDto,
  PermissionGroupDefinitionCreateDto,
  PermissionGroupDefinitionUpdateDto,
  PermissionGroupDefinitionGetListInput
} from "./model";

export const CreateAsyncByInput = (
  input: PermissionGroupDefinitionCreateDto
) => {
  return http.post<PermissionGroupDefinitionDto>(
    baseUrlApi("permission-management/definitions/groups"),
    {
      data: input
    }
  );
};

export const DeleteAsyncByName = (name: string) => {
  return http.delete(
    baseUrlApi(`permission-management/definitions/groups/${name}`)
  );
};

export const GetAsyncByName = (name: string) => {
  return http.get<PermissionGroupDefinitionDto>(
    baseUrlApi(`permission-management/definitions/groups/${name}`)
  );
};

export const GetListAsyncByInput = (
  input: PermissionGroupDefinitionGetListInput
) => {
  return http.get<ListResultDto<PermissionGroupDefinitionDto>>(
    baseUrlApi("permission-management/definitions/groups"),
    {
      params: input
    }
  );
};

export const UpdateAsyncByNameAndInput = (
  name: string,
  input: PermissionGroupDefinitionUpdateDto
) => {
  return http.put<PermissionGroupDefinitionDto>(
    baseUrlApi(`permission-management/definitions/groups/${name}`),
    { data: input }
  );
};
