<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useI18n } from "vue-i18n";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const { locale } = useI18n();
const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const company = useCompany();
const invitationLink = ref("");
const invitationIndustry = ref("");
const companySupplier = ref("");
const mailLoading = ref(false);
const smsLoading = ref(false);
const email = ref("");
const phone = ref("");
const showList = ref(false);
const showSupllierInput = ref(false);
const props = defineProps<{
  invitationModal?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const companySuppliers = company.suppliers ? company.suppliers : [];

const sendLink = async () => {
  try {
    console.log(company.loggedCompany.id);
    if (!invitationIndustry.value) {
      notyf.error("Please select industry first");
      return;
    }
    loading.value = true;
    const response = await api.post(
      "/v3/api/worker/worker_invitation/create-worker-invitation/",
      { company: company.loggedCompany.id, industry: companySupplier.value }
    );
    const baseURL = window.location.origin;
    invitationLink.value = `${baseURL}/worker-signup/` + response.data.token;
    loading.value = false;
  } catch (error) {
    console.error("ok", error);
    loading.value = false;
  }
};

const sendEmailHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.post(
      "/v3/api/worker/worker_invitation/send-worker-signup-invitation/",
      {
        link: invitationLink.value,
        email: email.value,
      }
    );
    notyf.success("Invitation Email sent successfully");
    email.value = "";
  } catch {
    notyf.error("Invalid email address");
  } finally {
    mailLoading.value = false;
  }
};
const sendSMSHandler = async () => {
  try {
    smsLoading.value = true;
    const response = await api.post(
      "/v3/api/worker/worker_invitation/send-invitation-sms/",
      {
        message: invitationLink.value,
        phone: phone.value,
      }
    );
    notyf.success("Invitation SMS sent successfully");
    phone.value = "";
  } catch {
    notyf.error("Invalid phone number");
  } finally {
    smsLoading.value = false;
  }
};
const copyToClipBoard = (link: string) => {
  navigator.clipboard.writeText(link);
  notyf.success("Link Copied");
};
onMounted(() => {
  if (userSession.user.role == "partner") {
    companySupplier.value = userSession.user.partner;
  }
  invitationIndustry.value = company.loggedCompany.industry
    ? company.loggedCompany.industry[0].id
    : "";
});
</script>
<template>
  <template>
    <Transition name="fade-slow">
      <VModal
        is="form"
        :open="props.invitationModal"
        title="Worker Signup Link"
        size="small"
        actions="right"
        @submit.prevent="sendLink()"
        @close="closeModalHandler"
        class="crete-link-modal"
      >
        <template #content>
          <div class="modal-form columns is-multiline">
            <div v-if="!invitationLink" class="field column is-12 mb-0">
              <VField class="">
                <label class="light-text" style="font-size: 16px"
                  >Sector
                </label>
                <VControl>
                  <div class="indutryOptions">
                    <div
                      style="margin-bottom: 20px"
                      v-for="(item, index) in company.loggedCompany.industry"
                      :key="index"
                      :class="
                        invitationIndustry == item.id
                          ? 'cus-selected'
                          : 'options'
                      "
                      @click="invitationIndustry = item.id"
                    >
                      <img :src="item.industryLogo" />
                      <p style="font-size: 12px">{{ item.name }}</p>
                    </div>
                  </div>
                </VControl>
              </VField>
              <div
                class="colums is-multiline cu-all-input"
                style="margin-bottom: 40px"
              >
                <label
                  class="column is-12 light-text pl-0 is-flex cus-align-center"
                  style="font-size: 16px"
                  >Work through business partner ?
                  <span>
                    <VField>
                      <VControl>
                        <VSwitchBlock
                          :disabled="userSession.user.role == 'partner'"
                          v-model="showList"
                          label="Yes"
                        />
                      </VControl>
                    </VField>
                  </span>
                </label>
                <VField>
                  <VControl>
                    <VSelect
                      :disabled="showList ? false : true"
                      v-model="companySupplier"
                      rounded
                      name="industry"
                      class="is-rounded"
                    >
                      <VOption disabled value="">Select Partner</VOption>
                      <VOption
                        v-for="(supplier, index) in companySuppliers"
                        :value="showList ? '' : supplier.id"
                        :key="index"
                        >{{ supplier.supplierName }}
                      </VOption>
                    </VSelect>
                  </VControl>
                </VField>
              </div>
            </div>

            <div
              v-if="invitationLink"
              class="mb-3 is-reversed"
              style="width: 100%"
            >
              <VField addons>
                <VControl expanded>
                  <VInput
                    v-model="invitationLink"
                    type="text"
                    class="input"
                    placeholder="Find a repository"
                  />
                </VControl>
                <VControl>
                  <VButton
                    icon="fas fa-copy"
                    @click="copyToClipBoard(invitationLink)"
                    color="primary"
                  >
                    Link
                  </VButton>
                </VControl>
              </VField>

              <!-- invite mail -->
              <div>
                <form
                  @submit.prevent="sendEmailHandler()"
                  id="cus-invitation-tools"
                >
                  <VField style="width: 100%" addons>
                    <VControl expanded>
                      <VInput
                        v-model="email"
                        type="email"
                        class="input"
                        placeholder="example@gmail.com"
                      />
                    </VControl>
                    <VControl>
                      <VButton
                        type="submit"
                        icon="feather:mail"
                        :loading="mailLoading"
                        color="primary"
                      >
                        Mail
                      </VButton>
                    </VControl>
                  </VField>

                  <!-- <VControl icon="lnil lnil-envelope-alt" style="width: 100% !important">
                                        <VInput type="email" v-model="email" required placeholder="example@gmail.com" />
                                    </VControl>
                                    <VButton type="submit" color="info" icon="feather:mail" :loading="mailLoading" raised>
                                        Mail
                                    </VButton> -->
                </form>
              </div>
              <!-- invite SMS -->
              <div>
                <form
                  @submit.prevent="sendSMSHandler()"
                  id="cus-invitation-tools"
                >
                  <VField style="width: 100%" addons>
                    <VControl expanded>
                      <VInput
                        v-model="phone"
                        pattern="^\+44\d{10}$"
                        type="phone"
                        class="input"
                        required
                        placeholder="+4400000000"
                      />
                    </VControl>
                    <VControl>
                      <VButton
                        type="submit"
                        icon="feather:message-circle"
                        :loading="mailLoading"
                        color="primary"
                      >
                        SMS
                      </VButton>
                    </VControl>
                  </VField>

                  <!-- <VControl icon="lnil lnil-phone" style="width: 100% !important">
                                        <VInput type="tel" pattern="^\+44\d{10}$" v-model="phone" placeholder="+4400000000"
                                            required />
                                    </VControl>
                                    <VButton color="primary" icon="feather:message-circle" raised type="submit"
                                        :loading="smsLoading">
                                        SMS
                                    </VButton> -->
                </form>
              </div>
            </div>
          </div>
        </template>
        <template #action>
          <VButton
            v-if="!invitationLink"
            type="submit"
            color="primary"
            rounded
            :loading="loading"
            icon="fas fa-link"
            raised
          >
            Create</VButton
          >
        </template>
        <template #cancel>
          <VButton
            style="display: none"
            rounded
            color="light"
            @click="closeModalHandler"
            raised
            >Close
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
