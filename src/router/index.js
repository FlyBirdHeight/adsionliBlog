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
    path: "/first",
    name: 'First',
    redirect: '/first/structure-function',
    component: () => import('@/views/first/first.vue'),
    children: [
      {
        path: 'structure-function',
        name: 'StructureFunction',
        component: () => import('../views/first/structure-function.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
