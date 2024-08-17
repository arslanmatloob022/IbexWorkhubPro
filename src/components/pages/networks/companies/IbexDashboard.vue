<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useThemeColors } from "/@src/composable/useThemeColors";
import { useCompany } from "/@src/stores/company";
import { ref, onMounted, shallowRef, watch } from "vue";
const api = useApi();
const themeColors = useThemeColors();

onMounted(() => {});
</script>

<template>
  <div class="business-dashboard company-dashboard">
    <p>dashboard</p>
  </div>
</template>
<style lang="scss" scoped></style>
