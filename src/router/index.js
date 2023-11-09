import { createRouter, createWebHistory } from 'vue-router'
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
                },
                {
                  path:'detail/:id',
                  component: () => import("@/views/company/store/StoreDetailView.vue"),
                }
              ]
            },
            {
              path: 'commodity',
              children: [
                {
                  path: 'all',
                  component: () => import("@/views/company/commodity/CommodityView.vue"),
                },
                {
                  path: 'detail/:id',
                  component: () => import("@/views/company/commodity/CommodityDetailView.vue"),
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
      //404页面
      path: "/:path(.*)",
      component: () => import("@/views/result/NotFound.vue")
    }
  ]
})

export default router
