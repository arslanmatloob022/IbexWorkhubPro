<template>
    <div class="columns">
      <div class="column is-4 is-offset-2">
        <h2 class="title is-2">
              Front Line Efficiency<br> Integrated with Back Office<br> Intelligence.
            </h2>
        <div   v-for="(item, index) in employeeReports" :key="index" :class="employeeReports.length-1 !==index?'repport-box':'pt-5'">
          <div class="is-flex" style="justify-content: space-between;">
            <h3 class="title is-5" :class="item.openDetail?'active-text-grad':'active-text-black'">{{ item.title }}</h3>
            <div class="">
                <span class="arrow cu-pointer " :class="item.openDetail?'rightDown-arrow-grad':'rightDown-arrow-black'" @click="toggleDetails(index)">
                    <i :class="item.openDetail?'fa fa-arrow-down':'fa fa-arrow-right'"></i>
                </span>
            </div>
          </div>
          <div >
            <p v-show="item.openDetail">{{ item.details }}</p>
          </div>
         
        </div>
      </div>
      <div class="column is-2"></div>
      <div class="column is-6">
        <img style="border-radius: 12px;"
        class="light-image-block-l "
        src="/images/home-page/2.png"
        alt=""
        >
      </div>
    </div>
  </template>
  
  <script>
 
  
  export default {
    
    data() {
      return {
        employeeReports: [
          { title: 'Complete & Incomplete Profiles', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: false },
          { title: 'BS7858 employment checks', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: true },
          { title: 'Reminder Expired SIA License', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: false },
          { title: 'Reminder Expired SIA License', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: false },
         
        ],
      };
    },
    methods: {
      toggleDetails(index) {
        // Set all openDetail to false
        this.employeeReports.forEach((item, itemIndex) => {
          item.openDetail = index === itemIndex;
        });
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .repport-box{
    border-bottom: 1px solid rgb(201, 201, 201);
    padding: 20px 0px 9px 0px;
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

.active-text-grad {
    cursor: pointer;
    background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.active-text-black {
   color: black;
}
  </style>
  