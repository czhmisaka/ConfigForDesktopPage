/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-07 19:00:30
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { PageConfig as ManageOnlyPageConfig } from "./managerOnly";
import { chosSearch, chosSearchMobile } from "./chosSearch";
import { myPicture } from "./myPicture";
import { desktopDataTemplate } from '../../userManage/types';
import { PictureListManage } from "./managerOnly/pictureListManage";
import { CategoryManage } from "./managerOnly/newCategoryManage";
import { collectionManage } from "./managerOnly/collectionManage";


const pageConfig = {
  main: {
    name: "图库",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      maxRows: 12,
      margin: 6,
    },
  },
  categoryManage: {
    name: "相册管理",
    desktopData: CategoryManage,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      maxRows: 12,
      margin: 6,
    },
  },
  collectionManage: {
    name: "收藏夹管理",
    desktopData: collectionManage,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      maxRows: 8,
      margin: 6,
    },
  },
  pictureListManage: {
    name: "批量上传",
    desktopData: PictureListManage,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      maxRows: 12,
      margin: 6,
    },
  },
  myPicture: {
    name: "暂存区",
    desktopData: myPicture,
    gridColNum: 12,
    cusStyle: {
      showLink: true,
      wholeScreen: true,
      Fullscreen: false,
      maxRows: 12,
      margin: 6,
    },
  },
  ...ManageOnlyPageConfig,
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
