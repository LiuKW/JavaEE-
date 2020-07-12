<template>
  <div>
    <div class="add-container">
      <div class="add-title">
        <h1>添加收货地址</h1>
      </div>
      <div class="add-box">
        <Form :model="formData" label-position="left" :label-width="100" :rules="ruleInline">
          <FormItem label="收件地址" prop="address">
            <i-input v-model="formData.address" size="large"></i-input>
          </FormItem>
        </Form>
      </div>
      <div class="add-submit">
        <Button type="primary" v-on:click="submitAddress">添加地址</Button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Distpicker from 'v-distpicker';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'AddAddress',
  data () {
    return {
      formData: {
        name: '',
        address: '',
        phone: '',
        postalcode: '',
        province: '广东省',
        city: '广州市',
        area: '天河区'
      },
      userId: 0,
      ruleInline: {
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    ...mapActions(['loadAddress']),
    submitAddress: function () {
      var that = this;
      console.log(that.formData.address);
        this.$axios({
          method: 'post',
          url: 'http://kingwait.com/supermarket/user-address',
          data: {
            userId: that.userId,
            addressContent: that.formData.address
          }
        }).then(response => {
          //这里使用了ES6的语法，不懂还是看看昨晚发的网址
          console.log(response.data); //请求成功返回的数据
          if(response.data.code == 10000) {
            this.$Message.success(response.data.msg);
            // this.$router.push({ path: '/home/myAddress' });
          } else {
            this.$Message.error(response.data.msg);
          }
        }).catch(
          error => console.log(error) //请求失败返回的数据
        );
      },
    getProvince (data) {
      this.formData.province = data.value;
    },
    getCity (data) {
      this.formData.city = data.value;
    },
    getArea (data) {
      this.formData.area = data.value;
    },
    loadUser () {
      var that = this;
      var loginInfo = localStorage.getItem('loginInfo');
      loginInfo = JSON.parse(loginInfo);
      that.loginInfo = loginInfo;
      that.userId = loginInfo.userId;
    }
  },
  components: {
    Distpicker
  }
};
</script>

<style scoped>
.add-container {
  margin: 15px auto;
  width: 60%;
  min-width: 600px;
}
.add-title {
  margin-bottom: 15px;
  text-align: center;
}
.add-submit {
  display: flex;
  justify-content: center;
}
</style>
