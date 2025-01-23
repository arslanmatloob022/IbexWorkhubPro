<script lang="ts" setup>
import { ref, watch, onMounted, defineProps, defineEmits } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";

// API and user session hooks
const api = useApi();
const notyf = useNotyf();
const userSession = useUserSession();

// Reactive variables
const loading = ref(false);
const selectedAdminsIds = ref<string[]>([]);
const companyAdminsList = ref<{ value: string; name: string; icon: string }[]>(
  []
);

// Emits
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSelectAdmins", value: string[]): void;
}>();

// Props
const props = defineProps<{
  selectedAdmins?: [];
}>();

// Close modal handler
const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

// Emit selected admins
const updateSelectedAdmins = () => {
  emit("update:OnSelectAdmins", selectedAdminsIds.value);
  notyf.info(`${selectedAdminsIds.value}`);
};

watch(selectedAdminsIds, (newVal, oldVal) => {
  if (newVal) {
    updateSelectedAdmins();
  }
});

// Fetch admins data
const getAdminsHandler = async () => {
  try {
    loading.value = true;

    // API call to fetch admins
    const response = await api.get("/api/users/by-role/admin/");
    if (response && response.data) {
      companyAdminsList.value = response.data.map((admin: any) => ({
        value: admin.id,
        name: `${admin.username || ""} ${admin.lastName || ""}`.trim(),
        icon: admin.avatar || "",
      }));

      // Initialize selected admins if passed in props
      if (props.selectedAdmins?.length) {
        selectedAdminsIds.value = props.selectedAdmins;
      }
    } else {
      notyf.error("Failed to fetch admin data.");
    }
  } catch (err) {
    console.error("Error fetching admin data:", err);
    notyf.error("An error occurred while fetching admins.");
  } finally {
    loading.value = false;
  }
};

// On component mount, fetch admin list
onMounted(() => {
  getAdminsHandler();
});
</script>

<template>
  <div>
    <VField v-slot="{ id }" class="is-image-select" label="Sales people">
      <VControl>
        <Multiselect
          v-model="selectedAdminsIds"
          :attrs="{ id }"
          placeholder="Sales people"
          label="name"
          track="value"
          mode="tags"
          :options="companyAdminsList"
        >
          <template #singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="select-label-icon" :src="value.icon" alt="" />
              <span class="select-label-text">
                {{ value.name }}
              </span>
            </div>
          </template>
          <template #option="{ option }">
            <img class="select-option-icon" :src="option.icon" alt="" />
            <span class="select-label-text">
              {{ option.name }}
            </span>
          </template>
        </Multiselect>
      </VControl>
    </VField>
  </div>
</template>
