import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/index.scss';
Vue.use(ElementUI);
import axios from 'axios'
Vue.prototype.axios = axios

import Analysis from "@/modules/analysis/index.js";
Vue.prototype.analysis = new Analysis();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
