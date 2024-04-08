/*
 * @Date: 2022-04-28 22:20:23
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-08 18:51:31
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/module/dataTemplate.ts
 */

import { cardUtil, setSize, setPosition } from "./util";
import { defineAsyncComponent, defineComponent, ref, h } from "vue";
import { createApp, markRaw } from "vue";
import { componentLists } from "./gridCard/module/componentLists";

export enum cardOnChangeType {
  upOnChange = "upOnChange",
  onChange = "onChange",
  forceRefresh = "forceRefresh",
  forceRefreshToOrgin = "forceRefreshToOrgin",
  gridCardListonChange = "gridCardListonChange",
  cardConfigChange = "cardConfigChange",
  cardConfigChangeNoMerge = "cardConfigChangeNoMerge",
  cardEdit = "cardEdit",
  cardDelete = "cardDelete",
  cardAdd = "cardAdd",
  openComponentsList = "openComponentsList",
  moduleApi = "moduleApi",
  highLightCard = "highLightCard",
  upEmit = "upEmit",
}

export const gridSizeConfig = (
  size: gridInfo_SizeType = gridInfo_SizeType.middle
): gridSizeCell => {
  const gridInfo_SizeTypeToGridSize = {
    small: gridSizeMaker(1, 1),
    middle: gridSizeMaker(2, 2),
    large: gridSizeMaker(4, 2),
  };
  return gridInfo_SizeTypeToGridSize[size];
};

export enum gridInfo_SizeType {
  small = "small",
  middle = "middle",
  large = "large",
}

export interface gridSizeCell {
  width: number;
  height: number;
  [key: string]: any;
}

export interface gridPositionCell {
  x: number;
  y: number;
}

export interface componentsGridInfo {
  default: {
    position: gridPositionCell;
    size?: gridSizeCell;
  };
  size: {
    middle: gridSizeCell;
    [key: string]: gridSizeCell;
  };
}

export const gridSizeMaker = (
  width = 1,
  height = 1,
  options: { [key: string]: any } = {}
): gridSizeCell => {
  return {
    width,
    height,
    ...options,
  };
};

export interface gridCellOptions {
  props?: {
    [key: string]: any;
  };
  isSettingTool?: Boolean;
  noAnimate?: Boolean;
  showInGridDesktop?: Boolean;
  [key: string]: any;
}

export interface gridOriginTemplate {
  class: string;
  userType?: string;
  checkFunc?: Function;
}

/**
 * @name: gridCellTemplate
 * @description: 组件布局属性
 * @authors: CZH
 * @Date: 2022-07-24 16:56:14
 */
export interface gridCellTemplate {
  label: string;
  labelNameCN: string;
  key: string;
  gridInfo: componentsGridInfo;
  gridOrigin?: gridOriginTemplate;
  component: cardComponent | any;
  options?: gridCellOptions;
  data?: {
    methods: {};
    params: {};
  };
  setSize: (
    width: number | string,
    height: number | string
  ) => gridCellTemplate;
  setPosition: (x: number | string, y: number | string) => gridCellTemplate;
  [key: string]: any;
}

/**
 * @name: cardComponentType
 * @description: 组件加载方式
 * @authors: CZH
 * @Date: 2022-05-16 18:43:10
 */
export enum cardComponentType {
  componentList = "componentList",
  fromData = "fromData", // 不推荐使用data保存组件
  cusComponent = "cusComponent", // 使用自定义组件
}

/**
 * @name: inputType
 * @description: 输入类型
 * @authors: CZH
 * @Date: 2022-05-19 14:38:50
 */
export enum inputType {
  text = "text",
  boolean = "boolean",
  number = "number",
  numberSlider = "numberSlider",
  obj = "object",
  functionEditor = "functionEditor",
  array = "array",
}

export interface CardComponentTemplate {
  name?: string;
  settingDetail: {
    props?: {
      [key: string]: {
        label: string;
        type: inputType;
        localData?: {
          [key: string]: any;
        };
      };
    };
    baseProps?: {
      [key: string]: any;
    };
    [key: string]: any;
  };
  component: any;
  componentInfo?: componentInfo;
  [key: string]: any;
}

export interface componentInfo {
  description?: string;
  label?: string;
  group?: string;
  context?: Array<any>;
  gridInfo?: { [key: string]: gridSizeCell };
  [key: string]: any;
}
export interface propInfo {
  [key: string]: {
    label: string;
    type: inputType;
    description?: string;
    localData?: {
      [key: string]: any;
    };
  };
}

/**
 * @name: cardComponentMaker
 * @description: 可用组件生成器
 * @authors: CZH
 * @Date: 2022-05-19 14:06:02
 */
export const cardComponentMaker = (
  component: any,
  props: propInfo = {},
  baseProps: { [key: string]: any } = {},
  componentInfo: componentInfo = {}
): CardComponentTemplate => {
  let cardComponent = {
    name: componentInfo.label,
    settingDetail: {
      props,
      baseProps,
    },
    componentInfo,
    component,
  } as CardComponentTemplate;
  return cardComponent;
};

/**
 * @name: cardComponent
 * @description: waitForWriting
 * @authors: CZH
 * @Date: 2022-05-19 16:00:11
 */
export interface cardComponent {
  name: string;
  type: cardComponentType;
  data?: string | any;
  getFunc?: (data: any) => any;
}

export const componentGetter = (
  component: cardComponent,
  componentLists: { [key: string]: any }
): any => {
  switch (component.type) {
    case cardComponentType.componentList:
      // console.log(
      //   "fuckcomponentList",
      //   Object.keys(componentLists).indexOf(component.name),
      //   componentLists,
      //   component.name
      // );
      if (Object.keys(componentLists).indexOf(component.name) > -1) {
        return markRaw(componentLists[component.name]);
      } else {
        return componentLists["iframe"];
      }
    case cardComponentType.fromData:
      if (!component.data) return "";
      return {
        // component:defineComponent(Function('"use strict";return (' + component.data + ')')().bind(ref))
        // component: defineComponent(eval('(()=>{return '+component.data+'})()')),
        component: createApp(eval("(()=>{return " + component.data + "})()")),
      };
    case cardComponentType.cusComponent:
      return { component: component.data };
      break;
  }
};

/**
 * @name: gridCellMaker
 * @description: 构建矩阵单元
 * @authors: CZH
 *  @Date: 2022-04-30 14:25:29
 * @param {string} label
 * @param {object} size
 * @param {object} options
 */
export const gridCellMaker = (
  label: string,
  labelNameCN: string,
  size: { [key: string]: gridSizeCell } = {},
  component: cardComponent | any,
  options: gridCellOptions
): gridCellTemplate => {
  let gridCell: gridCellTemplate = {
    label,
    labelNameCN,
    key: label,
    options: {
      showInGridDesktop: true,
      ...options,
    },
    component,
    gridInfo: {
      default: {
        position: {
          x: 0,
          y: 0,
        },
      },
      size: {
        middle: gridSizeMaker(2, 2),
        ...size,
      },
    },
  };
  gridCell.gridInfo.default.size =
    Object.keys(size).length > 0
      ? size[Object.keys(size)[0]]
      : gridSizeMaker(2, 2);
  for (let key in cardUtil) {
    gridCell[key] = cardUtil[key];
  }
  return gridCell;
};

export default {};
