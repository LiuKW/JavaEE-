<template>
  <div>
    <Table border :columns="columns" :data="order" size="large" @on-row-click="gotoDetail" no-data-text="你还有订单，快点去购物吧"></Table>
    <div class="page-size"><Page :total="100" show-sizer></Page></div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'MyOrder',
  data() {
    return {
      order: [
        {
          orderId: 1,
          orderPrice: 27,
          orderAddress: "广东",
          orderStatus: 0,
          orderTime: "now"
        }
      ],
      loginInfo: {},
      userId: 1,
      columns: [
        {
          title: '订单号',
          key: 'orderId',
          align: 'center'
        },
        {
          title: '总价',
          key: 'orderPrice',
          width: 80,
          align: 'center',
          render: (h, params) => {
            let price = params.row.orderPrice;
            console.log(h);
            console.log(params);
            price = price.toFixed(2);
            return h('span', price);
          }
        },
        {
          title: '地址',
          key: 'orderAddress',
          align: 'center'
        },
        {
          title: '状态',
          key: 'orderStatus',
          width: 150,
          align: 'center',
          render: (h, params) => {
            let status = params.row.orderStatus;
            console.log(h);
            console.log(params);
            if (status === 0) {
              return h('tag', {
                attrs: {
                  type: 'dot',
                  color: 'red'
                },
              }, '已取消');
            }
            if (status === 1) {
              return h('tag', {
                attrs: {
                  type: 'dot',
                  color: 'green'
                },
              }, '已完成');
            }
            if (status === 2) {
              return h('tag', {
                attrs: {
                  type: 'dot',
                  color: 'blue'
                },
              }, '待支付');
            }
          }
        },
        {
          title: '时间',
          key: 'orderTime',
          align: 'center'
        }
      ]
    };
  },
  created() {
    this.loadUser();
    this.loadOrder();
  },
  methods: {
    loadUser() {
      var that = this;
      var loginInfo = localStorage.getItem('loginInfo');
      loginInfo = JSON.parse(loginInfo);
      that.loginInfo = loginInfo;
      that.userId = loginInfo.userId;
    },
    loadOrder() {
      var that = this;
      var loginInfo = localStorage.getItem('loginInfo');
      loginInfo = JSON.parse(loginInfo);
      var userId = loginInfo.userId;
      this.$axios({
        method: 'get',
        url: 'http://kingwait.com/supermarket/user/orders/' + userId
      })
        .then(response => {
          //这里使用了ES6的语法，不懂还是看看昨晚发的网址
          //console.log(response.data); //请求成功返回的数据
          if (response.data.code == 10000) {
            //console.log(response.data.orders.orders);
            if (response.data.orders) {
              that.order = response.data.orders.orders;
            } else {
              that.order = [];
            }
            console.log(that.order);
          }
        })
        .catch(
          error => console.log(error) //请求失败返回的数据
        );
    },
    gotoDetail (e) {
      console.log(e);
      var that = this;
      that.$router.push({ path: '/myOrder', query: { id: e.orderId } });
    }
  }
};
</script>

<style scoped>
.page-size {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
