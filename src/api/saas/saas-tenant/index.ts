import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  TenantDto,
  TenantGetListInput,
  TenantCreateDto,
  TenantUpdateDto,
  TenantConnectionStringDto,
  TenantConnectionStringCreateOrUpdate
} from "./model";

export const GetAsyncById = (id: string) => {
  return http.get<TenantDto>(baseUrlApi(`saas/tenants/${id}`));
};

export const GetAsyncByName = (name: string) => {
  return http.get<TenantDto>(baseUrlApi(`saas/tenants/by-name/${name}`));
};

export const GetListAsyncByInput = (input: TenantGetListInput) => {
  return http.get<PagedResultDto<TenantDto>>(baseUrlApi(`saas/tenants`), {
    params: input
  });
};

export const CreateAsyncByInput = (input: TenantCreateDto) => {
  return http.post<TenantDto>(baseUrlApi(`/api/saas/tenants`), {
    data: input
  });
};

export const UpdateAsyncByIdAndInput = (id: string, input: TenantUpdateDto) => {
  return http.put<TenantDto>(baseUrlApi(`saas/tenants/${id}`), {
    data: input
  });
};

export const DeleteAsyncById = (id: string) => {
  return http.delete(baseUrlApi(`saas/tenants/${id}`));
};

export const GetConnectionStringAsyncByIdAndName = (
  id: string,
  name: string
) => {
  return http.get<TenantConnectionStringDto>(
    baseUrlApi(`saas/tenants/${id}/connection-string/${name}`)
  );
};

export const GetConnectionStringAsyncById = (id: string) => {
  return http.get<ListResultDto<TenantConnectionStringDto>>(
    baseUrlApi(`saas/tenants/${id}/connection-string`)
  );
};

export const SetConnectionStringAsyncByIdAndInput = (
  id: string,
  input: TenantConnectionStringCreateOrUpdate
) => {
  return http.put<TenantConnectionStringDto>(
    baseUrlApi(`saas/tenants/${id}/connection-string`),
    { data: input }
  );
};

export const DeleteConnectionStringAsyncByIdAndName = (
  id: string,
  name: string
) => {
  return http.delete(
    baseUrlApi(`saas/tenants/${id}/connection-string/${name}`)
  );
};
