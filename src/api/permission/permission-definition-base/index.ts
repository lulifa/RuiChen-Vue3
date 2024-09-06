import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  PermissionDefinitionDto,
  PermissionDefinitionCreateDto,
  PermissionDefinitionUpdateDto,
  PermissionDefinitionGetListInput
} from "./model";

export const CreateAsyncByInput = (input: PermissionDefinitionCreateDto) => {
  return http.post<PermissionDefinitionDto>(
    baseUrlApi("permission-management/definitions"),
    { data: input }
  );
};

export const DeleteAsyncByName = (name: string) => {
  return http.delete(baseUrlApi(`permission-management/definitions/${name}`));
};

export const GetAsyncByName = (name: string) => {
  return http.get<PermissionDefinitionDto>(
    baseUrlApi(`permission-management/definitions/${name}`)
  );
};

export const GetListAsyncByInput = (
  input: PermissionDefinitionGetListInput
) => {
  return http.get<ListResultDto<PermissionDefinitionDto>>(
    baseUrlApi("permission-management/definitions"),
    { params: input }
  );
};

export const UpdateAsyncByNameAndInput = (
  name: string,
  input: PermissionDefinitionUpdateDto
) => {
  return http.put<PermissionDefinitionDto>(
    baseUrlApi(`permission-management/definitions/${name}`),
    { data: input }
  );
};
