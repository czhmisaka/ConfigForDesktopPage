/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-10-07 19:09:46
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

import {
  btnMaker,
  closeBtn,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, post } from "@/utils/api/requests";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
import { xor } from "lodash";
import { openDrawerFormEasy } from "../../userManage/component/searchTable/drawerForm";
import { openDrawerForm } from "../../userManage/component/searchTable/drawerForm";
import { btnActionTemplate, drawerProps } from "@/modules/userManage/types";
import { tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { stringAnyObj } from "../../userManage/types";

// 图片信息操作列表
import { InfoCardBtnList } from "./InfoCardBtnList";
import { setData } from "../../../components/basicComponents/grid/module/cardApi/index";
import { doubleCheckBtnMaker } from "../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";
import { SearchCellStorage } from "../../userManage/component/searchTable/searchTable";
import { DataInfo } from "../../../utils/auth";
import { 新增收藏夹, 删除收藏夹 } from "./managerOnly/collectionManage";

let fucknum = 0;
let searchMode = '' as 'category' | 'collection' | 'all'

// 获取图片列表
export const getFunc = async function (that, data) {
  let res = {} as stringAnyObj;
  let { limit, offset, query, category, collection } = data;
  if (!query) query = {};
  let {
    tags,
    name,
    date_available_end,
    date_available_start,
    file_size_min,
    file_size_max,
    width_min,
    width_max,
    height_min,
    height_max,
    colorRange,
    color,
  } = query;
  let searchData = {
    ...query,
    pageSize: limit,
    pageNumber: offset
  } as stringAnyObj
  if (category && category.id && searchMode == 'category') {
    searchData = {
      ...searchData,
      categoriesIds: [category.id]
    }
  }
  if (collection && collection.id && searchMode == 'collection') {
    searchData = {
      ...searchData,
      collectionIds: [collection.id]
    }
  }
  if (color) {
    let colors = color.replace('rgb(', '').replace(')', '').split(',')
    if (!colorRange) colorRange = 10
    searchData = {
      ...searchData,
      colorRMax: (colors[0] * 1) + (colorRange / 2),
      colorRMin: (colors[0] * 1) - (colorRange / 2),
      colorGMax: (colors[1] * 1) + (colorRange / 2),
      colorGMin: (colors[1] * 1) - (colorRange / 2),
      colorBMax: (colors[2] * 1) + (colorRange / 2),
      colorBMin: (colors[2] * 1) - (colorRange / 2),
    }
  }
  res = await post('/admin/picture/pictureInfo/search', searchData)
  return res.data.list.map((x) => {
    return {
      ...x,
    };
  });
};

export const mainDesktop = async () => {
  const photoInfoStorage = new SearchCellStorage([

  ])
  const tagList = (await post('/admin/picture/tags/list', {})).data
  return [
    gridCellMaker(
      "upload",
      "上传",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_upload",
      },
      {}
    )
      .setPosition(0, 0)
      .setSize(1, 1),

    gridCellMaker(
      "categoryList",
      "相册列表",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_menuList",
      },
      {
        props: {
          noSearch: true,
          treeDataFunc: async (that) => {
            let res = await post("/admin/picture/categories/tree", {});
            return res.data;
          },
          outputKey: "category",
          clickItemFunc: async (that, data) => {
            searchMode = 'category'
          },
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
      }
    )
      .setPosition(0, 0)
      .setSize(2, 6),
    gridCellMaker(
      "collectionList",
      "收藏夹列表",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_menuList",
      },
      {
        props: {
          treeDataFunc: async (that) => {
            let res = await post("/admin/picture/collection/tree", {});
            return res.data;
          },
          searchBtn: 新增收藏夹,
          outputKey: "collection",
          clickItemFunc: async (that, data) => {
            searchMode = 'collection'
          },
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
      }
    )
      .setPosition(0, 6)
      .setSize(2, 6),
    gridCellMaker(
      "searchInfo",
      "搜索栏",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_searchInfo",
      },
      {
        props: {
          outputKey: "query",
          tagList: tagList,
          searchByImage: async (that, list) => {
            console.log(list, 'asd')
            changeCardProperties(that, {
              waterFall: {
                imageList:list
              },
            });
          },
        },
      }
    )
      .setPosition(2, 0)
      .setSize(8, 1),
    gridCellMaker(
      "waterFall",
      "瀑布流图片展示功能",
      {},
      {
        name: "photoWebSiteModule_waterfall",
        type: cardComponentType.componentList,
      },
      {
        props: {
          watchKey: ["category", "collection", "query"],
          getFunc: getFunc,
        },
      }
    )
      .setPosition(2, 1)
      .setSize(8, 11),
    gridCellMaker(
      "InfoCard",
      "图片信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_infoCard",
      },
      {
        props: {
          btnList: InfoCardBtnList,
          watchKeyForCategory: "category",
          sendSearch: (that, data) => {
            searchMode = 'all'
          }
        },
      }
    )
      .setPosition(10, 0)
      .setSize(2, 12),
    // gridCellMaker(
    //   "upload",
    //   "上传",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "photoWebSiteModule_upload",
    //   },
    //   {
    //     props: {
    //       uploaded: async (that, data) => {

    //       }
    //     }
    //   }
    // )
    //   .setPosition(0, 10)
    //   .setSize(2, 2),

  ] as gridCellTemplate[];
};
