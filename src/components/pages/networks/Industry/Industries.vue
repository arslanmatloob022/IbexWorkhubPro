<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";

export interface IndustryData {
    id: number;
    name: string;
    industryLogo: string;
}
const formData = ref({
    id: "",
    name: "",
    industryLogo: "",
});
const emit = defineEmits<{
    (e: "update:modalHandler", value: boolean): void;
    (e: "update:OnSuccess", value: null): void;
}>();

const filters = ref("");
const notyf = useNotyf();
const api = useApi();
const input = ref("");
const isLoading = ref(false);
const currentSelectedID = ref(0);
const isUploading = ref(false);
const user_action = ref(false);
const add_logo = ref(false);

const editMode = ref(false);

const SweetAlertProps = ref({
    title: "",
    subtitle: "test",
    isSweetAlertOpen: false,
    btntext: "text",
});

const projects: IndustryData[] = [];

//labeling of columns
const columns = {
    industryLogo: {
        label: "Industry",
        grow: true,
        media: true,
    },
    actions: {
        label: "Actions",
        align: "end",
    },
} as const;

// search bar functional
const filteredData = computed(() => {
    if (!filters.value) {
        return projects;
    } else {
        const filterRe = new RegExp(filters.value, "i");

        return projects.filter((item) => {
            return item.name.match(filterRe);
        });
    }
});

const clearButton = () => {
    formData.value = "";
};

// Add the new editIndustry method here
const editIndustry = (item: IndustryData) => {
    user_action.value = true;
    formData.value = { ...item };
    editMode.value = true;
};

// fetch industry data to api
const getAllIndustry = async () => {
    try {
        const response = await api.get("/v3/api/industry/", {});
        projects.length = 0;
        projects.push(...(response.data as IndustryData[]));
        filters.value = "ss";
        filters.value = "";
    } catch (error) {
        console.error("ok", error);
    }
};

//Open delete sweet alert
const OpenDeleteSweeetAlert = (id: number) => {
    currentSelectedID.value = id;
    SweetAlertProps.value = {
        title: "Are you sure?",
        subtitle: "You will not be able to recover this Industry!",
        btntext: "Yes, Delete it",
        isSweetAlertOpen: true,
    };
};

//delete the industry data to api
const DeleteIndustryHandler = async () => {
    try {
        SweetAlertProps.value.isSweetAlertOpen = false;
        const response = await api.delete(
            `/v3/api/industry/${currentSelectedID.value}/`,
            {}
        );
        getAllIndustry();
        notyf.success("Delete Worker, Worker");
    } catch (error) {
        console.error("ok", error);
    }
    editMode.value = false;
};

// Add Industry
const addIndustryHandler = async () => {
    try {
        isLoading.value = true;
        const formDataAPI = new window.FormData();
        console.log(formData.value, "formData value");
        for (const key in formData.value) {
            if (key !== "industryLogo" || formData.value.industryLogo !== null) {
                formDataAPI.append(key, formData.value[key]);
            }
        }
        if (editMode.value) {
            // Update existing industry
            const response = await api.put(
                `/v3/api/industry/${formData.value.id}/`,
                formDataAPI
            );
            closeHandler();
            notyf.dismissAll();
            isLoading.value = false;
            notyf.success("worker updated, worker");
            emit("update:OnSuccess", null); // Emit an event to update the prop
            getAllIndustry();
            editMode.value = false;
        } else {
            // Add new industry
            const response = await api.post("/v3/api/industry/", formDataAPI);
            closeHandler();
            notyf.dismissAll();
            notyf.success("New worker added, New Worker");
            isLoading.value = false;
            emit("update:OnSuccess", null); // Emit an event to update the prop
            getAllIndustry();
        }
        //const response = await api.post("/v3/api/industry/", formDataAPI);
    } catch (error: any) {
        let errorObj = error.response.data ?? {};
        Object.values(errorObj).forEach((values) => {
            values.forEach((value) => {
                console.log(value);
                notyf.error(` ${value}, New Worker`);
            });
        });
    }
};

const closeHandler = () => {
    emit("update:modalHandler", false); // Emit an event to update the prop
    console.log("modal closed");

    formData.value = {
        id: "",
        name: "",
        industryLogo: "",
    };
};
// Input handler
const inputChangeHandler = (event: any) => {
    console.log(event.target.name);
    formData.value = {
        ...formData.value,
        [event.target.name]: event.target.value,
    };
};
const onAddFile = (error: any, fileInfo: any) => {
    const _file = fileInfo.file as File;
    if (_file) {
        formData.value = { ...formData.value, industryLogo: _file };
    }
};

const onRemoveFile = (error: any, fileInfo: any) => {
    formData.value = { ...formData.value, industryLogo: null };
};
// render the page
onMounted(() => {
    getAllIndustry();
});
</script>

<template>
    <div class="columns">
        <div class="column is-6">
            <div class="list-flex-toolbar is-reversed">
                <div class="buttons">
                    <VControl icon="feather:search">
                        <input v-model="filters" class="input custom-text-filter" placeholder="Search..." />
                    </VControl>
                </div>
            </div>
            <VFlexTable v-if="filteredData.length" :data="filteredData" :columns="columns" rounded>
                <template #body>
                    <TransitionGroup name="list" tag="div" class="flex-list-inner">
                        <!--Table item-->
                        <div v-for="item in filteredData" :key="item.id" class="flex-table-item">
                            <VFlexTableCell :column="{ media: true, grow: true }">
                                <VAvatar :picture="item.industryLogo" />
                                <div>
                                    <span class="item-name dark-inverted">{{ item.name }}</span>
                                </div>
                            </VFlexTableCell>
                            <VFlexTableCell :column="{ align: 'end' }">
                                <VDropdown class="is-pushed-mobile" icon="feather:more-vertical" spaced right>
                                    <template #content>
                                        <a role="menuitem" href="#" class="dropdown-item is-media"
                                            @click="editIndustry(item)">
                                            <div class="icon">
                                                <i aria-hidden="true" class="lnil lnil-pencil" />
                                            </div>
                                            <div class="meta">
                                                <span>{{ editMode ? "Edit" : "Edit" }}</span>
                                                <span>Edit Industry Details</span>
                                            </div>
                                        </a>
                                        <a role="menuitem" href="#" class="dropdown-item is-media"
                                            @click="OpenDeleteSweeetAlert(item.id)">
                                            <div class="icon">
                                                <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                                            </div>
                                            <div class="meta">
                                                <span>Remove</span>
                                                <span>Remove from list</span>
                                            </div>
                                        </a>
                                    </template>
                                </VDropdown>
                            </VFlexTableCell>
                        </div>
                    </TransitionGroup>
                </template>
            </VFlexTable>
        </div>
        <div class="column is-6">
            <div class="is-raised s-card" style="border-radius: 20px;">
                <div class="mt-4 pl-5">
                    <h2 class="title is-5 is-narrow toc-ignore is-flex is-justify-content-start">
                        {{ editMode ? "Edit Industry" : "Add Industry" }}
                    </h2>
                </div>
                <div class="mt-5 mb-4 is-flex is-align-items-center is-justify-content-center">
                    <form @submit.prevent="addIndustryHandler" style="width: 400px">
                        <VField>
                            <label>Industry Logo *</label>
                        </VField>
                        <div class="control is-flex is-justify-content-center">
                            <VAvatar size="xl" class="profile-v-avatar mt-4">
                                <template #avatar>
                                    <img v-if="user_action" class="avatar" :src="formData.industryLogo == null
                                            ? '/images/avatars/placeholder.jpg'
                                            : formData.industryLogo
                                        " alt="" />

                                    <VFilePond v-if="!user_action" class="profile-filepond" name="profile_filepond"
                                        :chunk-retry-delays="[500, 1000, 3000]"
                                        label-idle="<i class='fas fa-cloud-upload-alt' style='font-size:27px'></i>"
                                        :accepted-file-types="[
                                            'image/png',
                                            'image/jpeg',
                                            'image/gif',
                                        ]" :image-preview-height="140" :image-resize-target-width="140" :image-resize-target-height="140"
                                        image-crop-aspect-ratio="1:1" style-panel-layout="compact circle"
                                        style-load-indicator-position="center bottom"
                                        style-progress-indicator-position="right bottom"
                                        style-button-remove-item-position="left bottom"
                                        style-button-process-item-position="right bottom" @addfile="onAddFile"
                                        @removefile="onRemoveFile" />

                                    <span>
                                        <VIconButton style="position: absolute; top: 60%; right: -3%" v-if="user_action"
                                            icon="feather:edit-2" class="edit-button is-edit" circle tabindex="0"
                                            @keydown.space.prevent="isUploading = true" @click="
                                                isUploading = true;
                                            user_action = false;
                                            add_logo = true;
                                            " />

                                        <VIconButton style="position: absolute; top: 60%; right: -3%" v-if="add_logo"
                                            icon="feather:arrow-left" class="edit-button is-back" circle tabindex="0"
                                            @keydown.space.prevent="isUploading = false" @click="
                                                isUploading = false;
                                            user_action = true;
                                            add_logo = false;
                                            " />
                                    </span>
                                </template>
                            </VAvatar>
                        </div>
                        <VField>
                            <VLabel>Name *</VLabel>
                            <VControl>
                                <VInput required type="text" placeholder="Enter Industry Name.." v-model="formData.name"
                                    @change="(e) => inputChangeHandler(e)" />
                            </VControl>
                        </VField>
                        <VFlex justify-content="end">
                            <div class="mt-5">
                                <!-- Center align the buttons -->
                                <!-- <VButton color="white" elevated> Clear </VButton> -->
                                <!-- <VButton class="mr-4" bold elevated @click="clearButton()" > Clear </VButton> -->
                                <VButton color="primary" :icon="editMode ? 'fas fa-edit' : 'fas fa-plus'" elevated
                                    type="submit" :loading="isLoading">
                                    {{ editMode ? "Edit" : "Add" }}
                                </VButton>
                            </div>
                        </VFlex>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <SweetAlert v-if="SweetAlertProps.isSweetAlertOpen" :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
        :title="SweetAlertProps.title" :subtitle="SweetAlertProps.subtitle" :btntext="SweetAlertProps.btntext"
        :onConfirm="DeleteIndustryHandler" :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)" />
</template>