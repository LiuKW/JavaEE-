<template>
  <div v-if="showItem">
    <div style="margin-bottom: 30px;">
      <Button type="primary" v-on:click="deleteCart">清除购物车</Button>
    </div>
    <Table border ref="selection" :columns="columns" :data="shoppingCart" size="large" no-data-text="您的购物车没有商品，请先添加商品到购物车再点击购买"></Table>
    <div class="go-to">
      <Button @click="goTo" type="primary">去付款</Button>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'MyShoppingCart',
  data () {
    return {
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
      showItem: true
    };
  },
  created () {
    this.loadShoppingCart();
  },
  computed: {
    ...mapState(['shoppingCart'])
  },
  methods: {
    ...mapActions(['loadShoppingCart']),
    goTo () {
      this.$router.push('/order');
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
    }
  },
  store
};
</script>

<style scoped>
.go-to {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
