import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import categoryChart from '@/components/category/chart.vue'
import categoryEdit from '@/components/category/edit.vue'
import goodAdd from '@/components/good/add.vue'
import goodEdit from '@/components/good/edit.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/categoryChart',
        component: categoryChart
      },
      {
        path: '/categoryEdit',
        component: categoryEdit
      },
      {
        path: '/goodAdd',
        component: goodAdd
      },
      {
        path: '/goodEdit',
        component: goodEdit
      },
      // { path: '/roles', component: Roles },
      // { path: '/categories', component: Cate },
      // { path: '/params', component: Params },
      // { path: '/goods', component: GoodsList },
      // { path: '/goods/add', component: Add },
      // { path: '/orders', component: Order },
      // { path: '/reports', component: Report }
    ]
  }
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router