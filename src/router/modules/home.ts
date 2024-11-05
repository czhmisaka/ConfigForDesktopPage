/*
 * @Date: 2023-02-13 09:16:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-11-04 02:17:14
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
  ],
};

export default homeRouter;
