<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useCompany } from "/@src/stores/company";
import { debounce } from "/@src/composable/useSupportElement";
import { sendWhatsappMessage } from "/@src/composable/useSupportElement";
const api = useApi();
const route = useRoute();
const Loading = ref(false)
const company = useCompany();
const search = ref('')
const router = useRouter();
const workers = ref<any>([
])



const debouncedSearchChangeHandler = debounce(() => {
    search.value ? getWorkerForOption() : workers.value = []
}, 500);

const getWorkerForOption = async () => {
    try {
        Loading.value = true;
        const response = await api.get(`/v3/api/worker/workers-for-options/${company.loggedCompany.id}/?search=${search.value}`,
            {}
        );
        workers.value = response.data
    } catch (error) {
        console.error("Error while searching", error);
    } finally {
        Loading.value = false;
    }
};

const gotWorkerProfile = (id: any) => {
    router.push(`/sidebar/company/workers/${id}`)
    resetSearch();
}

const resetSearch = () => {
    search.value = '';
    workers.value = []
}

</script>
<template>
    <VField class="mt-4">
        <VControl :icon="!Loading ? 'feather:search' : 'feather:loader'">
            <input v-model="search" type="text" class="input is-rounded search-input cus-searchInput"
                placeholder="Search..." @input="debouncedSearchChangeHandler">
            <template #extra>
                <div v-if="workers.length > 0" class="is-active search-results has-slimscroll">
                    <div v-for="user in workers" :key="user.id" class="search-result cu-pointer">
                        <VAvatar class="cus-pointer" :picture="user.profileImageURL" @click="gotWorkerProfile(user.id)" />
                        <div class="ml-2" style="display:flex; flex-direction:column; text-align:left">
                            <span class="item-name dark-inverted" style="margin-bottom: 2px !important; font-weight:500"
                                @click="gotWorkerProfile(user.id)">{{
                                    user.firstName }}
                                {{ user.lastName }} <img style="  width: 20px; height: 20px;"
                                    :src="user.industry.industryLogo" @click="gotWorkerProfile(user.id)" /></span>
                            <div @click="sendWhatsappMessage(user.phoneNumber)"
                                style="color:var(--light-text); display:flex; gap:4px; algin-items:center">
                                <img src="/images/icons/workerProfile/whatsapp.png"
                                    style="width: 12px; height: 12px;margin-top:3px; margin-right: 2px" />
                                {{ user.phoneNumber }}
                            </div>
                            <!-- <div style="color:var(--light-text); display:flex;gap:4px; align-items:center">
                                <i style="width: 10px; color:var(--primary)" class="iconify" data-icon="feather:mail" aria-hidden="true"></i>
                                {{ user.emailAddress }}
                            </div> -->
                        </div>
                    </div>
                </div>
                <div v-if="!workers.length && search && !Loading" class="is-active search-results has-slimscroll">
                    <h1 class="p-4 light-text">No result found</h1>
                </div>
            </template>
            <div v-if="search" class="form-icon is-right" tabindex="0" role="button" @keydown.space.prevent="resetSearch"
                @click="resetSearch">
                <i aria-hidden="true" class="iconify" data-icon="feather:x" />
            </div>
        </VControl>
    </VField>
</template>
<style lang="scss">
.field .control .form-icon.is-right {
    inset-inline-start: unset !important;
    inset-inline-end: 6px;
    cursor: pointer;
}

.control .search-results {
    max-height: 380px !important;
}

.cus-searchInput {
    width: 280px;
    transition: all 2s ease-in-out;
}

.cus-searchInput:focus {
    width: 340px
}
</style>