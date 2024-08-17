<!-- SweetAlert.vue -->

<script setup lang="ts">

const props = defineProps({
  isSweetAlertOpen: {
    type: Boolean,
    default: false,
  },
  btntext: {
    type: String,
    default: 'Confirm',
  },
  title: {
    type: String,
    default: 'Are You Sure?',
  },
  subtitle: {
    type: String,
    default: 'Are you sure',
  },
  onConfirm: Function, // Add a prop for the callback function
  onCancel:Function
});

const emit = defineEmits();

const handleButtonClick = () => {
  // Call the callback function passed as a prop
  if (props.onConfirm && typeof props.onConfirm === 'function') {
    props.onConfirm();
  }
};
</script>

<template>

  
<div role="dialog" aria-modal="true" class="is-active modal v-modal">
  <div class="modal-background v-modal-close" tabindex="-1" role="button"></div>
    <div class="modal-content">
      <div class="modal-card">

    
        <div class="modal-card-body  custom-card">
          <div class=" inner-content is-flex is-flex-direction-column is-align-items-center is-justify-content-space-between" style="height: 100%;">
            <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
              <i class="lnir lnir-warning mb-5" aria-hidden="true" style="font-size: 70px; color:hsl(19, 82%, 58%)" ></i>
              <h3 class="title is-4 is-narrow is-thin mb-3">{{props.title}}</h3>
              <p class="light-text is-text-align-center mb-5" style="text-align:center">{{props.subtitle}}</p>
            </div>
            <div >
              <VButtons class="is-flex is-justify-content-center">
                <VButton @click="props.onCancel" class="mr-5"> Close </VButton>
                <VButton @click="handleButtonClick()" color="danger" > {{ props.btntext }} </VButton>
              </VButtons>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
</template>
<style lang="scss" >
  .custom-card{
    padding: 40px;
    display: inline-block;
    width: 400px;
    min-height: 300px;
    border-radius: 30px;
    border: 1px solid var(--fade-grey-dark-3);
    transition: all 0.3s;
  }
</style>

