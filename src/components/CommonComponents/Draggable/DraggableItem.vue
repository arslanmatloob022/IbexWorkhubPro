<script lang="ts" setup>
import { ref } from "vue";

interface Item {
  id: number;
  name: string;
  description: string;
}

const items = ref<Item[]>([
  { id: 1, name: "Item 1", description: "Description 1" },
  { id: 2, name: "Item 2", description: "Description 2" },
  { id: 3, name: "Item 3", description: "Description 3" },
  { id: 4, name: "Item 4", description: "Description 4" },
  { id: 5, name: "Item 5", description: "Description 5" },
  { id: 6, name: "Item 6", description: "Description 6" },
  { id: 7, name: "Item 7", description: "Description 7" },
  { id: 8, name: "Item 8", description: "Description 8" },
  { id: 9, name: "Item 9", description: "Description 9" },
  { id: 10, name: "Item 10", description: "Description 10" },
]);

const dragItem = ref<number | null>(null);

const handleDragStart = (index: number) => {
  dragItem.value = index;
};

const handleDrop = (index: number) => {
  if (dragItem.value !== null && dragItem.value !== index) {
    const draggedItem = items.value[dragItem.value];
    items.value.splice(dragItem.value, 1);
    items.value.splice(index, 0, draggedItem);
  }
  dragItem.value = null;
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};
</script>

<template>
  <div>
    <h2>Draggable List</h2>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="item.id"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @drop="() => handleDrop(index)"
        @dragover="handleDragOver"
        class="draggable-item"
      >
        <div>
          <strong>{{ item.name }}</strong
          >: {{ item.description }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.draggable-item {
  padding: 10px;
  margin: 5px 0;
  background: #f9f9f9;
  border: 1px solid #ccc;
  cursor: grab;
}

.draggable-item:active {
  cursor: grabbing;
}
</style>
