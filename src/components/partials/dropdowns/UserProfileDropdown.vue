<script setup lang="ts">
import { useUserSession } from "/@src/stores/userSession";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";

const userSession = useUserSession();
const router = useRouter();
const layoutSwitcher = useLayoutSwitcher();
async function logout() {
  userSession.logoutUser();
  await router.push({ path: '/' })
  router.go(0)
}
</script>

<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a role="button" tabindex="0" class="is-trigger dropdown-trigger" aria-haspopup="true"
        @keydown.space.prevent="toggle" @click="toggle">
        <VAvatar :picture="userSession.user && userSession.user.profileImage
          ? userSession.user.profileImage
          : '/images/avatars/svg/vuero-1.svg'
          " />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar size="large" :picture="userSession.user && userSession.user.profileImage
          ? userSession.user.profileImage
          : '/images/avatars/svg/vuero-1.svg'
          " />

        <div style="
          display: flex !important;
          flex-direction: column !important;
          margin-left: 10px !important;
          ">
          <span>{{ userSession.user && userSession.user.first_name }}
            {{ userSession.user && userSession.user.last_name }}</span>
          <span style="color: var(--light-text)">{{
            userSession.user && userSession.user.jobPosition
          }}</span>
        </div>
      </div>

      <RouterLink to="/sidebar/profile" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-user-alt" />
        </div>
        <div class="meta">
          <span>Profile</span>
          <span>View your profile</span>
        </div>
      </RouterLink>

      <a href="#" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-briefcase" />
        </div>
        <div class="meta">
          <span>Projects</span>
          <span>All my projects</span>
        </div>
      </a>

      <a href="#" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-users-alt"></i>
        </div>
        <div class="meta">
          <span>Team</span>
          <span>Manage your team</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <a role="menuitem" class="dropdown-item is-media" @click="()=>{$router.push('/sidebar/company/settings')}">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-cog" />
        </div>
        <div class="meta">
          <span>Settings</span>
          <span>Company settings</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <div class="dropdown-item is-button">
        <VButton class="logout-button" icon="feather:log-out" color="primary" role="menuitem" raised fullwidth
          @click="logout">
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
<style scoped>
.cus-meta {
  display: flex !important;
  flex-direction: column !important;
}
</style>

