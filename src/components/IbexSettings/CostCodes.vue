<script setup lang="ts">
const filters = ref("");

const users = [{}];
const openCostCodeModal = ref(false);
const openCategoryModal = ref(false);
const filteredData = computed(() => {
  if (!filters.value) {
    return users;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return users.filter((item) => {
      return item.username?.match(filterRe) || item.location?.match(filterRe);
    });
  }
});
</script>

<template>
  <div>
    <div class="list-flex-toolbar flex-list-v1">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <VButtons>
        <VButton
          color="primary"
          @click="openCostCodeModal = !openCostCodeModal"
          icon="fas fa-plus"
          elevated
        >
          Cost Code
        </VButton>
        <VButton
          @click="openCategoryModal = !openCategoryModal"
          color="info"
          icon="fas fa-plus"
          elevated
        >
          Category
        </VButton>
      </VButtons>
    </div>

    <div class="page-content-inner"></div>
    <CostCodeModal
      v-if="openCostCodeModal"
      :addUpdateCostCodeModal="openCostCodeModal"
      @update:modal-handler="openCostCodeModal = false"
    />
    <CodeCategoryModal
      v-if="openCategoryModal"
      :addUpdateCategoryModal="openCategoryModal"
      @update:modal-handler="openCategoryModal = false"
    />
  </div>
</template>

<style lang="scss">
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    width: 100%;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
