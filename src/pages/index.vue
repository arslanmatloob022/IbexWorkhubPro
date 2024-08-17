<script setup lang="ts">
import packageJson from '../../package.json'

type TabId = 'elements' | 'components' | 'forms' | 'plugins'
const activeTab = ref<TabId>('elements')

useHead({
  title: 'AREZ - Workforce Management Software',
})

</script>

<template>
  <div>
  <MinimalLayout theme="light">
    <div class="landing-page-wrapper">
      <!-- Hero and Navbar -->
      <div
        id="vuero-landing "
        class="hero is-fullheight is-active"
      >
        <!-- Navbar partial -->
        <LandingNavigation />
        
        <div class="hero-body has-text-centered">
          <div class="container" id="home">
            <h1 class="title is-1 is-bold dark-white is-leading">
              <span>AREZ</span>
              Improve visibility and control over your security staff.
              
            </h1>
            <h3 class="subtitle is-4">
              Reduce risk and increase profitability by effectively managing and tracking your security crew in real-time and integrating time and labour with invoicing and payroll in one security workforce management software package.
     
            </h3>

            <div class="buttons mb-2">
              <VButton
                href="#"
                color="primary"
                rounded
              >
                Book a Demo
              </VButton>
            </div>

            <div class="trusted-by mb-4">
              <span>Trusted by <span>2000+ customers</span></span>
              <div class="rating">
                <i
                  class="iconify"
                  data-icon="uiw:star-on"
                />
                <i
                  class="iconify"
                  data-icon="uiw:star-on"
                />
                <i
                  class="iconify"
                  data-icon="uiw:star-on"
                />
                <i
                  class="iconify"
                  data-icon="uiw:star-on"
                />
                <i
                  class="iconify"
                  data-icon="uiw:star-on"
                />
              </div>
            </div>
            <div class="hero-mockup-wrap">
              <div class="hero-mockup" style="background-color: transparent;">
                <img
                  class="light-image-block-l"
                  src="https://arez.io/images/banner/single-welcome.webp"
                  alt=""
                >
                <img
                  class="dark-image-block-l"
                  src="https://arez.io/images/banner/single-welcome.webp"
                  alt=""
                >
              </div>
              <div class="hero-mockup-gradient" />
            </div>
 
          </div>
        </div>


      </div>

      <!--Stacks Section-->
      <div
        id="arez-features"
        class="section"
      >
        <div class="container">
       

          <!--Title-->
          <div class="section-title has-text-centered">
            <h2 class="title is-2">
              Amazing Features
            </h2>
            <h4>Front Line Efficiency Integrated with Back Office Intelligence.</h4>
          </div>

          <!--Boxed Features-->
          <div class="boxed-features">
            <div class="flex-card light-bordered hover-inset">
              <div class="flex-cell is-bordered">
                <i
                  aria-hidden="true"
                  class="lnil lnil-toolbox"
                />
                <h3>Verification of SIA license</h3>
                <p>Verify SIA license and checks SIA validity directly with the SIA database.</p>
              </div>
              <div class="flex-cell is-bordered">
                <i
                  aria-hidden="true"
                  class="lnil lnil-display-alt"
                />
                <h3>BS7858 employment checks</h3>
                <p>Verify employment checks and securely manage employees documents.</p>
              </div>
              <div class="flex-cell is-bordered">
                <i
                  aria-hidden="true"
                  class="lnil lnil-moon"
                />
                <h3>Register new employees</h3>
                <p>Register unlimited new employees into your team and collaborate as much as you need.</p>
              </div>
              <div class="flex-cell is-bordered no-border-edge">
                <i
                  aria-hidden="true"
                  class="lnil lnil-rocket"
                />
                <h3>Active Support</h3>
                <p>Our support helps you solve any issues you have</p>
              </div>
              <div class="flex-cell">
                <i
                  aria-hidden="true"
                  class="lnil lnil-code"
                />
                <h3>Employee reports</h3>
                <p>Download realtime employees reports with multiple filters.</p>
              </div>
              <div class="flex-cell">
                <i
                  aria-hidden="true"
                  class="lnil lnil-plug"
                />
                <h3>Complete & incomplete profiles</h3>
                <p>Display completed and incomplete employees profiles with employees documents.</p>
              </div>
              <div class="flex-cell">
                <i
                  class="lnil lnil-switch"
                  aria-hidden="true"
                />
                <h3>RTL Support</h3>
                <p>Vuero supports RTL layouts. Configure it in less than a minute.</p>
              </div>
              <div class="flex-cell no-border-edge">
                <i
                  aria-hidden="true"
                  class="lnil lnil-file-name"
                />
                <h3>Reminder expired SIA license</h3>
                <p>Determine in advance if employee SIA is about to expiry in next 2 weeks.</p>
              </div>
            </div>
          </div>

          <!--CTA-->
          <div class="cta-block" style="flex-direction: column; align-items: flex-start; gap: 30px;">
            <div class="head-text ">
              <h3>Register of Certificate Holders</h3>
              <p>Once a certificate has been issued, details about the certificate holder are recorded in a register and made available to the public. Establishing and maintaining a record is required under Section 12 of the Private Security Industry Act. You will be able to search the register on the date of the birth field if it is known to you, but this information will not be made available from any obtained result. When a result is obtained by entering the date of birth, it can be taken as confirmation that the date entered is correct. The address of an individual will not be made public.</p>
            </div>
            <div class="head-action">
              <div class="buttons">
                <a
                  href="http://go.cssninja.io/buy-vuero"
                  class="button v-button is-primary is-rounded is-elevated action-button"
                >
                  Find by certificate
                </a>
                <a
                  target="_blank"
                  href="https://go.cssninja.io/discord"
                  class="button chat-button"
                >
                  Chat with us
                </a>
              </div>
            </div>
          </div>

       

          
        </div>
      </div>



 

      <div
        id="arez-services"
        class="section"
      >
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-6 is-offset-3 has-text-centered">
              <!--Title-->
              <div class="section-title has-text-centered p-b-40">
                <h2 class="title is-3">
                  AREZ Services
                </h2>
                <h4>Every annual contract is designed to support unlimited collaboration for everyone on your project — with fixed, predictable pricing from day one.</h4>
              </div>
            </div>
          </div>
          <div class="columns is-vcentered component-features is-flex-tablet-p">
            <div class="column is-4">
              <!-- Side icon box -->
              <div class="media-flex">
                <div class="left-icon">
                  <i
                    aria-hidden="true"
                    class="lnil lnil-construction"
                  />
                </div>
                <div class="flex-meta">
                  <h4>Unlimited users</h4>
                  <p>
                    Grow your team and collaborate as much as you need. We'll never charge you for adding more users to AREZ.
                  </p>
                </div>
              </div>
            </div>
            <div class="column is-4">
              <!-- Side icon box -->
              <div class="media-flex">
                <div class="left-icon">
                  <i
                    aria-hidden="true"
                    class="lnil lnil-code"
                  />
                </div>
                <div class="flex-meta">
                  <h4>Unlimited data</h4>
                  <p>
                    Never run out of sheets, data or document storage with plans designed to support even the most complex projects.
                  </p>
                </div>
              </div>
            </div>
            <div class="column is-4">
              <!-- Side icon box -->
              <div class="media-flex">
                <div class="left-icon">
                  <i
                    aria-hidden="true"
                    class="lnil lnil-color-palette"
                  />
                </div>
                <div class="flex-meta">
                  <h4>24/7 Support</h4>
                  <p>
                    Say goodbye to downtime with a free, direct line to live technical support for everyone on your project.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-vcentered component-features is-flex-tablet-p">
              <div class="column is-4">
                <!-- Side icon box -->
                <div class="media-flex">
                  <div class="left-icon">
                    <i
                      aria-hidden="true"
                      class="lnil lnil-color-palette"
                    />
                  </div>
                  <div class="flex-meta">
                    <h4>Enterprise-grade security</h4>
                    <p>
                      Exceeds global requirements for data safety, security and privacy without sacrificing performance and ease of use.
                    </p>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <!-- Side icon box -->
                <div class="media-flex">
                  <div class="left-icon">
                    <i
                      aria-hidden="true"
                      class="lnil lnil-color-palette"
                    />
                  </div>
                  <div class="flex-meta">
                    <h4>100% Customer satisfaction</h4>
                    <p>
                      Get help from real, in-house Customer Success experts whose only metric of success is your success.
                    </p>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <!-- Side icon box -->
                <div class="media-flex">
                  <div class="left-icon">
                    <i
                      aria-hidden="true"
                      class="lnil lnil-color-palette"
                    />
                  </div>
                  <div class="flex-meta">
                    <h4>Cloud-based platform</h4>
                    <p>
                      Ditch on-premise servers. AREZ's cloud-based infrastructure will help you grow wherever you go.
                    </p>
                  </div>
                </div>
              </div>
          </div>

          <!--CTA-->
          <!-- <p class="p-t-40 p-b-40 has-text-centered">
            <a
              href="http://go.cssninja.io/buy-vuero"
              class="button v-button is-rounded is-primary is-elevated is-bold is-huge"
            >
              Buy Now
            </a>
          </p> -->

      
        </div>
      </div>

      <div class="section">
        <div class="container">
          <!--Title-->
          <div class="section-title has-text-centered pt-40">
            <h2 class="title is-3">
              
              Benefits of AREZ
            </h2>
            <h4>Improve Security Workforce Operations with AREZ.</h4>
          </div>

          <div class="customers-choice p-t-40 p-b-40">
            <!-- Feature -->
            <div class="columns is-vcentered side-feature">
              <div class="column is-5 is-offset-1 has-text-centered">
                <img
                  class="light-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-4.svg"
                  alt=""
                >
                <img
                  class="dark-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-4-dark.svg"
                  alt=""
                >
              </div>
              <div class="column is-5">
                <h2 class="title m-b-10 is-centered-tablet-portrait">
                  
                  SIA validity checks
                </h2>
                <p class="section-feature-description is-centered-tablet-portrait">
                  Live SIA validity checks directly with the SIA database, with the AREZ AI system identifying anomalies in profiles. e.g. the Arez will determine in advance if an officer's SIA is about to expire within two weeks.
                </p>
              </div>
            </div>

            <!-- Feature -->
            <div class="columns is-vcentered side-feature">
              <div
                class="column is-5 has-text-centered h-hidden-desktop h-hidden-tablet-p"
              >
                <img
                  class="light-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-5.svg"
                  alt=""
                >
                <img
                  class="dark-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-5-dark.svg"
                  alt=""
                >
              </div>
              <div class="column is-5 is-offset-1">
                <h2 class="title m-b-10 is-centered-tablet-portrait">
                  Right to work
                </h2>
                <p class="section-feature-description is-centered-tablet-portrait">
                  Arez.io is software that simplifies security screening checks, reducing the time, effort and cost of vetting officers by up to 10X. In addition, Arez's simple workflow automates the verification of SIA licenses, identity checks, documentation checks and storage in the cloud, employment history, and reference checks, which is flexible enough to meet your company's requirements.
                </p>
              </div>
              <div class="column is-5 has-text-centered h-hidden-mobile">
                <img
                  class="light-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-5.svg"
                  alt=""
                >
                <img
                  class="dark-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-5-dark.svg"
                  alt=""
                >
              </div>
            </div>

            <!-- Feature -->
            <div class="columns is-vcentered side-feature">
              <div class="column is-5 is-offset-1 has-text-centered">
                <img
                  class="light-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-6.svg"
                  alt=""
                >
                <img
                  class="dark-image-l featured-image"
                  src="/@src/assets/illustrations/landing/feature-6-dark.svg"
                  alt=""
                >
              </div>
              <div class="column is-5">
                <h2 class="title m-b-10 is-centered-tablet-portrait">
                  Proof of identity
                </h2>
                <p class="section-feature-description is-centered-tablet-portrait">
                  The Arez.io AI system allows you to continually maintain the quality of your staff and help with the audit processes, where companies are regularly audited against BS7858 requirements to become approved and maintain approval.
                </p>
              </div>
            </div>
          </div>

          <div class="cta-wrapper">
            <div class="cta-title">
              <h3>Subscribe To Newsletter</h3>
              <a
                href="http://go.cssninja.io/buy-vuero"
                class="custom-button"
              >
                <img
                  src="/images/icons/logos/envato.svg"
                  alt=""
                >
                <span>Subscribe</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <LandingFooter />

      <!-- Back To Top Button -->
      <div id="backtotop">
        <a
          href="#"
          aria-label="back to top"
        >
          <i
            aria-hidden="true"
            class="fas fa-angle-up"
          />
        </a>
      </div>
    </div>
  </MinimalLayout>
</div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/_demo/landing';
</style>
