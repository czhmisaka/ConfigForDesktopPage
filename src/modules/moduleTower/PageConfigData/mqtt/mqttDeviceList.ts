/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-02-20 23:25:50
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/mqtt/mqttDeviceList.ts
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
const wholeScreen = {
  size: {
    width: 12,
    height: 16,
  },
};
export function getXpx(vw) {
  return vw / (document.body.clientWidth / wholeScreen.size.width);
}
export function getYpx(vh) {
  return vh / (document.body.clientHeight / wholeScreen.size.height);
}

const sizeGetter = () => {
  return {
    mqttDeviceList: {
      width: wholeScreen.size.width - getXpx(60),
      height: wholeScreen.size.height,
    },
    closeDesktop: {
      width: getXpx(60),
      height: getYpx(60),
    },
  };
};
const positionGetter = () => {
  return {
    mqttDeviceList: {
      x: 0,
      y: 0,
    },
    closeDesktop: {
      x: wholeScreen.size.width - getXpx(60),
      y: 0,
    },
  };
};

let timeOut = null as any;
const windowResize = windowResizeChecker(async (that, baseData) => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, sizeGetter());
    changeCardPosition(that, positionGetter());
  }, 50);
}, "windowResize");

export const mqttDeviceListDesktop = async (): Promise<gridCellTemplate[]> => {
  const 设备字段存储库 = new SearchCellStorage([
    tableCellTemplateMaker("clientId", "clientId"),
    tableCellTemplateMaker("createTime", "createTime"),
    tableCellTemplateMaker("icon", "icon"),
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("name", "name"),
    tableCellTemplateMaker("status", "status"),
    tableCellTemplateMaker("uniqueId", "uniqueId"),
    tableCellTemplateMaker("updateTime", "updateTime"),
  ]);
  const 编辑设备 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Edit",
    function: async (that, data) => {
      let drawerProps = {
        title: "编辑",
        queryItemTemplate: 设备字段存储库.getByKeyArr(["name", "uniqueId"]),
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  });
 
  const 操作栏 = tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([编辑设备], {})
  );
  设备字段存储库.push(操作栏);
  return [
    gridCellMaker(
      "mqttDeviceList",
      "搜索结果列表",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          modeChange: true,
          // isCard:true,
          searchItemTemplate: [],
          showItemTemplate: 设备字段存储库.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/iot/device/searchByName", {
              ...query,
            });
            return {
              ...res.data,
              ...res.data.pagination,
            };
          },
          btnList: [],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(
        sizeGetter().mqttDeviceList.width,
        sizeGetter().mqttDeviceList.height
      ),
    windowResize,
  ];
};

export const openDrawerforMqttDeviceListDesktop = async (that) => {
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
            sizeGetter().closeDesktop.width,
            sizeGetter().closeDesktop.height
          )
          .setPosition(
            positionGetter().closeDesktop.x,
            positionGetter().closeDesktop.y
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
            return [...(await mqttDeviceListDesktop()), closeBtn(that)];
          },
          gridColNum: wholeScreen.size.width,
          cusStyle: {
            wholeScreen: true,
            Fullscreen: true,
            maxRows: wholeScreen.size.height,
            margin: 0,
          },
        },
      });
    },
    "openMqttDeviceList"
  );
  addGridCell(that, init);
};
