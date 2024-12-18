/*
 * @Date: 2023-02-13 09:16:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-17 23:47:30
 * @FilePath: \github\config-for-desktop-page\src\router\modules\home.ts
 */
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const homeRouter: RouteConfigsTable = {
  path: "/",
  name: "Home",
  component: Layout,
  meta: {
    icon: "home-filled",
    title: "首页",
    rank: 0,
  },
  children: [
    {
      path: "/main_tran",
      name: "风格迁移",
      component: () => import("@/modules/main/trans.vue"),
      meta: {
        Fullscreen: true,
        wholeScreen: true,
        title: "风格迁移",
        showLink: false,
        allPeopleCanSee: true,
      },
    },
    // {
    //   path: "/main_tran_old",
    //   name: "风格迁移",
    //   component: () => import("@/modules/main/trans.vue"),
    //   meta: {
    //     Fullscreen: true,
    //     wholeScreen: true,
    //     title: "风格迁移",
    //     showLink: false,
    //     allPeopleCanSee: true,
    //   },
    // },
  ],
};

export default homeRouter;
