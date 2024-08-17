<script setup lang="ts">
import { ref } from "vue";
import { useCompany } from "/@src/stores/company";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
const api = useApi();
const notyf = useNotyf();

const FormData = ref({
  id: "",
  supplierName: "",
  supplierEmailAddress: "",
  registrationNumber: "",
  contactPerson: "",
  postCode: "",
  supplierPhoneNumber: "",
  VATExist: false,
  vatNumber: "",
  industry: "",
  registeredName: "",
  tradingName: "",
  businessArea: "",
  relationShip: "",
  color: "#49DFDC",
  address: "",
  approved_till: "",
  status: true,
  company: "",
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const props = defineProps<{
  createNewBusinessModal?: boolean;
}>();

const company = useCompany();

const businessArea_array = ref([
  {
    name: "Guard & Security",
  },
  {
    name: "Guard & Cleaning",
  },
]);
const businessRelation_array = ref([
  {
    name: "Supplier",
  },
  {
    name: "UnSpecified",
  },
]);
const compnayIndustries = company.loggedCompany.industry
  ? company.loggedCompany.industry
  : [];
const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const createSupplier = async () => {
  const formDataAPI = {};
  try {
    FormData.value.company = company.loggedCompany.id;
    await api.post(`/v3/api/supplier/`, FormData.value);
    await new Promise((resolve) => setTimeout(resolve, 100));
    closeModalHandler();
    notyf.dismissAll();
    notyf.success("New supplier added, New Supplier");
    emit("update:OnSuccess", null);
  } catch (error) {
    console.error("Error adding supplier:", error);
  }
};
onMounted(() => {});
</script>

<template>
  <!--Create New Business-->
  <VModal
    is="form"
    :open="props.createNewBusinessModal"
    title="Create New Supplier"
    size="big"
    actions="right"
    @submit.prevent="createSupplier()"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns">
          <div class="column is-4">
            <div class="field">
              <label class="label">Supplier Name *</label>
              <div class="control">
                <input
                  type="text"
                  v-model="FormData.supplierName"
                  class="input"
                  placeholder="Enter Supplier Name"
                  required
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Email *</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  v-model="FormData.supplierEmailAddress"
                  placeholder="Enter Email"
                  required
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Register Name *</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="FormData.registeredName"
                  placeholder="Enter Register Name"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <div class="field">
              <label class="label"> Registration Number*</label>
              <div class="control">
                <input
                  type="number"
                  v-model="FormData.registrationNumber"
                  class="input"
                  placeholder="Enter  Registration Number"
                  required
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Contact Person * </label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="FormData.contactPerson"
                  placeholder="Enter Contact Person"
                  required
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Supplier PhoneNo* </label>
              <div class="control">
                <input
                  type="phone"
                  class="input"
                  v-model="FormData.supplierPhoneNumber"
                  placeholder="Enter Supplier Phone Number"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-4 field mb-0">
            <label class="label">Business Type : * </label>
            <VField>
              <VControl>
                <VSelect
                  v-model="FormData.industry"
                  name="industry"
                  required
                  class="is-rounded"
                >
                  <VOption value="">Select Business Type</VOption>
                  <VOption
                    v-for="(item, index) in compnayIndustries"
                    :value="item.id"
                    >{{ item.name }}</VOption
                  >
                </VSelect>
              </VControl>
            </VField>
            <VField id="interests" class="p-0" label=""> </VField>
          </div>
          <div class="column is-4 field mb-0">
            <label class="label">Business Area: * </label>
            <VField>
              <VControl>
                <VSelect
                  v-model="FormData.businessArea"
                  name="industry"
                  required
                  class="is-rounded"
                >
                  <VOption value="">Select Business Area</VOption>
                  <VOption
                    v-for="(item, index) in businessArea_array"
                    :value="item.name"
                    >{{ item.name }}</VOption
                  >
                </VSelect>
              </VControl>
            </VField>
            <VField id="interests" class="p-0" label=""> </VField>
          </div>
          <div class="column is-4 field mb-0">
            <label class="label">RelationShip: * </label>
            <VField>
              <VControl>
                <VSelect
                  v-model="FormData.relationShip"
                  name="industry"
                  required
                  class="is-rounded"
                >
                  <VOption value="">Select Relation</VOption>
                  <VOption
                    v-for="(item, index) in businessRelation_array"
                    :value="item.name"
                    >{{ item.name }}</VOption
                  >
                </VSelect>
              </VControl>
            </VField>
            <VField id="interests" class="p-0" label=""> </VField>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Trading Name *</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="FormData.tradingName"
                  placeholder="Enter trading name"
                  required
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Postcode *</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="FormData.postCode"
                  placeholder="Enter Postcode"
                  required
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Color </label>
              <div class="control">
                <input
                  type="color"
                  class="input"
                  name="color"
                  v-model="FormData.color"
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Address </label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="FormData.address"
                  placeholder="Enter Address"
                  required
                />
              </div>
            </div>
          </div>
          <div class="column is-4">
            <VField>
              <label class="label">Are You Register VAT? </label>
              <VControl>
                <VRadio
                  v-model="FormData.VATExist"
                  value="true"
                  label="Yes"
                  color="primary"
                  name="outlined_radio"
                />

                <VRadio
                  v-model="FormData.VATExist"
                  value="false"
                  label="No"
                  name="outlined_radio"
                  color="danger"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Vat Number</label>
              <div class="control">
                <input
                  type="number"
                  class="input"
                  v-model="FormData.vatNumber"
                  placeholder="Enter VAT Number"
                  :readonly="FormData.VATExist == 'false'"
                />
              </div>
            </div>
          </div>

          <div class="column is-4">
            <div class="field">
              <label class="label">Approved Till*</label>
              <div class="control">
                <input
                  type="date"
                  class="input"
                  v-model="FormData.approved_till"
                  placeholder=""
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns"></div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" raised>Save</VButton>
    </template>
  </VModal>
</template>

<style lang="scss">
input[readonly] {
  background-color: #f2f2f2;
}
</style>
