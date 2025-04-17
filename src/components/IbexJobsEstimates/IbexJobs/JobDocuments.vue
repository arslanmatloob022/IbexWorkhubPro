<script setup lang="ts">
import { files } from "/@src/data/layouts/tile-grid-v2";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import JobFolders from "./JobDocuments/JobFolders.vue";

const notyf = useNotyf();
const api = useApi();
const props = defineProps<{
  leadId?: string;
  uploaded_files?: any;
}>();

const filters = ref("");
const valueSingle = ref(0);
const selectedType = ref("");
const tab = ref("contracts");
const openFileModal = ref(false);
const mergedProposalsList = ref([]);
const mainTab = ref("documents");
const photoTab = ref("site_visits");
const videoTab = ref("job_videos");

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

const emits = defineEmits<{
  (emit: "getProjectInfo", value: any): void;
  (emit: "updateOnSuccess", value: any): void;
}>();

const getProject = () => {
  emits("getProjectInfo", null);
};

const openFileUploaderModal = (type: "") => {
  selectedType.value = type;
  openFileModal.value = !openFileModal.value;
};

const getGroupedProposals = async (type: any = "contracts") => {
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

const folderType = ref("");
const openCreateFolderModal = ref(false);
const documentsFoldersList = ref([]);
const photosFoldersList = ref([]);
const videosFoldersList = ref([]);
const addFolderHandler = (type: string = "") => {
  folderType.value = type;
  openCreateFolderModal.value = !openCreateFolderModal.value;
};

const getMediaFolders = async (type: any = "") => {
  try {
    const resp = await api.get(
      `/api/media-folder/?object=${props.leadId}&type=${type}`
    );
    if (type === "documents") {
      documentsFoldersList.value = resp.data;
    } else if (type === "photos") {
      photosFoldersList.value = resp.data;
    } else if (type === "videos") {
      videosFoldersList.value = resp.data;
    }
  } catch (err) {
    console.log(err);
  }
};

const updateOnSuccessHandler = () => {
  getAllFolders();
  emits("updateOnSuccess", null);
};

const getAllFolders = (type: any = "documents") => {
  if (type === "documents") {
    getMediaFolders("documents");
  } else if (type === "photos") {
    getMediaFolders("photos");
  } else if (type === "videos") {
    getMediaFolders("videos");
  }
};

onMounted(() => {
  getGroupedProposals();
  getAllFolders("documents");
});
</script>

<template>
  <div>
    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-boxed">
          <ul>
            <li :class="[mainTab === 'documents' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="mainTab = 'documents'"
                @click="
                  mainTab = 'documents';
                  getAllFolders('documents');
                "
                ><span>Documents</span></a
              >
            </li>
            <li :class="[mainTab === 'photos' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="mainTab = 'photos'"
                @click="
                  mainTab = 'photos';
                  getAllFolders('photos');
                "
                ><span>Photos</span></a
              >
            </li>
            <li :class="[mainTab === 'videos' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="mainTab = 'videos'"
                @click="
                  mainTab = 'videos';
                  getAllFolders('videos');
                "
                ><span>Videos</span></a
              >
            </li>

            <li class="tab-naver" />
          </ul>
        </div>
      </div>
    </div>

    <div v-if="mainTab == 'documents'">
      <!-- <NewJobFolders type="documents" :objectId="props.leadId" /> -->
      <!-- <JobFolders type="documents" :object="props.leadId"></JobFolders> -->
      <div class="tabs-wrapper">
        <div class="tabs-inner">
          <div class="tabs">
            <ul>
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

              <li :class="[tab === 'job_scope' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'job_scope'"
                  @click="tab = 'job_scope'"
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
              <li :class="[tab === 'files' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals('files')"
                  @click="getGroupedProposals('files')"
                  ><span>Uploaded Files</span></a
                >
              </li>
              <li :class="[tab === 'calculations' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals('calculations')"
                  @click="getGroupedProposals('calculations')"
                  ><span>Calculations</span></a
                >
              </li>
              <li
                v-for="item in documentsFoldersList"
                :key="item.id"
                :class="[tab === item.title && 'is-active']"
              >
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals(item.title)"
                  @click="getGroupedProposals(item.title)"
                  ><span>{{ item.title }}</span></a
                >
              </li>
              <li class="is-cus-active">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="addFolderHandler('documents')"
                  @click="addFolderHandler('documents')"
                  ><span>
                    <i class="fas fa-folder-plus"></i>

                    Folder</span
                  ></a
                >
              </li>

              <li class="tab-naver" />
            </ul>
          </div>
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
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="contracts"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'estimates'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="estimates"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'proposal_formats'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="proposal_formats"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'job_scope'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="job_scope"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'asbestos'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="asbestos"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'permits'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="permits"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'material'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="material"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'miscellaneous'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('documents')"
            doc-type="miscellaneous"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="tab == 'files'">
          <ProjectFiles
            :projectId="props.leadId"
            :files="props.uploaded_files"
            @update:on-upload-file="getProject"
          />
        </div>
        <div v-if="tab == 'calculations'">
          <ExcelSheetComponent :object-id="props.leadId" />
        </div>
        <div v-for="item in documentsFoldersList" :key="item.id">
          <div v-if="tab == item.title">
            <ObjectDocumentsTiles
              @deleteFolderUpdate="getAllFolders('documents')"
              :doc-type="item.title"
              :object-id="props.leadId"
              :folderId="item.id"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="mainTab == 'photos'">
      <div class="tabs-wrapper">
        <div class="tabs-inner">
          <div class="tabs">
            <ul>
              <li :class="[photoTab === 'site_visits' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals('site_visits')"
                  @click="
                    getGroupedProposals('site_visits');
                    photoTab = 'site_visits';
                  "
                  ><span>Site Visit Photos</span></a
                >
              </li>
              <li :class="[photoTab === 'inspiration_photos' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="
                    getGroupedProposals('inspiration_photos')
                  "
                  @click="
                    getGroupedProposals('inspiration_photos');
                    photoTab = 'inspiration_photos';
                  "
                  ><span>Inspiration Photos</span></a
                >
              </li>

              <li :class="[photoTab === 'trade_photos' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals('trade_photos')"
                  @click="
                    getGroupedProposals('trade_photos');
                    photoTab = 'trade_photos';
                  "
                  ><span>Trade Photos</span></a
                >
              </li>
              <li :class="[photoTab === 'design_approval' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="
                    getGroupedProposals('design_approval')
                  "
                  @click="
                    getGroupedProposals('design_approval');
                    photoTab = 'design_approval';
                  "
                  ><span>Design Approval Photos</span></a
                >
              </li>
              <li
                v-for="item in photosFoldersList"
                :key="item.id"
                :class="[photoTab === item.title && 'is-active']"
              >
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals(item.title)"
                  @click="
                    getGroupedProposals(item.title);
                    photoTab = item.title;
                  "
                  ><span>{{ item.title }}</span></a
                >
              </li>
              <li class="is-cus-active">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="addFolderHandler('photos')"
                  @click="addFolderHandler('photos')"
                  ><span>
                    <i class="fas fa-plus"></i>

                    Folder</span
                  ></a
                >
              </li>

              <li class="tab-naver" />
            </ul>
          </div>
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
        <div v-if="photoTab == 'site_visits'">
          <ObjectPhotosCard
            @deleteFolderUpdate="getAllFolders('photos')"
            doc-type="site_visits"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="photoTab == 'inspiration_photos'">
          <ObjectPhotosCard
            @deleteFolderUpdate="getAllFolders('photos')"
            doc-type="inspiration_photos"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="photoTab == 'trade_photos'">
          <ObjectPhotosCard
            @deleteFolderUpdate="getAllFolders('photos')"
            doc-type="trade_photos"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="photoTab == 'design_approval'">
          <ObjectPhotosCard
            @deleteFolderUpdate="getAllFolders('photos')"
            doc-type="design_approval"
            :object-id="props.leadId"
          />
        </div>
        <div v-for="item in photosFoldersList" :key="item.id">
          <div v-if="photoTab == item.title">
            <ObjectPhotosCard
              @deleteFolderUpdate="getAllFolders('photos')"
              :doc-type="item.title"
              :object-id="props.leadId"
              :folderId="item.id"
              :showFolderDeleteBtn="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="mainTab == 'videos'">
      <div class="tabs-wrapper">
        <div class="tabs-inner">
          <div class="tabs">
            <ul>
              <li :class="[videoTab === 'job_videos' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals('job_videos')"
                  @click="
                    videoTab = 'job_videos';
                    getGroupedProposals('job_videos');
                  "
                  ><span>Job videos</span></a
                >
              </li>
              <li :class="[videoTab === 'other_videos' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals('other_videos')"
                  @click="
                    videoTab = 'other_videos';
                    getGroupedProposals('other_videos');
                  "
                  ><span>Other videos</span></a
                >
              </li>

              <li
                v-for="item in videosFoldersList"
                :key="item.id"
                :class="[videoTab === item.title && 'is-active']"
              >
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="getGroupedProposals(item.title)"
                  @click="
                    getGroupedProposals(item.title);
                    videoTab = item.title;
                  "
                  ><span>{{ item.title }}</span></a
                >
              </li>
              <li class="is-cus-active">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="addFolderHandler('videos')"
                  @click="addFolderHandler('videos')"
                  ><span>
                    <i class="fas fa-plus"></i>

                    Folder</span
                  ></a
                >
              </li>
              <li class="tab-naver" />
            </ul>
          </div>
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
        <div v-if="videoTab == 'job_videos'">
          <ObjectDocumentsTiles
            @deleteFolderUpdate="getAllFolders('videos')"
            doc-type="job_videos"
            :object-id="props.leadId"
          />
        </div>
        <div v-if="videoTab == 'other_videos'">
          <ObjectDocumentsTiles
            doc-type="other_videos"
            :object-id="props.leadId"
            @deleteFolderUpdate="getAllFolders('videos')"
          />
        </div>
        <div v-for="item in videosFoldersList" :key="item.id">
          <div v-if="videoTab == item.title">
            <ObjectDocumentsTiles
              :doc-type="item.value"
              :object-id="props.leadId"
              :folderId="item.id"
              @deleteFolderUpdate="getAllFolders('videos')"
            />
          </div>
        </div>
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
    <CreateFolderModal
      v-if="openCreateFolderModal"
      :open-create-folder-modal="openCreateFolderModal"
      :type="folderType"
      :object="props.leadId"
      @update:modal-handler="openCreateFolderModal = false"
      @update:on-success="getAllFolders(folderType)"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.is-cus-active {
  a {
    border-bottom: 3px solid !important;
    background-color: rgb(230, 247, 255);
    border-bottom-color: var(--info) !important;
    color: var(--info) !important;
  }
}

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
