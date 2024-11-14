<script lang="ts" setup>
import { formatDate } from "/@src/composable/useSupportElement";

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  taskDetailModal?: boolean;
  taskData?: object;
}>();

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
    @close="closeModalHandler"
  >
    <template #content>
      <div class="p-2">
        <VCard elevated>
          <h1 class="subtitle is-5 mb-1">Task info</h1>
          <p>
            Description:
            <span class="is-bold">
              {{
                props.taskData?.description
                  ? props.taskData?.description
                  : "N/A"
              }}
            </span>
          </p>
          <p>
            Duration:
            <span class="is-bold">
              {{
                props.taskData?.startDate ? props.taskData?.startDate : "N/A"
              }}
            </span>
            to

            <span class="is-bold">
              {{ props.taskData?.endDate ? props.taskData?.endDate : "N/A" }}
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

      <div class="p-2">
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
          <p>
            Parking:
            <VTag
              outlined
              :color="
                props.taskData?.project?.parkingAvaliable ? 'primary' : 'info'
              "
              :label="
                props.taskData?.project?.parkingAvaliable ? 'Available' : 'N/A'
              "
              rounded
            >
            </VTag>
            <span class="ml-4">
              Wifi:
              <VTag
                outlined
                :color="
                  props.taskData?.project?.wifiAvaliabe ? 'primary' : 'info'
                "
                :label="
                  props.taskData?.project?.wifiAvaliabe ? 'Available' : 'N/A'
                "
                rounded
              >
              </VTag>
            </span>
          </p>
          <p></p>
        </VCard>
      </div>

      <div class="p-2">
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
          <!-- badge="/images/icons/flags/germany.svg" -->
          <!-- <template #action>
            <VTag color="green" label="trending" rounded />
          </template> -->
        </VCardAction>
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
