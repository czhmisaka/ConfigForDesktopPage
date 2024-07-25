/*
 * @Date: 2022-12-02 11:00:29
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-28 22:25:48
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/types.ts
 */

import {
  CardComponentTemplate,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import * as Icons from "@element-plus/icons-vue";
import { gridCellMaker } from "../../components/basicComponents/grid/module/dataTemplate";
import { searchCell } from "@/modules/userManage/component/searchTable/searchTable";
import { tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { Props } from "@vueuse/motion";
import { ComponentPropsOptions, PropType } from "vue";
import defineComponent from "../../views/login/utils/motion";
export type iconType = keyof typeof Icons;

export interface stringAnyObj {
  [key: string]: any;
}

export enum closeType {
  outLayerClickClose,
  btnClose,
}

/**
 * @name: btnCell
 * @description: 自定义事件按钮
 * @authors: CZH
 * @Date: 2022-11-21 17:11:45
 */
export enum btnActionTemplate {
  OpenDrawer = "OpenDrawer",
  Function = "Function",
  Url = "Url",
  UploadFunction='UploadFunction'
}

/**
 * @name: drawerProps
 * @description: 弹窗属性事件
 * @authors: CZH
 * @Date: 2022-11-23 22:49:56
 */
export interface drawerProps {
  title?: string;
  size?: number;

  schema?: {
    required: string[];
    [key: string]: any;
  };
  formProps?: stringAnyObj;
  data?: stringAnyObj;
  //  true 纯数据展示模式
  noEdit?: boolean;

  // true 开启全屏幕桌面模式，此时的按钮列表会隐藏
  fullscreenGridDesktop?: boolean;
  //  true 开启桌面模式 （需要搭配 gridDesktopConfig 属性使用
  gridDesktop?: boolean;
  gridDesktopConfig?: desktopDataTemplate;
  // 表单输入服务
  queryItemTemplate?: tableCellOptions[];

  // 弹窗背景色
  bgColor?: string;

  // 针对当前表单的按钮服务
  btnList?: btnCellTemplate[];

  afterFunction?: (closeType: closeType, that: stringAnyObj) => void;
}

export interface cusStyle {
  wholeScreen: boolean;
  maxRows: number;
  margin: number;
  // 全屏显示???这个忘了，应该是有问题的，回头改一下
  Fullscreen?: boolean;
  // 展示在菜单中
  showLink?: boolean;
  // 所有用户可见，避免无权限跳转
  allPeopleCanSee?: boolean;
  //
  noUserAndMenu?: boolean;
}

/**
 * @name: gridDesktopConfigTemplate
 * @description: 调起完整桌面服务的配置
 * @authors: CZH
 * @Date: 2023-02-09 14:55:34
 */
export interface desktopDataTemplate {
  [key: string]: any;
  desktopData?: () => Promise<gridCellTemplate[]> | gridCellTemplate[];
  // 列宽
  gridColNum?: number;
  // 自定义样式
  cusStyle?: cusStyle;
  // 预先载入的baseData
  preBaseData?: stringAnyObj;
  permission?: stringAnyObj[];
  dataPermission?: stringAnyObj[];
  // 当前页面使用的按钮列表（用于按钮权限处理）
  btnList?: btnCellTemplate[];
  // 全屏显示，去除menu和header
  Fullscreen?: boolean;
  // 直接载入路由配置
  InRouter?: boolean;
  // 自定义path
  RouterPath?: string;
}

export interface gridDesktopPropsTemplate extends desktopDataTemplate {
  componentLists?: {
    [key: string]: CardComponentTemplate;
  };
  fastMode?: boolean;
  noAnimate?: boolean;
  preBaseData: stringAnyObj;
}

/**
 * @name: btnCellTemplate
 * @description: 按钮对象
 * @authors: CZH
 * @Date: 2022-11-23 22:50:42
 */
export interface btnCellTemplate extends stringAnyObj {
  isShow: (data: stringAnyObj, btn: btnCellTemplate) => boolean;
  isDisable: (data: stringAnyObj) => boolean;
  // 按钮名称
  label: string;
  // 按钮类型
  type: btnActionTemplate;
  // 按钮icon
  icon?: iconType;
  // 主题色
  elType?: "success" | "danger" | "primary" | "warning";
  // 表单按钮详情
  drawerDetail?: drawerProps;
  // 函数按钮详情
  function?: (that: stringAnyObj, data?: stringAnyObj) => void;
  // 跳转按钮地址
  url?: string;
  // 按钮使用到的接口权限key
  apiList: string[];
  // 按钮key
  showAbleKey: string;
  uploadInfo?: {
    data: stringAnyObj;
    action: "";
    limit: 1;
    success: () => {};
  };
}

export interface PageDataTemplate extends stringAnyObj {
  data: stringAnyObj[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface tableCellOptionsInputPropertiesTemplate {
  // 字典属性
  dictKey?: string;
  // 表单属性
  propertiesOption?: stringAnyObj;
  // 输入值属性，不同输入方式有不同的数据解构方案
  inputOptions?: stringAnyObj;
  // 动态数据输入属性，其他同上
  funcInputOptionsLoader?: (
    obj: stringAnyObj
  ) => stringAnyObj | Promise<stringAnyObj>;
  // 当这个值被修改的时候触发的函数
  onChangeFunc?: (
    that: stringAnyObj,
    data: stringAnyObj,
    key?: string
  ) =>
    | Promise<tableCellOptions[] | void>
    | tableCellOptions[]
    | stringAnyObj
    | void;
  // 一些style
  style?: stringAnyObj;
  customComponent?: customComponent;
  [key: string]: any;
}

// 自定义组件渲染方案
export interface customComponent<P = {}> extends stringAnyObj {
  isLocalComponent?: Boolean;
  component: {
    setup?: (props, context) => any;
    props?: ComponentPropsOptions<P>;
    emits?: string[];

    name?: string;
    [key: string]: any;
  };
}

export interface tableCellOptionsInputTemplate
  extends tableCellOptionsInputPropertiesTemplate {
  type: formInputType;
}
export interface tableCellOptionsTableTemplate {
  fixed?: "left" | "none" | "right";
  showFunc?: (data: any, key: string, isPopover?: boolean) => any;
  type: showType;
  style?: stringAnyObj;
  sortable?: boolean;
  btnList?: btnCellTemplate[];
  noDetail?: boolean;
  [key: string]: any;
}

/**
 * @name: 表格单元配置
 * @description: tableCellOptions
 * @authors: CZH
 * @Date: 2022-11-10 09:30:21
 */
export interface tableCellOptions {
  input?: tableCellOptionsInputTemplate;
  table?: tableCellOptionsTableTemplate;
  [key: string]: any;
}

export enum showType {
  func,
  funcComponent,
  dataKey,
  btnList,
}

/**
 * @name: tableCellTemplate
 * @description: 表格单元
 * @authors: CZH
 * @Date: 2022-11-10 09:52:01
 */
export interface tableCellTemplate extends tableCellOptions {
  label: string;
  key: string;
  // 可用于表单可见判断
  showAble: boolean;
  [key: string]: any;
}

/**
 * @name: 表单输入类型
 * @description: formInputType
 * @authors: CZH
 * @Date: 2022-11-15 14:15:58
 */
export enum formInputType {
  customComponent = "customComponent",
  tabSelect = "tabSelect",
  customSelect = "customSelect",
  select = "select",
  selects = "selects",
  number = "number",
  inputList = "inputList",
  input = "input",
  areaCascader = "areaCascader",
  datePicker = "datePicker",
  timePicker = "timePicker",
  datePickerRanger = "datePickerRanger",
  timePickerRanger = "timePickerRanger",
  radioGroup = "radioGroup",
  radio = "radio",
  checkBox = "checkBox",
  upload = "upload",
  uploadImage = "uploadImage",
  uploadFileList = "uploadFileList",
  mobile = "mobile",
  idCard = "idCard",
  treeSelect = "treeSelect",
  treeSelectRemote = "treeSelectRemote",
  searchList = "searchList",
  searchTree = "searchTree",
  indexListForSwitch = "indexListForSwitch",
  button = "button",
  searchTable = "searchTable",
  gridDesktop = "gridDesktop",
  remoteDictSelect = "remoteDictSelect",
  textarea = "textarea",
  richTextArea = "richTextArea",
  underLine = "underLine",
  gridCellMaker = "gridCellMaker",
  cascader = "cascader",
  tableCellTemplate = "tableCellTemplate",
  switch = "switch",
}

/**
 * @name:  搭配formInputType规范组件注册函数的使用方案
 * @description: waitForWriting
 * @authors: CZH
 * @Date: 2022-12-07 19:15:01
 */
export interface inputElementTemplate {
  properties: (
    that: stringAnyObj,
    cell: tableCellTemplate
  ) => stringAnyObj | Promise<stringAnyObj>;
  uiSchema?: (
    that: stringAnyObj,
    cell: tableCellTemplate
  ) => stringAnyObj | Promise<stringAnyObj>;
}

export default {};
