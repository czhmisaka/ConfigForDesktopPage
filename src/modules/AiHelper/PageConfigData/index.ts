/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-09 13:54:58
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/PageConfigData/index.ts
 */
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { isValidKey } from "@/utils/index";

export const base = {
  name: "测试",
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
    allPeopleCanSee: true,
  },
};
let pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
