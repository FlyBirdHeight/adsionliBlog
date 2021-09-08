import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },{
    path: "/third",
    name: 'Third',
    redirect: '/third/structure-function',
    component: () => import('@/views/es6/第三章/index.vue'),
    children: [
      {
        path: 'structure-function',
        name: 'StructureFunction',
        component: () => import('../views/es6/第三章/structure-function.vue')
      }
    ]
  },{
    path: "/seventh",
    name: 'Seventh',
    component: () => import('@/views/es6/第七章/index.vue'),
  },{
    path: "/test",
    name: 'Test',
    redirect: '/test/change_data',
    component: () => import('@/views/test/index.vue'),
    children: [
      {
        path: 'change_data',
        name: 'ChangeData',
        component: () => import('../views/test/change_data.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
