
<script setup lang="ts">
import sleep from '/@src/utils/sleep'
import { useNotyf } from '/@src/composable/useNotyf'
import { onMounted } from 'vue';
import { useApi } from '/@src/composable/useAPI';
const api = useApi()
const notyf = useNotyf()
const router = useRouter()
const route = useRoute()
const formsubmited = ref(false)
const isLoading = ref(false)
const selectedStatus = ref('Approved')
const comment = ref('')
const tokenResponse = ref<any>({
    "id": 57,
    "worker": {
        "firstName": "",
        "lastName": ""
    },
    "jobTitle": "",
    "companyName": "",
    "employedFrom": "",
    "employedTo": "",
  
})

const confirmReference = async () => {
    try {
        isLoading.value = true
        const resp = await api.patch(`v3/api/worker/reference_requests/approve-through-token/${route.query.token}/`, {status:selectedStatus.value, comment:comment.value});
        formsubmited.value=true
        console.log(resp);
    } catch (err) {
        console.log(err)
    }finally{
        isLoading.value =false
    }
}
const checkToken = async () => {
    try {
        isLoading.value = true
        const resp = await api.get(`v3/api/worker/reference_requests/check-token/${route.query.token}/`);
        console.log(resp);
        tokenResponse.value = resp.data
    } catch (err) {
        notyf.error('Invalid token or  request already processed');
        console.log(err)
        router.push('/')
    }finally{
        isLoading.value =false
    }
}

onMounted(() => {
    checkToken()
    selectedStatus.value = route.query.status
})

</script>

<template>
    <div class="confirm-account-wrapper">
        <div class="wrapper-inner" v-if="!formsubmited">
            <div class="action-box cu-input-all">
                <h1 class="mb-2" style="color:var(--primary); font-weight:500; text-align:center; font-size:24px; text-decoration:underline">Thanks For
                    Your Time !</h1>
                <p class="mt-5 cu-message">

                    I am reaching out to request your assistance in verifying <b> {{ tokenResponse.worker.firstName  }} {{ tokenResponse.worker.lastName }} </b> employment at <b> {{ tokenResponse.companyName }} </b> for the period from  <b>  {{ tokenResponse.employedFrom }} </b> to <b> {{ tokenResponse.employedTo  }} </b>  Your prompt response using the buttons below would be greatly appreciated.
                </p>
                <div class="mt-4" style="display:flex; align-items:center;">
                    <VControl raw subcontrol>
                        <VCheckbox v-model="selectedStatus" true-value="Approved" label="Confirm" color="primary" solid circle  />

                    </VControl>

                    <VControl raw subcontrol>
                        <VCheckbox v-model="selectedStatus" true-value="Rejected" label="Deny"
                            color="danger" solid circle/>
                    </VControl>
                </div>
                <VField >
                    
                    <VControl class=" mt-5" style="margin-bottom: 40px;">
                        <VTextarea v-model="comment" class="is-primary-focus" rows="6" placeholder="Comment please..." />
                    </VControl>
                </VField>
                <div class="">
                    <VButton style="width:100%" color="primary" raised  :loading="isLoading" 
                        @click="confirmReference()">
                        Submit
                    </VButton>
                </div>
            </div>
        </div>
        <div class="wrapper-inner" v-if="formsubmited">
            <div class="action-box">
                <VLoader :active="isLoading">
                    <div class="box-content">
                        <img class="light-image" src="/@src/assets/illustrations/placeholders/launch.svg" alt="">
                        <img class="dark-image" src="/@src/assets/illustrations/placeholders/launch-dark.svg" alt="">
                        <h3 class="dark-inverted">
                            Thank You for your precious time !
                        </h3>
                        <p>
                            We appreciate your prompt response regarding the employer we inquired about. Your input will
                            greatly assist us in evaluating the employment timeline of the mentioned employer. Thank you for
                            your assistance.
                        </p>
                        <div class="buttons">
                            <RouterLink to="/"  color="primary" raised tabindex="0">

                                Go Home
                            </RouterLink>
                       
                        </div>
                    </div>
                </VLoader>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.checkbox.is-solid.is-primary input + span {
    background: #fff;
}

.cu-message{
    font-weight: 500;
    b{
        color: var(--primary);
    }
}
textarea{
    border-radius: 15px !important;
    background-color: #f5f5f5 !important;
    border: none !important;
    padding: 23px 20px !important;
}
/* ==========================================================================
1. Confirm Account
========================================================================== */
.confirm-account-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100dvh;
    max-width: 540px;
    min-height: 560px;
    margin: 0 auto;

    .wrapper-inner {
        .action-box {
            @include vuero-s-card;

            padding: 40px;

            .box-content {
                text-align: center;
                font-family: var(--font);

                img {
                    display: block;
                    width: 100%;
                    max-width: 220px;
                    margin: 0 auto 8px;

                    &.is-larger {
                        max-width: 300px;
                    }
                }

                h3 {
                    font-size: 1.1rem;
                    font-family: var(--font-alt);
                    font-weight: 600;
                    max-width: 320px;
                    margin: 0 auto 8px;

                    span {
                        color: var(--primary);
                    }
                }

                p {
                    font-size: 0.9rem;
                }

                .buttons {
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                    padding-top: 30px;

                    .button {
                        margin: 0 4px;
                        min-width: 180px;
                    }
                }
            }
        }
    }
}

.is-dark {
    .confirm-account-wrapper {
        .wrapper-inner {
            .action-box {
                @include vuero-card--dark;
            }
        }

        .wrapper-outer {
            @include vuero-card--dark;
        }
    }
}

@media only screen and (width <=767px) {
    .confirm-account-wrapper {
        .wrapper-inner {
            .action-box {
                padding: 20px;

                .box-content {
                    .buttons {
                        .button {
                            min-width: 130px;
                        }
                    }
                }
            }
        }
    }
}
</style>
