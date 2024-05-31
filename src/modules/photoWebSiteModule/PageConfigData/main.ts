/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-05-30 21:37:43
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
      color,
    } = query;
    if (!color) {
      let res = await post(
        `/images?offset=${offset}&limit=${limit}${Object.keys(query).length == 0 && category?.id
          ? "&catrgory=" + category?.id
          : ""
        }${tags ? "&tags=" + tags : ""}${name ? "&name=" + name : ""}${file_size_max ? "&file_size_max=" + file_size_max : ""
        }${date_available_start
          ? "&date_available_start=" + date_available_start
          : ""
        }${file_size_min ? "&file_size_min=" + file_size_min : ""}${date_available_end
          ? "&date_available_end=" +
          new Date(date_available_end[1]).toLocaleString() +
          "&date_available_start=" +
          new Date(date_available_end[0]).toLocaleString()
          : ""
        }
      ${width_min ? "&width_min=" + width_min : ""}${width_max ? "&width_max=" + width_max : ""
        }${height_min ? "&height_min=" + height_min : ""}${height_max ? "&height_max=" + height_max : ""
        }`,
        []
      );
      return res;
    } else {
      return await getColorList(data);
    }
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
    let path = x.path.replace("./", "/");
    return {
      ...x,
      url: `/imageserver/i.php?` + path.replace(".", "-sm.") + "",
    };
  });
};

export const mainDesktop = async () => {
  const photoInfoStorage = new SearchCellStorage([

  ])
  return [
    gridCellMaker('searchTable', 'searchTable', {}, {
      name: "userManage_searchTable",
      type: cardComponentType.componentList,
    }, {
      props: {
        searchItemTemplate: [],
        showItemTemplate: photoInfoStorage.getAll([
          "id",
          "createTime",
          "updateTime",
        ]),
        searchFunc: async (query, that) => {
          let res = await post("/admin/picture/pictureInfo/search", {});
          return res.data;
        },
        defaultQuery: {
          showLink: null,
        },
        btnList: [],
        autoSearch: false,
        modeChange: true,
        isCard: false,
      }
    }).setPosition(0, 1).setSize(12, 12),
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

    // gridCellMaker(
    //   "categoryList",
    //   "相册列表",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "userManage_menuList",
    //   },
    //   {
    //     props: {
    //       noSearch: true,
    //       treeDataFunc: async (that) => {
    //         let res = await get("/categories", {});
    //         return res.data;
    //       },
    //       outputKey: "category",
    //       defaultProps: {
    //         label: "name",
    //         children: "children",
    //       },
    //     },
    //   }
    // )
    //   .setPosition(0, 0)
    //   .setSize(2, 5),
    // gridCellMaker(
    //   "collectionList",
    //   "收藏夹列表",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "userManage_menuList",
    //   },
    //   {
    //     props: {
    //       treeDataFunc: async (that) => {
    //         const user = useUserStoreHook();
    //         let options = JSON.parse(JSON.stringify(await user.getOptions()));
    //         let col = await post('/piwigo',{
    //           method: "pwg.collections.getList",
    //           user_id: options.id,
    //         });
    //         return col.result.collections;
    //       },
    //       noNeedInit: true,
    //       clickItemDetailFunc: (that, data) => {
    //         openDrawerFormEasy(that, {
    //           title: "收藏夹【" + data.name + "】",
    //           queryItemTemplate: [tableCellTemplateMaker("名字", "name")],
    //           noEdit: true,
    //           data,
    //           btnList: [删除收藏夹],
    //         });
    //       },
    //       searchBtn: 新增收藏夹,
    //       outputKey: "collection",
    //       defaultProps: {
    //         label: "name",
    //         children: "children",
    //       },
    //     },
    //   }
    // )
    //   .setPosition(0, 5)
    //   .setSize(2, 5),
    // gridCellMaker(
    //   "searchInfo",
    //   "搜索栏",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "photoWebSiteModule_searchInfo",
    //   },
    //   {
    //     props: {
    //       outputKey: "query",
    //       tagList: tagList,
    //       searchByImage: async (that, list) => {
    //         changeCardPosition(that, {
    //           waterFall: { x: 0, y: 1 },
    //           searchInfo: { x: 0, y: 0 },
    //         });
    //         changeCardSize(that, {
    //           waterFall: {
    //             width: 10,
    //             height: 11,
    //           },
    //           categoryList: {
    //             width: 0,
    //             height: 0,
    //           },
    //           collectionList: {
    //             width: 0,
    //             height: 0,
    //           },
    //           searchInfo: {
    //             width: 10,
    //             height: 1,
    //           },
    //           InfoCard: {
    //             width: 2,
    //             height: 10,
    //           },
    //         });
    //         changeVisible(that, {
    //           userManage_menuListRemote: false,
    //           searchInfo: true,
    //           upload: false,
    //           icon: true,
    //         });
    //         setData(that, { fuck: fucknum++ });
    //         let searchImageNum = 0;
    //         changeCardProperties(that, {
    //           waterFall: {
    //             watchKey: ["category", "query", "collection", "fuck"],
    //             getFunc: async () => {
    //               searchImageNum++;
    //               return searchImageNum == 1
    //                 ? list.map((x) => {
    //                     let path = x.path.replace("./", "/");
    //                     return {
    //                       ...x,
    //                       url:
    //                         `/imageserver/i.php?` +
    //                         path.replace(".", "-sm.") +
    //                         "",
    //                     };
    //                   })
    //                 : [];
    //             },
    //           },
    //         });
    //       },
    //     },
    //   }
    // )
    //   .setPosition(2, 0)
    //   .setSize(8, 1),
    // gridCellMaker(
    //   "waterFall",
    //   "瀑布流图片展示功能",
    //   {},
    //   {
    //     name: "photoWebSiteModule_waterfall",
    //     type: cardComponentType.componentList,
    //   },
    //   {
    //     props: {
    //       watchKey: ["category", "collection", "query"],
    //       getFunc: getFunc,
    //     },
    //   }
    // )
    //   .setPosition(2, 1)
    //   .setSize(8, 11),
    // gridCellMaker(
    //   "InfoCard",
    //   "图片信息",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "photoWebSiteModule_infoCard",
    //   },
    //   {
    //     props: {
    //       // btnList: InfoCardBtnList,
    //       watchKeyForCategory: "category",
    //     },
    //   }
    // )
    //   .setPosition(10, 0)
    //   .setSize(2, 12),
    // gridCellMaker(
    //   "icon",
    //   "返回按钮",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "icon",
    //   },
    //   {
    //     showInGridDesktop: false,
    //     props: {
    //       name: "ArrowRightBold",
    //       onClickFunc: ({ props, context, e }) => {
    //         changeCardPosition(context, {
    //           waterFall: {
    //             x: 2,
    //             y: 1,
    //           },
    //           searchInfo: { x: 2, y: 0 },
    //         });
    //         changeCardSize(context, {
    //           InfoCard: {
    //             width: 2,
    //             height: 12,
    //           },
    //           waterFall: {
    //             width: 8,
    //             height: 11,
    //           },
    //           categoryList: {
    //             width: 2,
    //             height: 5,
    //           },
    //           collectionList: {
    //             width: 2,
    //             height: 5,
    //           },
    //           cate: {
    //             width: 2,
    //             height: 10,
    //           },
    //           searchInfo: {
    //             width: 8,
    //             height: 1,
    //           },
    //         });
    //         changeVisible(context, {
    //           upload: true,
    //           icon: false,
    //           searchInfo: true,
    //         });
    //         changeCardProperties(context, {
    //           waterFall: {
    //             watchKey: ["category", "query", "collection"],
    //             getFunc: getFunc,
    //           },
    //         });
    //         setData(context, {
    //           query: {},
    //         });
    //       },
    //     },
    //   }
    // )
    //   .setPosition(10, 10)
    //   .setSize(2, 2),
  ] as gridCellTemplate[];
};
