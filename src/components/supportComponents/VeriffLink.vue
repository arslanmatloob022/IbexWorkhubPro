<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const verificationLink = ref("");
const mailLoading = ref(false);
const smsLoading = ref(false)

const props = defineProps<{
    veriffModal?: boolean;
    id?: number;
    email?: string;
    phone?: string;
}>();
const emit = defineEmits<{
    (e: "update:modalHandler", value: boolean): void;
    (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
    emit("update:modalHandler", false);
};


const sendEmailHandler = async () => {
    try {
        mailLoading.value = true
        const response = await api.post(`/v3/api/worker/veriff/${props.id}/send-veriff-email/`,
            {
                "link": verificationLink.value,
                "email": props.email
            });
        notyf.success("Invitation Email sent successfully")

    } catch {
        notyf.error("Invalid email address")
    } finally {
        mailLoading.value = false
    }

}
const sendSMSHandler = async () => {
    try {
        smsLoading.value = true
        const response = await api.post("/v3/api/worker/worker_invitation/send-invitation-sms/",
            {
                "message": verificationLink.value,
                "phone": props.phone
            });
        notyf.success("Invitation SMS sent successfully")

    } catch {
        notyf.error("Invalid phone number")
    } finally {
        smsLoading.value = false
    }

}

const createVeriffLink = async () => {
    try {
        const response = await api.post('/v3/api/worker/veriff/create-session/', {
            worker:props.id
        })
        verificationLink.value= response.data.verification.url
    } catch (Err) {
        console.log(Err)
    }
}

const copyToClipBoard = (link: string) => {
    navigator.clipboard.writeText(link);
    notyf.success("Link Copied");
};
onMounted(() => {
    createVeriffLink()
});
</script>

<template>
    <template>
        <Transition name="fade-slow">
            <VModal is="form" :open="props.veriffModal" title="Send Veriff Link" size="small" actions="right"
                 @close="closeModalHandler" class="crete-link-modal">
                <template #content>

                    <div class="modal-form columns is-multiline">
                        <div class="mb-3 is-reversed" style="width:100%">
                            <VField addons>
                                <VControl expanded>
                                    <VInput v-model="verificationLink" type="text" class="input"
                                        placeholder="Find a repository" />
                                </VControl>
                                <VControl>
                                    <VButton icon="fas fa-copy" @click="copyToClipBoard(verificationLink)"
                                        color="primary">
                                        Link
                                    </VButton>
                                </VControl>
                            </VField>

                            <!-- invite mail -->
                            <div>
                                <form @submit.prevent="sendEmailHandler()" id="cus-invitation-tools">
                                    <VField style="width:100%" addons>
                                        <VControl expanded>
                                            <VInput v-model="props.email" type="email" class="input"
                                                placeholder="example@gmail.com" />
                                        </VControl>
                                        <VControl>
                                            <VButton type="submit" icon="feather:mail" :loading="mailLoading"
                                                color="primary">
                                                Mail
                                            </VButton>
                                        </VControl>
                                    </VField>
                                </form>
                            </div>
                            <!-- invite SMS -->
                            <div>
                                <form @submit.prevent="sendSMSHandler()" id="cus-invitation-tools">
                                    <VField style="width:100%" addons>
                                        <VControl expanded>
                                            <VInput v-model="props.phone" pattern="^\+44\d{10}$" type="phone"
                                                class="input" required placeholder="+4400000000" />
                                        </VControl>
                                        <VControl>
                                            <VButton type="submit" icon="feather:message-circle" :loading="mailLoading"
                                                color="primary">
                                                SMS
                                            </VButton>
                                        </VControl>
                                    </VField>
                                </form>
                            </div>
                        </div>
                    </div>
                </template>

                <template #action>
                    <VButton style="display:none" type="submit" color="primary" rounded
                        :loading="loading" icon="fas fa-link" raised>
                        Create</VButton>
                </template>

                <template #cancel>
                    <VButton style="display:none" rounded color="light" @click="closeModalHandler" raised>Close
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