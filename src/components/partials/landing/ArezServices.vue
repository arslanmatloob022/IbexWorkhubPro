<template>
    <div class="columns is-multiline">
      <div class="column is-4">
        <h2 class="title is-1 services-fs" >Arez<br> Services</h2>
        <div class=""  v-for="(item, index) in servicesData" :key="index">
            <div class="is-flex service-block" style="">
                <div class="">
                    <span class="cus-icon-circle">
                        <i :class="item.icon"></i>
                    </span>
                </div>
                <div class="">
                    <h4 class="title is-5 mb-2">{{ item.title }}</h4>
                    <p class="mt-0">{{ item.details }}</p>
                </div>
            </div>
        </div>
      </div>
      <div class="column is-1"></div>
      <div class="column is-7">
        <h3 class="cus-heading--grad ">
            Every annual<br> contract is designed<br> to support unlimited<br> collaboration for everyone<br> on your project<br> with fixed, predictable pricing<br> from day one.
        </h3>
        <div class="" >
            <div class="is-flex service-block" style="">
                <div class="">
                    <span class="cus-icon-circle">
                        <i class="fa fa-user"></i>
                    </span>
                </div>
                <div class="">
                    <h4 class="title is-5 mb-2">Pricing Plans</h4>
                    <p>Pricing Plans that designed to support most complex projects.</p>
                </div>
            </div>
            <div class="is-flex service-block" style="">
                <div class="">
                    <span class="cus-icon-circle">
                        <i class="fa fa-user"></i>
                    </span>
                </div>
                <div class="">
                    <h4 class="title is-5 mb-2">24/7 Support</h4>
                    <p>Pricing Plans that designed to support most complex projects.</p>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
 
  
  export default {
    
    data() {
      return {
        servicesData: [
        {
          title: 'Unlimited Users',
          details:'Grow your team and collaborate as much as you need. No limit on users',
          icon:'fa fa-users',
        },
        {
          title: 'Pricing Plans',
          details:'Pricing Plans that designed to support most complex projects.',
          icon:'fa fa-users',
        },
        {
          title: '24/7 Support',
          details: '24/7 Support ,Direct line to live technical support for everyone on your project.',
          icon:'fa fa-users',
        },
        {
          title: 'Pricing Plans',
          description: 'Tuesday, March 11th, 2024',
          details:'Pricing Plans that designed to support most complex projects.',
          icon:'fa fa-users',
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
    }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .services-fs{
    font-size: 60px;
  }
  .repport-box{
    border-bottom: 1px solid rgb(201, 201, 201);
    padding: 20px 0px 9px 0px;
  }
  .rightDown-arrow {
    cursor: pointer;
    background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 24px;
}
.cus-heading--grad{
    background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: left;
    font-size: 34px;
    line-height: 40px;
    margin-bottom: 30px;
    margin-top: 84px !important;
}
.cus-icon-circle{
    background: #efefef;
    padding: 25px 25px 25px 25px;
    border-radius: 40px;
}
.service-block{
   gap: 30px;
    margin: 44px 0px 44px 0px;
    align-items: center;
}
  </style>
  