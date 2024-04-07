/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-03 17:23:20
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/index.ts
 */
import { isValidKey } from "@/utils/index";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { MqttPageConfig } from "./main";
import { iotInfoList } from "./mqtt/admin/iotInfoList";
import { designDesktop } from "./design/index";
import { iotGroupList } from "./mqtt/admin/iotGroupList";
import { iotEventManage } from "./mqtt/admin/iotEventList";
import { iotDetail } from "./mqtt/admin/iotDetail";

export const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
    allPeopleCanSee: true,
    showLink: true,
  },
};
let pageConfig = {
  ...MqttPageConfig,
  ...designDesktop,
  IotDetail: {
    gridColNum: 4,
    cusStyle: {
      wholeScreen: false,
      Fullscreen: true,
      margin: 6,
      maxRows: 8,
      allPeopleCanSee: true,
      showLink: false,
    },
    name: "设备详情",
    desktopData: iotDetail,
  },
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
