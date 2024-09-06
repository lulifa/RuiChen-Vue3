import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import type {
  EditionCreateDto,
  EditionDto,
  EditionGetListInput,
  EditionUpdateDto
} from "./model";

export const CreateAsyncByInput = (input: EditionCreateDto) => {
  return http.post<EditionDto>(baseUrlApi(`saas/editions`), {
    data: input
  });
};

export const DeleteAsyncById = (id: string) => {
  return http.delete(baseUrlApi(`saas/editions/${id}`));
};

export const GetAsyncById = (id: string) => {
  return http.get<EditionDto>(baseUrlApi(`saas/editions/${id}`));
};

export const GetListAsyncByInput = (input: EditionGetListInput) => {
  return http.get<PagedResultDto<EditionDto>>(baseUrlApi(`saas/editions`), {
    params: input
  });
};

export const UpdateAsyncByIdAndInput = (
  id: string,
  input: EditionUpdateDto
) => {
  return http.put<EditionDto>(baseUrlApi(`saas/editions/${id}`), {
    data: input
  });
};
