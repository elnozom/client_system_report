import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
 mode:"history",
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/views/theme/Base"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/views/pages/Dashboard.vue"),
        },
        {
          path: "/cashtry",
          name: "cashtry",
          component: () => import("@/views/pages/cashtry/index.vue"),
        },
        {
          path: "/cashtry-open",
          name: "cashtry-open",
          component: () => import("@/views/pages/cashtry/open.vue"),
        },
        {
          path: "/top",
          name: "top",
          component: () => import("@/views/pages/topsales/index.vue"),
        },
        {
          path: "/suppliers-balance",
          name: "suppliers-balance",
          component: () => import("@/views/pages/suppliers/balnace.vue"),
        },
        {
          path: "/account-balance",
          name: "account-balance",
          component: () => import("@/views/pages/accounts/Balance.vue"),
        },
        {
          path: "/driver-totals",
          name: "driver-totals",
          component: () => import("@/views/pages/employee/DriverTotals.vue"),
        },
        {
          path: "/cash-flow",
          name: "cash-flow",
          component: () => import("@/views/pages/cashtry/flow.vue"),
        },
        {
          path: "/balance-of-trade",
          name: "balance-of-trade",
          component: () => import("@/views/pages/accounts/BalanceOfTrade.vue"),
        },
        {
          path: "/trans-cycle",
          name: "trans-cycle",
          component: () => import("@/views/pages/accounts/TransCycle.vue"),
        },
        {
          path: "/stock",
          name: "stock",
          component: () => import("@/views/pages/items/Stock.vue"),
        },
      ],
      
      
    },

    {
      path: "/",
      component: () => import("@/views/pages/auth/Auth"),
      children: [
        {
          name: "login",
          path: "/login",
          component: () => import("@/views/pages/auth/Login"),
        },
      ],
    },
    {
      path: "/server-err",
      name: "error",
      component: () => import("@/views/pages/error/Server-Down.vue"),
    },
    {
      path: "*",
      redirect: "/404",
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/views/pages/error/Error-1.vue"),
    },
  ],
});
