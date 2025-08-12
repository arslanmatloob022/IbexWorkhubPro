<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const editor = shallowRef<any>();
const CKEditor = defineAsyncComponent(() =>
  import("@ckeditor/ckeditor5-vue").then((m) => m.default.component)
);

function MyUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return {
      upload: () => {
        return loader.file.then((file) => {
          const data = new FormData();
          data.append("image", file);

          return api
            .post("/api/blog/")
            .then((res) => res.json())
            .then((data) => {
              return { default: data.url }; // CKEditor expects { default: 'image_url' }
            });
        });
      },
      abort: () => {},
    };
  };
}

const editorConfig = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
  extraPlugins: [MyUploadAdapterPlugin],
  height: "400px",
  minHeight: "400px",
};

const blogData = ref({
  title: "",
  main_image: "",
  content: "",
});

onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
});
</script>
<template>
  <div style="height: 400px">
    <CKEditor
      style="height: 400px"
      v-if="editor"
      v-model="blogData.content"
      :editor="editor"
      :config="editorConfig"
    />
  </div>
</template>
<style lang="scss"></style>
