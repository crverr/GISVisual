import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.axios = axios

import * as echarts from 'echarts';
Vue.prototype.echarts = echarts
// 适配flex
import '@/common/flexible.js';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
