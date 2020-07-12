<template>
  <div>
    <div v-if="address == null && showItem">
      <div style="text-align: center; line-height: 100px; margin-top: 100px; font-size: 20px; font-weight: bold;">
        你还没有地址
        <div>
          <Button type="primary" v-on:click="goToAdd">添加地址</Button>
        </div>
      </div>
    </div>
    <div class="address-box" v-for="(item, index) in address" :key="index" v-if="showItem">
      <div class="address-header">
        <span>{{userName}}</span>
        <div class="address-action">
          <span @click="edit(index, item.addressId)"><Icon type="edit"></Icon> 修改</span>
          <span @click="del(index, item.addressId)"><Icon type="trash-a"></Icon> 删除</span>
        </div>
      </div>
      <div class="address-content">
        <p><span class="address-content-title"> 收 货 人 :</span> {{userName}}</p>
        <p><span class="address-content-title">收货地址:</span> {{item.addressContent}}</p>
      </div>
    </div>
    <Modal v-model="modal" width="530">
        <p slot="header">
          <Icon type="edit"></Icon>
          <span>修改地址</span>
        </p>
        <div>
            <Form :model="formData" label-position="left" :label-width="100" :rules="ruleInline">
              <FormItem label="收件人" prop="name">
                <i-input v-model="formData.name" size="large"></i-input>
              </FormItem>
              <FormItem label="收件地址" prop="address">
                <i-input v-model="formData.address" size="large"></i-input>
              </FormItem>
            </Form>
        </div>
        <div slot="footer">
          <Button type="primary" size="large" long @click="editAction">修改</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
/* eslint-disable */
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
import Distpicker from 'v-distpicker';
export default {
  name: 'MyAddress',
  data () {
    return {
      modal: false,
      formData: {
        name: '',
        address: '',
        phone: '',
        postalcode: '',
        province: '广东省',
        city: '广州市',
        area: '天河区',
        id: 0
      },
      index: 0,
      loginInfo: {},
      userName: '',
      userId: 0,
      ruleInline: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
      },
      showItem: true
    };
  },
  created () {
    var that = this;
    that.showItem = false;
    that.$nextTick(() => {
      that.showItem = true;
    });
    this.loadUser();
    this.loadAddress();
  },
  computed: {
    ...mapState(['address'])
  },
  methods: {
    ...mapActions(['loadAddress']),
    edit (index, id) {
      var that = this;
      index = Number(index);
      id = Number(id);
      console.log(index);
      console.log(id);
      console.log(this.address);
      this.modal = true;
      this.formData.address = this.address[index].addressContent;
      this.formData.name = this.userName;
      this.formData.id = id;
      this.index = index;
    },
    editAction () {
      var that = this;
      console.log(this.formData)
      this.$axios({
        method: 'put',
        url: 'http://kingwait.com/supermarket/user-address/',
        data: {
          userId: this.userId,
          addressId: this.formData.id,
          addressContent: this.formData.address
        }
      }).then(response => {
        //这里使用了ES6的语法，不懂还是看看昨晚发的网址
        console.log(response.data); //请求成功返回的数据
        if(response.data.code == 10000) {
          this.$Message.success(response.data.msg);
          that.address[that.index].addressContent = this.formData.address;
          that.showItem = false;
          that.$nextTick(() => {
            that.showItem = true;
          });
          that.loadAddress();
          console.log(that.address);
          this.modal = false;
        } else {
          this.$Message.error(response.data.msg);
        }
      }).catch(
        error => console.log(error) //请求失败返回的数据
      );


      // this.$Message.success('修改成功');
    },
    del (index, id) {
      var that = this;
      var that = this;
      console.log(id);
      this.$Modal.confirm({
        title: '信息提醒',
        content: '你确定删除这个收货地址',
        onOk: () => {
          //this.$Message.success('删除成功');
          this.$axios({
            method: 'delete',
            url: 'http://kingwait.com/supermarket/user-address/'+id
          }).then(response => {
            //这里使用了ES6的语法，不懂还是看看昨晚发的网址
            console.log(response.data); //请求成功返回的数据
            if(response.data.code == 10000) {
              this.$Message.success(response.data.msg);
              that.edit(0,0);
              this.modal = false;
              that.address.pop(index)
              that.showItem = false;
              that.$nextTick(() => {
                that.showItem = true;
              });
              that.loadAddress();
              console.log(that.address);
            } else {
              this.$Message.error(response.data.msg);
            }
          }).catch(
            error => console.log(error) //请求失败返回的数据
          );
        },
        onCancel: () => {
          this.$Message.info('取消删除');
        }
      });
    },
    loadUser () {
      var that = this;
      var loginInfo = localStorage.getItem('loginInfo');
      loginInfo = JSON.parse(loginInfo);
      that.loginInfo = loginInfo;
      that.userName = loginInfo.userNickname;
      that.userId = loginInfo.userId;
      console.log(that.address);
    },
    goToAdd () {
      this.$router.push('/home/addAddress');
    }
  },
  components: {
    Distpicker
  },
  store
};
</script>

<style scoped>
.address-box {
  padding: 15px;
  margin: 15px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
}
.address-header {
  height: 35px;
  display: flex;
  justify-content: space-between;
  color: #232323;
  font-size: 18px;
}
.address-content {
  font-size: 14px;
}
.address-content-title {
  color: #999;
}
.address-action span{
  margin-left: 15px;
  font-size: 14px;
  color: #2d8cf0;
  cursor: pointer;
}
</style>
