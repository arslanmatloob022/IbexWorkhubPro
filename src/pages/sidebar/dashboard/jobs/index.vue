<script setup lang="ts">
import { useCompany } from "/@src/stores/company";
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useApi } from "/@src/composable/useAPI";
const api = useApi();
const viewWrapper = useViewWrapper();
const tabs = ref<"listView" | "kanbanView" | "cardView">("kanbanView");
const jobIDD = ref(0);
const EditJobModalOpen = ref(false);
const company = useCompany();
const search = ref("");
let selectSlotOptions = ref<any[]>([]);
const selectSlotValue = ref("");
const tasks = ref(<any>[]);
const loading = ref(false);
viewWrapper.setPageTitle("Jobs");
useHead({
  title: "Jobs - Arez",
});
const statData = ref<any>([]);
const openJobEditModal = () => {
  EditJobModalOpen.value = true;
};

const getJobStats = async () => {
  try {
    const { data } = await api.get(
      `/v3/api/vixen-job/stats/${company.loggedCompany.id}`
    );
    statData.value = data;
  } catch (error) {
    console.log(error);
  }
};

const getCountByState = (state) => {
  const item = statData.value.find((item) => item.state === state);
  return item ? item.count : 0;
};

const getAllCompanies = async () => {
  try {
    const resp = await api.get(
      `/v3/api/customer-company/company/${company.loggedCompany.id}`
    );
    // console.log("Companies:", resp.data);
    //   Companies
    selectSlotOptions.value = resp.data.map((item: any) => {
      return {
        value: item.id.toString(),
        name: item.name,
        icon: item.logo ? item.logo : "/default/icon.png",
        email: item.email,
      };
    });
    selectSlotOptions.value.unshift({
      value: "",
      name: "All",
      icon: company.loggedCompany.compnayLogo,
    });
  } catch (error) {
    console.log(error);
  }
};

const getJobs = async () => {
  try {
    loading.value = true;
    const { data } = await api.get(
      `/v3/api/vixen-job/${company.loggedCompany.id}/company/?customer_company=${selectSlotValue.value}`
    );

    data.forEach((element) => {
      let workerPics = <any>[];
      element.assignedWorkers.forEach((worker) => {
        workerPics.push({ picture: worker.profileImageURL });
      });

      element.workerPics = workerPics;
    });
    tasks.value = data;
    console.log("receiving", tasks.value);
    loading.value = false;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const filteredTasks = computed(() => {
  console.log("computed called");
  if (!search.value) {
    return tasks.value;
  } else {
    return tasks.value.filter((item) => {
      return item.title.match(new RegExp(search.value, "i"));
    });
  }
});

watch(selectSlotValue, (oldVal, newVal) => {
  getJobs();
});

onMounted(() => {
  getJobs();
  getJobStats();
  getAllCompanies();
});
</script>

<template>
  <div class="page-content-inner">
    <div
      class="is-flex"
      style="gap: 20px; margin-bottom: 16px; align-items: stretch"
    >
      <VField v-slot="{ id }" class="pl-2">
        <VControl class="placement-wrapper">
          <span
            style="
              margin-left: 1rem;
              font-weight: 500;
              font-size: 1.3rem;
              color: #555;
              transform: translateY(0.5rem);
            "
            >All Clients ({{
              selectSlotOptions.length > 10
                ? selectSlotOptions.length
                : "0" + selectSlotOptions.length
            }})</span
          >
          <Multiselect
            style="
              width: 280px;
              height: 55px;
              border-radius: 1rem;
              background-color: transparent !important;
              border: none;
              outline: none;
              width: 100%;
            "
            v-model="selectSlotValue"
            :attrs="{ id }"
            placeholder="Select a customer company"
            label="name"
            :options="selectSlotOptions"
            :searchable="true"
            track-by="name"
            :height="300"
            class="lg-multiselect"
          >
            <template
              #singlelabel="{ value }"
              style="background-color: transparent !important"
            >
              <div
                class="multiselect-single-label"
                style="background-color: transparent"
              >
                <img
                  style="width: 30px; border-radius: 0.5rem"
                  class="select-label-icon mr-2"
                  :src="value.icon"
                  alt=""
                />
                {{ value.name }}
              </div>
            </template>

            <template #option="{ option }">
              <div
                class=""
                style="display: flex; flex-direction: column; gap: 0.3rem"
              >
                <div
                  class=""
                  style="display: flex; align-items: center; gap: 0.5rem"
                >
                  <img
                    style="width: 40px; border-radius: 0.5rem"
                    class="select-option-icon mr-2"
                    :src="option.icon"
                    alt=""
                  />
                  <div
                    style="display: flex; flex-direction: column; gap: 0.3rem"
                  >
                    <span
                      style="color: #444; font-size: 1.2rem; font-weight: 500"
                      >{{ option.name }}</span
                    >
                    <span style="color: #666; font-size: 1rem"
                      ><span style="color: #444">Email:</span>
                      {{ option.email }}</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </Multiselect>
        </VControl>
      </VField>

      <!-- Anomalies  -->
      <div
        class=""
        style="
          background-color: lightgrey;
          height: 42px;
          width: 7px;
          border-radius: 10px;
        "
      ></div>

      <!-- new jobs -->
      <div style="height: max-content">
        <div
          class="cus-card"
          style="
            background-color: #f3f1f1;
            display: flex;
            flex-direction: column;
            gap: 2px;
            text-align: left;
            height: 110px;
          "
        >
          <p
            style="
              color: #3b4b4ca1 !important;
              font-size: 20px;
              margin-bottom: 17px;
            "
            class="title"
          >
            {{ getCountByState("created") }}
          </p>
          <p
            style="
              color: #3b4b4ca1 !important;
              font-size: 16px;
              font-weight: 500;
            "
          >
            New Jobs
          </p>
        </div>
      </div>

      <!-- new jobs -->
      <div style="height: max-content">
        <div
          class="cus-card"
          style="
            background-color: #c449c230;
            display: flex;
            flex-direction: column;
            gap: 2px;
            text-align: left;
            height: 110px;
          "
        >
          <p
            style="
              color: #c449c2 !important;
              font-size: 20px;
              margin-bottom: 17px;
            "
            class="title"
          >
            {{ getCountByState("waitingRAMS") }}
          </p>
          <p
            style="color: #c449c2 !important; font-size: 16px; font-weight: 500"
          >
            RAMS / CPP
          </p>
        </div>
      </div>
      <!-- ready to start-->
      <div>
        <div
          class="cus-card"
          style="background-color: #5887ff30; text-align: left; height: 110px"
        >
          <div class="is-flex" style="justify-content: space-between">
            <div class="">
              <p
                style="color: #5887ff !important; font-size: 20px"
                class="title mb-0"
              >
                {{ getCountByState("readyToStart") }}
              </p>
            </div>
          </div>
          <p
            class=""
            style="color: #5887ff !important; font-size: 16px; font-weight: 500"
          >
            Ready to Start
          </p>
        </div>
      </div>

      <!-- in progress -->
      <div>
        <div
          class="cus-card"
          style="background-color: #fcefe8; text-align: left; height: 110px"
        >
          <p
            style="color: #eb6c32c4 !important; font-size: 20px"
            class="title mb-0"
          >
            {{ getCountByState("started") }}
          </p>
          <p
            style="
              color: #eb6c32c4 !important;
              font-size: 16px;
              font-weight: 500;
            "
          >
            In Progress
          </p>
        </div>
      </div>

      <!-- completed -->
      <div>
        <div
          class="cus-card"
          style="background-color: #41d5784f; text-align: left; height: 110px"
        >
          <p
            style="color: #32b064 !important; font-size: 20px"
            class="title mb-0"
          >
            {{ getCountByState("completed") }}
          </p>
          <p
            class=""
            style="color: #32b064 !important; font-size: 16px; font-weight: 500"
          >
            Completed
          </p>
        </div>
      </div>
    </div>
    <div class="kanban-toolbar">
      <VField raw>
        <VControl icon="feather:search">
          <VInput v-model="search" placeholder="Search..." />
        </VControl>
      </VField>

      <VButton
        color="primary mr-5"
        @click="openJobEditModal"
        style="float: right"
        icon="fas fa-plus"
      >
        Create Job
      </VButton>

      <VIconBox
        class="mr-4 cu-pointer"
        size="medium"
        @click="tabs = 'kanbanView'"
        :color="[tabs == 'kanbanView' ? 'primary' : '']"
      >
        <i class="fas fa-tv" aria-hidden="true"></i>
      </VIconBox>
      <VIconBox
        class="mr-4 cu-pointer"
        size="medium"
        @click="tabs = 'cardView'"
        :color="[tabs == 'cardView' ? 'primary' : '']"
      >
        <i class="lnil lnil-thumbnail" aria-hidden="true"></i>
      </VIconBox>
      <VIconBox
        class="mr-4 cu-pointer"
        size="medium"
        @click="tabs = 'listView'"
        :color="[tabs == 'listView' ? 'primary' : '']"
      >
        <i class="lnil lnil-list-alt" aria-hidden="true"></i>
      </VIconBox>
    </div>
    <div v-if="tabs == 'kanbanView'">
      <CardPlaceload v-if="loading" />
      <KanbanEditor v-if="!loading" :tasks="filteredTasks" />
    </div>
    <div v-if="tabs == 'listView'">
      <JobsView :tasks="filteredTasks" :loading="loading" />
    </div>
    <div v-if="tabs == 'cardView'">
      <CardsView :tasks="filteredTasks" :loading="loading" />
    </div>

    <AddJobsModal
      v-if="EditJobModalOpen"
      :AddJobModalOpen="EditJobModalOpen"
      :jobId="jobIDD"
      @update:modalHandler="EditJobModalOpen = false"
      @update:on-success="getJobs"
    />
  </div>
</template>

<style lang="scss">
.placement-wrapper {
  width: 30rem;
  height: 7rem;
  background: #f3f1f1;
  border-radius: 0.8rem;
  display: flex;
  align-items: start;
  padding: 0.5rem 0.5rem;
  flex-direction: column;
  gap: 0rem;
  box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.placement-wrapper:hover {
  box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
}
.sitejob-space {
  margin-top: -1rem;
}
.lg-multiselect {
  .multiselect-dropdown {
    max-height: 300px !important;
  }
}

.placement-wrapper > .multiselect > .multiselect-wrapper > .multiselect-search {
  background: transparent;
  outline: none;
}

.placement-wrapper > .multiselect > .multiselect-dropdown {
  border-radius: 0.8rem;
  margin-bottom: -1.5rem;
  box-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
  min-height: 450px !important;
}
.multiselect .multiselect-caret {
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 0.3rem;
  cursor: pointer;
  background: #666;
}
</style>

<style scoped lang="scss">
/*Cards styling */
.cus-card {
  width: 100%;
  height: 150px;
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-radius: 15px;
  transition: transform 0.3s ease;
  padding-bottom: 10px;
  overflow: hidden;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }

  .title {
    font-size: calc(17px + 1vw);
    color: rgb(255, 255, 255);
  }

  .subtitle {
    font-weight: 600;
    font-size: calc(2px + 1vw);
    color: #f1f1f1;
  }
}
</style>
