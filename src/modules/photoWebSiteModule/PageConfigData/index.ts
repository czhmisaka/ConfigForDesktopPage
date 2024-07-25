/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-28 21:53:41
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/index.ts
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


const pageConfig = {
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
