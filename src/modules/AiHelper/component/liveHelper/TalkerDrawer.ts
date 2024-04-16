/*
 * @Date: 2024-04-10 20:53:37
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-14 14:03:35
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/liveHelper/TalkerDrawer.ts
 */

import {
  cardComponentType,
  cardOnChangeType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { drawerProps } from "@/modules/userManage/types";
import { stringAnyObj, talkCellMaker } from "../talkTool/talkBox";
import { checkContext } from "@/components/basicComponents/grid/module/cardApi";
import data from "@iconify-icons/ep/edit";
import { isMobile } from "@/utils/Env";

export enum InfoType {
  word = "word",
  img = "img",
  iframe = "iframe",
  customComponent = "customComponent",
}

export interface InfoCellTemplate extends stringAnyObj {
  type: InfoType;
  data?: stringAnyObj | string;
  timeOut?: number;
}

export const wordInfoMaker = (word: string, timeOut?: number) => {
  return {
    data: word,
    type: InfoType.word,
    timeOut,
  } as InfoCellTemplate;
};

export const AiTalkerDesktop = async () => {
  return [
    gridCellMaker(
      "talkBox",
      "talkBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_talkBox",
      },
      {
        props: {
          inputList: [talkCellMaker("user", "你好啊")],
        },
      }
    )
      .setSize(4, 6)
      .setPosition(8, 0),
    gridCellMaker(
      "inputBox",
      "inputBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_inputBox",
      },
      {
        props: {
          inputList: [talkCellMaker("user", "你好啊")],
        },
      }
    )
      .setSize(4, 2)
      .setPosition(8, 6),
  ] as gridCellTemplate[];
};

export const AiTalkerDesktop_mobile = async () => {
  return [
    gridCellMaker(
      "talkBox",
      "talkBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_talkBox",
      },
      {
        props: {
          inputList: [talkCellMaker("user", "你好啊")],
        },
      }
    ).setSize(4, 6),
    gridCellMaker(
      "inputBox",
      "inputBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_inputBox",
      },
      {
        props: {
          inputList: [talkCellMaker("user", "你好啊")],
        },
      }
    )
      .setSize(4, 2)
      .setPosition(0, 6),
  ] as gridCellTemplate[];
};

export const AiTalkerDrawer = (that) => {
  console.log(isMobile());
  closeAiHelperEasy(that);
  let drawer = {
    gridDesktop: true,
    size: isMobile() ? 100 : 100,
    fullscreenGridDesktop: true,
    bgColor: "rgba(0,0,0,0);box-shadow:none;",
    gridDesktopConfig: {
      gridColNum: isMobile() ? 4 : 12,
      desktopData: async () => {
        if (isMobile()) return await AiTalkerDesktop_mobile();
        else return await AiTalkerDesktop();
      },
      cusStyle: {
        wholeScreen: true,
        Fullscreen: true,
        margin: 6,
        maxRows: 8,
        allPeopleCanSee: true,
        showLink: true,
      },
    },
    afterClose: (that) => {
      openAiHelperEasy(that, wordInfoMaker("欢迎回来"));
    },
  } as drawerProps;
  openDrawerFormEasy(that, drawer);
};

export const closeAiHelper = (content: stringAnyObj) => {
  if (!checkContext(content, { a: 1 })) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {};
    data["AiHelper_liveHelper"] = false;
    content[func]("onChange", data, {
      type: [cardOnChangeType.moduleApi],
    });
  } catch (err) {
    console.error("closeAiHelper错误:", err, content, false);
  }
};

export const openAiHelper = (
  content: stringAnyObj,
  info: InfoCellTemplate = { type: InfoType.word, data: "你好" }
) => {
  if (!checkContext(content, { a: 1 })) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {};
    data["AiHelper_liveHelper"] = info;
    content[func]("onChange", data, {
      type: [cardOnChangeType.moduleApi],
    });
  } catch (err) {
    console.error("closeAiHelper错误:", err, content, false);
  }
};

export const openAiHelperEasy = (
  that: stringAnyObj,
  info?: InfoCellTemplate
) => {
  that.$modules
    .getModuleApi()
    ["AiHelper_openAiHelper"](
      that,
      info || { type: InfoType.word, data: "你好", timeOut: 1 }
    );
};

export const closeAiHelperEasy = (that: stringAnyObj) => {
  that.$modules.getModuleApi()["AiHelper_closeAiHelper"](that);
};
