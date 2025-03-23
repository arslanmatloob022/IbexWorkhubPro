<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { HotTable } from "@handsontable/vue3";
import "handsontable/dist/handsontable.full.min.css";
import { ref, onMounted, nextTick } from "vue";
import {
  convertToFormData,
  formatDateTime,
} from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { grep } from "cypress/types/jquery";

const userSession = useUserSession();
const api = useApi();
const notyf = useNotyf();
const loading = ref(false);
const columns = {
  username: {
    label: "Title",
    grow: true,
  },
  location: "Height",
  industry: "Width",
  unit: "Unit",
  contacts: "Unit Price",
  totalPrice: "Total Price",
  quantity: "Quantity",
  grandTotalPrice: "Grand Total Price",
  action: {
    label: "Action",
    align: "end",
  },
} as const;

const addItem = ref(false);
const addSection = ref(false);
const sectionsList = ref([
  {
    id: "",
    title: "",
    is_template: false,
    object: "",
    description: "",
    created_at: "",
    items: [
      {
        id: "cd65c781-5fd1-48d9-9d6c-7af86ec5a72f",
        title: "Item One Of Kitchen Tiling",
        height: 0,
        width: 0,
        item_area: 0,
        unit: "Sq ft",
        item_unit_price: 0,
        item_total_price: 0,
        quantity: 0,
        grand_total_price: 0,
        additional_data: {},
        is_active: true,
        created_at: "2025-03-23T10:25:29.447261Z",
        updated_at: "2025-03-23T10:25:29.447272Z",
        section: "bdff8ebb-a0f5-475a-bc48-a6c3699eb550",
      },
    ],
  },
]);

const selectedSectionId = ref("");
const filters = ref("");
const props = defineProps<{
  fetchAll?: {
    type: Boolean;
    default: true;
  };
  fetchTemplates?: {
    type: Boolean;
    default: false;
  };
  userId?: string;
  objectId?: string;
}>();

const sectionItem = ref({
  id: "",
  title: "",
  height: 0.0,
  width: 0.0,
  item_area: 0.0,
  unit: "",
  item_unit_price: 0.0,
  item_total_price: 0.0,
  quantity: 0.0,
  grand_total_price: 0.0,
  additional_data: {},
  is_active: true,
  created_at: "",
  updated_at: "",
  section: "",
});
const sectionData = ref({
  title: "",
  is_template: false,
  object: props.objectId ?? "",
  description: "",
});

const getAllSections = async () => {
  try {
    const response = await api.get(
      `/api/calculation-section/?object=${props.objectId ?? ""}&user_id=${
        props.userId ?? ""
      }&is_template=${props.fetchTemplates ?? ""}`
    );
    sectionsList.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const createSection = async () => {
  try {
    const payload = sectionData.value;
    const response = await api.post(`/api/calculation-section/`, payload);
    notyf.success("Section created successfully!");
    getAllSections();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const showItemEditor = async (id: any) => {
  selectedSectionId.value = id;
  addItem.value = !addItem.value;
  if (addItem.value == false) {
    sectionItem.value = {
      id: "",
      title: "",
      height: 0.0,
      width: 0.0,
      item_area: 0.0,
      unit: "",
      item_unit_price: 0.0,
      item_total_price: 0.0,
      quantity: 0.0,
      grand_total_price: 0.0,
      additional_data: {},
      is_active: true,
      created_at: "",
      updated_at: "",
      section: "",
    };
  }
};

watch(
  () => sectionItem.value.width,
  () => {
    let total = 0;
    total = sectionItem.value.height * sectionItem.value.width;
    sectionItem.value.item_area = total.toFixed(2);
  }
);

watch(
  () => sectionItem.value.item_unit_price,
  () => {
    let total = 0;
    total = sectionItem.value.item_area * sectionItem.value.item_unit_price;
    sectionItem.value.item_total_price = total.toFixed(2);
  }
);

watch(
  () => sectionItem.value.quantity,
  () => {
    let total = 0;
    total = sectionItem.value.item_total_price * sectionItem.value.quantity;
    sectionItem.value.grand_total_price = total.toFixed(2);
  }
);

const createSectionItem = async () => {
  try {
    const payload = sectionItem.value;
    payload.section = selectedSectionId.value;
    const response = await api.post(`/api/calculation-section-items/`, payload);
    notyf.success("Section created successfully!");
    getAllSections();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const filteredSections = computed(() => {
  if (!filters.value) {
    return sectionsList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return sectionsList.value.filter((item) => {
      return item.title?.match(filterRe);
    });
  }
});
const deleteSectionHandler = async (id: any) => {
  try {
    await api.delete(`/api/calculation-section/${id}/`);
    notyf.success("Section deleted successfully!");
    getAllSections();
  } catch (error) {
    console.error(error);
    notyf.error("Failed to delete sheet.");
  }
};

onMounted(async () => {
  //   if (props.fetchAll) {
  await getAllSections();
  //   }
  await getAllSections();
});
</script>

<template>
  <div class="column is-12">
    <div class="list-flex-toolbar is-reversed">
      <VButtons>
        <VButton
          :icon="addSection ? 'fas fa-window-close' : 'fas fa-plus'"
          :color="addSection ? 'warning' : 'primary'"
          class="ml-2"
          raised
          @click="addSection = !addSection"
        >
          {{ addSection ? "Close" : "Section" }}</VButton
        >
        <VButton
          icon="fas fa-file-import"
          color="info"
          class="ml-2"
          raised
          @click="addSection = !addSection"
          >Import</VButton
        >
      </VButtons>
      <div>
        <VControl class="mr-2 h-hidden-mobile" icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </div>
    </div>
    <div class="columns is-multiline">
      <TransitionGroup name="translate-page-y">
        <div v-if="addSection" class="column is-12 card p-4 curved mb-2">
          <div class="columns is-multiline">
            <div class="column is-10">
              <VField>
                <VControl>
                  <VInput
                    v-model="sectionData.title"
                    type="text"
                    placeholder="Section Title"
                  />
                </VControl>
              </VField>
              <VField>
                <VControl>
                  <VTextarea
                    v-model="sectionData.description"
                    type="text"
                    rows="2"
                    placeholder="Section Description"
                  />
                </VControl>
              </VField>
            </div>

            <div class="column is-2">
              <VButton
                color="primary"
                outlined
                light
                bold
                fullwidth
                class="ml-2"
                raised
                @click="createSection"
              >
                Add Section</VButton
              >
              <VControl raw subcontrol>
                <VCheckbox
                  v-model="sectionData.is_template"
                  label="Create Template"
                  color="info"
                />
              </VControl>
            </div>
          </div>
        </div>
      </TransitionGroup>
      <VPlaceholderPage
        v-if="!filteredSections.length"
        title="There is not custom calculations are added on this Job."
        subtitle="Too bad. Looks like we couldn't find any calculation and measurements for the
          Job."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>
      <TransitionGroup name="from-bottom">
        <div
          v-if="filteredSections.length"
          class="column is-12 card p-4 curved mb-2"
          v-for="(item, index) in filteredSections"
          :key="item.id"
        >
          <div class="is-flex space-between mb-4 bottom-border">
            <div>
              <h4 class="title is-5 m-0">{{ item.title }}</h4>
              <div class="content">
                <p>
                  {{ formatDateTime(item.created_at) }}
                </p>
              </div>
            </div>
            <div class="is-flex">
              <VIconWrap
                icon="lucide:pen"
                color="info"
                class="cu-pointer"
                has-background
              />
              <VIconWrap
                icon="fas fa-plus"
                v-tooltip.rounded.primary="'Add Item'"
                :color="addItem ? 'dark' : 'primary'"
                class="cu-pointer ml-1"
                @click="showItemEditor(item.id)"
                has-background
              />
              <VIconWrap
                @click="deleteSectionHandler(item.id)"
                icon="fas fa-copy"
                color="warning"
                v-tooltip.rounded.warning="'Create Template'"
                has-background
                class="cu-pointer ml-1"
              />
              <VIconWrap
                @click="deleteSectionHandler(item.id)"
                icon="lucide:trash"
                color="danger"
                has-background
                class="cu-pointer ml-1"
              />
            </div>
          </div>
          <div v-if="addItem" class="columns is-multiline">
            <div class="column is-6">
              <VField label="Title">
                <VControl>
                  <VInput
                    v-model="sectionItem.title"
                    type="text"
                    placeholder="Item Title"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Height">
                <VControl>
                  <VInput
                    v-model="sectionItem.height"
                    type="text"
                    placeholder="Height"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Width">
                <VControl>
                  <VInput
                    v-model="sectionItem.width"
                    type="text"
                    placeholder="Width"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Area">
                <VControl>
                  <VInput
                    v-model="sectionItem.item_area"
                    type="number"
                    step="2"
                    placeholder="Area"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Unit">
                <VControl>
                  <VInput
                    v-model="sectionItem.unit"
                    type="text"
                    placeholder="Unit"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Unit Price">
                <VControl>
                  <VInput
                    v-model="sectionItem.item_unit_price"
                    type="text"
                    placeholder="Unit price"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Total Price">
                <VControl>
                  <VInput
                    v-model="sectionItem.item_total_price"
                    type="text"
                    placeholder="Total price"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Quantity">
                <VControl>
                  <VInput
                    v-model="sectionItem.quantity"
                    type="text"
                    placeholder="Quantity"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VField label="Grand Total">
                <VControl>
                  <VInput
                    v-model="sectionItem.grand_total_price"
                    type="text"
                    placeholder="Grand Total"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-2">
              <VButton
                light
                fullwidth
                @click="createSectionItem"
                color="primary"
                outlined
                class="mt-5"
                >Add Item</VButton
              >
            </div>
          </div>
          <div class="is-flex columns is-multiline">
            <VFlexTable
              class="column is-12"
              v-if="item.items.length"
              :data="item.items"
              :columns="columns"
              compact
            >
              <template #body>
                <TransitionGroup name="list" tag="div" class="flex-list-inner">
                  <!--Table item-->
                  <div
                    v-for="calItem in item.items"
                    :key="calItem.id"
                    class="flex-table-item"
                  >
                    <VFlexTableCell :column="{ grow: true }" data-th="Label">
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.title"
                            type="text"
                            placeholder="Title"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.height"
                            type="text"
                            placeholder="height"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.width"
                            type="text"
                            placeholder="width"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.unit"
                            type="text"
                            placeholder="unit"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.item_unit_price"
                            type="text"
                            placeholder="unit"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.item_total_price"
                            type="text"
                            placeholder="total price"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.quantity"
                            type="text"
                            placeholder="quantity"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <VField>
                        <VControl>
                          <VInput
                            v-model="calItem.grand_total_price"
                            type="text"
                            placeholder="quantity"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>
                    <VFlexTableCell :column="{ align: 'end' }">
                      <VIconWrap
                        icon="lucide:pen"
                        color="info"
                        class="cu-pointer"
                      />
                      <VIconWrap
                        icon="lucide:trash"
                        color="danger"
                        class="cu-pointer ml-1"
                      />
                    </VFlexTableCell>
                  </div>
                </TransitionGroup>
              </template>
            </VFlexTable>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.fullscreen {
  position: fixed; /* Stays fixed on the screen */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff; /* Optional background */
  z-index: 9999;
  display: flex;
  padding: 12px;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
}
</style>
