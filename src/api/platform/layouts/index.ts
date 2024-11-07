import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type {
  CreateLayout,
  Layout,
  UpdateLayout,
  LayoutListResult,
  GetLayoutPagedRequest,
  LayoutPagedResult
} from "./model";

export const create = (input: CreateLayout) => {
  return http.post<Layout>(baseUrlApi("platform/layouts"), {
    data: input
  });
};

export const update = (id: string, input: UpdateLayout) => {
  return http.put<Layout>(baseUrlApi(`platform/layouts/${id}`), {
    data: input
  });
};

export const get = (id: string) => {
  return http.get<Layout>(baseUrlApi(`platform/layouts/${id}`));
};

export const getAll = () => {
  return http.get<LayoutListResult>(baseUrlApi("platform/layouts/all"));
};

export const getList = (input: GetLayoutPagedRequest) => {
  return http.get<LayoutPagedResult>(baseUrlApi("platform/layouts"), {
    params: input
  });
};

export const deleteById = (id: string) => {
  return http.delete(baseUrlApi(`platform/layouts/${id}`));
};
