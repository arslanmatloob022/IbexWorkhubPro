import { defineStore } from "pinia";

export const handleItemDrag = defineStore("handleItemDrag", () => {
  const dragItem = ref<number | null>(null);
  const items = ref([]);
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
});
