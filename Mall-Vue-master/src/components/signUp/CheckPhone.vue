<template>
  <div class="info-form">
    <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate">
      <FormItem label="手机号" prop="phone"><i-input v-model="formValidate.phone" clearable size="large" placeholder="请输入手机号"></i-input></FormItem>
      <FormItem label="验证码" prop="checkNum">
        <i-input v-model="formValidate.checkNum" size="large" placeholder="请输入验证码">
          <Button slot="append" @click="getcheckNum" :disabled="isDisabled">{{ refreshTitle }}</Button>
        </i-input>
      </FormItem>
      <Button type="error" size="large" long @click="handleSubmit('formValidate')">验证手机号</Button>
    </Form>
  </div>
</template>

<script>
/* eslint-disable */
import store from '@/vuex/store';
import { mapMutations } from 'vuex';
export default {
  name: 'CheckPhone',
  data() {
    return {
      formValidate: {
        phone: '',
        checkNum: ''
      },
      ruleValidate: {
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { type: 'string', pattern: /^1[3-9]\d{9}$/, message: '手机号格式出错', trigger: 'blur' }],
        checkNum: [{ required: true, message: '必须填写验证码', trigger: 'blur' }, { type: 'string', min: 4, max: 4, message: '验证码长度错误', trigger: 'blur' }]
      },
      refreshTitle: '获取验证码', //初始化默认展示文字
      timer: null,
      countdown: 60, //初始化默认倒计时
      isDisabled: false
    };
  },
  methods: {
    ...mapMutations(['SET_SIGN_UP_SETP']),
    getcheckNum() {
      if (this.formValidate.phone.length === 11) {
        if (!this.timer) {
          this.countdown = 60;
          this.show = false;
          this.isDisabled = true;
          this.timer = setInterval(() => {
            if (this.countdown > 0 && this.countdown <= 60) {
              this.countdown--;
              this.refreshTitle = '重发(' + this.countdown + 's)';
            } else {
              clearInterval(this.timer);
              this.timer = null;
              this.isDisabled = false;
              this.refreshTitle = '重发';
            }
          }, 1000);
        }
        /* this.$Message.success({
          content: '验证码为: 1234',
          duration: 6,
          closable: true
        }); */
		this.$axios({
		  method: 'get',
		  url: 'http://kingwait.com/supermarket/user/code/' + this.formValidate.phone
		}).then(response => {
		  //这里使用了ES6的语法，不懂还是看看昨晚发的网址
		  console.log(response.data); //请求成功返回的数据
		  if(response.data.code == 10000) {
		    this.$Message.success(response.data.msg);
		  } else {
		    this.$Message.error(response.data.msg);
		  }
		}).catch(
		  error => console.log(error) //请求失败返回的数据
		);
      } else {
        this.$Message.error({
          content: '请输入正确的手机号',
          duration: 6,
          closable: true
        });
      }
    },
    handleSubmit(name) {
      // 提交验证
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.formValidate.phone);
          this.$axios({
            method: 'post',
            url: 'http://kingwait.com/supermarket/user/code/',
            data: {
              userPhone: this.formValidate.phone,
              code: this.formValidate.checkNum
            }
          }).then(response => {
            //这里使用了ES6的语法，不懂还是看看昨晚发的网址
            console.log(response.data); //请求成功返回的数据
            if(response.data.code == 10000) {
              this.$router.push({ path: '/SignUp/inputInfo', query: { phone: this.formValidate.phone } });
              this.SET_SIGN_UP_SETP(1);
            } else {
              this.$Message.error({
                content: '验证码错误',
                duration: 6,
                closable: true
              });
            }
          }).catch(
            error => console.log(error) //请求失败返回的数据
          );
        } else {
          this.$Message.error({
            content: '请填写正确的信息',
            duration: 6,
            closable: true
          });
        }
      });
    }
  },
  store
};
</script>

<style scoped>
.info-form {
  width: 90% !important;
}
</style>
