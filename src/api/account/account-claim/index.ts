import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type { ChangeAvatarInput } from "./model";

export const changeAvatar = (input: ChangeAvatarInput) => {
  return http.post(baseUrlApi("account/my-claim/change-avatar"), {
    data: input
  });
};
