/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-11 00:14:16
 * @FilePath: \github\config-for-desktop-page\src\modules\main\PageConfigData\index.ts
 */
import { mainDesktop } from "./main";
import { mobileDesktop } from "./mobile/mobile";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";
import { eat } from "./eat";
import { gridCellMaker, cardComponentType } from "@/components/basicComponents/grid/module/dataTemplate";
import { imgFolderManage } from "@/modules/photoWebSiteModule/PageConfigData/managerOnly/loraServer/imgFolder";
import { loraServerManage } from "@/modules/photoWebSiteModule/PageConfigData/managerOnly/loraServer/loraServerManage";
import { loraTrainTaskManage } from "@/modules/photoWebSiteModule/PageConfigData/managerOnly/loraServer/loraTrainTask";

export const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
    allPeopleCanSee: true,
  },
};
let pageConfig = {
  loraServer: {
    name: 'loraServer管理',
    desktopData: loraServerManage,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      maxRows: 8,
      margin: 6,
    },
  },
  imgFolder: {
    name: "图集管理",
    desktopData: imgFolderManage,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      maxRows: 8,
      margin: 6,
    },
  },
  训练任务:{
    name:'lora训练任务',
    desktopData:loraTrainTaskManage,
    gridColNum:12,
    cusStyle:{
      showLink: true,
      wholeScreen: true,
      maxRows: 8,
      margin: 6,
    }
  },
  ComfyUi:{
    name:'ComfyUi',
    desktopData: async()=>{
      return [
        gridCellMaker('测试','test',{},{
          type:cardComponentType.componentList,
          name:'iframe'
        },{
          props:{
            url:'http://127.0.0.1:8188/'
          }
        }).setSize(12,8)
      ]
    },
    gridColNum:12,
    cusStyle:{
      showLink: true,
      wholeScreen: true,
      maxRows: 8,
      margin: 6
    },
   
  },
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
