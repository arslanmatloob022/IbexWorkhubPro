<script setup lang="ts">
import { files } from "/@src/data/layouts/tile-grid-v2";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const notyf = useNotyf();
const api = useApi();
const props = defineProps<{
  leadId?: string;
}>();

const filters = ref("");
const valueSingle = ref(0);
const selectedType = ref("");
const tab = ref("proposal_formats");
const openFileModal = ref(false);
const mergedProposalsList = ref([]);

const filteredData = computed(() => {
  if (!filters.value) {
    return files;
  } else {
    return files.filter((item) => {
      return (
        item.name.match(new RegExp(filters.value, "i")) ||
        item.size.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

const optionsSingle = [
  "All Files",
  "Recently Updated",
  "My Files",
  "Team Files",
  "Deprecated",
];

const openFileUploaderModal = (type: "") => {
  selectedType.value = type;
  openFileModal.value = !openFileModal.value;
};

const getGroupedProposals = async (type: any = "proposal_formats") => {
  try {
    tab.value = type;
    const resp = await api.get(
      `/api/attachment/by-object/${props.leadId}/?type=${type}`
    );
    mergedProposalsList.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

const deleteSelectedDocumentHandler = async (id: any) => {
  try {
    const resp = await api.delete(`/api/attachment/${id}/`);
    notyf.purple("File Deleted Successfully");
    getGroupedProposals();
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getGroupedProposals();
});
</script>

<template>
  <div>
    <div class="tabs-inner">
      <div class="tabs">
        <ul>
          <li :class="[tab === 'proposal_formats' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="getGroupedProposals('proposal_formats')"
              @click="getGroupedProposals('proposal_formats')"
              ><span>Merge Proposals</span></a
            >
          </li>
          <li :class="[tab === 'contracts' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="getGroupedProposals('contracts')"
              @click="getGroupedProposals('contracts')"
              ><span>Contracts</span></a
            >
          </li>
          <li :class="[tab === 'estimates' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="getGroupedProposals('estimates')"
              @click="getGroupedProposals('estimates')"
              ><span>Customer Estimates</span></a
            >
          </li>

          <li :class="[tab === 'jobScope' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'jobScope'"
              @click="tab = 'jobScope'"
              ><span>Job Scope</span></a
            >
          </li>

          <li :class="[tab === 'asbestos' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'asbestos'"
              @click="tab = 'asbestos'"
              ><span>Asbestos & Lead Report</span></a
            >
          </li>
          <li :class="[tab === 'permits' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'permits'"
              @click="tab = 'permits'"
              ><span>Permits</span></a
            >
          </li>
          <li :class="[tab === 'material' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'material'"
              @click="tab = 'material'"
              ><span>Bids & Material</span></a
            >
          </li>
          <li :class="[tab === 'miscellaneous' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'miscellaneous'"
              @click="tab = 'miscellaneous'"
              ><span>Miscellaneous</span></a
            >
          </li>
          <li class="tab-naver" />
        </ul>
      </div>
    </div>
    <div class="tile-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        <VField class="h-hidden-mobile">
          <VControl>
            <Multiselect
              v-model="valueSingle"
              :options="optionsSingle"
              :max-height="145"
              placeholder="Select an option"
            />
          </VControl>
        </VField>
        <VButton @click="openFileUploaderModal(tab)" color="primary" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Add File</span>
        </VButton>
      </div>
    </div>

    <div class="tile-grid tile-grid-v2">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        :class="[filteredData.length !== 0 && 'is-hidden']"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
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
      <div v-if="tab == 'contracts'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div
            v-for="item in mergedProposalsList"
            :key="item.id"
            class="column is-4"
          >
            <DocumentTile
              :document="item"
              @deleteSelectedFile="deleteSelectedDocumentHandler"
            />
          </div>
        </TransitionGroup>
      </div>
      <div v-if="tab == 'estimates'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div v-for="item in filteredData" :key="item.id" class="column is-4">
            <div class="tile-grid-item">
              <div class="tile-grid-item-inner">
                <img
                  :src="item.icon"
                  alt=""
                  @error.once="onceImageErrored(150)"
                />
                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>
                    <span>{{ item.size }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>Updated {{ item.updated }}</span>
                  </span>
                </div>
                <FileTileDropdown />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <div v-if="tab == 'proposal_formats'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <div
            v-for="item in mergedProposalsList"
            :key="item.id"
            class="column is-4"
          >
            <DocumentTile
              :document="item"
              @deleteSelectedFile="deleteSelectedDocumentHandler"
            />
          </div>
        </TransitionGroup>
      </div>
      <div v-if="tab == 'jobScope'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div v-for="item in filteredData" :key="item.id" class="column is-4">
            <div class="tile-grid-item">
              <div class="tile-grid-item-inner">
                <img
                  :src="item.icon"
                  alt=""
                  @error.once="onceImageErrored(150)"
                />
                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>
                    <span>{{ item.size }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>Updated {{ item.updated }}</span>
                  </span>
                </div>
                <FileTileDropdown />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <div v-if="tab == 'asbestos'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div v-for="item in filteredData" :key="item.id" class="column is-4">
            <div class="tile-grid-item">
              <div class="tile-grid-item-inner">
                <img
                  :src="item.icon"
                  alt=""
                  @error.once="onceImageErrored(150)"
                />
                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>
                    <span>{{ item.size }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>Updated {{ item.updated }}</span>
                  </span>
                </div>
                <FileTileDropdown />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <div v-if="tab == 'permits'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div v-for="item in filteredData" :key="item.id" class="column is-4">
            <div class="tile-grid-item">
              <div class="tile-grid-item-inner">
                <img
                  :src="item.icon"
                  alt=""
                  @error.once="onceImageErrored(150)"
                />
                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>
                    <span>{{ item.size }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>Updated {{ item.updated }}</span>
                  </span>
                </div>
                <FileTileDropdown />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <div v-if="tab == 'material'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div v-for="item in filteredData" :key="item.id" class="column is-4">
            <div class="tile-grid-item">
              <div class="tile-grid-item-inner">
                <img
                  :src="item.icon"
                  alt=""
                  @error.once="onceImageErrored(150)"
                />
                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>
                    <span>{{ item.size }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>Updated {{ item.updated }}</span>
                  </span>
                </div>
                <FileTileDropdown />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <div v-if="tab == 'miscellaneous'">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div v-for="item in filteredData" :key="item.id" class="column is-4">
            <div class="tile-grid-item">
              <div class="tile-grid-item-inner">
                <img
                  :src="item.icon"
                  alt=""
                  @error.once="onceImageErrored(150)"
                />
                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>
                    <span>{{ item.size }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>Updated {{ item.updated }}</span>
                  </span>
                </div>
                <FileTileDropdown />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <UploadDocumentModal
      v-if="openFileModal"
      :openFileModal="openFileModal"
      :object="props.leadId"
      :type="selectedType"
      @close:ModalHandler="openFileModal = false"
      @update:OnSuccess="getGroupedProposals"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.tile-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.tile-grid-v2 {
  .tile-grid-item {
    @include vuero-s-card;

    border-radius: 14px;
    padding: 16px;
    cursor: pointer;

    &:hover,
    &:focus {
      border-color: var(--primary);
      box-shadow: var(--light-box-shadow);
    }

    .tile-grid-item-inner {
      display: flex;
      align-items: center;

      > img {
        display: block;
        width: 50px;
        height: 50px;
        min-width: 50px;
      }

      .meta {
        margin-inline-start: 10px;
        line-height: 1.4;

        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            color: var(--dark-text);
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1rem;
          }

          &:nth-child(2) {
            display: flex;
            align-items: center;

            span {
              display: inline-block;
              color: var(--light-text);
              font-size: 0.8rem;
              font-weight: 400;
            }

            .icon-separator {
              position: relative;
              font-size: 4px;
              color: var(--light-text);
              padding: 0 6px;
            }
          }
        }
      }

      .dropdown {
        margin-inline-start: auto;
      }
    }
  }
}

.is-dark {
  .tile-grid {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }

  .tile-grid-v2 {
    .tile-grid-item {
      @include vuero-card--dark;

      &:hover,
      &:focus {
        border-color: var(--primary) !important;
      }
    }
  }
}
</style>
