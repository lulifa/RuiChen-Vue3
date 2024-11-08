import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type {
  Data,
  GetDataByPaged,
  DataPagedResult,
  DataListResult,
  CreateData,
  UpdateData,
  CreateDataItem,
  UpdateDataItem
} from "./model";

export const create = (input: CreateData) => {
  return http.post<Data>(baseUrlApi("platform/datas"), { data: input });
};

export const createItem = (id: string, input: CreateDataItem) => {
  return http.post(baseUrlApi(`platform/datas/${id}/items`), {
    data: input
  });
};

export const update = (id: string, input: UpdateData) => {
  return http.put<Data>(baseUrlApi(`platform/datas/${id}`), {
    data: input
  });
};

export const updateItem = (id: string, name: string, input: UpdateDataItem) => {
  return http.put(baseUrlApi(`platform/datas/${id}/items/${name}`), {
    data: input
  });
};

export const remove = (id: string) => {
  return http.delete(baseUrlApi(`platform/datas/${id}`));
};

export const removeItem = (id: string, name: string) => {
  return http.delete(baseUrlApi(`platform/datas/${id}/items/${name}`));
};

export const get = (id: string) => {
  return http.get<Data>(baseUrlApi(`platform/datas/${id}`));
};

export const getByName = (name: string) => {
  return http.get<Data>(baseUrlApi(`platform/datas/by-name/${name}`));
};

export const getList = (input: GetDataByPaged) => {
  return http.get<DataPagedResult>(baseUrlApi("platform/datas"), {
    params: input
  });
};

export const getAll = () => {
  return http.get<DataListResult>(baseUrlApi("platform/datas/all"));
};
