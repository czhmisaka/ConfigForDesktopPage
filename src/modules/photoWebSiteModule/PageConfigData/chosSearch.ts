/*
 * @Date: 2023-03-12 23:10:24
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-26 01:11:53
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/chosSearch.ts
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
  highLightComponent,
  removeGridCell,
  addGridCell,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, post} from "@/utils/api/requests";
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
import { collapseItemProps } from "element-plus";
import { fa } from "element-plus/es/locale";

const gridDesktop = {
  width: 24,
};

let gridCelldefault = {
  label: "",
  size: { width: 1, height: 1 },
  position: { x: 0, y: 0 },
};
let num = 0;
let showKeyArr = [];

const elementKey = (
  props: stringAnyObj,
  size: { w: number; h: number },
  position: { x: number; y: number },
  name: string | number = 1,
  desktop: Desktop
) => {
  num++;
  showKeyArr.push("image" + name + "_" + num);
  return gridCellMaker(
    "image" + name + "_" + num,
    "图片_" + name + "_" + num,
    {},
    {
      name: "photoWebSiteModule_lazyImage",
      type: cardComponentType.componentList,
    },
    {
      showInGridDesktop: false,
      props: {
        ...props,
        clickFunc: ({ props, context }) => {
          if (gridCelldefault.label == props.detail.label) return;
          gridCelldefault = {
            label: props.detail.label,
            ...props.detail.gridInfo.default,
          };
          setData(context, {
            image: props.item,
          });
          highLightComponent(context, [
            props.detail.label,
            "InfoCard",
            "icons",
          ]);
          changeVisible(context, {
            InfoCard: true,
            icons: true,
          });
          let pos = {};
          pos[props.detail.label] = {
            x: 1,
            y: 1,
          };
          let size = {};
          console.log(desktop, "desktopFucker");
          size[props.detail.label] = {
            width: (desktop.len_x * 5) / 6 - 2,
            height:
              location.hash == "#/photoWebSiteModule/CHOSSEARCHS"
                ? 9
                : desktop.len_y - 2,
          };
          changeCardPosition(context, pos);
          setTimeout(() => changeCardSize(context, size), 300);
        },
      },
    }
  )
    .setSize(size.w, size.h)
    .setPosition(position.x, position.y);
};

// 计算桌面碰撞
export class Desktop {
  map = [] as boolean[][];
  len_x = 0;
  len_y = 0;
  randomTryTime = 2500;

  constructor(x: number, y: number) {
    for (let i = 0; i < x; i++) {
      this.map.push([]);
      for (let c = 0; c < y; c++) {
        this.map[i].push(false);
      }
    }
    this.len_x = x;
    this.len_y = y;
  }

  async initByGridList(gridList: gridCellTemplate[]) {
    if (!gridList) return false;
    for (let i = 0; i < gridList.length; i++) {
      const gridCell = gridList[i];
      if (!gridCell.options.showInGridDesktop) continue;
      const { x, y } = gridCell.gridInfo.default.position;
      const { width: w, height: h } = gridCell.gridInfo.default.size;
      this.set(x, y, w, h, true);
    }
  }

  check(x, y, w = 1, h = 1) {
    if (x < 0 || y < 0 || w < 1 || h < 1) return false;
    if (this.map.length < x + w - 1) return false;
    if (this.map[0].length < y + h - 1) return false;
    let canSet = true;
    for (let x1 = x; x1 < x + w; x1++) {
      for (let y1 = y; y1 < y + h; y1++) {
        if (this.get({ x: x1, y: y1 })) {
          canSet = false;
          break;
        }
      }
    }
    return canSet;
  }

  set(x, y, w = 1, h = 1, dontCheck = false) {
    if (!dontCheck && !this.check(x, y, w, h)) return false;
    for (let x1 = x; x1 < x + w; x1++) {
      for (let y1 = y; y1 < y + h; y1++) {
        this.map[x1][y1] = true;
      }
    }
  }

  get({ x, y }) {
    return this.map[x][y];
  }

  getRandomXy(width = 1, height = 1) {
    return {
      x: Math.floor(Math.random() * (this.len_x - width + 1)),
      y: Math.floor(Math.random() * (this.len_y - height + 1)),
    };
  }

  async randomSet(
    list: { w: number; h: number; data: stringAnyObj }[],
    callBack: (x, y, data, i) => void
  ) {
    for (let i = 0; i < list.length; i++) {
      const { w, h } = list[i];
      // try random x first
      for (let time = 0; time < this.randomTryTime; time++) {
        let width = 1,
          height = 1;
        if (time < this.randomTryTime * 0.5) {
          let scaleRate = Math.floor(
            Math.random() * (this.len_x / 2) + this.len_x / 10
          );
          width = (w > h ? Math.round(w / h) : 1) * scaleRate;
          height = (h > w ? Math.round(h / w) : 1) * scaleRate;
        } else if (time < this.randomTryTime * 0.7) {
          let scaleRate = Math.floor(
            Math.random() * (this.len_x / 4) + this.len_x / 14
          );
          width = (w > h ? Math.round(w / h) : 1) * scaleRate;
          height = (h > w ? Math.round(h / w) : 1) * scaleRate;
        } else if (time < this.randomTryTime * 0.9) {
          let scaleRate = Math.floor(Math.random() * (this.len_x / 8));
          width = (w > h ? Math.round(w / h) : 1) * scaleRate;
          height = (h > w ? Math.round(h / w) : 1) * scaleRate;
        }
        let randomXy = this.getRandomXy(width, height);
        if (this.check(randomXy.x, randomXy.y, width, height)) {
          this.set(randomXy.x, randomXy.y, width, height);
          callBack(
            {
              w: width,
              h: height,
            },
            { x: randomXy.x, y: randomXy.y },
            list[i].data,
            i
          );
          break;
        }
      }
    }
  }
}

export const chosSearch = async () => {
  const chosSearchFunc = async (that, query, data = []) => {
    if (showKeyArr.length > 0) {
      let obj = {};
      for (let x in showKeyArr) obj[showKeyArr[x]] = false;
      changeVisible(that, obj);
      setTimeout(() => {
        removeGridCell(that, showKeyArr);
        showKeyArr = [];
      }, 200);
    }
    let list = data.map((x) => {
      return {
        ...x,
      };
    });
    if (list.length == 0) {
      let { result } = await post('/piwigo',{
        method: "pwg.images.search",
        query: query,
        per_page: 100,
      });
      list = result.images.map((x) => {
        return {
          ...x,
          ...x.derivatives,
          ...x.derivatives["2small"],
          derivatives: null,
        };
      });
    }

    let desktop = new Desktop(24, 16);
    desktop.initByGridList(that.gridList);
    setTimeout(() => {
      desktop.randomSet(
        list.map((x) => {
          return { w: x.width, h: x.height, data: x };
        }),
        (wh, xy, data, i) => {
          addGridCell(
            that,
            elementKey(
              {
                fit: "cover",
                noPreview: "true",
                item: data,
              },
              wh,
              xy,
              i,
              desktop
            )
          );
        }
      );
      let num1 = 0;
      setTimeout(() => {
        let interval = setInterval(() => {
          if (num1 > showKeyArr.length) clearInterval(interval);
          let data = {};
          data[showKeyArr[num1++]] = true;
          changeVisible(that, data);
        }, 40);
      }, 500);
    }, 500);
  };
  return [
    gridCellMaker(
      "InfoCard",
      "图片信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_infoCard",
      },
      {
        showInGridDesktop: false,
        props: {
          // btnList: InfoCardBtnList,
          watchKeyForCategory: "category",
        },
      }
    )
      .setPosition(19, 1)
      .setSize(4, 12),
    gridCellMaker(
      "icons",
      "返回按钮",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        showInGridDesktop: false,
        props: {
          name: "Close",
          onClickFunc: ({ props, context, e }) => {
            let label = gridCelldefault.label;
            let size = {},
              pos = {};
            size[label] = gridCelldefault.size;
            pos[label] = gridCelldefault.position;
            changeCardSize(context, size);
            changeCardPosition(context, pos);
            changeVisible(context, {
              InfoCard: false,
              icons: false,
            });
            setTimeout(() => {
              highLightComponent(context, []);
            }, 400);
            gridCelldefault.label = "";
          },
        },
      }
    )
      .setPosition(19, 13)
      .setSize(4, 2),
    gridCellMaker(
      "searchInfo",
      "输入框",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_searchInfoChosSearch",
      },
      {
        props: {
          showMoreProps: true,
          searchFunc: (that, data) => {
            let time = 0;
            setTimeout(() => chosSearchFunc(that, data), 0);
          },
          updateSearch: (that, data) => {
            setTimeout(() => chosSearchFunc(that, {}, data), 0);
          },
        },
      }
    )
      .setPosition(8, 4)
      .setSize(8, 1),
  ];
};

export const chosSearchMobile = async () => {
  const chosSearchFunc = async (that, query) => {
    if (showKeyArr.length > 0) {
      let obj = {};
      for (let x in showKeyArr) obj[showKeyArr[x]] = false;
      changeVisible(that, obj);
      setTimeout(() => {
        removeGridCell(that, showKeyArr);
        showKeyArr = [];
      }, 200);
    }
    let { result } = await post('/piwigo',{
      method: "pwg.images.search",
      query: query,
      per_page: 100,
    });
    let list = result.images.map((x) => {
      return {
        ...x,
        ...x.derivatives,
        ...x.derivatives["2small"],
        derivatives: null,
      };
    });

    let desktop = new Desktop(8, 16);
    desktop.initByGridList(that.gridList);
    desktop.randomSet(
      list.map((x) => {
        return { w: x.width, h: x.height, data: x };
      }),
      (wh, xy, data, i) => {
        addGridCell(
          that,
          elementKey(
            {
              fit: "cover",
              noPreview: "true",
              item: data,
            },
            wh,
            xy,
            i,
            desktop
          )
        );
      }
    );
    let num1 = 0;
    setTimeout(() => {
      let interval = setInterval(() => {
        if (num1 > showKeyArr.length) clearInterval(interval);
        let data = {};
        data[showKeyArr[num1++]] = true;
        changeVisible(that, data);
      }, 40);
    }, 300);
  };
  return [
    gridCellMaker(
      "InfoCard",
      "图片信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_infoCard",
      },
      {
        showInGridDesktop: false,
        props: {
          btnList: InfoCardBtnList,
          watchKeyForCategory: "category",
        },
      }
    )
      .setPosition(0, 10)
      .setSize(8, 5),
    gridCellMaker(
      "icons",
      "返回按钮",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        showInGridDesktop: false,
        props: {
          name: "Close",
          onClickFunc: ({ props, context, e }) => {
            let label = gridCelldefault.label;
            let size = {},
              pos = {};
            size[label] = gridCelldefault.size;
            pos[label] = gridCelldefault.position;
            changeCardSize(context, size);
            changeCardPosition(context, pos);
            changeVisible(context, {
              InfoCard: false,
              icons: false,
            });
            setTimeout(() => {
              highLightComponent(context, []);
            }, 400);
            gridCelldefault.label = "";
          },
        },
      }
    )
      .setPosition(0, 15)
      .setSize(8, 1),
    gridCellMaker(
      "searchInfo",
      "输入框",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_searchInfoChosSearch",
      },
      {
        props: {
          searchFunc: (that, data) => {
            let time = 0;
            setTimeout(() => chosSearchFunc(that, data), 0);
          },
        },
      }
    )
      .setPosition(1, 4)
      .setSize(6, 1),
  ];
};
