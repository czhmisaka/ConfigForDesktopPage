/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-03 17:22:02
 * @FilePath: /ConfigForDesktopPage/src/store/modules/module.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { stringAnyObj } from "@/modules/userManage/types";
import { initRouter } from "@/router/utils";
import { useRouter } from "vue-router";

import {
  flatChildrenArr,
  getModuleFromView,
  modulesCellTemplate,
  timeChecker,
} from "@/router/util";
import { RouteConfigsTable, routerMeta } from "../../../types";
import { get, post } from "@/utils/api/requests";
import { useMultiTagsStoreHook } from "./multiTags";
import { useUserStoreHook } from "@/store/modules/user";
import { isUrl } from "@pureadmin/utils";
import { timeConsole } from "@/router/util";
import modulesLIst from "@/layout/components/modules/modulesLIst.vue";

let licenseMap = {};
let showAbleKeyMap = {};

interface pageCellTemplate extends stringAnyObj {
  name?: string;
  id?: string;
  meta?: routerMeta;
}

interface moduleTemplate {
  nowModule: pageCellTemplate;
  moduleList: pageCellTemplate[];
  nowPage: pageCellTemplate;
  pageList: pageCellTemplate[];
  routerBackup: RouteConfigsTable[];
  nowLicense: string[];
  nowShowAbleKey: string[];
  userInfo: {
    loginAdminFlag: boolean;
    [key: string]: any;
  };
  isLoading: boolean;
}

function getFatherNameList(list, id) {
  let nameList = [];
  let searchId = id;
  while (searchId > 0) {
    list.map((x) => {
      if (x.id == searchId) {
        nameList = [x.name].concat(nameList);
        searchId = x.parentId;
      }
    });
  }
  return nameList;
}

/**
 * @name: dealAsyncMenuList
 * @description: 处理异步路由
 * @authors: CZH
 * @Date: 2022-12-19 09:35:30
 */
function dealAsyncMenuList(cell, routerBackup, wholeCell) {
  // cell.type：1-模块，2-目录，3-菜单，4-按钮
  const wholeCellList = flatChildrenArr(wholeCell);
  // 排除按钮
  if (cell.type == 4) {
    const pageId = "page_" + cell.parentId;
    cell.urls.map((x) => {
      licenseMap[pageId]
        ? licenseMap[pageId].push(x)
        : (licenseMap[pageId] = [x]);
    });
    showAbleKeyMap[pageId]
      ? showAbleKeyMap[pageId].push(cell.key)
      : (showAbleKeyMap[pageId] = [cell.key]);

    return false;
  }

  if (cell.showLink == false) return false;

  // 判断是否需要处理子节点
  if (cell.children && cell.children.length > 0)
    cell.children = cell.children
      .map((x) => dealAsyncMenuList(x, routerBackup, wholeCell))
      .filter(Boolean)
      .sort((a, b) => a.orderNumber - b.orderNumber);

  // 检查目录下是否存在菜单,如果一个目录下没有菜单则移除
  if (cell.type == 2) {
    if (!cell.children || cell.children.length == 0) return false;
    const flatMenuArr = flatChildrenArr(cell.children).filter(
      (x) => x.type == 3
    );
    if (!flatMenuArr || flatMenuArr.length == 0) return false;
  }

  // 检查模块下是否存在拥有菜单的目录，如不存在则移除整个模块
  if (cell.type == 1) {
    if (!cell.children || cell.children.length == 0) return false;
    const flatIndexMenuArr = flatChildrenArr(cell.children).filter(
      (x) => x.type == 3
    );
    if (!flatIndexMenuArr || flatIndexMenuArr.length == 0) return false;
  }

  if (cell.type == 3) {
    if (cell.children && cell.children.length == 0) {
      delete cell.children;
    }
  }

  // 补充meta
  if (!cell.meta || typeof cell.meta != "object") {
    if (typeof cell.meta == "string" && cell.meta != "") {
      let data = {};
      data = JSON.parse(cell.meta.replaceAll("'", '"'));
      cell.meta = {
        title: cell.name,
        icon: cell.icon,
        menuId: cell.id,
        ...data,
      };
    } else {
      let meta = {
        title: cell.name,
        icon: cell.icon,
        menuId: cell.id,
      };
      cell.meta = meta;
    }
  }

  // 补充path
  if (cell.urls && cell.urls.length > 0) {
    cell["path"] = cell.urls[0];
    if (cell.type == 3) {
      if (isUrl(cell["path"])) {
        cell.meta = {
          ...cell.meta,
          frameSrc: cell.path,
        };
        if (cell.path[0] != "/") cell.path = "/" + cell.name;
      } else {
        for (let i = 0; i < routerBackup.length; i++) {
          if (routerBackup[i].path == cell.path) {
            // 获取目标路由
            let backup = routerBackup[i];
            // 补充基本信息
            let nameList = getFatherNameList(wholeCellList, cell.parentId);
            cell.component = backup.component;
            cell.path =
              (nameList.length > 1 ? "/" + nameList.join("/") : "") +
              "/" +
              cell.name;
            cell.meta = {
              ...backup.meta,
              ...cell.meta,
              PageName: cell.urls[0],
              showLink: cell.showLink || backup.meta.showLink,
            };
            console.log(cell);
            break;
          }
        }
      }
    }
  } else {
    cell["path"] = "/" + cell.name;
  }
  return cell;
}

const getNowModulePage = (nowModules) => {
  if (
    nowModules.children &&
    nowModules.children.length > 0 &&
    nowModules.children[0].children &&
    nowModules.children[0].children.length > 0
  ) {
    return nowModules.children[0].children[0];
  } else if (
    nowModules.children &&
    nowModules.children.length > 0 &&
    nowModules.children[0]
  ) {
    return nowModules.children[0];
  }
  return false;
};

export const moduleStore = defineStore({
  id: "module-info",
  state: (): moduleTemplate => ({
    moduleList: [],
    pageList: [],
    routerBackup: [],

    nowModule: {},
    nowPage: {},
    nowLicense: [],
    nowShowAbleKey: [],
    userInfo: {
      loginAdminFlag: false,
    },
    isLoading: false,
  }),
  actions: {
    async clear() {
      this.moduleList = [];
      this.pageList = [];
      this.routerBackup = [];
      this.nowModule = {};
      this.nowPage = {};
      this.nowLicense = [];
      this.nowShowAbleKey = [];
      this.userInfo = {
        loginAdminFlag: false,
      };
      this.isLoading = false;
    },

    async init(resData) {
      timeConsole.checkTime("处理路由");
      this.isLoading = false;
      let moduleList = [];
      this.userInfo = await useUserStoreHook().getOptions();

      timeConsole.checkTime("处理路由-预加载");
      // 注入各个模块的展示界面
      await this.initRouterBackup();
      timeConsole.checkTime("处理路由-预加载");

      timeConsole.checkTime("处理路由-预处理");
      // 预处理
      // @ToDo 这里可能会导致一个加载问题
      if (resData && resData.length && resData.length > 0)
        resData?.map((x) => {
          moduleList.push(dealAsyncMenuList(x, this.routerBackup, resData));
        });
      this.moduleList = moduleList
        .filter(Boolean)
        .sort((a, b) => a.orderNumber - b.orderNumber);
      timeConsole.checkTime("处理路由-预处理");
      // 默认加载第一个模块
      if (this.moduleList.length > 0) {
        this.nowModule = this.moduleList[0];
      }
      this.isLoading = true;
      timeConsole.checkTime("处理路由");
    },

    checkWhichIsNowModule() {},

    async initRouterBackup() {
      // 注入各个模块的展示界面
      const moduleList = await getModuleFromView(false);
      let baseModuleRouterList = [] as RouteConfigsTable[];
      moduleList.map((module: modulesCellTemplate, index: number) => {
        module.routers.map((route: RouteConfigsTable, i: number) => {
          route.children
            ? route.children.map((cell: RouteConfigsTable) => {
                baseModuleRouterList.push(cell);
              })
            : baseModuleRouterList.push(route);
        });
      });
      this.routerBackup = baseModuleRouterList;
    },

    // 切换moduleList
    async checkModule(
      number: number = 0,
      path = "/",
      needOpenNew: Boolean = false
    ) {
      if (number > this.moduleList.length - 1)
        number = this.moduleList.length - 1;
      this.nowModule = this.moduleList[number];
      const { multiTags } = useMultiTagsStoreHook();
      if (multiTags && multiTags["length"] > 0) {
        setTimeout(() => {
          useMultiTagsStoreHook().handleTags("splice", "", {
            startIndex: 1,
            length: multiTags["length"],
          });
        }, 100);
      }

      // 此处按照产品的要求，打开一个新的页面展示与当前模块不一致的情况
      // if (needOpenNew) {
      // 这一段是测试用的
      if (false) {
        const targetPage = getNowModulePage(this.nowModule);
        if (targetPage) {
          const path = `${location.href.split("#")[0]}#${targetPage.path}`;
          window.open(path);
        }
      } else {
        let router = await initRouter(true);
        router.push(path);
      }
      return this.nowModule;
    },

    async searchToPage(pagePath: string) {
      timeConsole.checkTime("searchToPage");
      let targetModuleIndex = -1;
      for (let i = 0; i < this.moduleList.length; i++) {
        const pageList = flatChildrenArr(this.moduleList[i].children);
        pageList.map((x) => {
          if (x.path == pagePath) {
            targetModuleIndex = i;
          }
        });
      }
      if (targetModuleIndex != -1)
        await this.checkModule(targetModuleIndex, pagePath);
      timeConsole.checkTime("searchToPage");
      return targetModuleIndex == -1 ? false : true;
    },

    isThatAPage(path): stringAnyObj | boolean {
      path = decodeURI(path);
      // 直接前往当前模块的首页
      if (path == "/") return true;
      let page = false;
      let pageList = [];
      this.moduleList.map((x) => {
        pageList = pageList.concat(flatChildrenArr(x.children));
      });
      pageList.map((x) => {
        if (x.path == path) page = x;
      });
      // 首次匹配前触发模块加载操作，故不处理
      if (pageList.length == 0) return true;
      return page;
    },

    // 切换路由需要记录
    checkPage(pageMeta: routerMeta) {
      this.nowPage.meta = pageMeta;
      this.nowLicense = licenseMap["page_" + pageMeta.menuId];
      this.nowShowAbleKey = showAbleKeyMap["page_" + pageMeta.menuId];
      if (pageMeta.menuId) localStorage.setItem("menuId", pageMeta.menuId);
    },
  },
});

export function useModuleHook() {
  return moduleStore(store);
}
