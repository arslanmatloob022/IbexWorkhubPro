<template>
    <div class="columns is-multiline">
      <div class="column is-4">
        <h2 class="title is-1">
            Arez Pricing According to your Needs
        </h2>
        <div class="cus-light-green">
            <h3 class="title is-5 mb-2">Free</h3>
            <h4 class="title is-6">14 days free Trail</h4>
            <p class="has-text-black pb-4">
                Manage up to 100 workers and subcontractors
            </p>
            <p class="has-text-black pb-4">
                The employment reference system contracts past employers and finds and manages gaps in employment over 31 days
            </p>
           
            <p class="has-text-black pb-5">
                The employment reference system contracts past employers and finds and manages gaps in employment over 31 days
            </p>

            <VButton color="black" style="width: 100%;height: 48px;margin-top: 20px;">
                Request a Free Trail
            </VButton>
        </div>
      </div>
      <div class="column is-4">
        <h2 class="title is-6">
            Affordable pricing options to fit the needs and budget of any business, big or small.
        </h2>
        <div class="cus-light-blue">
            <h3 class="title is-5 mb-2">Business</h3>
            <h4 class="title is-6">Let's discuss</h4>
            <p class="has-text-black pb-4">
                Daily SIA license checks with the Home office database.
            </p>
            <p class="has-text-black pb-4">
                The employment reference system contracts past employers and finds and manages gaps in employment over 31 days
            </p>
            <p class="has-text-black pb-4">
                The employment reference system contracts past employers and finds and manages gaps in employment over 31 days
            </p>
            
            <p class="has-text-black pb-4" style="padding-top: 38px;">
                Discover anomalies in workers' records and BS7858 non-compliance automatically
            </p>
            <VButton color="black" style="width: 100%;height: 48px;margin-top: 20px;">
                Request a Free Trail
            </VButton>
        </div>
      </div>

      <div class="column is-4">
     
        <div class="cus-light-black">
            <h3 class="title is-3 mb-2 cus-title--grad">Professional<br>
                <span style="font-size: 16px;">
                    £ 99/per month -per seat
                </span>


            </h3>
            <p class="has-text-white pb-4">
                Daily SIA license checks with the Home office database.
            </p>
            <p class="has-text-white pb-4">
                The employment reference system contracts past employers and finds and manages gaps in employment over 31 days
            </p>
            <p class="has-text-white pb-4">
                The employment reference system contracts past employers and finds and manages gaps in employment over 31 days
            </p>
            
            <p class="has-text-white pb-4">
                The employment reference system contracts past employers and finds and manages gaps in employment over 31 days
            </p>
            <p class="has-text-white pb-4" style="padding-top: 6px;">
                Discover anomalies in workers' records and BS7858 non-compliance automatically
            </p>
            <VButton color="black" style="width: 100%;background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);height: 48px;margin-top: 20px;">
                Request a Free Trail
            </VButton>
        </div>
      </div>
    </div>
  </template>
  
  <script>
 
  
  export default {
    
    data() {
      return {
        employeeReports: [
          { title: 'SIA Validity Checks', details: 'Working in a secure environment is a crucial requirement for any business operating.', openDetail: true },
          { title: 'BS7858 employment checks', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: false },
          { title: 'Reminder Expired SIA License', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: false },
          { title: 'BS7858 employment checks', details: 'Display completed and incomplete employees profiles with employees documents.', openDetail: false },
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

.cus-title--grad{
    background-image: linear-gradient(103deg, #56f38b 0%, #0bbbcf 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.cus-light-green{
    background-color: #EAFEF1;
    border-radius: 10px;
    padding: 32px 28px 45px 28px ;
}
.cus-light-blue{
    background-color: #E2F7F9;
    border-radius: 10px;
    padding: 32px 28px 45px 28px ;
}
.cus-light-black{
    background-color: black;
    border-radius: 10px;
    padding: 32px 28px 45px 28px ;
}
  </style>
  