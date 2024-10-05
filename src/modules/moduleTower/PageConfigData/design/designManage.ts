/*
 * @Date: 2024-02-29 09:32:39
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-01 15:15:22
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/design/designManage.ts
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  addGridCell,
  removeGridCell,
} from "@/components/basicComponents/grid/module/cardApi/index";
import {
  btnActionTemplate,
  desktopDataTemplate,
  drawerProps,
  stringAnyObj,
  tableCellTemplate,
} from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import {
  SearchCellStorage,
  actionCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnMaker,
  closeDrawerFormEasy,
  doubleCheckBtnMaker,
  openDrawerFormEasy,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { list } from "postcss";
import { gridEditList } from "@/modules/main/PageConfigData/main";
import {
  eventCenterCell,
  eventTriggerType,
  windowResizeChecker,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import { IotDeviceTemplate } from "../../component/mqtt/iotCard";
import { base } from "../index";

export const designManage = async () => {
  let designCellStorage = new SearchCellStorage([]);
  return [] as gridCellTemplate[];
};
