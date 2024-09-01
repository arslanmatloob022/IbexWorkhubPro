<template>
  <div class="columns is-multiline">
    <div class="column is-4">
      <div
        v-for="(item, index) in employeeReports"
        :key="index"
        :class="employeeReports.length - 1 !== index ? 'repport-box' : 'pt-3'"
      >
        <div class="is-flex" style="gap: 20px; align-items: baseline">
          <div class="">
            <span
              class="arrow cu-pointer"
              :class="
                item.openDetail
                  ? 'rightDown-arrow-grad'
                  : 'rightDown-arrow-black'
              "
              @click="toggleDetails(index)"
            >
              <i
                :class="
                  item.openDetail ? 'fa fa-arrow-down' : 'fa fa-arrow-right'
                "
              ></i>
            </span>
          </div>
          <div class="">
            <h3
              class="title is-5 mb-1"
              :class="item.openDetail ? 'cus-title--grad' : ''"
            >
              {{ item.title }}
            </h3>
            <p v-show="item.openDetail" class="has-text-light">
              {{ item.details }}
            </p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
    <div class="column is-1"></div>
    <div class="column is-7">
      <h2 class="cu-benefit-heading">
        Ibex <br />
        Benefits
      </h2>
      <h3 class="title is-4">
        Improve Security Workforce<br />
        Operations with Ibex.
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employeeReports: [
        {
          title: "SIA Validity Checks",
          details:
            "Working in a secure environment is a crucial requirement for any business operating.",
          openDetail: true,
        },
        {
          title: "BS7858 employment checks",
          details:
            "Display completed and incomplete employees profiles with employees documents.",
          openDetail: false,
        },
        {
          title: "Reminder Expired SIA License",
          details:
            "Display completed and incomplete employees profiles with employees documents.",
          openDetail: false,
        },
        {
          title: "BS7858 employment checks",
          details:
            "Display completed and incomplete employees profiles with employees documents.",
          openDetail: false,
        },
      ],
    };
  },
  methods: {
    toggleDetails(index) {
      // Set all openDetail to false
      this.employeeReports.forEach((item, itemIndex) => {
        item.openDetail = index === itemIndex;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.repport-box {
  // border-bottom: 1px solid rgb(201, 201, 201);
  padding: 10px 0px 9px 0px;
}
.rightDown-arrow-grad {
  cursor: pointer;
  background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
}
.rightDown-arrow-black {
  cursor: pointer;
  color: black;
  font-size: 24px;
}

.cus-title--grad {
  background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cu-benefit-heading {
  font-size: 71px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 94px;
  letter-spacing: normal;
  color: #1a1a1a;
}
</style>
