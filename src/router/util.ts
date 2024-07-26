/*
 * @Date: 2022-04-29 14:11:20
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-26 01:13:33
 * @FilePath: /ConfigForDesktopPage/src/router/util.ts
 */
import { menuInfoTemplate } from "./../components/menu/menuConfigTemplate";
import { CardComponentTemplate } from "../components/basicComponents/grid/module/dataTemplate";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");
import { desktopDataTemplate, stringAnyObj } from "@/modules/userManage/types";
import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";
import { useCacheHook } from "@/store/modules/cache";
import { collapseItemProps } from "element-plus";

// 函数执行时间计算
export const timeChecker = class {
  name: string;
  startTime: number;
  checkTimeMap: stringAnyObj;
  checkNumMap: stringAnyObj;
  showConsole: boolean;
  constructor(name, showConsole: boolean = false) {
    this.name = name;
    this.startTime = new Date().getTime();
    this.checkTimeMap = {};
    this.checkNumMap = {};
    this.showConsole = showConsole;
  }
  getTime = (word: string | number = " ") => {
    if (!this.showConsole) return;
    console.log(this.name, word, new Date().getTime() - this.startTime + "ms");
  };

  checkTime = (word: string, extraWord: string = "") => {
    extraWord += " " + decodeURI(window.location.href);
    if (!this.showConsole) return;
    if (!this.checkTimeMap[word]) {
      this.checkTimeMap[word] = new Date().getTime();
      console.log(
        this.name,
        word + extraWord,
        "start",
        new Date().getTime() - this.startTime + "ms"
      );
    } else {
      console.log(
        this.name,
        word + extraWord,
        `耗时【${new Date().getTime() - this.checkTimeMap[word]}ms】`,
        "end",
        new Date().getTime() - this.startTime + "ms"
      );
      this.checkTimeMap[word] = "";
    }
  };

  checkNum = (word: string) => {
    if (!this.showConsole) return;
    if (this.checkNumMap[word]) {
      console.log(
        this.name,
        word,
        this.checkNumMap[word]++,
        "节点时间",
        new Date().getTime() - this.startTime + "ms"
      );
    } else {
      this.checkNumMap[word] = -1;
      console.log(
        this.name,
        word,
        this.checkNumMap[word]++,
        "节点时间",
        new Date().getTime() - this.startTime + "ms"
      );
    }
  };
};

export let timeConsole = new timeChecker("模块生成");

// 获取当前地址中的query参数
export const getQuery = (): { [key: string]: any } => {
  const hash =
    new URL(window.location.href).hash.split("?").length > 1
      ? new URL(window.location.href).hash
      : new URL(window.location.href).hash + "?";
  const query = {};
  hash
    .split("?")[1]
    .split("&")
    .map((x) => {
      const list = x.split("=");
      if (list.length === 2) {
        query[list[0]] = list[1];
      }
    });
  return {
    ...query,
  };
};

/**
 * @name: metaInfoTemplate
 * @description: 路由meta数据控制
 * @authors: CZH
 * @Date: 2022-04-29 14:45:01
 */
export interface metaInfoTemplate {
  menuInfo: {
    asideMenu: boolean | Array<menuInfoTemplate>;
    headerMenu: boolean | Array<menuInfoTemplate>;
  };
  options: {
    [key: string]: any;
  };
}

/**
 * @name: routerCellMaker
 * @description: 路由单元构建函数
 * @authors: CZH
 * @Date: 2022-04-29 14:49:39
 */
export const routerCellMaker = (
  path: string,
  name: string,
  component: any,
  options: {
    meta?: { [key: string]: any };
    router?: { [key: string]: any };
  } = {},
  children?: RouteConfigsTable[]
): RouteConfigsTable => {
  let routerCell: RouteConfigsTable = {
    path,
    name,
    component,
    children,
    meta: {
      title: name,
      icon: "bxs:package",
      // 这里的false可能需要根据用户的登录身份修改
      showLink: false,
      ...options["meta"],

      // 这个属性用于标注这个路由的来源 ，只有超级管理员能保持一直可见
      moduleBackUpRouter: true,
    },
    ...options["router"],
  };
  return routerCell;
};

/**
 * @name: modulesCellTemplate
 * @description: 模块生成模板
 * @authors: CZH
 * @Date: 2022-11-07 16:05:19
 */
export interface modulesCellTemplate {
  name: string;
  path: string;
  routers: any[];
  isReady: boolean;
  pageConfigIsReady: boolean;
  pageMap: stringAnyObj;
  components: {
    [key: string]: CardComponentTemplate;
  };
  output?: { [key: string]: any };
  children?: { [key: string]: any }[];
  baseInfo?: {
    info: string;
    output?: boolean;
    authorize?: string;
    fitScreenSize?: string;
    [key: string]: any;
  };
}

let moduleList = [] as modulesCellTemplate[];
let action = {} as stringAnyObj;

/**
 * @name: getModuleFromView
 * @description: 从@/modules文件夹中遍历并生成模块文件列表,基于模块单体页面构建，不参与主体页面构建流程，自带动画效果
 * @authors: CZH
 * @Date: 2022-10-23 21:51:34
 * @param {*} basePath
 */
export const getModuleFromView = async (init = false) => {
  timeConsole.checkTime("模块加载", "开始");
  if (!init) {
    await new Promise((res) => {
      let interval = setInterval(() => {
        if (
          moduleList &&
          moduleList.length > 0 &&
          moduleList.filter((x) => x.isReady).length ==
          moduleList.filter((x) => x.components).length
        ) {
          clearInterval(interval);
          timeConsole.checkTime("模块加载", "实际结束");
          res(true);
        }
      }, 100);
    });
    return moduleList;
  }

  // 如果你找到了这里的 require.context 搜索出了问题，先看一下是不是出现了空文件夹，如有则删除。  -- czh 20221109
  // 感谢自己，表现形式可能为 undifined files -- czh 20230116
  // again ，可能需要做一个更好的提示信息 -- czh 20230209
  // fuck 迁移这种规模的代码都有点困难 -- czh 20230618
  // 好消息，现在我们改成了import(试图) -- czh 20230706
  // TMD为什么组件加载时间这么长，请不要把组件当成页面写 -- czh 20231120
  moduleList = [] as modulesCellTemplate[];
  const importModule = import.meta.glob("@/modules/**", {});
  const requireList = Object.keys(importModule) as string[];
  const requireModule = async (fileName: string): Promise<any> => {
    return await importModule[fileName]();
  };
  // 文档路径
  const pageConfigData = "PageConfigData/index.ts";

  const component = "component/index.ts";
  const mainPage = "Index.vue";
  const output = "output.ts";
  const router = "router/index.ts";

  /**
   * @name: getModuleName
   * @description: 获取模组名(文件夹名)
   * @authors: CZH
   * @Date: 2022-11-07 14:42:27‘
   * @param {string} fileName
   */
  function getModuleName(fileName: string): string {
    return fileName.split("/src/modules/")[1].split("/")[0];
  }

  /**
   * @name: getDealName
   * @description: 获取当前所需处理的对象名
   * @authors: CZH
   * @Date: 2022-11-07 14:53:40
   * @param {string} fileName
   */
  function getDealName(fileName: string, len: number = 5): string {
    return fileName.split("/").length < len
      ? ""
      : fileName
        .split("/")
        .filter((x: any, i: number) => i >= len - 1)
        .join("/");
  }

  /**
   * @name: getFileNameLength
   * @description: 获取当前处理对象长度
   * @authors: CZH
   * @Date: 2022-11-07 14:54:12
   * @param {string} fileName
   */
  function getFileNameLength(fileName: string): number {
    return fileName.split("/").length;
  }
  /**
   * @name: dealRequireList
   * @description: 处理函数
   * @authors: CZH
   * @Date: 2022-11-07 14:54:37
   * @param {function} checkFunc
   * @param {function} dealFunc
   */
  function dealRequireList(
    checkFunc: (dealName: string, len: number) => boolean,
    dealFunc: (fileName: string, isLast: boolean) => Promise<void>,
    afterFunc: () => void = () => { }
  ) {
    const dealList = requireList.filter(async (fileName: string) => {
      return checkFunc(getDealName(fileName), getFileNameLength(fileName));
    });
    dealList.map(async (fileName: string, i: number) => {
      if (checkFunc(getDealName(fileName), getFileNameLength(fileName))) {
        await dealFunc(fileName, dealList.length - 1 == i);
      }
      if (dealList.length - 1 == i) {
        afterFunc && afterFunc();
      }
    });
  }

  // 处理获取到模块，构建基础的模块列表
  dealRequireList(
    (dealName, len) => {
      return dealName == mainPage && len == 5;
    },
    async (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.push({
        name: moduleName,
        path: `@/modules/${moduleName}/`,
        isReady: false,
        pageConfigIsReady: false,
        routers: [
          routerCellMaker(
            `/${moduleName}`,
            moduleName,
            () => import(`@/modules/${moduleName}/Index.vue`),
            {},
            []
          ),
        ],
        pageMap: {},
        baseInfo: { info: "" },
        output: {},
        children: [],
        components: {},
      });
    }
  );

  // 处理组件列表
  // 此处需要更新成 promise.all 形式 -- 改好了 czh 2023 1121
  // 之后需要基于判断当前优先加载的组件去获取需要展示的组件对象 - 20240511 开始开发选择性载入
  // 改好咯～现在组件都是异步加载的 - 20240513
  let compDealPromiseList = [];
  let hasCompModuleName = [];
  dealRequireList(
    (dealName, len) => dealName == component,
    async (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate, index) => {
        if (module.name == moduleName) {
          const func = async (fileName, index) => {
            // let comp = await (await requireModule(fileName)).default();
            moduleList[index]["components"][moduleName] = (await requireModule(
              fileName
            )) as any;
            // moduleList[index]["components"] = { fileName: fileName };
            moduleList[index].isReady = true;
          };
          hasCompModuleName.push(moduleName);
          compDealPromiseList.push(func(fileName, index));
        }
      });
    }
  );

  // 无组件则直接ready
  moduleList.map((x) => {
    if (hasCompModuleName.indexOf(x.name) == -1) x.isReady = true;
  });
  // 等待组件加载
  Promise.all(compDealPromiseList);

  // 添加默认路由方案 (output配置中可以关闭)
  // 使用 pageConfigIsReady 阻塞加载
  dealRequireList(
    (dealName, len) => dealName == pageConfigData,
    async (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          module.pageConfigIsReady = false;
          const pageMap = (await requireModule(fileName))["PageConfig"];
          // const pageMap = {};
          for (let x in pageMap) {
            module.pageMap[x] = pageMap[x];
          }
          Object.keys(pageMap).map((pageName: string) => {
            const componentOptions = () =>
              import(`@/modules/${moduleName}/Index.vue`);
            const options = {
              meta: {
                originData: {
                  ...pageMap[pageName],

                  desktopData: null,
                },
                ...pageMap[pageName]["cusStyle"],
                title: pageMap[pageName]["name"] || moduleName + "_" + pageName,
              },
            };
            module.routers[0].children.push(
              routerCellMaker(
                `/${moduleName}/${pageName}`,
                pageMap[pageName]["name"]
                  ? moduleName + "_" + pageMap[pageName]["name"]
                  : moduleName + "_" + pageName,
                componentOptions,
                options
              )
            );
            if (pageMap[pageName]["RouterPath"]) {
              module.routers.push(
                routerCellMaker(
                  pageMap[pageName]["RouterPath"],
                  pageMap[pageName]["name"]
                    ? moduleName + "_" + pageMap[pageName]["name"]
                    : moduleName + "_" + pageName,
                  componentOptions,
                  {
                    ...options,
                    meta: {
                      ...options.meta,
                      PageName: pageName,
                    },
                  }
                )
              );
            }
          });
          module.pageConfigIsReady = true;
        }
        return module;
      });
    }
  );

  // 处理路由列表
  dealRequireList(
    (dealName, len) => dealName == router,
    async (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          module.routers = [
            ...module.routers,
            ...(await requireModule(fileName)).default,
          ];
        }
        return module;
      });
    }
  );

  // 处理outPut文件
  dealRequireList(
    (dealName, len) => dealName == output && len == 5,
    async (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          const output = (await importModule[fileName]()) as stringAnyObj;
          if (output["output"]) module.output = await output.output();
          if (output["moduleInfo"]) {
            const moduleInfo = output["moduleInfo"];
            module.baseInfo = {
              ...module.baseInfo,
              ...moduleInfo,
            };
            module.routers[0].meta = {
              ...module.routers[0].meta,
              ...moduleInfo,
            };
          }
        }
        return module;
      });
    }
  );

  await new Promise((res) => {
    let interval = setInterval(() => {
      if (
        moduleList &&
        moduleList.length > 0 &&
        moduleList.filter((x) => x.isReady).length ==
        moduleList.filter((x) => x.components).length &&
        moduleList.filter((x) => x.pageConfigIsReady).length ==
        moduleList.length
      ) {
        clearInterval(interval);
        timeConsole.checkTime("模块加载", "实际结束");
        res(true);
      }
    }, 100);
  });

  return moduleList;
};

// 工具获取
export const getAction = () => {
  if (Object.keys(action).length == 0) getModuleFromView(true);
  // 获取所有引用关系

  // 获取所有的模块构建出来的路由记录
  action["getAllPageRouter"] = async () => {
    await getModuleFromView()
    let routes = [];
    moduleList.map((x) => {
      x.routers.map((cell) => {
        if (cell.children && cell.children.length > 0) {
          cell.children.map((route) => {
            delete route.children;
            routes.push(route);
          });
        } else {
          routes.push(cell);
        }
      });
    });
    return routes;
  };

  // 获取所有模块包的组件
  // 只能获得一个引用的指向关系，modules内的组件需要额外调用getOneComponent
  action["getAllComponents"] = () => {
    let back = {};
    moduleList.map((module: modulesCellTemplate) => {
      back = {
        ...back,
        ...module.components,
      };
    });
    return back;
  };

  // 按照 getAllComponents 获取的信息，获取单个模块内的组件
  // 防止数据不同步，此处放置的 moduleList 不一定是加载完成的（低性能电脑容易出现）
  action["getOneComponent"] = async (name: string) => {
    await getModuleFromView();
    let components = action.getAllComponents();
    if (componentLists && componentLists[name]) return componentLists[name];
    console.log(name,components,'获取单个组件')
    if (name.split("_").length == 2) {
      const moduleName = name.split("_")[0];
      if (useCacheHook().isInCache("component_" + moduleName)) {
        return (await useCacheHook().getDataByKey("component_" + moduleName))[
          name
        ];
      } else {
        if (components[moduleName]) {
          useCacheHook().setup("component_" + moduleName, async () => {
            return await components[moduleName].default();
          });
          return (await useCacheHook().getDataByKey("component_" + moduleName))[
            name
          ];
        }
      }
    }
    return componentLists["iframe"];
  };

  // 加载所有模块包中的组件引用
  action["loadAllComponents"] = async (name: string) => {
    await getModuleFromView()
    let components = action.getAllComponents();
    Object.keys(components).map((moduleName) => {
      if (!useCacheHook().isInCache("component_" + moduleName))
        useCacheHook().setup(
          "component_" + moduleName,
          async () => {
            let res = await components[moduleName].default()
            console.log(res,'加载了组件')
            return res;
          },
          true
        );
    });

    let cardComponents = {};
    await new Promise((r, j) => {
      const checkStatus = setInterval(() => {
        let isAllLoad = true;
        Object.keys(components).map((moduleName) => {
          if (!useCacheHook().isLoad("component_" + moduleName))
            isAllLoad = false;
        });
        if (isAllLoad) {
          Object.keys(components).map((moduleName) => {
            cardComponents = {
              ...cardComponents,
              ...useCacheHook().getDataByKeyStatic("component_" + moduleName),
            };
          });
          clearInterval(checkStatus);
          r(true);
        }
      }, 100);
    });
    useCacheHook().showData();
    return cardComponents;
  };

  // 获取所有模块包的 插入式能力组件
  action["getAllPluginComponent"] = () => {
    let back = {};
    moduleList.map((module) => {
      if (module.output && module.output.CardApiInjectComponent) {
        for (let componentName in module.output.CardApiInjectComponent) {
          back[`${module.name}_${componentName}`] =
            module.output.CardApiInjectComponent[componentName];
        }
      }
    });
    return back;
  };

  // 获取所有模块包的 插入式 onChange能力
  action["getModuleApi"] = () => {
    let back = {};
    moduleList.map((module) => {
      if (module.output.moduleApi) {
        for (let apiName in module.output.moduleApi) {
          back[`${module.name}_${apiName}`] = module.output.moduleApi[apiName];
        }
      }
    });
    return back;
  };

  return action;
};

// 可以被展开的数组
interface needFlatChildrenArrCell {
  children?: needFlatChildrenArrCell[];
  [key: string]: any;
}

// 数组展开
export const flatChildrenArr = (arr: needFlatChildrenArrCell[]) => {
  let back = [...arr];
  for (let i = 0; i < back.length; i++) {
    let cell = back[i];
    if (cell.children && cell.children.length > 0) {
      cell.children.map((x) => {
        back.push(x);
      });
    }
  }
  return back;
};

export const baseModuleRouter: RouteConfigsTable = {
  path: "/desktop",
  name: "modules",
  component: Layout,
  redirect: "/desktop/",
  meta: {
    icon: "bxs:package",
    title: "模块",
    rank: 0,
  },
  children: [],
};
