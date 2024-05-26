/*
 * @Date: 2022-10-20 21:59:45
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-26 01:03:19
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/index.ts
 */
import {
  CardComponentTemplate,
  cardComponentMaker,
  componentInfo,
  propInfo,
} from "@/components/basicComponents/grid/module/dataTemplate";

import { defineAsyncComponent } from "vue";
import { moduleInfo } from "../output";
const importModule = import.meta.glob("./**", {});

const componentGetter = async () => {
  const preName = moduleInfo.name;
  let componentList = [] as any[];

  // 搜索当前文件夹内的所有.vue 文件，构建组件对象
  // const importModule = import.meta.glob("./**.vue", {});
  const componentsFiles = async (key: string): Promise<any> => {
    return await importModule[key];
  };
  // const componentsFiles = require.context("./", true, /.vue$/);
  for (let i = 0; i < Object.keys(importModule).length; i++) {
    let componentsName = Object.keys(importModule)[i];
    if (componentsName.indexOf(".vue") == -1) continue;
    let data = (await (await componentsFiles(componentsName))())["default"];
    if (data) {
      if (!data["name"]) {
        data = {
          ...data,
          name: componentsName
            .split("/")
            [componentsName.split("/").length - 1].split(".vue")[0],
        };
      }
      componentList.push(data);
    }
  }
  // Object.keys(importModule).forEach(async (componentsName: string) => {});
  enum selectTypeTemplate {
    all,
    one,
  }

  let componentLists = {} as {
    [key: string | number | symbol]: CardComponentTemplate;
  };

  /**
   * @name: tagInObj
   * @description: 检索函数
   * @authors: CZH
   * @Date: 2022-11-11 09:43:27
   * @param {object} obj
   * @param {string} tagList
   * @param {*} selectType
   */
  function tagInObj(
    obj: { [key: string]: any },
    tagList: string[],
    selectType = selectTypeTemplate.all
  ) {
    let keyList = Object.keys(obj);
    let result = [];
    tagList.map((tag) => {
      if (keyList.indexOf(tag) > -1) {
        result.push(tag);
      }
    });
    switch (selectType) {
      case selectTypeTemplate.all:
        return tagList.length == result.length;
      case selectTypeTemplate.one:
        return result.length > 0;
    }
  }
  for (let i = 0; i < componentList.length; i++) {
    let module = componentList[i];
    let propsDetail = {} as propInfo;
    let baseProps = {} as { [key: string]: any };
    let componentInfo = { label: preName + "_" + module.name } as componentInfo;

    if (tagInObj(module, ["propsDetail"])) {
      propsDetail = { ...module.propsDetail };
    }

    if (tagInObj(module, ["baseProps"])) {
      baseProps = { ...module.baseProps };
    }

    if (tagInObj(module, ["componentInfo"])) {
      componentInfo = { ...componentInfo, ...module.componentInfo };
    }

    if (
      tagInObj(module, ["propsDetail", "componentInfo"], selectTypeTemplate.one)
    )
      componentLists[componentInfo.label as unknown as string] =
        cardComponentMaker(
          defineAsyncComponent(
            () =>
              new Promise((resolve, reject) => {
                resolve(module);
              })
          ),
          propsDetail,
          baseProps,
          componentInfo
        );
  }
  return componentLists;
};
export default componentGetter;
