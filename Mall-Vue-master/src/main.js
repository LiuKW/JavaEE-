// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import axios from 'axios';
Vue.prototype.$axios = axios; // 全局注册，使用方法为:this.$axios

Vue.use(iView);
Vue.config.productionTip = false;

axios.interceptors.request.use(config => {
  config.headers.token = window.localStorage.getItem('token');
  // config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
