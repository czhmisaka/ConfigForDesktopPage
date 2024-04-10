/*
 * @Date: 2022-11-03 16:40:47
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-10 19:34:35
 * @FilePath: /ConfigForDesktopPage/types/shims-vue.d.ts
 */
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

declare module "vuedraggable/src/vuedraggable";
declare module "@pureadmin/components";
declare module "@pureadmin/theme";
declare module "@pureadmin/theme/dist/browser-utils";
declare module "@/assets/svg/*.svg?component";
declare module "*.svg";
declare module "*.png";
