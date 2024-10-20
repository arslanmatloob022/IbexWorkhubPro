import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";

// Define the user type to enforce proper structure
export interface User {
  id: string;
  password: string;
  last_login: string;
  date_joined: string;
  email: string;
  role: string;
  avatar: string;
  is_active: boolean;
  phoneNumber: string;
  username: string;
  is_sentMail: boolean;
}

export const useUserSession = defineStore("userSession", () => {
  const token = useStorage("token", ""); // Store token in localStorage
  const code = useStorage("code", ""); // Store code in localStorage

  // Ref for user data with a default empty structure
  const user = ref<User>(
    JSON.parse(
      localStorage.getItem("user") ||
        JSON.stringify({
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
        })
    )
  );

  // const user = ref(
  //   {
  //     id: "",
  //     password: "",
  //     last_login: "",
  //     date_joined: "",
  //     email: "",
  //     role: "",
  //     avatar: "",
  //     is_active: false,
  //     phoneNumber: "",
  //     username: "",
  //     is_sentMail: false,
  //   } || undefined
  // );

  const loading = ref(true);

  // Computed property to check if the user is logged in
  const isLoggedIn = computed(
    () => token.value !== undefined && token.value !== ""
  );

  // Set user data
  function setUser(newUser: User) {
    user.value = newUser;

    // Convert the user object to a JSON string before storing it in localStorage
    localStorage.setItem("user", JSON.stringify(newUser));

    console.log("user data in store", user.value);
  }

  // Set token
  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem("token", JSON.stringify(newToken));
  }

  // Set code
  function setCode(newCode: string) {
    code.value = newCode;
  }

  // Set loading state
  function setLoading(newLoading: boolean) {
    loading.value = newLoading;
  }

  // Logout the user and clear the data
  async function logoutUser() {
    console.log("User logout function called");
    token.value = ""; // Use empty string instead of undefined
    code.value = ""; // Use empty string instead of undefined
    // Reset user to an empty object structure
    user.value = {
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
    };
    // localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.localStorage.setItem("token", ""); // Explicitly clear the token from localStorage
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

// Enable hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot));
}
