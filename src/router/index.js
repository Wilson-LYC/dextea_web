import { createRouter, createWebHistory } from 'vue-router'
import cookie from '../cookie/cookie.js'
import { ElMessage } from 'element-plus'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import("@/views/frame/MainFrame.vue"),
      redirect: '/company/store/all',
      children: [
        {
          path: 'company',
          component: () => import("@/views/frame/CompanyFrame.vue"),
          redirect: '/company/store/all',
          children: [
            {
              path: 'store',
              children: [
                {
                  path: 'all',
                  component: () => import("@/views/company/store/StoreView.vue"),
                },
                {
                  path: 'openarea',
                  component: () => import("@/views/company/store/OpenAreaView.vue"),
                }
              ]
            },
            {
              path: 'staff',
              component: () => import("@/views/company/staff/StaffView.vue"),
            },
            {
              path: 'commodity',
              children: [
                {
                  path: 'category',
                  component: () => import("@/views/company/commodity/CategoryView.vue"),
                },
                {
                  path: 'all',
                  component: () => import("@/views/company/commodity/CommodityView.vue"),
                }
              ]
            }
          ]
        },
      ],
    },
    {
      path: '/login',
      name: '登录',
      component: () => import("@/views/login/LoginView.vue"),
    },
    {
      //页面不存在时跳转到404页面
      path: "/:path(.*)",
      redirect: "/404"
    },
    {
      path: '/404',
      name: '404',
      component: () => import("@/views/result/NotFound.vue"),
    }
  ]
})

/**
 * beforeEach:从一个页面跳转到另外一个页面时触发
 * to:要跳转的页面
 * from:从哪个页面出来
 * next:决定是否通过
 */
router.beforeEach((to, from, next) => {
  // 如果跳转的页面不存在，跳转到404页面
  if (to.matched.length === 0) {
    next('/404')
  }
  if (cookie.getCookie("token")) {
    next()
  } else {
    if (to.path === "/login") {
      next()
    } else {
      ElMessage.error("请先登录")
      next('/login')
    }
  }
})

export default router
