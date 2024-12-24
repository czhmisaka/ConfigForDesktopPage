/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2024-12-24 09:01:53
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/output.ts
 */
export const moduleInfo = {
  name: "AiHelper",
  title: "AI助手",
  icon: "EL_ElemeFilled",
  info: "提供ai功能入口",
  author: "czh",
};

import liveHelper from "@/modules/AiHelper/component/liveHelper/index.vue";
import { closeAiHelper, openAiHelper } from "./component/liveHelper/TalkerDrawer";

export const output = async () => {
  return {
    moduleApi: {
      closeAiHelper,
      openAiHelper,
    },
    CardApiInjectComponent: {
      // liveHelper,
    },
  };
};

// 模组打包配置
export const modulePackConfig = {};