<script setup lang="ts">
import { useDarkmode } from "/@src/stores/darkmode";
import { useNotyf } from "/@src/composable/useNotyf";
import { useFetch } from "/@src/composable/useFetch";
import { useApi } from "/@src/composable/useAPI";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
const layoutSwitcher = useLayoutSwitcher();
type StepId = "login" | "forgot-password";
const step = ref<StepId>("login");
const isLoading = ref(false);
const darkmode = useDarkmode();
const router = useRouter();
const route = useRoute();
const notyf = useNotyf();
const api = useApi();
const Password = ref("");
const confirmPassword = ref("");
const token = ref("");
const email = ref("");
const handleSubmit = async () => {
  if (!isLoading.value) {
    if (Password.value != confirmPassword.value) {
      notyf.error("Both password and confirm password  must be matched");
      return;
    }
    isLoading.value = true;
    try {
      const response = await api.post("/api/auth/set-password/", {
        email: email.value,
        password: Password.value,
        token: token.value,
        confirm_password: confirmPassword.value,
      });

      onSuccess();
    } catch (error) {
      isLoading.value = false;
      notyf.dismissAll();
      notyf.error("Invalid or expired link, password update");
    }
  }
};
const onSuccess = () => {
  isLoading.value = false;
  notyf.dismissAll();
  notyf.success("Password updated successfully");
  router.push("/");
};

onMounted(() => {
  token.value = route.query.token;
  email.value = route.query.email;
  // handleSubmit()
});

useHead({
  title: "Reset Password - Ibex",
});

const ShowPassword = ref(false);
const passwordFieldType = ref("Password");
const switchVisibility = () => {
  passwordFieldType.value =
    passwordFieldType.value === "Password" ? "text" : "Password";
};
</script>

<template>
  <div class="modern-login">
    <div class="underlay h-hidden-mobile h-hidden-tablet-p" />
    <div class="columns is-gapless is-vcentered">
      <div class="column is-relative is-8 h-hidden-mobile h-hidden-tablet-p">
        <div class="hero is-fullheight is-image">
          <div class="hero-body">
            <div class="container">
              <div class="columns">
                <div class="column">
                  <img
                    class="hero-image"
                    src="/@src/assets/illustrations/login/station.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-4 is-relative">
        <div class="top-tools">
          <RouterLink to="/" class="top-logo">
            <AnimatedLogo width="38px" height="38px" />
          </RouterLink>

          <label
            class="dark-mode"
            tabindex="0"
            role="button"
            @keydown.space.prevent="
              (e) => (e.target as HTMLLabelElement).click()
            "
          >
            <input
              data-cy="dark-mode-toggle"
              type="checkbox"
              :checked="!darkmode.isDark"
              @change="darkmode.onChange"
            />
            <span />
          </label>
        </div>
        <div class="is-form">
          <div class="is-form-inner">
            <div class="form-text" :class="[step !== 'login' && 'is-hidden']">
              <h2>Reset Password</h2>
            </div>
            <form
              method="post"
              data-cy="login-form"
              :class="[step !== 'login' && 'is-hidden']"
              class="login-wrapper"
              @submit.prevent="handleSubmit"
            >
              <VField>
                <VControl icon="lnil lnil-lock-alt autv-icon">
                  <VLabel class="auth-label"> Password </VLabel>
                  <VInput
                    v-model="Password"
                    :type="passwordFieldType"
                    required
                    minlength="6"
                  />
                </VControl>
              </VField>
              <VField>
                <VControl icon="lnil lnil-lock-alt autv-icon">
                  <VLabel class="auth-label"> Confirm Password </VLabel>
                  <VInput
                    v-model="confirmPassword"
                    required
                    :type="passwordFieldType"
                    minlength="6"
                  />
                </VControl>
              </VField>

              <VField>
                <VControl class="is-flex">
                  <VControl raw subcontrol>
                    <VCheckbox
                      v-model="ShowPassword"
                      label="Show Password"
                      color="primary"
                      @click="switchVisibility"
                    />
                  </VControl>
                </VControl>
              </VField>

              <div class="button-wrap has-help">
                <VButton
                  id="login-button"
                  :loading="isLoading"
                  color="primary"
                  type="submit"
                  size="big"
                  rounded
                  raised
                  bold
                >
                  Submit
                </VButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-login {
  position: relative;
  background: var(--white);
  min-height: 100vh;

  .column {
    &.is-relative {
      position: relative;
    }
  }

  .hero {
    &.has-background-image {
      position: relative;

      .hero-overlay {
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        background: #5d4298 !important;
        opacity: 0.6;
      }
    }
  }

  .underlay {
    display: block;
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 66.6%;
    height: 100%;
    background: #fdfdfd;
    z-index: 0;
  }

  .top-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 1.25rem;
    margin-bottom: 5rem;

    .dark-mode {
      transform: scale(0.6);
      z-index: 2;
    }

    .top-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;

      img {
        display: block;
        width: 100%;
        max-width: 50px;
        margin: 0 auto;
      }

      svg {
        height: 50px;
        width: 50px;
      }
    }
  }

  .is-image {
    position: relative;
    border-inline-end: 1px solid var(--fade-grey);

    .hero-image {
      position: relative;
      z-index: 2;
      display: block;
      margin: -80px auto 0;
      max-width: 60%;
      width: 60%;
    }
  }

  .is-form {
    position: relative;
    max-width: 400px;
    margin: 0 auto;

    form {
      animation: fadeInLeft 0.5s;
    }

    .form-text {
      padding: 0 20px;
      animation: fadeInLeft 0.5s;

      h2 {
        font-family: var(--font-alt);
        font-weight: 400;
        font-size: 2rem;
        color: var(--primary);
      }

      p {
        color: var(--muted-grey);
        margin-top: 10px;
      }
    }

    .recover-text {
      font-size: 0.9rem;
      color: var(--dark-text);
    }

    .login-wrapper {
      padding: 30px 20px;

      .control {
        position: relative;
        width: 100%;
        margin-top: 16px;

        .input {
          padding-top: 14px;
          height: 60px;
          border-radius: 10px;
          padding-inline-start: 55px;
          transition: all 0.3s; // transition-all test

          &:focus {
            background: var(--fade-grey-light-6);
            border-color: var(--placeholder);

            ~ .auth-label,
            ~ .autv-icon i {
              color: var(--muted-grey);
            }
          }
        }

        .error-text {
          color: var(--danger);
          font-size: 0.8rem;
          display: none;
          padding: 2px 6px;
        }

        .auth-label {
          position: absolute;
          top: 6px;
          inset-inline-start: 55px;
          font-size: 0.8rem;
          color: var(--dark-text);
          font-weight: 500;
          z-index: 2;
          transition: all 0.3s; // transition-all test
        }

        .autv-icon,
        :deep(.autv-icon) {
          position: absolute;
          top: 0;
          inset-inline-start: 0;
          height: 60px;
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: var(--placeholder);
          transition: all 0.3s;
        }

        &.has-validation {
          .validation-icon {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            height: 60px;
            width: 60px;
            display: none;
            justify-content: center;
            align-items: center;

            .icon-wrapper {
              height: 20px;
              width: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: var(--radius-rounded);

              svg {
                height: 10px;
                width: 10px;
                stroke-width: 3px;
                color: var(--white);
              }
            }

            &.is-success {
              .icon-wrapper {
                background: var(--success);
              }
            }

            &.is-error {
              .icon-wrapper {
                background: var(--danger);
              }
            }
          }

          &.has-success {
            .validation-icon {
              &.is-success {
                display: flex;
              }

              &.is-error {
                display: none;
              }
            }
          }

          &.has-error {
            .input {
              border-color: var(--danger);
            }

            .error-text {
              display: block;
            }

            .validation-icon {
              &.is-error {
                display: flex;
              }

              &.is-success {
                display: none;
              }
            }
          }
        }

        &.is-flex {
          display: flex;
          align-items: center;

          a {
            display: block;
            margin-inline-start: auto;
            color: var(--muted-grey);
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s;

            &:hover,
            &:focus {
              color: var(--primary);
            }
          }

          .remember-me {
            font-size: 0.9rem;
            color: var(--muted-grey);
            font-weight: 500;
          }
        }
      }

      .button-wrap {
        margin: 40px 0;

        &.has-help {
          display: flex;
          align-items: center;

          > span {
            margin-inline-start: 12px;
            font-family: var(--font);

            a {
              color: var(--primary);
              font-weight: 500;
              padding: 0 2px;
            }
          }
        }

        .button {
          height: 46px;
          width: 140px;
          margin-inline-start: 6px;

          &:first-child {
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}

.remember-toggle {
  width: 65px;
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  transform: scale(0.9);

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .toggler {
      border-color: var(--primary);

      .active,
      .inactive {
        transform: translateX(calc(var(--transform-direction) * 100%))
          rotate(360deg);
      }

      .active {
        opacity: 1;
      }

      .inactive {
        opacity: 0;
      }
    }
  }

  .toggler {
    position: relative;
    display: block;
    height: 34px;
    width: 61px;
    border: 2px solid var(--placeholder);
    border-radius: 100px;
    transition: all 0.3s; // transition-all test

    .active,
    .inactive {
      position: absolute;
      top: 2px;
      inset-inline-start: 2px;
      height: 26px;
      width: 26px;
      border-radius: var(--radius-rounded);
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateX(calc(var(--transform-direction) * 0))
        rotate(calc(var(--transform-direction) * 0));
      transition: all 0.3s ease;

      svg {
        color: var(--white);
        height: 14px;
        width: 14px;
        stroke-width: 3px;
      }
    }

    .inactive {
      background: var(--placeholder);
      border-color: var(--placeholder);
      opacity: 1;
      z-index: 1;
    }

    .active {
      background: var(--primary);
      border-color: var(--primary);
      opacity: 0;
      z-index: 0;
    }
  }
}

@media only screen and (width <= 767px) {
  .modern-login {
    .top-logo {
      top: 30px;
    }

    .dark-mode {
      top: 36px;
      inset-inline-end: 44px;
    }

    .is-form {
      padding-top: 100px;
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .modern-login {
    .top-logo {
      svg {
        height: 60px;
        width: 60px;
      }
    }

    .dark-mode {
      top: -58px;
      inset-inline-end: 30%;
    }

    .columns {
      display: flex;
      height: 100vh;
    }
  }
}

/* ==========================================================================
Dark mode
========================================================================== */

.is-dark {
  .modern-login {
    background: var(--dark-sidebar);

    .underlay {
      background: var(--dark-sidebar-light-10);
    }

    .is-image {
      border-color: var(--dark-sidebar-light-10);
    }

    .is-form {
      .form-text {
        h2 {
          color: var(--primary);
        }
      }

      .login-wrapper {
        .control {
          &.is-flex {
            a:hover {
              color: var(--primary);
            }
          }

          .input {
            background: var(--dark-sidebar-light-4);

            &:focus {
              border-color: var(--primary);

              ~ .autv-icon {
                i {
                  color: var(--primary);
                }
              }
            }
          }

          .auth-label {
            color: var(--light-text);
          }
        }

        .button-wrap {
          &.has-help {
            span {
              color: var(--light-text);

              a {
                color: var(--primary);
              }
            }
          }
        }
      }
    }
  }

  .remember-toggle {
    input {
      &:checked + .toggler {
        border-color: var(--primary);

        > span {
          background: var(--primary);
        }
      }
    }

    .toggler {
      border-color: var(--dark-sidebar-light-12);

      > span {
        background: var(--dark-sidebar-light-12);
      }
    }
  }
}
</style>
