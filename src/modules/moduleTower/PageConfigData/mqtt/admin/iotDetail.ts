/*
 * @Date: 2024-04-03 17:03:45
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-07 16:05:18
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/mqtt/admin/iotDetail.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { IotDeviceTemplate } from "@/modules/moduleTower/component/mqtt/iotCard";

export const iotDetail = async (
  that: stringAnyObj,
  IotCardInfo: IotDeviceTemplate
) => {
  
  return [] as gridCellTemplate[];
};
