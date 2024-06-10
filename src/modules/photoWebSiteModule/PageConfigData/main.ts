/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-11 00:31:58
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
// import { InfoCardBtnList } from "./InfoCardBtnList";
import { setData } from "../../../components/basicComponents/grid/module/cardApi/index";
import { dobuleCheckBtnMaker } from "../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";
import { SearchCellStorage } from "../../userManage/component/searchTable/searchTable";
import { DataInfo } from "../../../utils/auth";
import { 新增收藏夹, 删除收藏夹 } from "./managerOnly/collectionManage";

let baseData = {} as { [key: string]: any };
let lastFunc = -1;
let dataBe = {};
let fucknum = 0;

// 获取图片列表
export const getFunc = async function (that, data) {
  let res = {} as stringAnyObj;
  const getColorList = async (data) => {
    const { limit, offset } = data;
    const {
      width_min,
      width_max,
      height_min,
      height_max,
      catrgory,
      tags,
      name,
      file_size_max,
      file_size_min,
      color,
    } = data.query;
    let colors = color
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map((x) => x.replace(" ", "") * 1);
    console.log(
      {
        limit: limit,
        offset: offset,
        width_min: width_min,
        width_max: width_max,
        height_min: height_min,
        height_max: height_max,
        catrgory: catrgory?.id,
        tags: tags,
        name: name,
        file_size_min: file_size_min,
        file_size_max: file_size_max,
        colorR: colors[0],
        colorG: colors[1],
        colorB: colors[2],
        date_available_start: data?.date_available_start,
        date_available_end: data?.date_available_end,
      },
      "asdads"
    );
    let res = await post("/mainSearch", {
      limit: limit,
      offset: offset,
      width_min: width_min,
      width_max: width_max,
      height_min: height_min,
      height_max: height_max,
      catrgory: catrgory?.id,
      tags: tags,
      name: name,
      file_size_min: file_size_min,
      file_size_max: file_size_max,
      colorR: colors[0],
      colorG: colors[1],
      colorB: colors[2],
      date_available_start: data?.date_available_start,
      date_available_end: data?.date_available_end,
    });
    return res;
  };
  const getCategory = async (data) => {
    let { limit, offset, query, category } = data;
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
    // if (!color) {
    let searchData = {
      pageSize: limit,
      pageNumber: offset
    } as stringAnyObj
    if (category) {
      searchData = {
        ...searchData,
        categoriesIds: [category.id]
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
    let res = await post('/admin/picture/pictureInfo/search', searchData)
    return res
    // } else {
    //   return await getColorList(data);
    // }
  };
  const getCollection = async (data) => {
    console.log("asdqwefuck");
    let { limit, offset, query } = data;
    let resp = await post('/piwigo', {
      col_id: data["collection"].id,
      method: "pwg.collections.getImages",
      per_page: limit,
      page: Math.floor(offset / limit),
    });
    return {
      data: {
        list: resp.result.images.map((x) => {
          return {
            ...x,
            path: "/" + x.element_url.split(":1200/")[1],
          };
        }),
      },
    };
  };
  let fuckkey = false;
  if (
    JSON.stringify(baseData["category"]) !=
    JSON.stringify(that.baseData["category"])
  ) {
    fuckkey = true;
    lastFunc = 1;
    res = await getCategory(data);
    setData(that, {
      collection: {},
    });
  } else if (
    JSON.stringify(baseData["collection"]) !=
    JSON.stringify(that.baseData["collection"])
  ) {
    fuckkey = true;
    lastFunc = 2;
    res = await getCollection(data);
    setData(that, {
      category: {},
    });
  } else if (lastFunc == 1) {
    fuckkey = true;
    res = await getCategory(data);
  } else if (lastFunc == 2) {
    fuckkey = true;
    res = await getCollection(data);
  }

  baseData = JSON.parse(JSON.stringify({ ...that.baseData, ...data.query }));
  console.log(baseData, that.baseData, fuckkey, res, res.data, "asd");
  return res.data.list.map((x) => {
    return {
      ...x,
    };
  });
};

export const mainDesktop = async () => {
  const photoInfoStorage = new SearchCellStorage([

  ])
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
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
      }
    )
      .setPosition(0, 0)
      .setSize(2, 5),
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
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
      }
    )
      .setPosition(0, 5)
      .setSize(2, 5),
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
          // tagList: tagList,
          searchByImage: async (that, list) => {
            setData(that, { fuck: fucknum++ });
            let searchImageNum = 0;
            changeCardProperties(that, {
              waterFall: {
                watchKey: ["category", "query", "collection", "fuck"],
                getFunc: async () => {
                  searchImageNum++;
                  return searchImageNum == 1
                    ? list.map((x) => {
                      let path = x.path.replace("./", "/");
                      return {
                        ...x,
                        url:
                          `/imageserver/i.php?` +
                          path.replace(".", "-sm.") +
                          "",
                      };
                    })
                    : [];
                },
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
          // btnList: InfoCardBtnList,
          watchKeyForCategory: "category",
        },
      }
    )
      .setPosition(10, 0)
      .setSize(2, 12),
    gridCellMaker(
      "upload",
      "上传",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_upload",
      },
      {
        props: {
          optionsData: {}
        }
      }
    )
      .setPosition(0, 10)
      .setSize(2, 2),

  ] as gridCellTemplate[];
};
