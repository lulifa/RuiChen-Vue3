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
  return http.post<IdentityClaimType>(baseUrlApi("/api/identity/claim-types"), {
    data: input
  });
};

export const deleteById = (id: string) => {
  return http.delete(baseUrlApi(`/api/identity/claim-types/${id}`));
};

export const update = (id: string, input: UpdateIdentityClaimType) => {
  return http.put<IdentityClaimType>(
    baseUrlApi(`/api/identity/claim-types/${id}`),
    { data: input }
  );
};

export const getById = (id: string) => {
  return http.get<IdentityClaimType>(
    baseUrlApi(`/api/identity/claim-types/${id}'`)
  );
};

export const getList = (input: GetIdentityClaimTypePagedRequest) => {
  return http.get<IdentityClaimType>(baseUrlApi("/api/identity/claim-types"), {
    params: input
  });
};

export const getActivedList = () => {
  return http.get<IdentityClaimTypeListResult>(
    baseUrlApi("/api/identity/claim-types/actived-list")
  );
};
