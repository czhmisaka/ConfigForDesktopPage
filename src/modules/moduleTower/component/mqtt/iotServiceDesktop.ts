/*
 * @Date: 2023-12-29 12:45:14
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-08 21:48:50
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotServiceDesktop.ts
 */

import {
  removeGridCell,
  addGridCell,
  changeCardSize,
  changeCardPosition,
} from "@/components/basicComponents/grid/module/cardApi";
import {
  gridCellMaker,
  cardComponentType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import {
  closeDrawerFormEasy,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  eventCenterCell,
  eventTriggerType,
  windowResizeChecker,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import { IotDeviceTemplate, iotCardGridCellMaker } from "./iotCard";

import { iotServiceCardGridCellMaker } from "./service/service";
import { getIotDeviceCellGridDesktopCardComponent } from "./iotGridCell/iotGridCell";
import { gridEditList } from "@/modules/main/PageConfigData/main";
import { useCacheHook } from "@/store/modules/cache";
import { post } from "@/utils/api/requests";

const wholeScreen = {
  size: {
    width: 12,
    height: 8,
  },
};

useCacheHook().setup(
  "allIot",
  async () => {
    let res = await post("/admin/iot/iot/getAll", {});
    return res.data;
  },
  true
);
export const getAllIotInfo = async () => {};

export const iotCardServiceDesktop = async () => {
  return [] as gridCellTemplate[];
};

// Iot设备弹窗
export const openDrawerForIotCardServiceDesktop = async (
  that,
  IotCardInfo: IotDeviceTemplate
) => {
  // 构建IotCard
  const iotInfoCardGridCell = iotCardGridCellMaker("iotInfo", IotCardInfo)
    .setSize(2, 2.5)
    .setPosition(0, 0);

  // 构建IotServiceCard
  const iotServiceCardGridCell = iotServiceCardGridCellMaker(
    "iotServiceCard",
    IotCardInfo
  )
    .setSize(2, 4)
    .setPosition(2, 0);

  // 构建gridCell
  let gridCellList = [] as gridCellTemplate[];
  if (IotCardInfo.gridCell) {
    IotCardInfo.gridCell.map((x) => {
      gridCellList.push(
        getIotDeviceCellGridDesktopCardComponent(x, IotCardInfo)
      );
    });
  }
  const init = eventCenterCell(
    eventTriggerType.onMounted,
    async (that, data) => {
      const closeBtn = (th) => {
        return gridCellMaker(
          "closeDesktop",
          "打开mqtt列表",
          {},
          {
            type: cardComponentType.componentList,
            name: "userManage_button",
          },
          {
            isSettingTool: true,
            props: {
              icon: "Close",
              onClickFunc: async ({ context, props }) => {
                removeGridCell(th, ["openMqttDeviceList"]);
                closeDrawerFormEasy(th);
              },
            },
          }
        )
          .setSize(
            0.5,
            0.5
          )
          .setPosition(
            11.5,
            0
          );
      };
      openDrawerFormEasy(that, {
        gridDesktop: true,
        size: 100,
        fullscreenGridDesktop: true,
        bgColor: "rgba(0,0,0,0);box-shadow:none;",
        gridDesktopConfig: {
          name: "开放平台应用管理界面-应用信息和管理界面",
          desktopData: async () => {
            return [
              iotInfoCardGridCell,
              iotServiceCardGridCell,
              ...(await iotCardServiceDesktop()),
              ...gridCellList,
              closeBtn(that),
              gridCellMaker(
                "editable",
                "编辑",
                {},
                {
                  name: "setting_editable",
                  type: cardComponentType.componentList,
                },
                {
                  isSettingTool: true,
                }
              )
                .setPosition(11, 7)
                .setSize(1, 1),
            ];
          },
          gridColNum: wholeScreen.size.width,
          cusStyle: {
            wholeScreen: false,
            Fullscreen: true,
            maxRows: wholeScreen.size.height,
            margin: 4,
          },
        },
      });
    },
    "openMqttDeviceList"
  );
  addGridCell(that, init);
};
