/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-13 10:03:41
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { PageConfig as ManageOnlyPageConfig } from "./managerOnly";
import { chosSearch } from "./chosSearch";
export interface desktopDataTemplate {
  name: string;
  desktopData?: () => Promise<gridCellTemplate[]>;
  gridColNum?: number;
  cusStyle?: {
    wholeScreen: boolean;
    maxRows: number;
    margin: number;
  };
}

const pageConfig = {
  main: {
    name: "图库",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 12,
      margin: 12,
    },
  },
  // main1: {
  //   name: "全屏图库",
  //   desktopData: mainDesktop,
  //   gridColNum: 12,
  //   cusStyle: {
  //     showlink: false,
  //     wholeScreen: true,
  //     maxRows: 12,
  //     margin: 12,
  //     Fullscreen: true,
  //   },
  // },
  chosSearch: {
    name: "搜索图片",
    desktopData: chosSearch,
    gridColNum: 24,
    cusStyle: {
      showLink: false,
      wholeScreen: true,
      maxRows: 16,
      margin: 6,
      Fullscreen: true,
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
