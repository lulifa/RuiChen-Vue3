import { defineComponent, Fragment } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

export default defineComponent({
  name: "Perms",
  props: {
    value: {
      type: undefined,
      default: []
    }
  },
  setup(props, { slots }) {
    return () => {
      if (!slots) return null;
      return useUserStoreHook().hasPerms(props.value) ? (
        <Fragment>{slots.default?.()}</Fragment>
      ) : null;
    };
  }
});
