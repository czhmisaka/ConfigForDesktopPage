/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-05 21:21:44
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/apiManage.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  searchCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import { formInputType, stringAnyObj } from "@/modules/userManage/types";

export const apiManage = async () => {
  // 部门数据
  const APITableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("URL", "url"),
    tableCellTemplateMaker("方法", "method"),
    tableCellTemplateMaker("接口分类", "tags"),
    tableCellTemplateMaker("接口释义", "description"),
  ]);

  let apiGroup = await get("/web/usc/url/group", {});
  let apiMap = {};
  apiGroup.data.map((x) => {
    apiMap[x] = x;
  });

  const userTableSearchTemplate = [
    tableCellTemplateMaker(
      "模块",
      "name",
      searchCell(formInputType.select, {
        inputOptions: apiMap,
      })
    ),
  ];

  const btnList = [];
  return [
    gridCellMaker(
      "searchTable",
      "搜索结果列表",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          defaultQuery: { name: apiGroup.data[apiGroup.data.length - 1] },
          autoSearch: true,
          searchItemTemplate: userTableSearchTemplate,
          showItemTemplate: APITableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            if (!query.name) return [];
            let res = await post("/web/usc/url/list", { ...query });
            return res && res.data ? res.data : [];
          },
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};