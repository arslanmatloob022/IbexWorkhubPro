<script setup lang="ts">
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
</script>

<template>
  <div class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Menu</h3>
      </div>

      <ul
        v-if="userSession.user.role == 'manager'"
        class="submenu"
        data-simplebar
      >
        <li>
          <RouterLink to="/sidebar/manager/projects"> My Projects </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/manager/calendar">
            Projects calendar
          </RouterLink>
        </li>
        <li class="divider" />

        <li>
          <RouterLink to="/sidebar/manager/profile"> Profile </RouterLink>
        </li>
      </ul>
      <ul
        v-if="userSession.user.role == 'client'"
        class="submenu"
        data-simplebar
      >
        <li>
          <RouterLink to="/sidebar/client/projects"> My Projects </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/client/calendar">
            Projects calendar
          </RouterLink>
        </li>
        <li class="divider" />

        <li>
          <RouterLink to="/sidebar/client/profile"> Profile </RouterLink>
        </li>
      </ul>
      <ul
        v-if="userSession.user.role == 'worker'"
        class="submenu"
        data-simplebar
      >
        <li>
          <RouterLink to="/sidebar/worker/projects"> My Projects </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/worker/calendar">
            Projects calendar
          </RouterLink>
        </li>
        <li class="divider" />

        <li>
          <RouterLink to="/sidebar/worker/profile"> Profile </RouterLink>
        </li>
      </ul>
      <ul
        v-if="userSession.user.role == 'contractor'"
        class="submenu"
        data-simplebar
      >
        <li>
          <RouterLink to="/sidebar/contractor/projects">
            My Projects
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/contractor/calendar">
            Projects calendar
          </RouterLink>
        </li>
        <li class="divider" />

        <li>
          <RouterLink to="/sidebar/contractor/profile"> Profile </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
