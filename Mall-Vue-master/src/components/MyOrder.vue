<template>
  <div class="container">
    <Layout class="layout">
      <Sider class="side-bar" :style="{ height: 'calc(100vh - 35px)', background: '#fff', overflow: 'auto' }" ref="side" :collapsed-width="78">
        <Menu active-name="1-2" theme="light" width="auto" @on-select="onSelect">
          <div class="user-icon">
            <div class="user-img"><img src="static/img/head.png" /></div>
            <p>{{userName}}</p>
          </div>
          <Submenu name="1">
            <template slot="title">
              <Icon type="location"></Icon>
              <span>收货地址</span>
            </template>
            <MenuItem name="myAddress">我的收货地址</MenuItem>
            <MenuItem name="addAddress">添加收货地址</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="clipboard"></Icon>
              <span>购物订单</span>
            </template>
            <MenuItem name="myOrder">我的订单</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-cart"></Icon>
              <span>购物车</span>
            </template>
            <MenuItem name="myShoppingCart">我的购物车</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout class="layout">
        <Header :style="{ background: '#fff' }">
          <h2>{{ activeTitle }}</h2>
        </Header>
        <Content class="content">
          <div style="font-size: 20px;font-weight: bold; margin;margin-bottom: 20px;">订单号：{{orderId}}
          <span v-if="orderStatus == 0"><tag type="dot" color="red" style="margin-left: 15px;">已取消</tag></span>
          <span v-if="orderStatus == 1"><tag type="dot" color="green" style="margin-left: 15px;">已完成</tag></span>
          <span v-if="orderStatus == 2"><tag type="dot" color="blue" style="margin-left: 15px;">待支付</tag></span>
          </div>
          <div style="margin-bottom: 15px; font-size: 15px; margin-left: 15px; font-weight: bold;">
            <span>下单时间：{{orderTime}}</span>
          </div>
        <div>
          <Table
            border
            :columns="columns"
            :data="orderContent"
            size="large"
            no-data-text="没有商品"
          ></Table>
        </div>
        <div class="address-container" style="margin-top: 30px;">
          <h3>收货人信息</h3>
          <span style="font-size: 20px;">地址：{{orderAddress}}</span>
        </div>
        <div class="pay-container">
          <div class="pay-box" style="text-align: right;">
            <p style="font-size: 15px; font-weight: bold; margin-bottom: 10px;"><span>应付总额：</span> <span class="money"><Icon type="social-yen"></Icon>{{orderPrice.toFixed(2)}}</span></p>
            <div class="pay-btn" v-if="orderStatus == 2">
              <Button type="primary" size="large" @click="gotoPay">支付订单</Button>
            </div>
          </div>
        </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Home',
  data() {
    return {
      activeTitle: '我的订单',
      columns: [
        {
          type: 'index',
          width: 58,
          align: 'center'
        },
        {
          title: '图片',
          key: 'goodMainImageUrl',
          width: 86,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.goodMainImageUrl,
                  width: '60px',
                  height: '60px'
                }
              })
            ]);
          },
          align: 'center'
        },
        {
          title: '名称',
          key: 'goodName',
          align: 'center'
        },
        {
          title: '数量',
          key: 'count',
          width: 68,
          align: 'center'
        },
        {
          title: '价格',
          width: 80,
          key: 'price',
          align: 'center',
          render: (h, params) => {
            let price = params.row.price;
            console.log(h);
            console.log(params);
            price = price.toFixed(2);
            return h('span', price);
          }
        }
      ],
      bar: {
        myAddress: '我的收货地址',
        addAddress: '添加收货地址',
        myOrder: '我的订单',
        myShoppingCart: '我的购物车'
      },
      orderId: '0',
      userName: '',
      orderContent: [
        {
          count: 1,
          goodId: 27,
          goodMainImageUrl: '',
          goodName: '前端开发',
          price: 35
        }
      ],
      orderAddress: '',
      orderPrice: 0,
      orderStatus: 0,
      orderTime: ''
    };
  },
  methods: {
    onSelect(name) {
      this.activeTitle = this.bar[name];
      this.$router.push(`/home/${name}`);
    },
    gotoPay () {
      var that = this;
      console.log(that.orderId);
      window.open("http://kingwait.com/supermarket/user-order/payorder?orderId="+that.orderId);
    },
    getName: function () {
      var that = this;
      var loginInfo = localStorage.getItem('loginInfo');
      loginInfo = JSON.parse(loginInfo);
      that.userName = loginInfo.userNickname;
    },
    getOrder: function () {
      var that = this;
      console.log(that.$route.query.id);
      var id = that.$route.query.id
      console.log(id);
      if (that.$route.query.id != undefined && that.$route.query.id != '') {
        this.$axios({
          method: 'get',
          url: 'http://kingwait.com/supermarket/user-order/query?orderId='+id
        })
          .then(response => {
            console.log(response.data); //请求成功返回的数据
            if (response.data.code == 10000) {
              that.orderContent = JSON.parse(response.data.detail.orderContent);
              console.log(that.orderContent);
              that.orderAddress = response.data.detail.orderAddress;
              that.orderPrice = response.data.detail.orderPrice;
              that.orderStatus = response.data.detail.orderStatus;
              that.orderTime = response.data.detail.orderTime;
            }
          })
          .catch(
            error => console.log(error) //请求失败返回的数据
          );
      }
    }
  },
  created: function() {
    var that = this;
    console.log(that.$route.query.id);
    if (that.$route.query.id != undefined && that.$route.query.id != '') {
      that.orderId = that.$route.query.id;
    }
    that.getName();
    that.getOrder();
  }
};
</script>

<style scoped>
.side-bar a {
  color: #232323;
}
.user-icon {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user-icon span {
  font-size: 96px;
}
.user-img {
  margin-bottom: 15px;
  width: 96px;
  height: 96px;
  border-radius: 48px;
  overflow: hidden;
}
.user-img img {
  width: 100%;
}
.content {
  margin: 15px;
  background-color: #fff;
  padding: 15px;
}
.layout-footer-center {
  padding: 0px 15px;
  padding-bottom: 15px;
  text-align: center;
}
</style>
