<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  data() {
    return {
      rows: [
        {
          id: 1,
          order: 1,
          name: "Item 1",
          desc: "The sample of the description",
          note: "nOtes",
        },
        {
          id: 2,
          order: 2,
          name: "Item 2",
          desc: "The sample of the description",
          note: "nOtes",
        },
        {
          id: 3,
          order: 3,
          name: "Item 3",
          desc: "The sample of the description",
          note: "nOtes",
        },
      ],
    };
  },
  methods: {
    onDragEnd(event) {
      // Adjust the order values based on the new order
      this.rows.forEach((row, index) => {
        row.order = index + 1;
      });
      console.log("Rows reordered:", this.rows);
    },
  },
};
</script>

<template>
  <div class="table-container">
    <table class="styled-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Name</th>
          <th>Description</th>
          <th>Notes</th>
        </tr>
      </thead>
      <draggable tag="tbody" :list="rows" item-key="id" @end="onDragEnd">
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.order }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.desc }}</td>
          <td>{{ row.note }}</td>
        </tr>
      </draggable>
    </table>
  </div>
</template>

<style lang="css" scoped>
.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table th,
.styled-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.styled-table tr {
  cursor: move; /* Visual cue for drag-and-drop */
}

.styled-table tr.dragging {
  background-color: #f0f8ff;
  opacity: 0.6;
}
</style>
