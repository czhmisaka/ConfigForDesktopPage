/*
 * @Date: 2024-04-03 17:03:45
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-08 22:37:17
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/mqtt/admin/iotDetail.ts
 */

import { addGridCell } from "@/components/basicComponents/grid/module/cardApi";
import {
  gridCellTemplate,
  gridPositionCell,
  gridSizeCell,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { IotDeviceTemplate } from "@/modules/moduleTower/component/mqtt/iotCard";
import { getIotDeviceCellGridDesktopCardComponent } from "@/modules/moduleTower/component/mqtt/iotGridCell/iotGridCell";
import {
  eventCenterCell,
  eventTriggerType,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { getQuery } from "@/router/util";
import { post } from "@/utils/api/requests";

export const iotDetailDesktop = async (
  that: stringAnyObj,
  IotCardInfo: IotDeviceTemplate
) => {
  return [] as gridCellTemplate[];
};

export const iotDetailInit_Mobile = eventCenterCell(
  eventTriggerType.onMounted,
  async (that, data) => {},
  "iotDetailInit_Mobile"
);

// 自动排版
export const checkSizeAndPosition = (
  gridCellList: gridCellTemplate[],
  一行几个格子: number = 3
) => {
  const createRowList = (number) => {
    let row = [];
    for (let i = 0; i < number; i++) {
      row.push(0);
    }
    return row;
  };

  let back = [] as gridCellTemplate[];
  // 存放当前行中的布局状态，0表示填满
  let rowList = [] as number[][];
  rowList.push(createRowList(一行几个格子));

  // 优先放最大的
  gridCellList.sort((a, b) => {
    const aSize =
      a.gridInfo.default.size.width * a.gridInfo.default.size.height;
    const bSize =
      b.gridInfo.default.size.width * b.gridInfo.default.size.height;
    return aSize - bSize;
  });

  // 一行四个格,限制最大格子 - 尽量等比缩放
  // 不设置最小占用，理论上最小一个一格
  gridCellList = gridCellList.map((x) => {
    const xWidth = x.gridInfo.default.size.width;
    if (xWidth > 一行几个格子) {
      const y = Math.round(
        (x.gridInfo.default.size.height * 一行几个格子) / xWidth
      );
      x.gridInfo.default.size.width = 一行几个格子;
      x.gridInfo.default.size.height = y;
    } else {
      x.gridInfo.default.size.width = Math.round(xWidth);
      x.gridInfo.default.size.height = Math.round(
        x.gridInfo.default.size.height
      );
    }
    return x;
  });

  // 尝试放进去
  // 还挺麻烦的
  const testGridHasRoom = (size: gridSizeCell) => {
    let position = { x: 0, y: 0 };
    let inRoom = false;

    // 判断
    const canInRoom = (
      size: gridSizeCell,
      position: gridPositionCell
    ): boolean => {
      if (position.x + size.width > 一行几个格子) return false;
      if (rowList.length < size.height + position.y) return false;
      for (let y = position.y; y < position.y + size.height; y++) {
        for (let x = position.x; x < position.x + size.width; x++) {
          if (rowList[y][x] == 1) return false;
        }
      }
      return true;
    };

    const setToRowList = (size: gridSizeCell, position: gridPositionCell) => {
      for (let y = position.y; y < position.y + size.height; y++) {
        for (let x = position.x; x < position.x + size.width; x++) {
          rowList[y][x] = 1;
        }
      }
    };

    for (let y = 0; y < rowList.length; y++) {
      const nowRow = rowList[y];
      for (let x = 0; x < nowRow.length; x++) {
        if (canInRoom(size, { x, y })) {
          inRoom = true;
          position = { x, y };
          setToRowList(size, position);
          break;
        }
      }
      if (y == rowList.length - 1 && !inRoom) {
        rowList.push(createRowList(一行几个格子));
        y = y - size.height > 0 ? y - size.height : 0;
      }
    }

    return position;
  };

  // 开始排版
  gridCellList.map((x) => {
    let size = {
      width: x.gridInfo.default.size.width,
      height: x.gridInfo.default.size.height,
    };
    let position = testGridHasRoom(size);
    x.setPosition(position.x, position.y);
    back.push(x);
  });

  return back;
};

export const openMobileDetailDrawer = (that, id) => {
  openDrawerFormEasy(that, {
    gridDesktop: true,
    size: 30,
    fullscreenGridDesktop: true,
    bgColor: "rgba(0,0,0,0);box-shadow:none;",
    gridDesktopConfig: {
      gridColNum: 3,
      desktopData: async () => await iotDetail(id),
      cusStyle: {
        wholeScreen: false,
        Fullscreen: true,
        margin: 6,
        maxRows: 8,
        allPeopleCanSee: true,
        showLink: true,
      },
    },
  });
};

export const iotDetail = async (id = "") => {
  if (id == "") id = getQuery().id;
  const init = eventCenterCell(
    eventTriggerType.onMounted,
    async (that) => {
      let res = await post("/admin/iot/iot/getIotInfo", {
        id,
        // needReReg: true,
      }).catch((e) => e);
      const iotInfo = {
        ...res,
        gridCell: res.gridCell,
      } as IotDeviceTemplate;
      // const gridCellList = JSON.parse(res.data.gridCell||'[]')
      let gridCellList = [] as gridCellTemplate[];
      iotInfo.gridCell.map((x) => {
        gridCellList.push(
          getIotDeviceCellGridDesktopCardComponent(
            { ...x, data: JSON.parse(x.data + "") },
            iotInfo
          )
        );
      });
      gridCellList = checkSizeAndPosition(gridCellList, that.sizeUnit.colNum);
      gridCellList.map((x) => {
        addGridCell(that, x);
      });
    },
    "Mobile_iotDetail"
  );
  return [init] as gridCellTemplate[];
};
