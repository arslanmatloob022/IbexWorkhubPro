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
// const hyperformulaInstance = HyperFormula.buildEmpty();
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
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};

const [] = [
  ["150", "643", "0.32", "11", "=A1*(B1*C1)+D1"],
  ["172", "474", "0.51", "11", "=A2*(B2*C2)+D2"],
  ["188", "371", "0.59", "11", "=A3*(B3*C3)+D3"],
  ["162", "731", "0.21", "10", "=A4*(B4*C4)+D4"],
  ["133", "682", "0.81", "9", "=A5*(B5*C5)+D5"],
  ["87", "553", "0.66", "10", "=A6*(B6*C6)+D6"],
  ["26", "592", "0.62", "11", "=A7*(B7*C7)+D7"],
  ["110", "461", "0.73", "9", "=A8*(B8*C8)+D8"],
  ["50", "346", "0.52", "15", "=A9*(B9*C9)+D9"],
  ["160", "423", "0.82", "11", "=A10*(B10*C10)+D10"],
  ["30", "216", "0.26", "9", "=A11*(B11*C11)+D11"],
  ["39", "473", "0.44", "5", "=A12*(B12*C12)+D12"],
  ["96", "490", "0.43", "5", "=A13*(B13*C13)+D13"],
  ["108", "176", "0.71", "7", "=A14*(B14*C14)+D14"],
  ["46", "586", "0.01", "14", "=A15*(B15*C15)+D15"],
  ["97", "514", "0.7", "14", "=A16*(B16*C16)+D16"],
  ["161", "717", "0.01", "13", "=A17*(B17*C17)+D17"],
  ["58", "123", "0.4", "8", "=A18*(B18*C18)+D18"],
  ["92", "739", "0.76", "14", "=A19*(B19*C19)+D19"],
  ["5", "320", "0.52", "13", "=A20*(B20*C20)+D20"],
  ["158", "480", "0.65", "5", "=A21*(B21*C21)+D21"],
  ["121", "373", "0.66", "8", "=A22*(B22*C22)+D22"],
  ["61", "704", "0.95", "7", "=A23*(B23*C23)+D23"],
  ["155", "452", "0.71", "10", "=A24*(B24*C24)+D24"],
  ["162", "693", "0.73", "11", "=A25*(B25*C25)+D25"],
  ["46", "75", "0.14", "15", "=A26*(B26*C26)+D26"],
  ["47", "691", "0.58", "15", "=A27*(B27*C27)+D27"],
  ["104", "346", "0.04", "7", "=A28*(B28*C28)+D28"],
  ["101", "717", "0.87", "5", "=A29*(B29*C29)+D29"],
  ["150", "487", "0.26", "15", "=A30*(B30*C30)+D30"],
  ["42", "465", "0.09", "14", "=A31*(B31*C31)+D31"],
  ["144", "337", "0.72", "7", "=A32*(B32*C32)+D32"],
  ["195", "138", "0.3", "6", "=A33*(B33*C33)+D33"],
  ["199", "717", "0.16", "6", "=A34*(B34*C34)+D34"],
  ["110", "236", "0.91", "9", "=A35*(B35*C35)+D35"],
  ["51", "351", "0.81", "13", "=A36*(B36*C36)+D36"],
  ["69", "221", "0.64", "9", "=A37*(B37*C37)+D37"],
  ["53", "125", "0.28", "12", "=A38*(B38*C38)+D38"],
  ["168", "428", "0.68", "9", "=A39*(B39*C39)+D39"],
  ["58", "361", "0.36", "5", "=A40*(B40*C40)+D40"],
  ["152", "213", "0.13", "13", "=A41*(B41*C41)+D41"],
  ["66", "431", "0.93", "10", "=A42*(B42*C42)+D42"],
  ["112", "108", "0.5", "14", "=A43*(B43*C43)+D43"],
  ["50", "127", "0.7", "7", "=A44*(B44*C44)+D44"],
  ["31", "200", "0.15", "14", "=A45*(B45*C45)+D45"],
  ["132", "654", "0.81", "8", "=A46*(B46*C46)+D46"],
  ["45", "438", "0.79", "6", "=A47*(B47*C47)+D47"],
  ["197", "615", "0.63", "7", "=A48*(B48*C48)+D48"],
  ["190", "592", "0.37", "8", "=A49*(B49*C49)+D49"],
  ["184", "419", "0.78", "8", "=A50*(B50*C50)+D50"],
  ["169", "58", "0.13", "7", "=A51*(B51*C51)+D51"],
  ["152", "324", "0.58", "5", "=A52*(B52*C52)+D52"],
  ["182", "713", "0.53", "5", "=A53*(B53*C53)+D53"],
  ["141", "576", "0.63", "12", "=A54*(B54*C54)+D54"],
  ["169", "429", "0.14", "13", "=A55*(B55*C55)+D55"],
  ["39", "694", "0.98", "13", "=A56*(B56*C56)+D56"],
  ["71", "361", "0.3", "13", "=A57*(B57*C57)+D57"],
  ["148", "540", "0.89", "6", "=A58*(B58*C58)+D58"],
  ["116", "52", "0.3", "7", "=A59*(B59*C59)+D59"],
  ["96", "395", "0.28", "7", "=A60*(B60*C60)+D60"],
  ["35", "222", "0.86", "13", "=A61*(B61*C61)+D61"],
  ["16", "430", "0.8", "8", "=A62*(B62*C62)+D62"],
  ["194", "357", "0.72", "9", "=A63*(B63*C63)+D63"],
  ["24", "498", "0.7", "7", "=A64*(B64*C64)+D64"],
  ["170", "142", "0.52", "5", "=A65*(B65*C65)+D65"],
  ["184", "614", "0.68", "9", "=A66*(B66*C66)+D66"],
  ["153", "524", "0.15", "9", "=A67*(B67*C67)+D67"],
  ["88", "620", "0.39", "15", "=A68*(B68*C68)+D68"],
  ["57", "452", "0.11", "6", "=A69*(B69*C69)+D69"],
  ["62", "493", "0.03", "11", "=A70*(B70*C70)+D70"],
  ["123", "431", "0.75", "15", "=A71*(B71*C71)+D71"],
  ["77", "113", "0.63", "12", "=A72*(B72*C72)+D72"],
  ["199", "208", "0.07", "6", "=A73*(B73*C73)+D73"],
  ["149", "514", "0.42", "12", "=A74*(B74*C74)+D74"],
  ["191", "334", "0.78", "13", "=A75*(B75*C75)+D75"],
  ["150", "643", "0.32", "11", "=A76*(B76*C76)+D76"],
  ["130", "721", "0.62", "5", "=A77*(B77*C77)+D77"],
  ["179", "517", "0.1", "8", "=A78*(B78*C78)+D78"],
  ["98", "31", "0.01", "10", "=A79*(B79*C79)+D79"],
  ["175", "509", "0.7", "11", "=A80*(B80*C80)+D80"],
  ["11", "569", "0.37", "7", "=A81*(B81*C81)+D81"],
  ["184", "630", "0.19", "6", "=A82*(B82*C82)+D82"],
  ["27", "165", "0.51", "13", "=A83*(B83*C83)+D83"],
  ["186", "417", "0.85", "15", "=A84*(B84*C84)+D84"],
  ["20", "741", "0.76", "11", "=A85*(B85*C85)+D85"],
  ["153", "640", "0.28", "6", "=A86*(B86*C86)+D86"],
  ["161", "542", "0.43", "14", "=A87*(B87*C87)+D87"],
  ["98", "344", "0.77", "6", "=A88*(B88*C88)+D88"],
  ["30", "400", "0.71", "13", "=A89*(B89*C89)+D89"],
  ["73", "91", "0.78", "8", "=A90*(B90*C90)+D90"],
  ["158", "72", "0.66", "12", "=A91*(B91*C91)+D91"],
  ["122", "35", "0.32", "15", "=A92*(B92*C92)+D92"],
  ["33", "99", "0.92", "9", "=A93*(B93*C93)+D93"],
  ["107", "538", "0.75", "10", "=A94*(B94*C94)+D94"],
  ["15", "563", "0.32", "6", "=A95*(B95*C95)+D95"],
  ["168", "572", "0.71", "6", "=A96*(B96*C96)+D96"],
  ["135", "217", "0.49", "12", "=A97*(B97*C97)+D97"],
  ["11", "595", "0.03", "13", "=A98*(B98*C98)+D98"],
  ["41", "739", "0.88", "11", "=A99*(B99*C99)+D99"],
  ["144", "289", "0.87", "13", "=A100*(B100*C100)+D100"],
  ["Sum", "Average", "Average", "Sum", "Sum"],
  [
    "=SUM(A1:A100)",
    "=AVERAGE(B1:B100)",
    "=AVERAGE(C1:C100)",
    "=SUM(D1:D100)",
    "=SUM(E1:E100)",
  ],
];

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
  columnSorting: true, // Enable sorting
  filters: true, // Enable filters
  dropdownMenu: true, // Show dropdown options
  contextMenu: true, // Enable right-click options
  // formulas: {
  //   engine: hyperformulaInstance, // Use the HyperFormula instance
  // },
  // licenseKey: "non-commercial-and-evaluation",
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

const saveSheetAsTemplate = async () => {
  try {
    await api.post(`/api/excel-files/create-template/`, {
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
        props.fileId ? props.fileId : sheetDataNew.value.id
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
      <VButton
        :loading="isLoading"
        color="warning"
        raised
        outlined
        class="mr-2"
        light
        >Import Template</VButton
      >
      <VButton
        :loading="isLoading"
        @click="saveSheetAsTemplate"
        color="success"
        raised
        outlined
        class="mr-2"
        light
        >Save As Template</VButton
      >
    </div>
    <div class="column is-4 is-flex">
      <!-- @click="saveSheetHandler" -->

      <div class="is-flex">
        <VButton
          :loading="isLoading"
          @click="saveSheetHandler"
          color="primary"
          raised
          outlined
          light
          class="mr-2"
          >Save</VButton
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
        <VIconBox bordered class="cu-pointer ml-2" color="danger">
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
