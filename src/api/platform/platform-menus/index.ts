import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type {
  Menu,
  CreateMenu,
  UpdateMenu,
  GetAllMenuRequest,
  GetMenuPagedRequest,
  UserMenu,
  RoleMenu
} from "./model";

export const create = (input: CreateMenu) => {
  return http.post<Menu>(baseUrlApi("platform/menus"), {
    data: input
  });
};

export const update = (id: string, input: UpdateMenu) => {
  return http.put<Menu>(baseUrlApi(`platform/menus/${id}`), {
    data: input
  });
};

export const deleteById = (id: string) => {
  return http.delete(baseUrlApi(`platform/menus/${id}`));
};

export const getById = (id: string) => {
  return http.get<Menu>(baseUrlApi(`platform/menus/${id}`));
};

export const getAll = (input: GetAllMenuRequest) => {
  return http.get<ListResultDto<Menu>>(baseUrlApi("platform/menus/all"), {
    params: input
  });
};

export const getList = (input: GetMenuPagedRequest) => {
  return http.get<PagedResultDto<Menu>>(baseUrlApi("platform/menus"), {
    params: input
  });
};

export const getListByUser = (userId: string, framework: string) => {
  return http.get<ListResultDto<Menu>>(
    baseUrlApi(`platform/menus/by-user/${userId}/${framework}`)
  );
};

export const getListByRole = (role: string, framework: string) => {
  return http.get<ListResultDto<Menu>>(
    baseUrlApi(`platform/menus/by-role/${role}/${framework}`)
  );
};

export const setUserMenu = (input: UserMenu) => {
  return http.put(baseUrlApi("platform/menus/by-user"), {
    data: input
  });
};

export const setUserStartupMenu = (userId: string, menuId: string) => {
  return http.put(baseUrlApi(`platform/menus/startup/${menuId}/by-user`), {
    data: {
      userId: userId
    }
  });
};

export const setRoleMenu = (input: RoleMenu) => {
  return http.put(baseUrlApi("platform/menus/by-role"), {
    data: input
  });
};

export const setRoleStartupMenu = (roleName: string, menuId: string) => {
  return http.put(baseUrlApi(`platform/menus/startup/${menuId}/by-role`), {
    data: {
      roleName: roleName
    }
  });
};
