<script lang="ts" setup>
import { formatDate } from "/@src/composable/useSupportElement";

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  taskDetailModal?: boolean;
  taskData?: object;
  taskId?: string;
}>();

const tab = ref<"info" | "progress">("info");

const closeModalHandler = () => {
  emit("update:modalHandler", true);
};
</script>
<template>
  <VModal
    v-if="props.taskDetailModal"
    :open="props.taskDetailModal"
    title="Task Info"
    actions="right"
    size="medium"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="tabs-wrapper column is-12 mb-0">
          <div class="tabs is-boxed">
            <ul>
              <li :class="[tab === 'info' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'info'"
                  @click="tab = 'info'"
                  ><span>Task Info</span></a
                >
              </li>
              <li :class="[tab === 'progress' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'progress'"
                  @click="tab = 'progress'"
                  ><span>Task Progress</span></a
                >
              </li>
            </ul>
          </div>
        </div>

        <div v-if="tab == 'info'" class="column is-12 py-0">
          <div class="columns is-multiline px-2 py-0">
            <div class="column is-12 mb-2">
              <VCard elevated class="columns is-multiline">
                <h1 class="subtitle is-5 mb-1">Task info</h1>
                <div class="column is-12">
                  <h1 class="subtitle is-6 m-0">Description</h1>
                  <p>
                    <span v-html="props.taskData?.description" class="is-bold">
                    </span>
                  </p>
                </div>
                <div class="column is-12">
                  <h1 class="subtitle is-6 m-0">Note</h1>
                  <p>
                    {{ props.taskData?.note ? props.taskData?.note : "N/A" }}
                  </p>
                </div>
                <div class="column is-6">
                  Duration
                  <p class="">
                    {{
                      props.taskData?.startDate
                        ? props.taskData?.startDate
                        : "N/A"
                    }}
                    to
                    {{
                      props.taskData?.endDate ? props.taskData?.endDate : "N/A"
                    }}
                  </p>
                </div>
                <div class="column is-6">
                  Unit
                  <p class="">
                    {{ props.taskData?.unit ? props.taskData?.unit : "N/A" }}
                  </p>
                </div>
              </VCard>
            </div>

            <div class="column is-12 p-0 mb-2" v-if="props.taskData.project.id">
              <VCard elevated>
                <h1 class="subtitle is-5 mb-1">Project Info</h1>
                <p>
                  Name:
                  <span class="is-bold">
                    {{
                      props.taskData?.project?.title
                        ? props.taskData?.project?.title
                        : "N/A"
                    }}
                  </span>
                </p>
                <p>
                  Address:
                  <span class="is-bold">
                    {{
                      props.taskData?.project?.address
                        ? props.taskData?.project?.address
                        : "N/A"
                    }}
                  </span>
                </p>
                <div>
                  Description:
                  <div
                    v-html="props.taskData?.project?.description"
                    class="is-bold"
                  ></div>
                </div>
              </VCard>
            </div>

            <div v-if="props.taskData?.workers?.length" class="column is-12">
              <h1 class="subtitle is-5 mb-1">Workers</h1>
              <VCardAction
                v-for="worker in props.taskData?.workers"
                :avatar="
                  worker.avatar
                    ? worker.avatar
                    : 'https://media.cssninja.io/content/avatars/19.jpg'
                "
                :title="worker.username"
                :subtitle="worker.email"
              >
              </VCardAction>
            </div>
          </div>
        </div>
        <div v-if="tab == 'progress'" class="column is-12 py-0">
          <!-- {{ props.taskData }}
          <br />
          {{ props.taskId }} -->
          <ProgressMedia
            :object="props.taskId"
            :taskData="props.taskData"
            type="task"
          />
        </div>
      </div>
    </template>
    <template #action>
      <VButton style="display: none" color="primary" raised> Confirm </VButton>
    </template>
    <template #cancel>
      <VButton @click="closeModalHandler" raised> Close </VButton>
    </template>
  </VModal>
</template>
