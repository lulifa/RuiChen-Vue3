import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type {
  IUserData,
  UserLookupSearchRequest,
  UserLookupCountRequest
} from "./model";

export const findById = (id: string) => {
  return http.get<IUserData>(baseUrlApi(`identity/users/lookup/${id}`));
};

export const findByUserName = (userName: string) => {
  return http.get<IUserData>(
    baseUrlApi(`identity/users/lookup/by-username/${userName}`)
  );
};

export const search = (input: UserLookupSearchRequest) => {
  return http.get<ListResultDto<IUserData>>(
    baseUrlApi("/api/identity/users/lookup/search"),
    { params: input }
  );
};

export const getCount = (input: UserLookupCountRequest) => {
  return http.get<number>(baseUrlApi("identity/users/lookup/count"), {
    params: input
  });
};
