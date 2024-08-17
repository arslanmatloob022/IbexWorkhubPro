<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { CreateActivityLog } from '/@src/composable/useSupportElement'
const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const showInput = ref(true);
const hoveredIndex = ref(null);
const showNoteInput = ref(false);
const openCross = ref(false);
const newNote = ref("");
const notes = ref([
  {
    id: 0,
    content: "",
    created_at: "",
    created_by: {
      first_name: "",
      last_name: "",
    },
  },
]);

const props = defineProps({
  id: {
    type: String,
    default: 0
  },
  worker: {
    type: Object,
    default: {}
  }
})

// notes functions
const showCross = (index: any) => {
  openCross.value = true;
  hoveredIndex.value = index;
};
const hideCross = () => {
  openCross.value = false;
};
const toggleNoteInput = () => {
  showNoteInput.value = !showNoteInput.value;
};
const addNote = async () => {
  if (newNote.value) {
    try {
      let payload = { content: newNote.value, worker: props.id };
      newNote.value = "";
      const resp = await api.post("/v3/api/worker/notes/", payload);
      notes.value.push(resp.data);
      getWorkerNotes();
      CreateActivityLog({message:'added a <b>comment</b>', objectId : route.params.id, method: "post" });
      notyf.success("note added");
    } catch (err) {
      console.log(err)
    }
  }
};

const deleteNote = async (noteIdtoDel: number) => {
  try {
    const index = notes.value.findIndex((note) => note.id === noteIdtoDel);
    if (index !== -1) {
      notes.value.splice(index, 1);
    }
    const resp = await api.delete(`/v3/api/worker/notes/${noteIdtoDel}`);
    CreateActivityLog({message:'deleted a <b>comment</b>', objectId : route.params.id, method: "delete" })
    notyf.warning("note deleted");
    getWorkerNotes()
  } catch (err) {
    console.log(err)
  }
};

const getWorkerNotes = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/notes/${props.id}/notes-worker/`
    );
    console.log(response.data)
    notes.value = response.data ?? [];
  } catch (error) {
    console.error("ok", error);
  }
};

onMounted(() => {
  getWorkerNotes()
})
</script>
<template>
  <div class="section-title">
    <h4>Comments</h4>
      <button @click="toggleNoteInput" class="add-btn">
        <i class="fas fa-plus" aria-hidden="true" style="color: var(--primary-light-12); font-size: 9px"></i>
        Add
      </button>
  </div>
  <div class="section-content">
    <div class="network-notifications">
      
      <VTag v-if="notes.length == 0" color="solid" label="No comments are available." rounded />
      <div v-if="showNoteInput" class="noteInput">
        <VField>
          <VControl icon="lnil lnil-plus">
            <VInput  @blur="addNote" v-model="newNote" @keyup.enter="() => {
              addNote();
            }
              " placeholder="Enter Comment" v-if="showInput" type="text" />
          </VControl>
        </VField>
        <VField style="display: flex; align-items: center; justify-content: flex-end; ">
          <VButton color="primary" outlined @click="() => { if (newNote.length > 0) addNote(); }">Save</VButton>
        </VField>
      </div>
      <div class="noteBlock" v-for="(note, id) in notes" :key="note.id" data-cy="dark-mode-toggle"
        @mouseover="showCross(id)" @mouseleave="hideCross">
        <div class="noteContent">
          <p>{{ note.content }}</p>
          <p>
            {{
              note.created_by.first_name &&
              note.created_by.first_name
            }}
            {{
              note.created_by.last_name &&
              note.created_by.last_name
            }}
            |
            {{
              note.created_at && note.created_at.slice(0, 10)
            }}
          </p>
        </div>
        <!--  -->
        <button v-if="openCross && hoveredIndex === id" class="DelBtn" elevated @click="deleteNote(note.id)">
          <i style="color: #2db998" class="lnir lnir-close"></i>
        </button>
      </div>
      
      <!-- <p>
              Enable or disable this setting to manage if your network should be
              notified when you make changes to your profile.
            </p> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.section-title {
  display: flex;
  justify-content: space-between;
}

.DelBtn {
  position: absolute;
  height: min-content;
  right:2px;
  top:0;
  padding: 4px;
  border: none;
  background-color: transparent;
  margin-top: 4px;
  cursor: pointer;
}

.noteInput {
  margin: 12px 0;
}

.noteBlock {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 2px 8px;
  padding-right: 20px;
  border-radius: 5px;
  margin-bottom: 6px;
  background-color: rgba(226, 216, 216, 0.15);
  transition: all ease-in-out 0.3s;
  .noteContent {
    display: flex;
    flex-direction: column;

    p:first-child {
      color: rgb(75, 75, 75);
      font-weight: 400;
    }
  }

  p {
    color: rgb(95, 95, 95, 0.8);
    font-weight: 400;
    margin-top: 4px;
  }

  &:hover {
   box-shadow: 0 0 2px 6px #f8f8f8;
  }
}

.add-btn {
  cursor: pointer;
  border: none;
  color: var(--primary-light-10);
  background-color: transparent;
  height: min-content;
  font-weight: 500;
  display: flex;
  align-items: center;
}
</style>