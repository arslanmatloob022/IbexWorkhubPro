<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const query = ref("");
const activeFilter = ref("all");
const filteredProjects = ref([]);
const loading = ref(false);
const userRole = ref("");
const isProjectFormOpen = ref(false);
const editProjectId = ref(null);
const isProjectCompleted = ref(false);
const projectIdDeleteTobe = ref(0);
const alertData = reactive({
  icon: "fa fa-warning",
  alertTitle: "Alert",
  alertDescription:
    "After deleting this Project, you will not be able to recover it.",
});

const projectStatusColor = {
  pending: "secondary",
  active: "warning",
  completed: "success",
};

const getProjectStatus = {
  pending: "Pre Construction",
  active: "Active",
  completed: "Completed",
};

const filterProject = async (filterName: any) => {
  loading.value = true;
  if (filterName) {
    activeFilter.value = filterName;
  }
  try {
    const url =
      query.value.length === 0
        ? `/project?filter=${activeFilter.value}`
        : `/project?filter=${activeFilter.value}&search=${query.value}`;
    const { data } = await api.get(url);
    filteredProjects.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openDeleteAlert = (id) => {
  projectIdDeleteTobe.value = id;
  isProjectCompleted.value = false;
};

const closeProjectForm = () => {
  isProjectFormOpen.value = false;
  editProjectId.value = null;
};

const deleteProject = async () => {
  loading.value = true;
  try {
    await api.delete(`/project/${projectIdDeleteTobe.value}`);
    filteredProjects.value = filteredProjects.value.filter(
      (project) => project.id !== projectIdDeleteTobe.value
    );
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/project`);
    filteredProjects.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <div class="mb-6 mobileWidth">
    <div class="flex-between mb-1 px-1 py-2">
      <form id="manger-form" @submit.prevent="filterProject(null)">
        <div>
          <input
            class="inputField mb-4 px-3 py-2"
            style="
              border: none;
              background-color: white;
              box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
              border-radius: 20px;
              outline: none;
              width: 300px;
            "
            type="text"
            placeholder="Search projects..."
            v-model="query"
          />
        </div>
      </form>

      <div class="filter-tabs">
        <SoftButtonVue
          @click="filterProject('all')"
          :class="activeFilter === 'all' ? 'active-btn' : ''"
          color="info"
          variant="gradient"
          size="sm"
          >All</SoftButtonVue
        >
        <SoftButtonVue
          @click="filterProject('active')"
          :class="activeFilter === 'active' ? 'active-btn' : ''"
          color="warning"
          variant="gradient"
          size="sm"
          >Active</SoftButtonVue
        >
        <SoftButtonVue
          @click="filterProject('pending')"
          :class="activeFilter === 'pending' ? 'active-btn' : ''"
          color="secondary"
          variant="gradient"
          size="sm"
          >Pre Construction</SoftButtonVue
        >
      </div>
    </div>

    <div class="card mb-4">
      <div
        class="card-header pb-0"
        style="display: flex; justify-content: space-between"
      >
        <h6>Projects</h6>
        <!-- openProjectForm -->
        <SoftButtonVue
          v-if="userRole !== 'contractor'"
          @click="() => $router.push('/addproject')"
        >
          <slot>Add Project</slot>
        </SoftButtonVue>
      </div>
      <Placeloader v-if="loading"></Placeloader>
      <div class="card-body px-0 pb-2">
        <div class="table-responsive">
          <table v-if="!loading" class="table mb-0">
            <thead>
              <tr>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Project
                </th>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                >
                  Managers
                </th>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                >
                  Client / Contractor
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Status
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Completion
                </th>
                <th
                  class="text-start text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredProjects" :key="item.id">
                <td @click="$router.push(`/projectdetail/${item.id}`)">
                  <div style="cursor: pointer" class="d-flex px-2 py-1">
                    <div>
                      <soft-avatar
                        :img="item.image ? item.image : '/home-placeload.png'"
                        size="sm"
                        class="me-3"
                        alt="xd"
                        borderRadius="sm"
                      />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ item.title }}</h6>
                      <p class="mb-0 text-sm">
                        {{
                          item.description
                            ? item.description.slice(0, 30)
                            : "...."
                        }}
                      </p>
                      <p class="text-xs text-secondary mb-0">
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                        {{
                          item.address
                            ? item.address.slice(0, 30)
                            : "No address added"
                        }}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="avatar-group mt-2">
                    <a
                      v-for="manager in item.managers"
                      :key="manager.id"
                      href="#"
                      class="avatar avatar-xs rounded-circle zoomout"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      :title="manager.username"
                    >
                      <img
                        :src="manager.avatar ? manager.avatar : img4"
                        rounded-circle
                        alt="image"
                      />
                      <p style="position: absolute; bottom: 7px">
                        {{ manager.username }}
                      </p>
                    </a>
                  </div>
                </td>
                <td class="align-middle text-center text-sm">
                  <div class="flex-column">
                    <p class="text-xs">
                      {{ item.client ? item.client.username : "-----" }}
                    </p>
                    <p class="text-xs">
                      {{ item.contractor ? item.contractor.username : "-----" }}
                    </p>
                  </div>
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="text-xs font-weight-bold">
                    <soft-badge
                      :color="projectStatusColor[item.status]"
                      variant="gradient"
                      size="sm"
                      >{{ getProjectStatus[item.status] }}</soft-badge
                    >
                    - Total tasks {{ item.total_tasks }}
                  </span>
                </td>
                <td class="align-middle">
                  <div class="d-flex align-items-center justify-content-center">
                    <span class="text-xs font-weight-bold mx-2"
                      >{{ item.percentage.toFixed(2) }}%</span
                    >
                    <div>
                      <soft-progress
                        color="info"
                        class="mx-auto"
                        variant="gradient"
                        :percentage="item.percentage"
                      />
                    </div>
                  </div>
                </td>
                <td class="align-middle text-center text-sm">
                  <div class="dropdown-container">
                    <a
                      @click="$router.push(`/projectdetail/${item.id}`)"
                      href="javascript:;"
                      class="text-secondary font-weight-bold text-xs"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                      >View</a
                    >
                    /
                    <a
                      @click="openDeleteAlert(item.id)"
                      href="javascript:;"
                      class="text-secondary font-weight-bold text-xs"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                      >Delete</a
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-else
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
            "
          >
            <img src="/loading.gif" alt="" />
          </div>
          <div
            v-if="!loading && filteredProjects.length === 0"
            style="display: flex; align-items: center"
          >
            <h3 class="mt-5 mb-5" style="margin: auto">No project found</h3>
          </div>
        </div>
      </div>
    </div>

    <SweetAlert ref="sweetAlert" :alertData="alertData">
      <template #actions>
        <soft-button-vue
          color="danger"
          size="md"
          @click="$refs.sweetAlert.closeModal()"
          >Cancel</soft-button-vue
        >
        <soft-button-vue
          @click="isProjectCompleted ? completeProject() : deleteProject()"
          size="md"
          :loading="loading"
          >Confirm</soft-button-vue
        >
      </template>
    </SweetAlert>
    <updateProject
      :isOpen="isProjectFormOpen"
      :closeModal="closeProjectForm"
      :projectId="editProjectId"
    />
  </div>
</template>

<style scoped>
.inputField {
  border: none;
  background-color: white;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 20px;
  outline: none;
  width: 300px;
}
.filter-tabs {
  display: flex;
  gap: 10px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
