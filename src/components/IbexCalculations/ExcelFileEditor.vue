How i can use luckysheet instead of hotTable,

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
const hyperformulaInstance = HyperFormula.buildEmpty({
  licenseKey: "internal-use-in-handsontable",
});
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);

const loading = ref(false);
const sheetDataNew = ref<string[][]>([[""]]);
const sheetData = ref({
  id: "",
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
  isTemplate?: boolean;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};

const hotSettings = ref({
  data: [],
  formulas: {
    engine: HyperFormula,
  },
  fixedRowsBottom: 2,
  stretchH: "all",
  autoWrapRow: true,
  autoWrapCol: true,
  licenseKey: "non-commercial-and-evaluation",

  colHeaders: true,
  rowHeaders: true,
  width: "100%",
  height: 800,
  minRows: 50,
  minCols: 50,
  rowHeights: 30,
  colWidths: 120,
  manualColumnResize: true,
  manualRowResize: true,
  columnSorting: true,
  filters: true,
  dropdownMenu: true,
  contextMenu: true,
});

const filesList = ref([]);

const saveSheetHandler = async () => {
  try {
    isLoading.value = true;
    if (props.fileId || sheetData.value.id) {
      const resp = await api.patch(
        `/api/excel-files/${props.fileId ? props.fileId : sheetData.value.id}/`,
        {
          is_template: false,
          title: sheetData.value.title,
          object: props.objectId ?? "",
          sheet_data: JSON.stringify(sheetDataNew.value),
        }
      );
      sheetData.value.id = resp.data.id;
      notyf.success("Sheet updated successfully!");
    } else {
      const resp = await api.post(`/api/excel-files/`, {
        title: sheetData.value.title,
        object: props.objectId ?? "",
        sheet_data: JSON.stringify(sheetDataNew.value),
      });
      sheetData.value.id = resp.data.id;
      notyf.success("Sheet created successfully!");
    }
    updateOnSuccessHandler();
  } catch (error) {
    console.error(error);
    notyf.error("Failed to save sheet.");
  } finally {
    isLoading.value = false;
  }
};

const createUpdateTemplatehandler = () => {
  if (props.fileId || sheetData.value.id) {
    saveSheetHandler();
  } else {
    saveSheetAsTemplate();
  }
};

const saveSheetAsTemplate = async () => {
  try {
    const resp = await api.post(`/api/excel-files/create-template/`, {
      is_template: true,
      title: sheetData.value.title,
      sheet_data: JSON.stringify(sheetDataNew.value),
    });
    sheetData.value.id = resp.data.id;
    updateOnSuccessHandler();
    notyf.success("Template saved successfully!");
  } catch (error) {
    console.error(error);
    notyf.error("Failed to save sheet.");
  }
};

const excelTemplates = ref([]);

const getAllExcelTemplate = async () => {
  try {
    const resp = await api.get(`/api/excel-files/templates/`, {});
    excelTemplates.value = resp.data;
  } catch (error) {
    console.error(error);
    notyf.error("Failed to save sheet.");
  }
};

const createSheetFromTemplate = async (id: any) => {
  try {
    await api.post(`/api/excel-files/create-template/${id}/`, {
      is_template: true,
      title: sheetData.value.title,
      sheet_data: JSON.stringify(sheetDataNew.value),
    });
    updateOnSuccessHandler();
    notyf.success("Template saved successfully!");
  } catch (error) {
    console.error(error);
    notyf.error("Failed to save sheet.");
  }
};

const downloadSheetHandler = async () => {
  try {
    const resp = await api.get(
      `/api/excel-files/${
        props.fileId ? props.fileId : sheetData.value.id
      }/download/`,

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
    sheetData.value.id = response.data.id;

    await nextTick();
    if (hotTable.value?.hotInstance) {
      hotTable.value.hotInstance.loadData(sheetDataNew.value); // Load data
      hotTable.value.hotInstance.render(); // Re-render table
    }
  } catch (error) {
    console.log("Error fetching sheet:", error);
  }
};

// watch(sheetDataNew, () => {
//   if (hotInstance) {
//     const totalRow = ["Total", `=SUM(B2:B${sheetDataNew.value.length})`];
//     hotInstance.alter("insert_row", sheetDataNew.value.length);
//     hotInstance.setDataAtRow(sheetDataNew.value.length, totalRow);
//     hotInstance.render();
//   }
// });
onMounted(() => {
  nextTick(() => {
    if (!hotTable.value) {
      console.error("hotTable is undefined");
      return;
    }
    hotInstance = new Handsontable(hotTable.value, {
      data: sheetDataNew.value,
      formulas: {
        engine: HyperFormula,
      },
      fixedRowsBottom: 2,
      stretchH: "all",
      autoWrapRow: true,
      autoWrapCol: true,
      licenseKey: "non-commercial-and-evaluation",

      width: "100%",
      height: 800,
      minRows: 50,
      minCols: 50,
      rowHeights: 30,
      colWidths: 120,
      manualColumnResize: true,
      manualRowResize: true,
      columnSorting: true, // Enable sorting
      filters: true, // Enable filters
      dropdownMenu: true, // Show dropdown options
      contextMenu: true, // Enable right-click options
    });
  });
});

const deleteSheetHandler = async (id: any) => {
  try {
    await api.delete(`/api/excel-files/${id}/`);
    notyf.success("Sheet deleted successfully!");
    closeModalHandler();
  } catch (error) {
    console.error(error);
    notyf.error("Failed to delete sheet.");
  }
};

onMounted(async () => {
  if (props.fileId) {
    await getSheet();
  }
  getAllExcelTemplate();
  // await nextTick();

  // if (hotTable.value?.hotInstance && sheetDataNew.value.length > 0) {
  //   hotTable.value.hotInstance.loadData(sheetDataNew.value);
  //   hotTable.value.hotInstance.render();
  // }
});
</script>

<template>
  <div class="modal-form full-screen columns is-multiline">
    <div class="column is-4">
      <VField>
        <VControl>
          <VInput v-model="sheetData.title" type="text" placeholder="title" />
        </VControl>
      </VField>
    </div>

    <div class="column is-4">
      <!-- <VButton
        :loading="isLoading"
        color="warning"
        raised
        outlined
        class="mr-2"
        light
        >Import Template</VButton
      > -->
    </div>
    <div class="column is-4 justify-right">
      <!-- @click="saveSheetHandler" -->

      <div class="is-flex">
        <VButton
          v-if="!props.isTemplate"
          :loading="isLoading"
          @click="saveSheetHandler"
          color="primary"
          raised
          class="mr-2"
          >{{ props.fileId || sheetData.id ? "Update" : "Save" }}</VButton
        >
        <VButton
          v-if="props.isTemplate"
          :loading="isLoading"
          @click="createUpdateTemplatehandler"
          color="success"
          raised
          outlined
          class="mr-2"
          light
          >{{ sheetData.id ? "Update" : "Create" }} Template</VButton
        >
        <VIconBox
          bordered
          @click="downloadSheetHandler()"
          loading
          class="cu-pointer"
          color="info"
        >
          <i class="lnir lnir-cloud-download" aria-hidden="true"></i>
        </VIconBox>
        <VIconBox
          bordered
          @click="deleteSheetHandler(sheetData.id)"
          class="cu-pointer ml-2"
          color="danger"
        >
          <i class="lnir lnir-trash" aria-hidden="true"></i>
        </VIconBox>
        <VIconBox
          @click="closeModalHandler()"
          class="cu-pointer ml-2"
          bordered
          color="warning"
        >
          <i class="lnir lnir-close" aria-hidden="true"></i>
        </VIconBox>
      </div>
    </div>

    <div class="column is-12">
      <HotTable
        ref="hotTable"
        :settings="hotSettings"
        :data="sheetDataNew"
      ></HotTable>
    </div>
  </div>
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
<!-- change this whole code with luckysheet use, so that  i can replace hottable -->
