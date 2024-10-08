import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  IdentityClaimType,
  CreateIdentityClaimType,
  IdentityClaimTypeListResult,
  UpdateIdentityClaimType,
  GetIdentityClaimTypePagedRequest
} from "./model";

export const create = (input: CreateIdentityClaimType) => {
  return http.post<IdentityClaimType>(baseUrlApi("identity/claim-types"), {
    data: input
  });
};

export const deleteById = (id: string) => {
  return http.delete(baseUrlApi(`identity/claim-types/${id}`));
};

export const update = (id: string, input: UpdateIdentityClaimType) => {
  return http.put<IdentityClaimType>(baseUrlApi(`identity/claim-types/${id}`), {
    data: input
  });
};

export const getById = (id: string) => {
  return http.get<IdentityClaimType>(baseUrlApi(`identity/claim-types/${id}'`));
};

export const getList = (input: GetIdentityClaimTypePagedRequest) => {
  return http.get<IdentityClaimType>(baseUrlApi("identity/claim-types"), {
    params: input
  });
};

export const getActivedList = () => {
  return http.get<IdentityClaimTypeListResult>(
    baseUrlApi("identity/claim-types/actived-list")
  );
};
