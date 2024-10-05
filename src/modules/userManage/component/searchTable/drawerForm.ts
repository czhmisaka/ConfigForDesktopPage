/*
 * @Date: 2022-11-21 08:55:57
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/searchTable/drawerForm.ts
 */

export const OpenDrawerBtn = () => {};

import {
  checkContext,
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { cardOnChangeType } from "@/components/basicComponents/grid/module/dataTemplate";
import drawerFormVue from "@/modules/userManage/component/searchTable/drawerForm.vue";
import {
  stringAnyObj,
  drawerProps,
  closeType,
  btnActionTemplate,
  btnCellTemplate,
  iconType,
} from "@/modules/userManage/types";
import { useModuleHook } from "@/store/modules/module";
import { isShallow } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";

export interface btnOptions {
  isShow?: (data: stringAnyObj) => boolean;
  isDisable?: (data: stringAnyObj) => boolean;
  drawerProps?: drawerProps;
  function?: (
    that: stringAnyObj,
    data?: stringAnyObj
  ) => Promise<void> | void | any | Promise<any>;
  url?: string;
  icon?: iconType;
  elType?:
    | "success"
    | "danger"
    | "primary"
    | "warning"
    | "info"
    | ""
    | ((
        data: stringAnyObj
      ) => "success" | "danger" | "primary" | "warning" | "info" | "");
  [key: string]: any;
}

/**
 * @name: btnMaker
 * @description: 自定义按钮生成函数
 * @authors: CZH
 * @Date: 2022-11-21 18:34:08
 */
export const btnMaker = (
  label: string,
  type: btnActionTemplate,
  options: btnOptions = {},
  apiList: string[] = [],
  showAbleKey: string = ""
): btnCellTemplate => {
  return {
    apiList,
    label,
    type,
    showAbleKey,
    isDisable: () => false,
    isLoading: false,
    elType:
      ["删除"].indexOf(label) > -1
        ? "danger"
        : ["编辑"].indexOf(label) > -1
        ? "success"
        : "primary",
    icon:
      label == "编辑"
        ? "Edit"
        : label == "删除"
        ? "Delete"
        : label == "提交"
        ? ""
        : "",
    ...options,
    isShow: (data: stringAnyObj, btn: btnCellTemplate) => {
      const { apiList, showAbleKey } = btn;
      let back = false;
      if (!btn.apiList || btn.apiList.length == 0)
        return options.isShow ? options.isShow(data) : true;
      const { nowLicense, nowShowAbleKey, userInfo } = useModuleHook();
      if (nowLicense && nowLicense.length > 0)
        back =
          apiList
            .map((x) => {
              return nowLicense.indexOf(x) == -1;
            })
            .filter(Boolean).length == 0;

      if (apiList.length == 0 && nowShowAbleKey && nowShowAbleKey.length > 0)
        back = nowShowAbleKey.indexOf(showAbleKey) != -1;
      if (userInfo.adminFlag) back = true;
      return back && options.isShow ? options.isShow(data) : back;
    },
  } as btnCellTemplate;
};

/**
 * @name: doubleCheckBtnMaker
 * @description: 二次确认按钮
 * @authors: CZH
 * @Date: 2022-12-14 14:56:27
 */
export const doubleCheckBtnMaker = (
  title: string,
  message: string,
  options: stringAnyObj = {}
) => {
  return new Promise((res, rej) => {
    ElMessageBox.confirm(message ? message : "删除", title ? title : "删除", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      showCancelButton: true,
      callback: async (action) => {
        if (action == "confirm") {
          res(true);
        } else {
          rej(false);
        }
      },
      ...options,
    });
  });
};

/**
 * @name: allProcessdoubleCheckBtnMaker
 * @description: waitForWriting
 * @authors: CZH
 * @Date: 2023-08-01 18:59:04
 * @param {*} btnName
 * @param {*} title
 * @param {function} message
 * @param {*} postFunc
 * @param {stringAnyObj} data
 */
export function allProcessdoubleCheckBtnMaker(
  btnName,
  title,
  message: (that: stringAnyObj, data: stringAnyObj) => string,
  postFunc: (
    that: stringAnyObj,
    data: stringAnyObj
  ) => Promise<stringAnyObj> | stringAnyObj,
  options: btnOptions = {}
) {
  return btnMaker(btnName, btnActionTemplate.Function, {
    function: async (that, data) => {
      if (
        await doubleCheckBtnMaker(title, message(that, data)).catch(
          (x) => false
        )
      )
        repBackMessageShow(that, await postFunc(that, data));
    },
    ...options,
  });
}

// 关闭按钮
export const closeBtn = btnMaker("结束", btnActionTemplate.Function, {
  icon: "Close",
  function: (that, data) => {
    if (that.close) that.close();
    else refreshDesktop(that);
  },
});

/**
 * @name: openDrawerForm
 * @description: moduleApi，BtnMaker 制作出来的按钮 响应drawerForm事件.
 * @authors: CZH
 * @Date: 2022-11-23 19:52:33
 */
export const openDrawerForm = (
  content: { [key: string]: any },
  value: drawerProps
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {};
    data[moduleName + drawerFormVue.name] = value;
    content[func]("onChange", data, {
      type: [cardOnChangeType.moduleApi],
    });
  } catch (err) {
    console.error("openDrawerForm_数据上报错误:", err, content, value);
  }
};

/**
 * @name: openDrawerForm
 * @description: moduleApi，BtnMaker 制作出来的按钮 响应drawerForm事件.
 * @authors: CZH
 * @Date: 2022-11-23 19:52:33
 */
export const closeDrawerForm = (content: { [key: string]: any }) => {
  if (!checkContext(content, { asd: 1 })) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {};
    data[moduleName + drawerFormVue.name] = false;
    content[func]("onChange", data, {
      type: [cardOnChangeType.moduleApi],
    });
  } catch (err) {
    console.error("openDrawerForm_数据上报错误:", err, content, false);
  }
};

/**
 * @name: repBackMessageShow
 * @description: 请求回调简易弹窗
 * @authors: CZH
 * @Date: 2023-02-09 10:46:52
 * @param {*} that
 * @param {*} res
 */
export const repBackMessageShow = (that, res, noRefresh = false) => {
  if (res["message"] == "成功" || "message") {
    that.$message.success("操作成功");
    if (!noRefresh)
      setTimeout(() => {
        that.close ? that.close() : refreshDesktop(that);
      }, 500);
  } else {
    console.log("错唔信息");
    // that.$message.error(res["message"]);
  }
};

/**
 * @name: openDrawerFormEasy
 * @description: 快速弹窗调用
 * @authors: CZH
 * @Date: 2023-02-09 10:54:24
 * @param {stringAnyObj} that
 * @param {drawerProps} drawerProps
 */
export const openDrawerFormEasy = (
  that: stringAnyObj,
  drawerProps: drawerProps
) => {
  that.$modules.getModuleApi()["userManage_openDrawerForm"](that, drawerProps);
};

/**
 * @name: openDrawerFormEasy
 * @description: 快速弹窗调用
 * @authors: CZH
 * @Date: 2023-02-09 10:54:24
 * @param {stringAnyObj} that
 * @param {drawerProps} drawerProps
 */
export const closeDrawerFormEasy = (that: stringAnyObj) => {
  that.$modules.getModuleApi()["userManage_closeDrawerForm"](that, false);
};

/**
 * @name: roleBtnMaker
 * @description: 权限按钮生成工具
 * @authors: CZH
 * @Date: 2023-08-28 10:03:32
 * @param {string} urls
 * @param {string} name
 */
export const roleBtnMaker = (urls: string[], name: string) => {
  return btnMaker("", btnActionTemplate.Function, {}, urls, name);
};

let component = {};
let moduleName = "userManage_";
component[drawerFormVue.name] = drawerFormVue;

export default {
  moduleApi: {
    btnMaker,
    btnActionTemplate,
    openDrawerForm,
    closeDrawerForm,
  },
  component,
};
