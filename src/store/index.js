import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import structure from "./modules/structure/index"
import utils from "./modules/utils/utils"
import router from "./modules/router/router"

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    structure,
    utils,
    router
  }
})
