<template>
  <div class="container">
    <h2 class="title">Company Settings</h2>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Company Information</h3>
      </div>
      <div class="card-body">
        <div class="info-row">
          <span class="info-label">Company Name:</span>
          <span class="info-value">{{ company.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Website:</span>
          <span class="info-value">{{ company.website }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value">{{ company.phone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Address:</span>
          <span class="info-value">
            {{ company.address.street }}, {{ company.address.city }},
            {{ company.address.state }} {{ company.address.zipCode }}
          </span>
        </div>
        <button class="edit-button" @click="smallFormOpen = true">Edit</button>
      </div>
    </div>

    <VModal
      is="form"
      :open="smallFormOpen"
      title="Edit Company Information"
      size="small"
      actions="right"
      @submit.prevent="handleSubmit"
      @close="smallFormOpen = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="field">
            <label>Company Name *</label>
            <div class="control">
              <input
                v-model="formData.name"
                type="text"
                class="input"
                placeholder="Company Name"
                required
              />
            </div>
          </div>
          <div class="field">
            <label>Website *</label>
            <div class="control">
              <input
                v-model="formData.website"
                type="url"
                class="input"
                placeholder="Website"
              />
            </div>
          </div>
          <div class="field">
            <label>Phone *</label>
            <div class="control">
              <input
                v-model="formData.phone"
                type="tel"
                class="input"
                placeholder="Phone"
              />
            </div>
          </div>
          <div class="field">
            <label>Street Address *</label>
            <div class="control">
              <input
                v-model="formData.address.street"
                type="text"
                class="input"
                placeholder="Street Address"
              />
            </div>
          </div>
          <div class="field">
            <label>City *</label>
            <div class="control">
              <input
                v-model="formData.address.city"
                type="text"
                class="input"
                placeholder="City"
              />
            </div>
          </div>
          <div class="field">
            <label>State *</label>
            <div class="control">
              <input
                v-model="formData.address.state"
                type="text"
                class="input"
                placeholder="State"
              />
            </div>
          </div>
          <div class="field">
            <label>Zip Code *</label>
            <div class="control">
              <input
                v-model="formData.address.zipCode"
                type="text"
                class="input"
                placeholder="Zip Code"
              />
            </div>
          </div>
        </div>
      </template>
      <template #action>
        <VButton type="submit" color="primary" raised>Save Changes</VButton>
      </template>
    </VModal>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const smallFormOpen = ref(false);

    const company = reactive({
      name: "ABC Corp",
      website: "https://example.com",
      phone: "123-456-7890",
      address: {
        street: "123 Main St",
        city: "Evergreen",
        state: "CO",
        zipCode: "80437-0242",
      },
    });

    const formData = reactive({ ...company });

    const handleSubmit = () => {
      Object.assign(company, formData);
      smallFormOpen.value = false;
    };

    return { company, smallFormOpen, formData, handleSubmit };
  },
});
</script>
  
  <style scoped>
.container {
  margin: 20px auto;
  max-width: 800px;
  font-family: "Arial", sans-serif;
}

.title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.card {
  background: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  background: #4caf50;
  padding: 15px;
  color: #fff;
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.info-label {
  font-weight: bold;
  color: #555;
}

.info-value {
  color: #333;
}

.edit-button {
  margin-top: 20px;
  display: inline-block;
  padding: 10px 15px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-button:hover {
  background: #45a049;
}

/* Modal Styling */
.modal-form .field {
  margin-bottom: 15px;
}

.modal-form .field label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.modal-form .field .input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-form .field .textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
  