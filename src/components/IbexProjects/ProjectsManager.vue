<script lang="ts" setup>
const tab = ref("manager");
onMounted(async () => {});
</script>

<template>
  <div class="columns is-multiline">
    <div class="tabs-wrapper mb-0">
      <div class="tabs is-boxed">
        <ul>
          <li :class="[tab === 'manager' ? 'is-active' : 'not-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'manager'"
              @click="tab = 'manager'"
              ><span>Jobs Manager</span></a
            >
          </li>
          <li :class="[tab === 'foresee' ? 'is-active' : 'not-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'foresee'"
              @click="tab = 'foresee'"
              ><span>Foresee Jobs</span></a
            >
          </li>
        </ul>
      </div>
    </div>

    <div v-if="tab === 'manager'" class="column is-12">
      <ProjectManagerCalendar />
    </div>
    <div v-if="tab === 'foresee'" class="column is-12">
      <ProjectsForeseeCalendar />
    </div>
  </div>
</template>
<style lang="scss">
.fc-day-sat,
.fc-day-sun {
  background-color: #f2f2f2;
}

.fc-event.fc-event-draggable {
  margin-right: 1px;
  border-width: 1px;
  border-radius: 4px;
  height: 100% !important;
  padding: 0.4rem !important;
  p {
    color: #fff;
  }
}
.fc-event {
  margin-bottom: 0px !important;
}
</style>
<style lang="scss" scoped>
.fc-h-event {
  border-width: thick !important;
  border-radius: 2px !important;
  margin-bottom: 1px !important;
}

.avatars {
  display: flex;
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex-direction: row;
  align-items: center;
}

// .avatars:hover .avatars__item {
//   margin-right: 10px;
// }
.avatars__item {
  background-color: #555;
  border: 1px solid var(--primary);
  border-radius: 100%;
  color: #333;
  display: block;
  font-family: sans-serif;
  font-size: 10px;
  font-weight: 100;
  height: 30px;
  width: 30px;
  line-height: 20px;
  text-align: center;
  // transition: margin 0.1s ease-in-out;
  overflow: hidden;
  // transition: all 0.4s ease-in-out;
}
//margin-left: -10px;

.avatars__item > img {
  width: 100%;
}
</style>
<style lang="scss">
.datatable-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &.is-reversed {
    flex-direction: row-reverse;
  }

  .field {
    margin-bottom: 0;

    .control {
      .button {
        color: var(--light-text);

        &:hover,
        &:focus {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--primary--color-invert);
        }
      }
    }
  }

  .buttons {
    margin-left: auto;
    margin-bottom: 0;

    .v-button {
      margin-bottom: 0;
    }
  }
}

.is-dark {
  .datatable-toolbar {
    .field {
      .control {
        .button {
          background: var(--dark-sidebar) !important;
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
            color: var(--smoke-white) !important;
          }
        }
      }
    }
  }
}
</style>
