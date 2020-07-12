
<template>
  <div class="item-class-show">
    <Row class="item-class-group">
      <i-col class="item-class-name" span="3">分类</i-col>
      <i-col class="item-class-select" span="21">
        <span v-for="(item, index) in categories" :key="index"><router-link :to="{ path: '/goodsList', query: { id: item.catId } }">{{ item.catName }}</router-link></span>
      </i-col>
    </Row>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'GoodsClassNav',
  data () {
    return {
      tagsInfo: [
        {
          tagName: '分类',
          tags: [ '华为(HUAWEI)', '三星(SAMSUNG)' ]
        }
      ],
      categories: []
    };
  },
  created () {
    var that = this;
    that.getCategory();
  },
  methods: {
    getCategory () {
      var that = this;
      this.$axios({
        method: 'get',
        url: 'http://kingwait.com/supermarket/category/list'
      }).then(response => {
        //这里使用了ES6的语法，不懂还是看看昨晚发的网址
        console.log(response.data); //请求成功返回的数据
        if(response.data.code == 10000) {
          //console.log(response.data.categories);
          if(response.data.categories) {
            that.categories = response.data.categories;
          } else {
            that.categories = [];
          }
          console.log(that.categories);
        }
      }).catch(
        error => console.log(error) //请求失败返回的数据
      );
    },
  }
};
</script>

<style scoped>
.item-class-show {
  margin: 15px auto;
  width: 100%;
}
.item-class-group {
  margin-top: 1px;
  height: 45px;
  border-bottom: 1px solid #ccc;
}
.item-class-group:first-child {
  border-top: 1px solid #ccc;
}
.item-class-name {
  padding-left: 15px;
  line-height: 44px;
  color: #666;
  font-weight: bold;
  background-color: #f3f3f3;
}
.item-class-name:first-child {
  line-height: 43px;
}
.item-class-select span {
  margin-left: 15px;
  width: 160px;
  color: #005aa0;
  line-height: 45px;
  cursor: pointer;
}
</style>
