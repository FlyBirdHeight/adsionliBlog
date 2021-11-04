import Vue from 'vue'
import VueRouter from 'vue-router'
import RouteHandle from "./handle"
import Page from "@/views/page/index.vue"
import store from "@/store/index.js"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/main/Home.vue')
  }, {
    path: '/fileing',
    name: 'Fileing',
    component: () => import('@/views/main/Fileing.vue')
  }, {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/main/Mine.vue')
  }, {
    path: '/catalogue',
    name: 'Catalogue',
    component: () => import('@/views/main/Catalogue.vue')
  }, {
    path: "/error404",
    name: "Error",
    component: () => import('@/views/main/error404.vue')
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
    path: "/face",
    name: "Face",
    redirect: '/face/constructor',
    component: () => import('@/views/face/index.vue'),
    children: [
      {
        path: 'constructor',
        name: 'Constructor',
        component: () => import('@/views/face/construct_prototype/index.vue')
      },
      {
        path: "test",
        name: 'FaceTest',
        redirect: '/face/test/change_data',
        component: () => import('@/views/face/test/index.vue'),
        children: [
          {
            path: 'change_data',
            name: 'ChangeData',
            component: () => import('@/views/face/test/change_data.vue')
          }
        ]
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
        component: () => import('@/views/utils/regular/index.vue')
      }
    ]
  }, {
    path: "/test",
    name: "Test",
    redirect: '/test/total',
    component: () => import('@/views/test/index.vue'),
    children: [
      {
        path: "total",
        name: 'TotalTest',
        component: () => import('@/views/test/total.vue'),
      },
      {
        path: "regular_test",
        name: 'RegularTest',
        component: () => import('@/views/test/regular_test.vue'),
      },
      {
        path: "component_test",
        name: 'ComponentTest',
        component: () => import('@/views/test/component_test.vue'),
      }
    ]
  }, {
    path: '/page',
    name: 'Page',
    component: Page,
    children: []
  },
]

const router = new VueRouter({
  routes
})
router['handle'] = new RouteHandle();

router.beforeEach((to, from, next) => {
  router.handle.beforeRouteSkip(to, from)
  if(to.matched.length == 0){
    next('/error404');
  }
  if (to.matched.length == 1 && to.matched[0].path == '/page') {
    let routerData = store.getters.getPageDataRouter;
    if (routerData.length > 0) {
      if (typeof (routerData[0].component) != 'undefined') {
        next(routerData[0].redirect)
      } else {
        next(`/page/${routerData[0].path}`)
      }
    } else {
      next('/')
    }
  }
  next()
})

export default router
