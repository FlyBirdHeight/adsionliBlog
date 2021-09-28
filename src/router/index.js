import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/main/Home.vue')
  },{
    path: '/fileing',
    name: 'Fileing',
    component: () => import('@/views/main/Fileing.vue')
  }, {
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
  }, {
    path: "/seventh",
    name: 'Seventh',
    component: () => import('@/views/es6/第七章/index.vue'),
    children: [
      {
        path: "first",
        name: 'SeventhFirst',
        component: () => import('@/views/es6/第七章/first.vue'),
      },
      {
        path: "second",
        name: 'SeventhSecond',
        component: () => import('@/views/es6/第七章/second.vue'),
      }
    ]
  }, {
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
  }, {
    path: "/face",
    name: "Face",
    redirect: '/face/constructor',
    component: () => import('@/views/face/index.vue'),
    children: [
      {
        path: 'constructor',
        name: 'Constructor',
        component: () => import('../views/face/construct_prototype/index.vue')
      }
    ]
  }, {
    path: "/utils",
    name: 'Utils',
    redirect: '/utils/regular',
    component: () => import('@/views/utils/index.vue'),
    children: [
      {
        path: 'regular',
        name: 'Regular',
        component: () => import('../views/utils/regular/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  next();
})

export default router
