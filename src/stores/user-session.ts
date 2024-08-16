import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, computed } from "vue";

export type UserData = Record<string, any>;

export const useUserSession = defineStore("userSession", () => {
  // const user = ref<Partial<UserData>>();
  const token = useStorage("token", "");
  const code = useStorage("code", "");
  const user = ref({
    id: "",
    password: "",
    last_login: "",
    date_joined: "",
    email: "",
    role: "",
    avatar: "",
    is_active: false,
    phoneNumber: "",
    username: "",
    is_sentMail: false,
  });
  const loading = ref(true);
  const isLoggedIn = computed(
    () => token.value !== undefined && token.value !== ""
  );

  function setUser(newUser: any) {
    user.value = newUser;
  }

  function setToken(newToken: string) {
    token.value = newToken;
  }
  function setCode(newCode: string) {
    code.value = newCode;
  }
  function setLoading(newLoading: boolean) {
    loading.value = newLoading;
  }

  async function logoutUser() {
    // const token = useUserToken();
    token.value = undefined;
    code.value = undefined;
    user.value = undefined;
    isLoggedIn.value = false;
    window.localStorage.setItem("token", "");
  }

  return {
    user,
    code,
    token,
    isLoggedIn,
    loading,
    logoutUser,
    setUser,
    setToken,
    setCode,
    setLoading,
  } as const;
});

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot));
}
