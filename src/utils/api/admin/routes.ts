/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-11 00:27:29
 * @FilePath: /ConfigForDesktopPage/src/utils/api/admin/routes.ts
 */
import { useModuleHook } from "@/store/modules/module";
import { http } from "../../http";
import { get, post } from "../requests";
import { getModuleFromView } from "@/router/util";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = async (noRefresh: boolean = false) => {
  const module = useModuleHook();
  if (noRefresh) {
    return {
      data: module.nowModule.children || [],
    };
  } else {
    let data = [];
    // let res = await post("/web/usc/menu/list/role", {});
    // let res = await get('/admin/base/comm/permmenu',{})
    // await module.init(res.data);
    let moduleList = (await getModuleFromView())
      .map((x) => {
        return x.routers[0].children.length > 0 ? x.routers[0] : false;
      })
      .filter(Boolean);
      moduleList.sort((a, b) => {
          return  b.name.indexOf('photo') - a.name.indexOf('photo') 
      })
    moduleList = moduleList.map((module) => {
      return {
        ...module,
        type:1,
        children: module.children.map((x) => {
          return {
            ...x,
            type:3,
            urls: [x.path],
          };
        }),
      };
    });
    console.log(moduleList,'处理前')
    await module.init(moduleList);
    console.log(useModuleHook().moduleList,'asdasdas')
    return {
      data: module.nowModule.children || [],
    };
  }
};
