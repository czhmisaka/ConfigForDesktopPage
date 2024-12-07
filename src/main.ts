/*
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2024-12-07 22:56:38
 * @FilePath: /ConfigForDesktopPage/src/main.ts
 */
import { getAction, getModuleFromView, timeChecker } from "@/router/util";
import { useCardStyleConfigHook } from "./store/modules/cardStyleConfig";
import { createApp, Directive } from "vue";
import App from "./App.vue";
import iconCell from "./components/basicComponents/cell/icon/iconCell.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { useUserStoreHook } from "./store/modules/user";
import { MotionPlugin } from "@vueuse/motion";
import * as Icons from "@element-plus/icons-vue";
import utils from "./utils";
import Vue3DraggableResizable from "vue3-draggable-resizable";
import { getServerConfig } from "@/utils/config/appConfig";
import { injectResponsiveStorage } from "@/utils/responsive";
import { setupStore } from "@/store";

// useUserStoreHook().getOptions();
const app = createApp(App);

// 引入重置样式
import "./style/reset.scss";
// 导入公共样式
import "./style/index.scss";
import "element-plus/dist/index.css";
import "@pureadmin/components/dist/index.css";
import "@pureadmin/components/dist/theme.css";
import "@pureadmin/components/dist/dark.scss";
// 导入字体图标
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";

// 全局注册`@iconify/vue`图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon,
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);
// 自定义指令

import * as directives from "@/directives";
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 全局注册按钮级别权限组件
import { Auth } from "@/components/ReAuth";
app.component("Auth", Auth);
for (let x in Icons) {
  if (utils.isValidKey(x, Icons)) {
    app.component(x, Icons[x]);
  } else {
  }
}
app.component("vue-drag-resize", Vue3DraggableResizable);
getServerConfig(app).then(async (config) => {
  const moduleList = await getModuleFromView(true);
  console.log(moduleList, "PageName");
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  setupStore(app);
  app.config.globalProperties.$modules = await getAction();
  app.config.globalProperties.$utils = utils;
  app.use(MotionPlugin).use(ElementPlus, { zIndex: 100000 });
  app.mount("#app");
  useCardStyleConfigHook().init();
});

import "animate.css";
import { post } from "./utils/api/requests";

