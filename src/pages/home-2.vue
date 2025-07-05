<script setup lang="ts">
import packageJson from "../../package.json";

type TabId = "elements" | "components" | "forms" | "plugins";
const activeTab = ref<TabId>("elements");

useHead({
  title: "Ibex builders studios - real estate builders",
});
</script>

<template>
  <div>
    <MinimalLayout theme="light">
      <div class="landing-page-wrapper">
        <!-- Hero and Navbar -->
        <div class="section-margin" id="outer-container">
          <MainHomeSection></MainHomeSection>
          <div class="container">
            <div class="hero-mockup-wrap" style="" id="inner-container">
              <div class="hero-mockup" style="background-color: transparent">
                <div class="is-flex" style="justify-content: center">
                  <!-- <video autoplay="autoplay" muted="muted" loop="loop" class="center-image" style="width: 100%; height: 100%;object-fit: cover;border-radius: 20px;">
                    <source src="https://earnflex-static.s3.eu-west-2.amazonaws.com/Videos/Corporate_video.mp4" type="video/mp4" />
                  </video> -->
                  <!-- <img
                    class="light-image-block-l center-image"
                    src="/images/home-page/1.png"
                    alt=""
                  />
                  <img
                    class="dark-image-block-l center-image"
                    src="/images/home-page/1.png"
                    alt=""
                  /> -->
                </div>
                <h2 class="title is-2 mt-4 mb-4" style="text-align: center">
                  Features In
                </h2>
                <div
                  class="is-flex"
                  style="
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                  "
                >
                  <!-- <img
                    src="/images/home-page/company-1.webp"
                    alt=""
                    srcset=""
                    class="featured-image"
                  />
                  <img
                    src="/images/home-page/company-2.webp"
                    alt=""
                    srcset=""
                    class="featured-image"
                  />
                  <img
                    src="/images/home-page/company-3.webp"
                    alt=""
                    srcset=""
                    class="featured-image"
                  />
                  <img
                    src="/images/home-page/company-5.webp"
                    alt=""
                    srcset=""
                    class="featured-image"
                  />
                  <img
                    src="/images/home-page/company-6.webp"
                    alt=""
                    srcset=""
                    class="featured-image"
                  /> -->
                </div>
              </div>
              <!-- <div class="hero-mockup-gradient" /> -->
            </div>
          </div>
        </div>

        <!--Efficiency-->
        <div id="arez-efficiency" class="" style="position: relative">
          <div class="container">
            <!--Boxed Features-->
            <div class="boxed-features section-margin">
              <FrontLineEfficency></FrontLineEfficency>
            </div>
          </div>
        </div>

        <!--Services -->
        <div id="arez-features" class="section pt-0" style="position: relative">
          <div class="container">
            <!--Title-->
            <div class="section-title has-text-left">
              <h2 class="title is-2">
                Front Line Efficiency<br />
                Integrated with Back Office<br />
                Intelligence.
              </h2>
              <!-- <h4>Front Line Efficiency Integrated with Back Office Intelligence.</h4> -->
            </div>
            <div class="boxed-features">
              <ArezServices></ArezServices>
            </div>
          </div>
        </div>

        <!-- Hire To Retire -->
        <div id="arez-hire-retire" class="" style="position: relative">
          <div class="container">
            <div class="boxed-features">
              <ArezFrontEmployee></ArezFrontEmployee>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div id="arez-benfit" class="" style="position: relative">
          <div class="container">
            <div class="boxed-features">
              <ArezBenefit></ArezBenefit>
            </div>
          </div>
        </div>

        <!-- Arez Pricing -->
        <div id="arez-benfit" class="" style="position: relative">
          <div class="container">
            <div class="boxed-features">
              <ArezPricing></ArezPricing>
            </div>
          </div>
        </div>

        <!-- Arez FAQ -->
        <div id="arez-faq" class="" style="position: relative">
          <div class="container">
            <div class="boxed-features">
              <ArezFAQ></ArezFAQ>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <NewLandingFooter />

        <!-- Back To Top Button -->
        <div id="backtotop">
          <a href="#" aria-label="back to top">
            <i aria-hidden="true" class="fas fa-angle-up" />
          </a>
        </div>
      </div>
    </MinimalLayout>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";
@import "/@src/scss/_demo/landing";

#inner-container .center-image {
  margin-top: -250px;
  border-radius: 12px;
}

.featured-image {
  width: 100px;
}
.section-margin {
  // margin-top: 50px;
  margin-bottom: 130px;
}
#arez-efficiency .container {
  max-width: 1680px !important;
}
#arez-hire-retire {
  background-color: black;
  padding: 100px 50px 100px 50px;
}
#arez-benfit {
  padding: 100px 50px 100px 50px;
}
#arez-pricing {
  padding: 100px 50px 100px 50px;
}
#arez-faq {
  padding: 100px 50px 100px 50px;
}
</style>
