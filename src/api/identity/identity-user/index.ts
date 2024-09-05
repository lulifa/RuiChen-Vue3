import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  User,
  CreateUser,
  SetPassword,
  UpdateUser,
  GetUserPagedRequest,
  UserClaim,
  IdentityUserOrganizationUnitUpdateDto
} from "./model";

import type {
  CreateIdentityClaim,
  UpdateIdentityClaim
} from "../identity-claim/model";
import type { Role } from "../identity-role/model";
import type { OrganizationUnit } from "../identity-organizationunit/model";

export const create = (input: CreateUser) => {
  return http.post<User>(baseUrlApi("identity/users"), { data: input });
};

export const createClaim = (id: string, input: CreateIdentityClaim) => {
  return http.post(baseUrlApi(`identity/users/${id}/claims`), { data: input });
};

export const changePassword = (id: string, input: SetPassword) => {
  return http.put(baseUrlApi(`identity/users/change-password?id=${id}`), {
    data: input
  });
};

export const deleteById = (id: string) => {
  return http.delete(baseUrlApi(`identity/users/${id}`));
};

export const deleteClaim = (id: string, input: UserClaim) => {
  return http.delete(baseUrlApi(`identity/users/${id}/claims`), {
    params: { claimType: input.claimType, claimValue: input.claimValue }
  });
};

export const getById = (id: string) => {
  return http.get<User>(baseUrlApi(`identity/users/${id}`));
};

export const getAssignableRoles = () => {
  return http.get<ListResultDto<Role>>(
    baseUrlApi("identity/users/assignable-roles")
  );
};

export const getRoleList = (id: string) => {
  return http.get<ListResultDto<Role>>(
    baseUrlApi(`identity/users/${id}/roles`)
  );
};

export const getClaimList = (input: { id: string }) => {
  return http.get<ListResultDto<UserClaim>>(
    baseUrlApi(`identity/users/${input.id}/claims`)
  );
};

export const getList = (input: GetUserPagedRequest) => {
  return http.get<PagedResultDto<User>>(baseUrlApi("identity/users"), {
    params: input
  });
};

export const update = (id: string, input: UpdateUser) => {
  return http.put<User>(baseUrlApi(`identity/users/${id}`), {
    data: input
  });
};

export const updateClaim = (id: string, input: UpdateIdentityClaim) => {
  return http.put(baseUrlApi(`identity/users/${id}/claims`), {
    data: input
  });
};

export const lock = (id: string, seconds: number) => {
  return http.put(baseUrlApi(`identity/users/${id}/lock/${seconds}`));
};

export const unlock = (id: string) => {
  return http.put(baseUrlApi(`identity/users/${id}/unlock`));
};

export const getOrganizationUnits = (id: string) => {
  return http.get<ListResultDto<OrganizationUnit>>(
    baseUrlApi(`identity/users/${id}/organization-units`)
  );
};

export const setOrganizationUnits = (
  id: string,
  input: IdentityUserOrganizationUnitUpdateDto
) => {
  return http.put<ListResultDto<OrganizationUnit>>(
    baseUrlApi(`/api/identity/users/${id}/organization-units`),
    { data: input }
  );
};

export const removeOrganizationUnit = (id: string, ouId: string) => {
  return http.delete(
    baseUrlApi(`/api/identity/users/${id}/organization-units/${ouId}`)
  );
};
