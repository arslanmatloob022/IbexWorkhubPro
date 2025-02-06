<template>
  <div class="role-management">
    <div
      v-for="section in permissions"
      :key="section.category"
      class="role-section"
    >
      <h3 class="role-category">
        {{ section.category }}
      </h3>
      <table class="role-table">
        <thead>
          <tr>
            <th>
              {{ section.title }}
            </th>
            <th>View</th>
            <th>Add</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in section.items" :key="item.name">
            <td class="pt-5">{{ item.name }}</td>
            <td>
              <VField>
                <VControl raw subcontrol>
                  <VCheckbox v-model="item.view" color="info" />
                </VControl>
              </VField>
            </td>
            <td>
              <VField>
                <VControl raw subcontrol>
                  <VCheckbox v-model="item.add" color="info" />
                </VControl>
              </VField>
            </td>

            <td>
              <VField>
                <VControl raw subcontrol>
                  <VCheckbox v-model="item.edit" color="info" />
                </VControl>
              </VField>
            </td>
            <td>
              <VField>
                <VControl raw subcontrol>
                  <VCheckbox v-model="item.delete" color="info" />
                </VControl>
              </VField>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { defineComponent, reactive } from "vue";

const permissions = reactive([
  {
    category: "Sales",
    title: "Leads",
    model: false,
    items: [
      {
        name: "Assign Salesperson",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        name: "View other Salesperson Leads & Activities",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        name: "Create a Job",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        name: "Export to Excel",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    category: "Project Management",
    model: false,
    title: "Schedule",
    items: [
      {
        name: "Set Baseline",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        name: "Daily logs",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        name: "Assign Users",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        name: "Global - Can see all To-Dos",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    category: "Files",
    model: false,
    title: "Documents",
    items: [
      {
        name: "Access SubVendor and Client Uploads",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        name: "Signature Requests on PDFs",
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
      { name: "Photos", view: false, add: false, edit: false, delete: false },
      { name: "Videos", view: false, add: false, edit: false, delete: false },
    ],
  },
]);
</script>
  
  <style scoped lang="scss">
.role-management {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.role-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.role-category {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.role-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.role-table th,
.role-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;

  text-align: left;
}

.role-table th {
  // background: #f1f1f1;
}
</style>
  