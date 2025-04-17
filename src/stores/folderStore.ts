// stores/folderStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useFolderStore = defineStore("folderStore", () => {
  // ================================
  // State
  // ================================
  const folders = ref<any[]>([]);
  const files = ref<any[]>([]);
  const folderStack = ref<any[]>([]); // Navigation
  const selectedFolder = ref<any>(null); // Current folder object
  const isLoading = ref(false);
  const searchQuery = ref("");

  // ================================
  // Getters
  // ================================
  const currentFolderId = computed(() =>
    selectedFolder.value ? selectedFolder.value.id : null
  );

  const currentPath = computed(() =>
    folderStack.value.map((f: any) => f.name).join(" / ")
  );

  // ================================
  // Actions
  // ================================

  const loadRootFolders = async () => {
    isLoading.value = true;
    try {
      const res = await axios.get("/api/folders/");
      folders.value = res.data;
      files.value = [];
      folderStack.value = [];
      selectedFolder.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const loadFolderContents = async (folder: any) => {
    isLoading.value = true;
    try {
      const res = await axios.get(`/api/folders/${folder.id}/contents/`);
      folders.value = res.data.subfolders || [];
      files.value = res.data.files || [];
      selectedFolder.value = folder;
      folderStack.value.push(folder);
    } finally {
      isLoading.value = false;
    }
  };

  const goBack = async () => {
    if (folderStack.value.length <= 1) {
      await loadRootFolders();
    } else {
      folderStack.value.pop(); // Remove current
      const prev = folderStack.value[folderStack.value.length - 1];
      await loadFolderContents(prev);
    }
  };

  const createFolder = async (name: string) => {
    const parent = selectedFolder.value?.id || null;
    const res = await axios.post("/api/folders/", { name, parent });
    await reloadCurrentFolder();
  };

  const createFile = async (name: string) => {
    const parent = selectedFolder.value?.id || null;
    const res = await axios.post("/api/files/", { name, parent });
    await reloadCurrentFolder();
  };

  const deleteFolder = async (folderId: number) => {
    await axios.delete(`/api/folders/${folderId}/`);
    await reloadCurrentFolder();
  };

  const reloadCurrentFolder = async () => {
    if (selectedFolder.value) {
      await loadFolderContents(selectedFolder.value);
    } else {
      await loadRootFolders();
    }
  };

  const search = async (query: string) => {
    if (!query) {
      await reloadCurrentFolder();
      return;
    }

    const parentId = currentFolderId.value || "";
    const res = await axios.get(
      `/api/search/?parent=${parentId}&q=${encodeURIComponent(query)}`
    );
    folders.value = res.data.subfolders;
    files.value = res.data.files;
  };

  const openFile = (file: any) => {
    // You can handle modal or file preview
    alert(`Open file: ${file.name}`);
  };

  // ================================
  // Expose
  // ================================

  return {
    folders,
    files,
    folderStack,
    selectedFolder,
    isLoading,
    searchQuery,

    currentFolderId,
    currentPath,

    loadRootFolders,
    loadFolderContents,
    goBack,
    createFolder,
    createFile,
    deleteFolder,
    reloadCurrentFolder,
    search,
    openFile,
  };
});
