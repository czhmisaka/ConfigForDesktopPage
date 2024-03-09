/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-08 14:23:04
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/index.ts
 */
import { isValidKey } from "@/utils/index";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { MqttPageConfig } from "./main";
import { iotInfoList } from "./mqtt/admin/iotInfoList";
import { designDesktop } from "./design/index";
import { iotGroupList } from "./mqtt/admin/iotGroupList";
import { iotEventManage } from "./mqtt/admin/iotEventList";

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
  ...MqttPageConfig,
  ...designDesktop,
  IotInfoList: {
    ...base,
    name: "设备列表",
    desktopData: iotInfoList,
  },
  iotGroupList: {
    ...base,
    name: "分组列表",
    desktopData: iotGroupList,
  },
  iotEventList: {
    ...base,
    name: "事件列表",
    desktopData: iotEventManage,
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
