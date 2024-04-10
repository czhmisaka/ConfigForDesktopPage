/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-09 08:50:38
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { gridEditList } from "@/modules/main/PageConfigData/main";
import {
  mqttDeviceListDesktop,
  openDrawerforMqttDeviceListDesktop,
} from "./mqtt/mqttDeviceList";
import {
  changeCardSize,
  changeCardPosition,
  highLightComponent,
  changeCardProperties,
  changeVisible,
} from "@/components/basicComponents/grid/module/cardApi";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";
import {
  IotDeviceTemplate,
  iotCardGridCellMaker,
} from "../component/mqtt/iotCard";
import { openDrawerForIotCardServiceDesktop } from "../component/mqtt/iotServiceDesktop";
import {
  IotDeviceServiceType,
  iotServiceCardGridCellMaker,
} from "../component/mqtt/service/service";
import { IotDeviceCellGridDesktopType } from "../component/mqtt/iotGridCell/iotGridCell";
import { post } from "@/utils/api/requests";
import { markRaw } from "vue";
const wholeScreen = {
  size: {
    width: 16,
    height: 8,
  },
};

const iotCard = {
  size: { width: 2, height: 2 },
};

export const mainDesktop = async (): Promise<gridCellTemplate[]> => {
  const hoverFunc = {
    hoverInFunc: async (that, data) => {
      const { position, size } = JSON.parse(
        JSON.stringify(that.detail.gridInfo.default)
      );
      position.x =
        position.x + size.width + size.width > wholeScreen.size.width
          ? position.x - size.width
          : position.x + size.width;
      changeCardPosition(that, {
        iotServiceCard: {
          x: position.x,
          y: position.y,
        },
      });
      changeCardSize(that, {
        iotServiceCard: {
          width: size.width,
          height: size.height * 2,
        },
      });
      changeCardProperties(that, {
        iotServiceCard: {
          deviceInfo: data,
        },
      });
      highLightComponent(that, [that.detail.label, "iotServiceCard"]);
      changeVisible(that, {
        iotServiceCard: true,
      });
    },
    hoverOutFunc: async (that, data) => {
      highLightComponent(that, []);
      changeVisible(that, {
        iotServiceCard: false,
      });
    },
  };

  const iotCardGridCellList = markRaw(
    (await post("/admin/iot/iot/list", {})).data
      .map((x) => {
        return {
          ...x,
          gridCell: JSON.parse(x.gridCell),
          service: JSON.parse(x.service),
        };
      })
      .map((data, i) => {
        return iotCardGridCellMaker(data.mainTopic, data, {
          clickFunc: async (that, data) => {
            openDrawerForIotCardServiceDesktop(that, data);
          },
          ...hoverFunc,
        })
          .setPosition(
            Math.floor(i / (wholeScreen.size.height / iotCard.size.height)) *
              iotCard.size.width,
            (i % (wholeScreen.size.height / iotCard.size.height)) *
              iotCard.size.height
          )
          .setSize(iotCard.size.width, iotCard.size.height);
      })
  );
  const iotServiceCardGridCell = iotServiceCardGridCellMaker(
    "iotServiceCard",
    {
      nameEn: "",
    },
    false
  );

  return [
    gridCellMaker(
      "openMqttDeviceListBtn",
      "打开设备列表按钮",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_button",
      },
      {
        isSettingTool: true,
        props: {
          type: "default",
          label: "设备列表",
          icon: "Grid",
          onClickFunc: async ({ context, props }) => {
            openDrawerforMqttDeviceListDesktop(context);
          },
        },
      }
    )
      .setSize(1, 1)
      .setPosition(2, 2),
    ...iotCardGridCellList,
    iotServiceCardGridCell,
    // ...gridEditList,
  ];
};

export const MqttPageConfig = {
  MAIN: {
    name: "设备展示",
    desktopData: mainDesktop,
    gridColNum: wholeScreen.size.width,
    cusStyle: {
      margin: 6,
      wholeScreen: false,
      maxRows: wholeScreen.size.height,
      Fullscreen: false,
      showLink: false,
    },
    menuId: "12",
  },
};
