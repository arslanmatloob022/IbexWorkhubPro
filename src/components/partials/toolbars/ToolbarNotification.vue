<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { onceImageErrored } from '/@src/utils/via-placeholder'

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)
</script>

<template>
  <div class="toolbar-notifications is-hidden-mobile">
    <div
      ref="dropdownElement"
      class="dropdown is-spaced is-dots is-right dropdown-trigger"
    >
      <div
        tabindex="0"
        class="is-trigger"
        aria-haspopup="true"
        @click="dropdown.toggle"
        @keydown.space.prevent="dropdown.toggle"
      >
        <i
          aria-hidden="true"
          class="iconify"
          data-icon="feather:bell"
        />
        <span class="new-indicator pulsate" />
      </div>
      <div
        class="dropdown-menu"
        role="menu"
      >
        <div class="dropdown-content">
          <div class="heading">
            <div class="heading-left">
              <h6 class="heading-title">
                Notifications
              </h6>
            </div>
            <div class="heading-right">
              <RouterLink
                class="notification-link"
                to="/sidebar/layouts/profile-notifications"
              >
                See all
              </RouterLink>
            </div>
          </div>
          <ul class="notification-list">
            <li>
              <a class="notification-item">
                <div class="img-left">
                  <img
                    class="user-photo"
                    alt=""
                    src="/demo/avatars/7.jpg"
                    @error.once="onceImageErrored(150)"
                  >
                </div>
                <div class="user-content">
                  <p class="user-info">
                    <span class="name">Alice C. hlo</span> left a comment.
                  </p>
                  <p class="time">1 hour ago</p>
                </div>
              </a>
            </li>
            <li>
              <a class="notification-item">
                <div class="img-left">
                  <img
                    class="user-photo"
                    alt=""
                    src="/demo/avatars/12.jpg"
                    @error.once="onceImageErrored(150)"
                  >
                </div>
                <div class="user-content">
                  <p class="user-info">
                    <span class="name">Joshua S.</span> uploaded a file.
                  </p>
                  <p class="time">2 hours ago</p>
                </div>
              </a>
            </li>
            <li>
              <a class="notification-item">
                <div class="img-left">
                  <img
                    class="user-photo"
                    alt=""
                    src="/demo/avatars/13.jpg"
                    @error.once="onceImageErrored(150)"
                  >
                </div>
                <div class="user-content">
                  <p class="user-info">
                    <span class="name">Tara S.</span> sent you a message.
                  </p>
                  <p class="time">2 hours ago</p>
                </div>
              </a>
            </li>
            <li>
              <a class="notification-item">
                <div class="img-left">
                  <img
                    class="user-photo"
                    alt=""
                    src="/demo/avatars/25.jpg"
                    @error.once="onceImageErrored(150)"
                  >
                </div>
                <div class="user-content">
                  <p class="user-info">
                    <span class="name">Melany W.</span> left a comment.
                  </p>
                  <p class="time">3 hours ago</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
