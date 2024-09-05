import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type {
  Role,
  GetRolePagedRequest,
  UpdateRole,
  CreateRole,
  RoleClaim
} from "./model";
import type {
  CreateIdentityClaim,
  UpdateIdentityClaim
} from "../identity-claim/model";

export const create = (input: CreateRole) => {
  return http.post<Role>(baseUrlApi("identity/roles"), { data: input });
};

export const createClaim = (id: string, input: CreateIdentityClaim) => {
  return http.post(baseUrlApi(`identity/roles/${id}/claims`), {
    data: input
  });
};

export const update = (id: string, input: UpdateRole) => {
  return http.put<Role>(baseUrlApi(`identity/roles/${id}`), {
    data: input
  });
};

export const updateClaim = (id: string, input: UpdateIdentityClaim) => {
  return http.put(baseUrlApi(`identity/roles/${id}/claims`), {
    data: input
  });
};

export const deleteById = (id: string) => {
  return http.delete(baseUrlApi(`identity/roles/${id}`));
};

export const deleteClaim = (id: string, input: RoleClaim) => {
  return http.delete(baseUrlApi(`identity/roles/${id}/claims`), {
    params: {
      claimType: input.claimType,
      claimValue: input.claimValue
    }
  });
};

export const getById = (id: string) => {
  return http.get<Role>(baseUrlApi(`identity/roles/${id}`));
};

export const getAllList = () => {
  return http.get<ListResultDto<Role>>(baseUrlApi("identity/roles/all"));
};

export const getClaimList = (input: { id: string }) => {
  return http.get<ListResultDto<RoleClaim>>(
    baseUrlApi(`identity/roles/${input.id}/claims`)
  );
};

export const getList = (input: GetRolePagedRequest) => {
  return http.get<PagedResultDto<Role>>(baseUrlApi("identity/roles"), {
    params: input
  });
};

export const removeOrganizationUnit = (id: string, ouId: string) => {
  return http.delete(
    baseUrlApi(`identity/roles/${id}/organization-units/${ouId}`)
  );
};
