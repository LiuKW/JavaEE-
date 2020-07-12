<template>
  <div>
    <Search></Search>
    <GoodsListNav></GoodsListNav>
    <div class="goods-list-container" v-if="showItem">
      <Alert show-icon class="tips-box">
        小提示
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">请点击商品前的选择框，选择购物车中的商品，点击付款即可。</template>
      </Alert>
      <Button type="primary" v-on:click="deleteCart">清除购物车</Button>
      <Table border ref="selection" :columns="columns" :data="shoppingCart" size="large" @on-selection-change="select" no-data-text="您的购物车没有商品，请先添加商品到购物车再点击购买"></Table>
      <div class="address-container">
        <h3>收货人信息</h3>
        <div class="address-box">
          <div class="address-check">
            <div class="address-check-name">
              <span><Icon type="ios-checkmark-outline"></Icon> {{checkAddress.name}}</span>
            </div>
            <div class="address-detail">
              <p>{{checkAddress.addressContent}}</p>
            </div>
          </div>
          <Collapse>
            <Panel>
                选择地址
                <p slot="content">
                  <RadioGroup vertical size="large" @on-change="changeAddress">
                    <Radio :label="item.addressId" v-for="(item, index) in address" :key="index">
                      <span>{{item.addressContent}}</span>
                    </Radio>
                  </RadioGroup>
                </p>
            </Panel>
          </Collapse>
        </div>
      </div>
      <div class="pay-container">
        <div class="pay-box">
          <p><span>提交订单应付总额：</span> <span class="money"><Icon type="social-yen"></Icon> {{totalPrice.toFixed(2)}}</span></p>
          <div class="pay-btn">
            <Button type="error" size="large" @click="submitOrder">支付订单</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Search from '@/components/Search';
import GoodsListNav from '@/components/nav/GoodsListNav';
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'Order',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created () {
    this.loadAddress();
    var that = this;
    console.log(that.shoppingCart);
    console.log(that.address);
    that.loadUser();
  },
  data () {
    return {
      goodsCheckList: [],
      columns: [
        {
          type: 'selection',
          width: 58,
          align: 'center'
        },
        {
          title: '图片',
          key: 'goodMainimageurl',
          width: 86,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.goodMainimageurl,
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
          title: '描述',
          width: 198,
          key: 'goodDescription',
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
          key: 'goodPrice',
          align: 'center',
          render: (h, params) => {
            let goodPrice = params.row.goodPrice;
            console.log(h);
            console.log(params);
            goodPrice = goodPrice.toFixed(2);
            return h('span', goodPrice);
          }
        }
      ],
      checkAddress: {
        name: '未选择',
        address: '请选择地址'
      },
      loginInfo: {},
      userId: 0,
      remarks: '',
      showItem: true
    };
  },
  computed: {
    ...mapState(['address', 'shoppingCart']),
    totalPrice () {
      let price = 0;
      this.goodsCheckList.forEach(item => {
        price += item.goodPrice * item.count;
      });
      return price;
    }
  },
  methods: {
    ...mapActions(['loadAddress', 'loadShoppingCart']),
    select (selection, row) {
      console.log(selection);
      this.goodsCheckList = selection;
      console.log(this.goodsCheckList);
    },
    changeAddress (data) {
      const father = this;
      console.log(data);
      this.address.forEach(item => {
        if (item.addressId === data) {
          father.checkAddress.name = item.addressContent.substring(0, 12);
          father.checkAddress.address = `${item.addressContent}`;
        }
      });
    },
    deleteCart () {
      var that = this;
      let Cart = [];
      localStorage.setItem('shoppingCart', JSON.stringify(Cart));
      that.showItem = false;
      that.$nextTick(() => {
        that.showItem = true;
      });
      that.loadShoppingCart();
    },
    loadUser () {
      var that = this;
      var loginInfo = localStorage.getItem('loginInfo');
      loginInfo = JSON.parse(loginInfo);
      that.loginInfo = loginInfo;
      that.userId = loginInfo.userId;
    },
    submitOrder () {
      var that = this;
      //console.log(that.goodsCheckList);
      //console.log(that.checkAddress.address);
      //console.log(that.totalPrice);

      var goodsList = [];

      for (var i in that.goodsCheckList) {
      	//console.log(that.goodsCheckList[i].count);
      	//console.log(that.goodsCheckList[i].goodPrice);
      	//console.log(that.goodsCheckList[i].goodId);
      	var newArray = {
      		count: that.goodsCheckList[i].count,
      		price: that.goodsCheckList[i].goodPrice,
      		goodId: that.goodsCheckList[i].goodId
      	};
      	goodsList.push(newArray);
      }

      console.log(goodsList);

      if (goodsList.length != 0 && that.checkAddress.address != '请选择地址') {
        this.$axios({
          method: 'post',
          url: 'http://kingwait.com/supermarket/user-order/placeorder',
          data: {
            userId: that.userId,
            goodsList: goodsList,
            orderAddress: that.checkAddress.address,
            totalPrice: that.totalPrice
          }
        })
          .then(response => {
            console.log(response.data); //请求成功返回的数据
            if (response.data.code == 10000) {
              console.log(response.data.orderId);
              var orderId = response.data.orderId;
              this.$Message.success('下单成功');
              that.deleteCart();
              this.$router.push({ path: '/Pay', query: { id: orderId } });
            } else {
              this.$Message.error('下单失败');
            }
          })
          .catch(
            error => console.log(error) //请求失败返回的数据
          );
      } else {
        this.$Message.error('请选择商品或地址');
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.selection.selectAll(true);
    }, 500);
  },
  components: {
    Search,
    GoodsListNav
  },
  store
};
</script>

<style scoped>
.goods-list-container {
  margin: 15px auto;
  width: 80%;
}
.tips-box {
  margin-bottom: 15px;
}
.address-container {
  margin-top: 15px;
}
.address-box {
  margin-top: 15px;
  padding: 15px;
  border: 1px #ccc dotted;
}
.address-check {
  margin: 15px 0px;
  height: 36px;
  display: flex;
  align-items: center;
}
.address-check-name {
  width: 120px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #ccc;
}
.address-check-name span {
  width: 120px;
  height: 36px;
  font-size: 14px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  background-color: #f90013;
}
.address-detail {
  padding-left: 15px;
  font-size: 14px;
  color: #999999;
}
.remarks-container {
  margin: 15px 0px;
}
.remarks-input {
  margin-top: 15px;
}
.invoices-container p{
  font-size: 12px;
  line-height: 30px;
  color: #999;
}
.pay-container {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}
.pay-box {
  font-size: 18px;
  font-weight: bolder;
  color: #495060;
}
.money {
  font-size: 26px;
  color: #f90013;
}
.pay-btn {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
}
</style>
