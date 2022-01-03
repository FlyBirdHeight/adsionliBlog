import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
require('@/utils/utils')
/**
 * @description 预读取文章列表json文件，以及标签列表json文件
 */
import TagList from "./data/tag_list.json"
store.commit('SET_TAG_LIST', TagList.tag)

Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../public/scss/index.scss';
Vue.use(ElementUI);
import axios from 'axios'
Vue.prototype.axios = axios

import Highlight from './utils/highlight.js';
Vue.use(Highlight);

import Analysis from "@/modules/analysis/index.js";
Vue.prototype.analysis = new Analysis();
require('./componets_register.js')
//动态添加路由
import DynamicRoute from '@/router/dynamic_route.js';
import HandlePageList from "./funcs/utils/page"
let handlePageList = new HandlePageList;
handlePageList.handlePagePath().then(res => {
  res = res.sort((a, b) => {
    if (a.toTop == b.toTop) {
      let aDate = new Date(a.created_at)
      let bDate = new Date(b.created_at)
      return bDate.getTime() - aDate.getTime()
    }
    return b.toTop - a.toTop
  });
  store.commit('SET_PAGE_LIST', res)
  let dynamicRoute = new DynamicRoute(res, router);
  dynamicRoute.generateRoute();
  router.handle.concatCoverData(res)
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

});
