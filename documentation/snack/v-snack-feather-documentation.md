### Feather icons

Arez Provides a `<VSnack />` component than can be used
to show a pill with an icon. Use the available `slots` prop
to insert your content. Check the markup for more details.

<!--code-->

```vue
<template>
  <VSnack title="Shopping" white icon="feather:shopping-cart">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Shopping" color="primary" icon="feather:smile">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Support" color="success" white icon="feather:life-buoy">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Business" color="info" icon="feather:briefcase">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Warning" color="warning" white icon="feather:alert-octagon">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Health" color="danger" white icon="feather:thermometer">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
</template>
```

<!--/code-->

<!--example-->

<div class="snacks">
  <VSnack title="Shopping" white icon="feather:shopping-cart">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Shopping" color="primary" icon="feather:smile">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Support" color="success" white icon="feather:life-buoy">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Business" color="info" icon="feather:briefcase">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack
    title="Warning"
    color="warning"
    white
    icon="feather:alert-octagon"
  >
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
  <VSnack title="Health" color="danger" white icon="feather:thermometer">
    <i class="iconify" data-icon="feather:plus"></i>
  </VSnack>
</div>

<!--/example-->
