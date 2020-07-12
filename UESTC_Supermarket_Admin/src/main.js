import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 改俊威的
axios.defaults.baseURL = 'http://47.98.174.14'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.token = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')