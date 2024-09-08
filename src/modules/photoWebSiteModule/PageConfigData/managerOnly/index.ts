/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-15 15:01:10
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { tagManage } from "./tagManage";
import { categoryManage } from "./categoryManage";
import { userManage } from "./userManage";
import { collectionManage } from "./collectionManage";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { loraServerManage } from "./loraServer/loraServerManage";
import { imgFolderManage } from "./loraServer/imgFolder";

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
  }

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

  // collectionManage: {
  //   name: "收藏夹管理",
  //   desktopData: collectionManage,
  //   gridColNum: 12,
  //   cusStyle: {
  //     showLink: true,
  //     wholeScreen: true,
  //     maxRows: 8,
  //     margin: 6,
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
