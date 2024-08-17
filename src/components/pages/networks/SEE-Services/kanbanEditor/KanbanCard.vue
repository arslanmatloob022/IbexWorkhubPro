<script setup lang="ts">
import "dragula/dist/dragula.css";

const router = useRouter();
const props = defineProps<{
  tasks: {
    type: Array;
    default: [];
  };
}>();
const gotoJob = (jobId: any) => {
  router.push({
    name: "/sidebar/company/jobs/[id]",
    params: { id: jobId },
  });
};

onMounted(() => {});
</script>
<template>
  <div
    v-for="task in props.tasks"
    :key="task.id"
    class="kanban-card gelatine cu-pointer"
    :data-id="task.id"
    @click="gotoJob(task.id)"
  >
    <div class="card-body">
      <div
        class="mb-2"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <p class="card-title">
          <span class="light-text">#</span> 00{{ task.id }}
        </p>
        <VTag>Ext-ID: {{ task.externalId ? task.externalId : "" }}</VTag>
      </div>
      <div class="is-flex">
        <h4 class="card-title">
          {{ task.title ? task.title : "" }}
        </h4>
        <VAvatar
          :picture="task && task.cuCompanyLogo ? task.cuCompanyLogo : ''"
        ></VAvatar>
      </div>
      <div
        v-if="task.manager"
        class="mt-3"
        style="background-color: #05d69e09; padding: 2px; border-radius: 3px"
      >
        <div class="is-flex">
          <VAvatar
            :picture="
              task.managerInfo && task.managerInfo.profileImage
                ? task.managerInfo.profileImage
                : ''
            "
          ></VAvatar>
          <div class="ml-2">
            <p class="card-title">
              {{
                task.managerInfo && task.managerInfo.first_name
                  ? task.managerInfo.first_name
                  : ""
              }}
              {{
                task.managerInfo && task.managerInfo.last_name
                  ? task.managerInfo.last_name
                  : ""
              }}
            </p>
            <p class="cus-light-text">
              {{
                task.managerInfo && task.managerInfo.email
                  ? task.managerInfo.email
                  : ""
              }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="task.site"
        class="mt-4"
        style="background-color: #05d69e09; padding: 2px; border-radius: 3px"
      >
        <p class="card-title">
          <span class="light-text"> Site: </span>
        </p>
        <p class="card-title">
          {{ task?.siteInfo?.name }}
        </p>
        <p class="cus-light-text">
          {{
            task.siteInfo && task.siteInfo.postcode
              ? task.siteInfo.postcode
              : ""
          }}
          ({{ task.siteInfo && task.siteInfo.city ? task.siteInfo.city : "" }})
        </p>
        <p class="cus-light-text">
          {{
            task.siteInfo && task.siteInfo.address ? task.siteInfo.address : ""
          }}
        </p>
      </div>

      <div class="kanban-card-stats">
        <span>
          <p>Assigned Workers</p>
          <i aria-hidden="true" class="iconify" data-icon="feather:clock"></i>
          {{ task.createdAt.slice(0, 10) }}
        </span>

        <VAvatarStack size="small" :avatars="task.workerPics" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
