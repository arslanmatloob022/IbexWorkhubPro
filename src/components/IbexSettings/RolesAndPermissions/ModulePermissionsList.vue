<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
const expandedModules = ref<Set<string>>(new Set());
const api = useApi();
const notyf = useNotyf();
const props = defineProps<{
  objectId?: string;
  type?: string;
}>();
const modulePermissionsList = ref([
  {
    id: "",
    name: "",
    value: "",
    count: 0,
    description: "",
    permissions: [
      {
        id: "",
        name: "",
        key: "",
        module: "",
      },
    ],
  },
]);
const objectAssignedPermissions = ref<any>([]);
const permissionModal = ref(false);
const selectedPermId = ref("");
const filters = ref("");
const selectedPermToDelete = ref("");
const SweetAlertProps = ref({
  title: "Delete Permission?",
  text: "Are you sure to delete this permission, deletion of permission may effect the reach to modules where it is applied.!",
  icon: "fas fa-bell",
  color: "warning",
  btnTxt: "Yes, delete it!",
  openSweetAlert: false,
});

const getModulePermissionsList = async () => {
  try {
    const resp = await api.get(`api/generic-modules/list/`);
    modulePermissionsList.value = resp.data;
  } catch (Error) {
    console.log(Error);
  }
};

const deletePermissionHandler = async () => {
  try {
    const resp = await api.delete(
      `/api/permissions/${selectedPermToDelete.value}`
    );
    notyf.success("Permission Deleted Successfully");
    getModulePermissionsList();
  } catch (err) {
    console.log(err);
  }
};
const toggleExpand = (moduleId: string) => {
  if (expandedModules.value.has(moduleId)) {
    expandedModules.value.delete(moduleId);
  } else {
    expandedModules.value.add(moduleId);
  }
};

const isExpanded = (moduleId: string) => {
  return expandedModules.value.has(moduleId);
};

const assignPermissionsHandler = async (perm: any, action: any) => {
  try {
    const selectedPerms = [
      {
        id: perm.id,
        isAssign: action,
      },
    ];

    const payload = {
      actions_list: JSON.stringify(selectedPerms),
    };

    if (props.type === "user") {
      payload.user = props.objectId;
      payload.mode = "user";
    } else if (props.type === "role") {
      payload.role = props.objectId;
      payload.mode = "role";
    }

    const resp = await api.post(
      `/api/generic-modules/assign-permissions-to-user-role/`,
      payload
    );
    notyf.success("Permission Assigned Successfully");
    getObjectAssignedPermissions();
  } catch (err) {
    console.log(err);
  }
};

const getObjectAssignedPermissions = async () => {
  try {
    const resp = await api.get(
      `api/generic-modules/permissions-by-type/${props.objectId}/${props.type}/`
    );
    objectAssignedPermissions.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

const assignedMappedPermissions = computed(() => {
  // Create a Set of assigned permission IDs for fast lookup
  const assignedIds = new Set(
    objectAssignedPermissions.value.map((p: any) => p)
  );
  console.log("ids", assignedIds);

  // Map over modules and their permissions, adding "assigned" property
  return modulePermissionsList.value.map((module) => ({
    ...module,
    permissions: module.permissions.map((perm) => ({
      ...perm,
      assigned: assignedIds.has(perm.id),
    })),
  }));
});

watch(
  () => props.objectId,
  () => {
    getObjectAssignedPermissions();
  }
);
onMounted(() => {
  getModulePermissionsList();
});
</script>

<template>
  <div>
    <div class="tile-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        <VButton
          @click="permissionModal = true"
          outlined
          light
          color="success"
          raised
        >
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Permission</span>
        </VButton>
        <!-- {{ props.objectId }} -->
      </div>
    </div>

    <div class="tile-grid tile-grid-v1">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        :class="[assignedMappedPermissions.length !== 0 && 'is-hidden']"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-6.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-6-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <!--Tile Grid v1-->
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div
          v-for="(item, key) in assignedMappedPermissions"
          :key="key"
          class="column is-12"
        >
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted">{{ item.name }}</span>
                <span>{{ item.description }}</span>
              </div>
              <div class="dropdown align-items-center">
                <VControl subcontrol class="mr-4">
                  <VSwitchBlock thin color="primary" :model-value="true" />
                </VControl>
                <VIconWrap
                  @click="toggleExpand(item.id)"
                  icon="fas fa-chevron-down"
                  color="info"
                  class="mr-1 cu-pointer"
                  has-large-icon
                />
              </div>
            </div>
            <TransitionGroup name="list-down">
              <div
                v-if="item.permissions?.length && isExpanded(item.id)"
                class="mt-3"
              >
                <ul
                  class="mt-1"
                  v-for="(perm, index) in item.permissions"
                  :key="perm.id"
                >
                  <li class="list-item">
                    <div>
                      <!-- <span class="small-circular-span">{{ index + 1 }}</span> -->
                      <span> {{ perm.name }}</span>
                    </div>
                    <VControl subcontrol class="mr-4">
                      <VSwitchBlock
                        :model-value="perm.assigned"
                        @update:model-value="
                          assignPermissionsHandler(perm, $event)
                        "
                        thin
                        color="success"
                      />
                    </VControl>
                  </li>
                </ul>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <SweetAlert
      v-if="SweetAlertProps.openSweetAlert"
      :isSweetAlertOpen="SweetAlertProps.openSweetAlert"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.text"
      :icon="SweetAlertProps.icon"
      :btntext="SweetAlertProps.btnTxt"
      :onConfirm="deletePermissionHandler"
      :onCancel="
        () => {
          SweetAlertProps.openSweetAlert = false;
        }
      "
    >
    </SweetAlert>
    <AddUpdatePermissionModal
      v-if="permissionModal"
      :open-permission-modal="permissionModal"
      :module-id="props.objectId"
      :permId="selectedPermId"
      @close:modalHandler="permissionModal = false"
      @update:OnSuccess="getModulePermissionsList"
    >
    </AddUpdatePermissionModal>
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

.list-item {
  width: 97%;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  border-radius: 14px;
  margin-left: 20px;
  box-shadow: inset 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
}

.tile-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.1rem !important;
  }
}

.is-dark {
  .tile-grid {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }
}

.tile-grid-v1 {
  .tile-grid-item {
    @include vuero-s-card;

    border-radius: 14px;
    padding: 12px;
    border-color: var(--success) !important;

    .tile-grid-item-inner {
      display: flex;
      align-items: center;

      .meta {
        margin-inline-start: 10px;
        line-height: 1.2;

        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            color: var(--dark-text);
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1rem;
          }

          &:nth-child(2) {
            color: var(--light-text);
            font-size: 0.9rem;
          }
        }
      }

      .dropdown {
        position: relative;
        margin-inline-start: auto;
      }
    }
  }
}
</style>
