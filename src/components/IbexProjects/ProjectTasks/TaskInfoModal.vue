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
            <div class="column is-12 p-0 mb-2">
              <VCard elevated class="">
                <h1 class="subtitle is-5 mb-1">Task info</h1>
                <p>
                  Description:
                  <span v-html="props.taskData?.description" class="is-bold">
                  </span>
                </p>
                <p>
                  Duration:
                  <span class="is-bold">
                    {{
                      props.taskData?.startDate
                        ? props.taskData?.startDate
                        : "N/A"
                    }}
                  </span>
                  to

                  <span class="is-bold">
                    {{
                      props.taskData?.endDate ? props.taskData?.endDate : "N/A"
                    }}
                  </span>
                </p>

                <p>
                  Unit:
                  <span class="is-bold">
                    {{ props.taskData?.unit ? props.taskData?.unit : "N/A" }}
                  </span>
                </p>
                <p>
                  Note:
                  <span class="is-bold">
                    {{ props.taskData?.note ? props.taskData?.note : "N/A" }}
                  </span>
                </p>
              </VCard>
            </div>

            <div class="column is-12 p-0 mb-2">
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

            <div class="column is-12 p-0">
              <h1 class="subtitle is-5 mb-1">Workers</h1>
              <VCardAction
                v-if="props.taskData?.workers?.length"
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
          <ProgressMedia :object="props.taskId" :taskData="props.taskData" />
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
