<script setup lang="ts">
const props = defineProps<{
  openDocViewModal?: boolean;
  document?: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:closeModalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:closeModalHandler", false);
};

const docViewerUrl = (file: any) => {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(
    file
  )}&embedded=true`;
};

onMounted(async () => {
  console.log("picture", props.document);
});
</script>

<template>
  <VModal
    is="form"
    :open="props.openDocViewModal"
    :title="props.title ? props.title : 'Attached Document'"
    size="xl"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <div v-if="props.document" class="modal-form">
        <iframe
          v-if="props.document?.includes('.pdf')"
          :src="`${props.document}#toolbar=0&view=FitH`"
          style="width: 100%; height: 800px; border: none"
        >
          Oops! an error has occurred.
        </iframe>
        <iframe
          v-else-if="
            props.document?.toLowerCase().includes('.doc') ||
            props.document?.toLowerCase().includes('.docx')
          "
          :src="docViewerUrl(props.document)"
          style="width: 100%; height: 800px; border: none"
        >
          Oops! an error has occurred.
        </iframe>
        <iframe
          v-else-if="
            props.document?.toLowerCase().includes('.xls') ||
            props.document?.toLowerCase().includes('.xlsx')
          "
          :src="docViewerUrl(props.document)"
          style="width: 100%; height: 800px; border: none"
        >
          Oops! an error has occurred.
        </iframe>
        <VPlyr
          v-if="props.document?.includes('.mp4')"
          ratio="4by3"
          :source="props.document"
          poster="/video/poster-3.jpg"
          embed
        />
        <img v-else :src="props.document" alt="" />
      </div>
      <div v-else class="modal-form">
        <h1 class="title is-5">No media file attached</h1>
      </div>
    </template>

    <template #cancel>
      <VButton type="submit" style="display: none" color="primary" raised
        >Close</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss" scoped></style>
