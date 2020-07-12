<template>
  <div>
    <div class="pay-container">
      <Alert show-icon>
        订单支付
        <Icon type="qr-scanner" slot="icon"></Icon>
        <template slot="desc">请点击支付按钮进行支付</template>
      </Alert>
      <Alert>
        订单号：{{orderId}}
      </Alert>
      <div class="pay-box">
        <div class="pay-demo">
          <img src="static/img/pay/pay-demo.png">
        </div>
        <div class="pay-qr-scan">
          <!--img src="static/img/pay/pay-qrscan.png"-->
          <i-button type="primary" @click="payOrder">支付</i-button>
          <div class="pay-tips" style="margin-top: 50px;">
            <router-link to="/payDone"><p>支付完成</p></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Pay',
  data() {
    return {
      orderId: 0
    };
  },
  methods: {
    payOrder () {
      var that = this;
      console.log(that.orderId);
      window.open("http://kingwait.com/supermarket/user-order/payorder?orderId="+that.orderId);
    }
  },
  created: function() {
    var that = this;
    console.log(that.$route.query.id);
    if (that.$route.query.id != undefined && that.$route.query.id != '') {
      that.orderId = that.$route.query.id;
    }
  }
};
</script>

<style scoped>
.pay-container {
  margin: 15px auto;
  width: 80%;
  min-width: 1000px;
}
.pay-box {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pay-demo {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pay-demo img{
  height: 80%;
}
.pay-qr-scan {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pay-tips {
  width: 50%;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
}
.pay-tips a {
  color: #999999;
}
</style>
