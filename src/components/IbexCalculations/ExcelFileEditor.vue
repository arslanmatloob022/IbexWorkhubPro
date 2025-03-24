<script setup lang="ts">
import axios from "axios";
import { useUserSession } from "/@src/stores/userSession";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { HotTable } from "@handsontable/vue3";
import { ref, onMounted, nextTick } from "vue";

import Handsontable from "handsontable";
import { HyperFormula } from "hyperformula";
import "handsontable/dist/handsontable.full.min.css";
const hotTable = ref<HTMLElement | null>(null);
let hotInstance: Handsontable | null = null;
const hyperformulaInstance = HyperFormula.buildEmpty();

const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const Loading = ref(false);
const selectSlotValue = ref("");
const selectSlotOptions = ref(<any>[]);

const loading = ref(false);
const sheetDataNew = ref<string[][]>([[""]]);
const sheetData = ref({
  title: "Enter Title",
  data: Array.from({ length: 80 }, () => Array(50).fill("")),
});
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  excelFileModal?: boolean;
  fileId?: any;
  objectId?: string;
  getLeadsList?: boolean;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};

const hotSettings = ref({
  colHeaders: true,
  rowHeaders: true,
  width: "100%",
  height: 800,
  minRows: 50,
  minCols: 50,
  rowHeights: 30,
  colWidths: 120,
  stretchH: "all",
  manualColumnResize: true,
  manualRowResize: true,
  columnSorting: true, // Enable sorting
  filters: true, // Enable filters
  dropdownMenu: true, // Show dropdown options
  contextMenu: true, // Enable right-click options
  formulas: {
    engine: hyperformulaInstance, // Use the HyperFormula instance
  },
  licenseKey: "non-commercial-and-evaluation",
});

const filesList = ref([]);

const saveSheetHandler = async () => {
  try {
    if (props.fileId) {
      await api.patch(`/api/excel-files/${props.fileId}/`, {
        title: sheetData.value.title,
        sheet_data: JSON.stringify(sheetDataNew.value),
      });
      notyf.success("Sheet updated successfully!");
    } else {
      await api.post(`/api/excel-files/`, {
        title: sheetData.value.title,
        sheet_data: JSON.stringify(sheetDataNew.value),
      });
      notyf.success("Sheet created successfully!");
    }
    updateOnSuccessHandler();
    notyf.success("Sheet saved successfully!");
  } catch (error) {
    console.error(error);
    notyf.error("Failed to save sheet.");
  }
};

const downloadSheetHandler = async () => {
  try {
    const resp = await api.post(
      `/api/excel-files/${props.fileId}/download/`,
      {},
      {
        responseType: "blob", // Important: Treat response as a file
      }
    );

    // Create a Blob from the response
    const blob = new Blob([resp.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a temporary URL
    const url = window.URL.createObjectURL(blob);

    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sheetData.value.title}.xlsx`; // Set the file name
    document.body.appendChild(a);

    // Trigger the download
    a.click();

    // Cleanup
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    notyf.success("File downloaded successfully!");
  } catch (error) {
    console.error("Download Error:", error);
    notyf.error("Failed to download the sheet.");
  }
};

const getSheet = async () => {
  try {
    const response = await api.get(`/api/excel-files/${props.fileId}/`);
    let rawData = response.data.sheet_data;

    let parsedData =
      typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    console.log("Parsed Data:", parsedData); // Debugging log

    if (!Array.isArray(parsedData)) {
      console.error("Invalid data format: Expected an array");
      parsedData = [];
    }

    parsedData = parsedData.map((row) => {
      if (Array.isArray(row)) {
        return row.map((cell) => (cell === null ? "" : cell)); // Replace null with empty strings
      } else if (typeof row === "object" && row !== null) {
        return Object.values(row).map((cell) => (cell === null ? "" : cell)); // Convert object values to array
      } else {
        return [row];
      }
    });

    console.log("Fixed Data:", parsedData);

    sheetDataNew.value = parsedData;
    sheetData.value.title = response.data.title;

    await nextTick();
    if (hotTable.value?.hotInstance) {
      hotTable.value.hotInstance.loadData(sheetDataNew.value); // Load data
      hotTable.value.hotInstance.render(); // Re-render table
    }
  } catch (error) {
    console.log("Error fetching sheet:", error);
  }
};
onMounted(() => {
  nextTick(() => {
    if (!hotTable.value) {
      console.error("hotTable is undefined");
      return;
    }

    const hyperformulaInstance = HyperFormula.buildEmpty({
      licenseKey: "internal-use-in-handsontable",
    });

    hotInstance = new Handsontable(hotTable.value, {
      data: [
        ["A1", "B1", "C1", "=A1+B1"],
        ["A2", "B2", "C2", "=A2*B2"],
      ],
      colHeaders: true,
      copyPaste: true,
      rowHeaders: true,
      formulas: {
        engine: hyperformulaInstance,
      },
      columns: [
        {
          type: "dropdown",
          source: ["Option 1", "Option 2", "Option 3"],
        },
      ],
      licenseKey: "non-commercial-and-evaluation",
    });
  });
});

onMounted(async () => {
  if (props.fileId) {
    await getSheet();
  }
  await nextTick();

  // if (hotTable.value?.hotInstance && sheetDataNew.value.length > 0) {
  //   hotTable.value.hotInstance.loadData(sheetDataNew.value);
  //   hotTable.value.hotInstance.render();
  // }
});
</script>

<template>
  <!-- <VModal
    is="form"
    :open="props.excelFileModal"
    title="Calculations"
    size="xl"
    actions="right"
    @submit.prevent="saveSheetHandler"
    @close="closeModalHandler"
  > -->
  <!-- <template #content> -->
  <div class="modal-form full-screen columns is-multiline">
    <div class="column is-9">
      <VField>
        <VControl>
          <VInput v-model="sheetData.title" type="text" placeholder="title" />
        </VControl>
      </VField>
    </div>
    <div class="column is-3 is-flex space-between">
      <VButton
        :loading="isLoading"
        @click="saveSheetHandler"
        color="primary"
        raised
        outlined
        class="mr-2"
        light
        >Save</VButton
      >
      <!-- icon="fas fa-download" -->
      <VButton
        :loading="isLoading"
        @click="downloadSheetHandler()"
        color="info"
        raised
        outlined
        style="width: 160px"
        light
        >Download</VButton
      >
      <!-- icon="fas fa-trash" -->
      <VButton
        :loading="isLoading"
        color="danger"
        outlined
        style="width: 160px"
        light
        class="ml-2"
        raised
        >Delete</VButton
      >
      <VButton
        :loading="isLoading"
        @click="closeModalHandler()"
        color="warning"
        raised
        class="ml-2"
        outlined
        light
        >Close</VButton
      >
    </div>

    <div class="column is-12">
      <HotTable
        ref="hotTable"
        :settings="hotSettings"
        :data="sheetDataNew"
      ></HotTable>
    </div>
  </div>
  <!-- </template> -->
  <!-- <template #action>
      <VButton :loading="isLoading" type="submit" color="primary" raised>{{
        props.fileId ? "Update" : "Save"
      }}</VButton>
    </template>
    <template #cancel>
      <VButton @click="closeModalHandler()" raised>Close</VButton>
    </template>
  </VModal> -->
</template>
<style lang="scss" scoped>
.fullscreen {
  position: fixed; /* Stays fixed on the screen */
  top: 0;
  left: 0;
  width: 100vw; /* 100% of viewport width */
  height: 100vh; /* 100% of viewport height */
  // background-color: rgba(0, 0, 0, 0.8); /* Optional background */
  background-color: #ffffff;
  z-index: 9999; /* Ensures it appears on top */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
}
</style>
