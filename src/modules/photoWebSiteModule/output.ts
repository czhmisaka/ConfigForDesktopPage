/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-26 01:15:06
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/output.ts
 */
export const moduleInfo = {
  name: "photoWebSiteModule",
  title: "素材分类",
  info: "基于piwigo pythonserver 的扩展包",
  author: 'czh'
};

export const output = async () => {
  return {
    moduleApi: {},
    CardApiInjectComponent: {},
  };
};

// 模组打包配置
export const modulePackConfig = {
  noDefaultRouter: false,
};
