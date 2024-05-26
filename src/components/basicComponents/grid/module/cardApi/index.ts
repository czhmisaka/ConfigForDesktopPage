/*
 * @Date: 2022-08-21 00:08:11
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-26 01:09:34
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/module/cardApi/index.ts
 */

import { stringAnyObj } from "@/modules/ApplicationManage/types";
import {
  cardOnChangeType,
  gridCellOptions,
  gridPositionCell,
  gridSizeCell,
} from "../dataTemplate";
import { deepClone } from "./deepClone";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";

/**
 * @name: checkContext
 * @description: 检查context对象以及输入value是否存在
 * @authors: CZH
 * @Date: 2022-08-17 19:12:22
 * @param {object} content
 * @param {object} value
 */
export const checkContext = (
  content: { [key: string]: any },
  value: { [key: string]: any }
) => {
  if (Object.keys(value).length == 0)
    console.error("数据上报错误:", "当前上报数据为空");
  else if (!content) console.error("setData_数据上报错误:", "没有组件对象");
  else return true;
};

/**
 * @name: deepMerge
 * @description: 合并两个对象，如有存在相同的key,则target优先,不要删除注释
 * @authors: CZH
 * @Date: 2022-08-23 23:58:35
 * @param {any} target
 * @param {any} other
 */
export const deepMerge = (target: any, other: any) => {
  const targetToString = Object.prototype.toString.call(target);
  // console.log(target, "option ", other);
  if (targetToString === "[object Object]") {
    for (let [key, val] of Object.entries(other)) {
      if (key in target) {
        target[key] = deepMerge(target[key], val);
      } else {
        target[key] = val;
      }
    }
  }
  // else if (targetToString === "[object Array]") {
  //     for (let [key, val] of Object.entries(other)) {
  //         if (target[key]) {
  //             target[key] = deepMerge(target[key], val);
  //         } else {
  //             target.push(val);
  //         }
  //     }
  // }
  return target;
};

/**
 * @name: setData
 * @description: 简易组件数据推送到桌面baseData的工具
 * @authors: CZH
 * @Date: 2022-07-29 16:25:14
 */
export const setData = (
  content: {
    [key: string]: any;
  },
  value: { [key: string]: any }
): void => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func]("onChange", deepClone(value), {
      type: [cardOnChangeType.onChange],
    });
  } catch (err) {
    console.error("setData_数据上报错误:", err, content, value);
  }
};

/**
 * @name: changeVisible
 * @description: 组件可视状态修改
 * @authors: CZH
 * @Date: 2022-08-17 20:07:07
 * @param {object} content
 * @param {object} value
 */
export const changeVisible = (
  content: { [key: string]: any },
  value: { [key: string]: Boolean }
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {} as gridCellOptions;
    Object.keys(value).map((name: string) => {
      data[name] = {
        options: { showInGridDesktop: value[name] },
      };
    });
    content[func]("onChange", data, {
      type: [cardOnChangeType.cardConfigChange],
    });
  } catch (err) {
    console.error("changeVisible 错误:", err, content, value);
  }
};

/**
 * @name: changeCardPosition
 * @description: 使用组件名称修改组件位置
 * @authors: CZH
 * @Date: 2022-08-17 21:01:15
 * @param {object} content
 * @param {object} value
 */
export const changeCardPosition = (
  content: { [key: string]: any },
  value: { [key: string]: gridPositionCell }
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {} as gridCellOptions;
    Object.keys(value).map((name: string) => {
      data[name] = {
        gridInfo: {
          default: {
            position: value[name],
          },
        },
      };
    });
    content[func]("onChange", data, {
      type: [cardOnChangeType.cardConfigChange],
    });
  } catch (err) {
    console.error("changeVisible 错误:", err, content, value);
  }
};

/**
 * @name: changeCardSize
 * @description: 使用组件名称修改组件Size
 * @authors: CZH
 * @Date: 2022-08-17 21:01:15
 * @param {object} content
 * @param {object} value
 */
export const changeCardSize = (
  content: { [key: string]: any },
  value: { [key: string]: gridSizeCell }
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {} as gridCellOptions;
    Object.keys(value).map((name: string) => {
      data[name] = {
        gridInfo: {
          default: {
            size: value[name],
          },
        },
      };
    });
    content[func]("onChange", data, {
      type: [cardOnChangeType.cardConfigChange],
    });
  } catch (err) {
    console.error("changeVisible 错误:", err, content, value);
  }
};

/**
 * @name: changeCardProperties
 * @description: 修改组件配置参数
 * @authors: CZH
 * @Date: 2022-09-08 10:06:40
 * @param {object} content
 * @param {*} value
 */
export const changeCardProperties = (
  content: { [key: string]: any },
  value: { [key: string]: any },
  noMerge = false
) => {
  if (!checkContext(content, value)) return;
  // try {
  let func = content["$emit"] ? "$emit" : "emit";
  let data = {} as gridCellOptions;
  Object.keys(value).map((name: string) => {
    if (noMerge) {
      data[name] = value[name];
    } else {
      data[name] = {
        options: {
          props: value[name],
        },
      };
    }
  });
  content[func]("onChange", data, {
    type: [
      noMerge
        ? cardOnChangeType.cardConfigChangeNoMerge
        : cardOnChangeType.cardConfigChange,
    ],
  });
  // } catch (err) {
  //   console.error("changeVisible 错误:", err, content, value);
  // }
};

/**
 * @name: refreshDesktop
 * @description: 刷新桌面
 * @authors: CZH
 * @Date: 2022-12-05 19:32:21
 */
export const refreshDesktop = (content: { [key: string]: any }) => {
  if (!checkContext(content, { 1: 1 })) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func](
      "onChange",
      {},
      {
        type: [cardOnChangeType.forceRefresh],
      }
    );
  } catch (err) {
    console.error("refreshDesktop 错误:", err, content, { 1: 1 });
  }
};

/**
 * @name: highLightComponent
 * @description: 高亮组件
 * @authors: CZH
 * @Date: 2022-12-05 19:32:21
 */
export const highLightComponent = (
  content: { [key: string]: any },
  value: string[] = []
) => {
  if (!checkContext(content, { 1: 1 })) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func]("onChange", value, {
      type: [cardOnChangeType.highLightCard],
    });
  } catch (err) {
    console.error("highLightComponent 错误:", err, content, value);
  }
};

/**
 * @name: addGridCell
 * @description: 添加一个组件
 * @authors: CZH
 * @Date: 2022-12-05 19:32:21
 */
export const addGridCell = (
  content: { [key: string]: any },
  value: gridCellTemplate
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func]("onChange", value, {
      type: [cardOnChangeType.cardAdd],
    });
  } catch (err) {
    console.error("highLightComponent 错误:", err, content, value);
  }
};

/**
 * @name: removeGridCell
 * @description: 删除一个组件
 * @authors: CZH
 * @Date: 2022-12-05 19:32:21
 */
export const removeGridCell = (
  content: { [key: string]: any },
  value?: string[]
) => {
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func]("onChange", value, {
      type: [cardOnChangeType.cardDelete],
    });
  } catch (err) {
    console.error("highLightComponent 错误:", err, content, value);
  }
};

/**
 * @name: upToTopDataChange
 * @description: 触发 griddesktop 的onchange 上报事件
 * @authors: CZH
 * @Date: 2023-02-08 10:35:37
 */
export const upToTopDataChange = (
  content: { [key: string]: any },
  value: { [key: string]: any }
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func]("onChange", value, {
      type: [cardOnChangeType.upOnChange],
    });
  } catch (err) {
    console.error("upToTopDataChange 错误:", err, content, value);
  }
};

/**
 * @name: upToTopDataChange
 * @description: 触发 griddesktop 的onchange 上报事件
 * @authors: CZH
 * @Date: 2023-02-08 10:35:37
 */
export const upEmit = (
  content: { [key: string]: any },
  value: { [key: string]: stringAnyObj }
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func]("onChange", value, {
      type: [cardOnChangeType.upEmit],
    });
  } catch (err) {
    console.error("upToTopDataChange 错误:", err, content, value);
  }
};

/**
 * @todo @czh 开发中
 * @name: baseDataWatcher
 * @description: 快速生成baseData数据的监听器
 * @authors: CZH
 * @Date: 2022-11-10 15:23:17
 * @param {object} model
 */
export const baseDataWatcher = (model: { [key: string]: any } = {}) => {
  let watchMap = {} as { [key: string]: any };
  return watchMap;
};

export const moduleApi = (apiName: string) => {};

export default {
  setData,
  changeCardPosition,
  changeCardProperties,
  changeCardSize,
  changeVisible,
};
