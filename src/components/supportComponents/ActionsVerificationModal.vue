<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";

const enteredCaptionText = ref("");
const notyf = useNotyf();

const props = defineProps<{
  actionVerificationModal?: boolean;
  message?: string;
  captionText?: string;
  btnText?: string;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const onSuccessHandler = () => {
  console.log("consoliingg");
  emit("update:OnSuccess", null);
};

const confirmAction = () => {
  if (enteredCaptionText.value == props.captionText) {
    onSuccessHandler();
    closeModalHandler();
  } else {
    notyf.error("Your entered text does not match.");
  }
};

onMounted(() => {});
</script>

<template>
  <template>
    <Transition name="fade-slow">
      <VModal
        :open="actionVerificationModal"
        title="Action Alert"
        actions="right"
        @close="actionVerificationModal = false"
      >
        <template #content>
          <div class="cus-justify-center">
            <i
              class="lnir lnir-alarm-2 m-4"
              style="font-size: 60px; color: var(--danger)"
            ></i>
            <div class="modal-form columns is-multiline">
              <div class="field column is-12 mb-0">
                <div
                  class="content"
                  style="
                    background-color: #ececec71;
                    padding: 6px;
                    border-radius: 8px;
                  "
                >
                  <p style="font-size: 14px">
                    <span
                      style="
                        color: var(--danger);
                        font-size: 17px;
                        font-weight: 500;
                      "
                      >Caution:
                    </span>
                    {{ props.message }}
                    <br />
                  </p>
                </div>
              </div>
              <div class="field column is-12 mb-0">
                <label
                  >To perform this action, type:
                  <span style="font-weight: 500; color: var(--danger)">{{
                    props.captionText
                  }}</span>
                  below:</label
                >
                <div class="control">
                  <input
                    type="text"
                    name="documentTitle"
                    v-model="enteredCaptionText"
                    required
                    class="input is-primary-focus"
                    placeholder="Enter captcha text"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #cancel>
          <VButton style="display: none" rounded color="light" raised
            >Close</VButton
          >
        </template>
        <template #action>
          <VButton type="submit" @click="confirmAction" color="primary" raised
            >{{ props.btnText ? props.btnText : "Confirm" }}
          </VButton>
        </template>
      </VModal>
    </Transition>
  </template>
</template>

<style lang="scss" scoped>
#cus-invitation-tools {
  width: 100%;
  display: flex !important;
  align-items: center !important;
  margin-bottom: 14px;
  gap: 12px;
}

c .cus-active-link {
  color: var(--primary) !important;
  font-weight: 500 !important;
}

.cus-dropdown-head {
  display: flex !important;
}

.indutryOptions {
  margin-top: 10px;

  display: flex;
  // gap: 10px;
  flex-wrap: wrap;

  .options {
    transition: all 1s ease-in-out;
    width: 80px;
    height: 80px;
    cursor: pointer;
    color: aliceblue;
    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }

    p {
      font-weight: 500;
      padding: 4px;
    }
  }

  .cus-selected {
    width: 80px;
    height: 80px;
    cursor: pointer;

    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
    }

    p {
      padding: 4px 8px;
      font-weight: 500;
      border-radius: 10px;
      background-color: var(--primary);
      color: white;
    }
  }
}
</style>

<style lang="scss">
.crete-link-modal {
  justify-content: flex-start !important;

  .modal-content {
    margin-top: 50px !important;
  }
}
</style>
