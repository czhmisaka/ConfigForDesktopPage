/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-26 01:26:13
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { PageConfig as ManageOnlyPageConfig } from "./managerOnly";
import { chosSearch, chosSearchMobile } from "./chosSearch";
// import { myPicture } from "./myPicture";
import { desktopDataTemplate } from '../../userManage/types';


const pageConfig = {
  main: {
    name: "图库",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      showLink:true,
      wholeScreen: true,
      maxRows: 12,
      margin: 6,
    },
  },
  // myPicture: {
  //   name: "暂存区",
  //   desktopData: myPicture,
  //   gridColNum: 12,
  //   cusStyle: {
  //     showLink: false,
  //     wholeScreen: true,
  //     Fullscreen: false,
  //     maxRows: 12,
  //     margin: 6,
  //   },
  // },
  // chosSearch: {
  //   name: "搜索图片",
  //   desktopData: chosSearch,
  //   gridColNum: 24,
  //   cusStyle: {
  //     showLink: true,
  //     wholeScreen: true,
  //     maxRows: 16,
  //     margin: 12,
  //     Fullscreen: true,
  //   },
  // },
  // chosSearchs: {
  //   name: "搜索图片手机端",
  //   desktopData: chosSearchMobile,
  //   gridColNum: 8,
  //   cusStyle: {
  //     showLink: true,
  //     wholeScreen: true,
  //     maxRows: 16,
  //     margin: 6,
  //     Fullscreen: true,
  //   },
  // },
  // ...ManageOnlyPageConfig,
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
