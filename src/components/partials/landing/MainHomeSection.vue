<script setup lang="ts">
import { isLargeScreen } from '/@src/utils/responsive'
import VueScrollTo from 'vue-scrollto'

import { useDarkmode } from '/@src/stores/darkmode'

const isMobileNavOpen = ref(false)
const darkmode = useDarkmode()
const scrollTo = VueScrollTo.scrollTo

const { y } = useWindowScroll()

const isScrolling = computed(() => {
  return y.value > 30
})

watchEffect(() => {
  if (isLargeScreen.value) {
    isMobileNavOpen.value = false
  }
})
</script>

<template>
    <div
        id="vuero-landing "
        class="hero is-fullheight is-active main--section"
      >
        <!-- Navbar partial -->
        <NewLandingNavigation />
        <div class="hero-body has-text-centered">
          <div class="container" id="home">
            <h1 class="Combined-Shape is-leading">
                Effectively managing and tracking your security crew in real-time
              
            </h1>
            <div class="is-flex" style="justify-content:space-between;flex-wrap:wrap">
                <div>
                    <div class="is-flex" style="flex-wrap:wrap;justify-content:space-between;">
                    <div>
                        <p class="Trusted-by">Trusted by</p>
                        <p class="Customers-number">3322 Trusted by</p>
                    </div>
                    <div>
                        <p class="Trusted-by">User Reviews</p>
                        <p class="Customers-number">3322  Reviews</p>
                    </div>
                    <div>
                        <p class="Trusted-by">Success Stories</p>
                        <p class="Customers-number">3322 Stories </p>
                    </div>
                </div>
                </div>
                <div>
                    <p class="request-demo">
                        Request demo <i class="fa fa-arrow-right"></i>
                    </p>
                </div>
            </div>

          </div>
        </div>

      </div>




</template>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';
@import '/@src/scss/_demo/landing';
.main--section {
    position:relative;
    margin: auto;
    overflow: auto;
    background: rgb(27, 23, 23) !important;
    background-size: 400% 400%;
    background-attachment: fixed;
}
.Combined-Shape {

  background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
  -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: left;
    font-size: 78px;
    line-height:90px;
    margin-bottom:50px;
    margin-top: -120px;
}

.request-demo {
    cursor:pointer;
    background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 24px;
}

.Trusted-by {
    text-align:left;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ccc;
  padding: 0px 140px 10px 0px;
}

.Customers-number {
    text-align:left;
  font-size: 19px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
}

</style>
