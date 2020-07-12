<template>
  <div>
    <div class="pay-done-box">
      <img src="static/img/pay-success.png">
      <div style="text-align: center; margin-top: 30px;">
        <router-link to="/"><i-button type="primary" @click="payOrder">返回首页</i-button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayDone'
};
</script>

<style scoped>
.pay-done-box {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
