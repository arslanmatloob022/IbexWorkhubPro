<template>
    <div class="columns">
      <div class="column is-4">
        <h2 class="title is-4 has-text-white">Manage your<br> valuable Employees from</h2>
        <h2 class="cus-heading--grad">
            HIRE <span style="font-size: 40px;">TO</span><br> RETIRE
        </h2>
        
      </div>
      <div class="column is-1"></div>
      <div class="column is-7">
        <h4 class="title is-5 has-text-light">
            Ensuring your employee’s<br> information is accurate, & fulfill<br> the compliance requirements
        </h4>

        <div   v-for="(item, index) in employeeReports" :key="index" :class="employeeReports.length-1 !==index?'repport-box':'pt-5'">
          <div class="is-flex" style="gap: 20px;align-items: baseline;">
            <div class="">
                <span class="arrow cu-pointer " :class="item.openDetail?'rightDown-arrow-grad':'rightDown-arrow-white'" @click="toggleDetails(index)">
                    <i :class="item.openDetail?'fa fa-arrow-down':'fa fa-arrow-right'"></i>
                </span>
            </div>
            <div class="">
                <h3 class="title is-5 mb-1 " :class="item.openDetail?'cus-title--grad':'has-text-white'">{{ item.title }}</h3>
            <p v-show="item.openDetail" class="has-text-light">{{ item.details }}</p>
            </div>
          </div>
          <div >
          
          </div>
         
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
 
  
  export default {
    
    data() {
      return {
        employeeReports: [
          { title: 'SIA Validity Checks', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: true },
          { title: 'BS7858 employment checks', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: false },
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
.rightDown-arrow-white {
    cursor: pointer;
   color: white;
    font-size: 24px;
}
.cus-heading--grad{
    background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: left;
    font-size: 84px;
    line-height: 90px;
    margin-bottom: 30px;
}
.cus-title--grad{
    background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.cus-icon-circle{
    background: #efefef;
    padding: 15px 15px 15px 15px;
    border-radius: 27px;
}
.service-block{
   gap: 30px;
    margin: 44px 0px 44px 0px
}
  </style>
  