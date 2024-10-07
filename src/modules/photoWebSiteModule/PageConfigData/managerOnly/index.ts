/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-07 18:58:52
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\managerOnly\index.ts
 */

import { cardComponentType, gridCellMaker, gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { tagManage } from "./tagManage";
import { categoryManage } from "./categoryManage";
import { userManage } from "./userManage";
import { collectionManage } from "./collectionManage";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { loraServerManage } from "./loraServer/loraServerManage";
import { imgFolderManage } from "./loraServer/imgFolder";
import { loraTrainTaskManage } from "./loraServer/loraTrainTask";

const pageConfig = {
  tagManage: {
    name: "标签管理",
    desktopData: tagManage,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      maxRows: 8,
      margin: 6,
    },
  },

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

  // categoryManage: {
  //   name: "相册管理",
  //   desktopData: categoryManage,
  //   gridColNum: 12,
  //   cusStyle: {
  //     showLink: true,
  //     wholeScreen: true,
  //     maxRows: 8,
  //     margin: 6,
  //     needGroupName: "管理员",
  //   },
  // },

  // userManage: {
  //   name: "用户管理",
  //   desktopData: userManage,
  //   gridColNum: 12,
  //   cusStyle: {
  //     showLink: true,
  //     wholeScreen: true,
  //     maxRows: 8,
  //     margin: 6,
  //     needGroupName: "管理员",
  //   },
  // },

  
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
