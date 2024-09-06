import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type {
  OrganizationUnit,
  CreateOrganizationUnit,
  UpdateOrganizationUnit,
  GetOrganizationUnitPagedRequest
} from "./model";
import type { GetUserPagedRequest, User } from "../identity-user/model";
import type { GetRolePagedRequest, Role } from "../identity-role/model";

export const create = (input: CreateOrganizationUnit) => {
  return http.post<OrganizationUnit>(
    baseUrlApi("identity/organization-units"),
    { data: input }
  );
};

export const update = (id: string, input: UpdateOrganizationUnit) => {
  return http.put<OrganizationUnit>(
    baseUrlApi(`identity/organization-units/${id}`),
    { data: input }
  );
};

export const deleteById = (id: string) => {
  return http.delete(baseUrlApi(`identity/organization-units/${id}`));
};

export const get = (id: string) => {
  return http.get<OrganizationUnit>(
    baseUrlApi(`identity/organization-units/${id}`)
  );
};

export const getList = (input: GetOrganizationUnitPagedRequest) => {
  return http.get<PagedResultDto<OrganizationUnit>>(
    baseUrlApi("identity/organization-units"),
    {
      params: input
    }
  );
};

export const getUnaddedMemberList = (
  input: { id: string } & GetUserPagedRequest
) => {
  return http.get<PagedResultDto<User>>(
    baseUrlApi(`identity/organization-units/${input.id}/unadded-users`),
    {
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount
      }
    }
  );
};

export const getMemberList = (id: string, input: GetUserPagedRequest) => {
  return http.get<PagedResultDto<User>>(
    baseUrlApi(`identity/organization-units/${id}/users`),
    {
      params: input
    }
  );
};

export const getUnaddedRoleList = (
  input: { id: string } & GetRolePagedRequest
) => {
  return http.get<PagedResultDto<Role>>(
    baseUrlApi(`identity/organization-units/${input.id}/unadded-roles`),
    {
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount
      }
    }
  );
};

export const getRoleList = (id: string, input: GetRolePagedRequest) => {
  return http.get<PagedResultDto<Role>>(
    baseUrlApi(`identity/organization-units/${id}/roles`),
    { params: input }
  );
};

export const getAll = () => {
  return http.get<ListResultDto<OrganizationUnit>>(
    baseUrlApi("identity/organization-units/all")
  );
};

export const move = (id: string, parentId?: string) => {
  return http.put(baseUrlApi(`identity/organization-units/${id}/move`), {
    data: {
      parentId: parentId
    }
  });
};

export const addMembers = (id: string, userIdList: string[]) => {
  return http.post(baseUrlApi(`identity/organization-units/${id}/users`), {
    data: { userIds: userIdList }
  });
};

export const addRoles = (id: string, roleIdList: string[]) => {
  return http.post(baseUrlApi(`identity/organization-units/${id}/roles`), {
    data: { roleIds: roleIdList }
  });
};
