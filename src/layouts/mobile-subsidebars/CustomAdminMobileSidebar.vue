<template>
  <div class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Menu</h3>
      </div>

      <ul class="submenu" data-simplebar>
        <li>
          <RouterLink to="/sidebar/dashboard"> Dashboard </RouterLink>
        </li>

        <VCollapseLinks>
          <template #header>
            Projects
            <i
              aria-hidden="true"
              class="iconify rtl-hidden"
              data-icon="feather:chevron-right"
            />
            <i
              aria-hidden="true"
              class="iconify ltr-hidden"
              data-icon="feather:chevron-left"
            />
          </template>

          <RouterLink to="/sidebar/dashboard/projects" class="is-submenu">
            <i class="lnir lnir-list-alt" aria-hidden="true"></i>
            <span>All Projects</span>
          </RouterLink>
          <RouterLink
            to="/sidebar/dashboard/manage-projects"
            class="is-submenu"
          >
            <i class="lnir lnir-appointment" aria-hidden="true"></i>
            <span>Manage Projects</span>
          </RouterLink>
          <RouterLink to="/sidebar/dashboard/workers-tasks" class="is-submenu">
            <i class="lnir lnir-calendar" aria-hidden="true"></i>
            <span>Workers chart</span>
          </RouterLink>
          <RouterLink
            to="/sidebar/dashboard/completed-projects"
            class="is-submenu"
          >
            <i class="lnir lnir-list" aria-hidden="true"></i>
            <span>Completed Projects</span>
          </RouterLink>
        </VCollapseLinks>

        <li>
          <RouterLink to="/sidebar/dashboard/managers"> Managers </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/dashboard/contractors">
            Contractors
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/dashboard/subcontractors">
            Sub Contractors
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/dashboard/workers"> Workers </RouterLink>
        </li>

        <li>
          <RouterLink to="/sidebar/dashboard/clients"> Clients </RouterLink>
        </li>

        <li class="divider" />

        <VCollapseLinks>
          <template #header>
            Finance
            <i
              aria-hidden="true"
              class="iconify rtl-hidden"
              data-icon="feather:chevron-right"
            />
            <i
              aria-hidden="true"
              class="iconify ltr-hidden"
              data-icon="feather:chevron-left"
            />
          </template>

          <RouterLink to="/sidebar/dashboard/create-payment" class="is-submenu">
            <i class="lnir lnir-paypal" aria-hidden="true"></i>
            <span>Create Payment</span>
          </RouterLink>
          <RouterLink
            to="/sidebar/dashboard/received-payments"
            class="is-submenu"
          >
            <i class="lnir lnir-invest-monitor" aria-hidden="true"></i>
            <span>All Payments</span>
          </RouterLink>
          <RouterLink
            to="/sidebar/dashboard/approved-payments"
            class="is-submenu"
          >
            <i class="lnir lnir-diagnosis-alt" aria-hidden="true"></i>
            <span>Approved Payments </span>
          </RouterLink>
        </VCollapseLinks>

        <li class="divider" />
        <li>
          <RouterLink to="/sidebar/dashboard/profile"> Profile </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
