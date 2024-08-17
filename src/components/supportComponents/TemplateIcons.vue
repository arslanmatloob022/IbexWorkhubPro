<script setup lang="ts">
import { useElements } from "/@src/stores/supportElements"
const elements = useElements();
const loading = ref(false);
const iconId = ref('');

onMounted(() => {
    elements.loadIcons()
})
</script>
<template>
    <div style="z-index:10000">
            <VModal :open="elements.isOpenTemplateModal" title="Select icon" size="big" actions="right"
                @close="elements.closeTemplateModal">
                <template #content>
                    <div class="modal-form columns is-multiline">
                        <div class="field column is-12 mb-0">
                            <VField>
                                <VControl>
                                    <div class="indutryOptions">
                                        <div class="options" v-for="(item, index) in elements.templateIcons" :key="index">
                                            <img @click="() => {
                                                elements.setIcon(item);
                                                iconId = item.id
                                            }" :class="iconId == item.id ? 'cus-img' : ''" :src="item.icon" />
                                            <p>{{ item.title.length<8? item.title: `${item.title.slice(0, 8)}... ` }}</p>
                                        </div>
                                    </div>
                                </VControl>
                            </VField>
                            <VField id="interests" class="p-0" label=""> </VField>
                        </div>
                    </div>
                </template>
                <template #action>
                    <VButton color="primary" style="display:none" :loading="loading" raised>
                        Select</VButton>
                </template>
                <template #cancel>
                    <VButton style="display:none" @click="elements.closeTemplateModal" raised>Close</VButton>
                </template>
            </VModal>
        </div>
</template>
<style lang="scss" scoped>
#cus-invitation-tools {
    width: 100%;
    display: flex !important;
    align-items: center !important;
    margin-bottom: 14px;
    gap: 12px;
}

.cus-active-link {
    color: var(--primary) !important;
    font-weight: 500 !important;
}

.cus-dropdown-head {
    display: flex !important;
}

.cus-img {
    width: 70px;
    height: 70px;
    border-radius: 6px;
    border: 2px solid var(--primary);
}

.indutryOptions {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .options {
        width: 80px;
        height: 80px;
        cursor: pointer;
        color: aliceblue;
        display: flex;
        gap: 6px;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
            width: 50px;
            height: 50px;
            border-radius: 12px;
        }

        p {
            font-weight: 500;
        }
    }

    .cus-selected {
        img {
            border: 3px solid var(--primary);
        }
        p {
            font-weight: 600;
            color: var(--primary);
        }
    }
}
</style>