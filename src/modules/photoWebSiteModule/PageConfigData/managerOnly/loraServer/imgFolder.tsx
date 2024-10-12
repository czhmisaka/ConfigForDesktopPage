/*
 * @Author: czhmisaka
 * @Date: 2024-09-08 22:29:40
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\managerOnly\loraServer\imgFolder.tsx
 */

/*
 * @Author: czhmisaka
 * @Date: 2024-09-06 00:15:06
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\managerOnly\loraServer\loraServerManage.tsx
 */

import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import {
  btnMaker,
  doubleCheckBtnMaker,
  openDrawerFormEasy,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  actionCell,
  DateCell,
  searchCell,
  SearchCellStorage,
  showCell,
  staticSelectCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
  showType,
} from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import { ElMessage, ElTag } from "element-plus";
import { transformDataFromCool } from "../newCategoryManage";
export const baseCoolTableCell = [
  tableCellTemplateMaker("更新时间", "updateTime"),
  tableCellTemplateMaker("创建时间", "createTime"),
  tableCellTemplateMaker("id", "id"),
];

export const imgFolderStorage = new SearchCellStorage([
  tableCellTemplateMaker("name", "name"),
  tableCellTemplateMaker("备注", "mark"),
  tableCellTemplateMaker("目标tag", "tagName"),
  tableCellTemplateMaker("图片数量", "imgNum"),
  tableCellTemplateMaker(
    "目标tag",
    "targetTag",
    searchCell(formInputType.searchList, {
      propertiesOption: {
        type: "string",
      },
      funcInputOptionsLoader: async (that) => {
        let attr = {
          multiple: false,
        };
        attr["remoteMethod"] = async (query) => {
          let res = await post("/admin/picture/tags/page", {
            keyWord: query,
            size: 200,
          });
          return [
            query ? { label: query, value: "needCreate:" + query } : false,
            ...transformDataFromCool(res.data).list.map((x) => {
              return {
                label: x.name,
                value: x.id + "",
              };
            }),
          ].filter(Boolean);
        };
        return attr;
      },
    })
  ),
  ...baseCoolTableCell,
]);

export const 删除图集 = btnMaker("删除", btnActionTemplate.Function, {
  elType: "danger",
  icon: "Delete",
  function: async (that, data) => {
    if (
      await doubleCheckBtnMaker(
        "删除图集",
        `确认要删除图集【${data.name}】吗？`
      ).catch((x) => false)
    ) {
      let res = await post("/admin/picture/lora/imgFolder/delete", {
        ids: [data.id],
      });
      repBackMessageShow(that, res);
    }
  },
});

export const 添加图片到图集 = btnMaker(
  "添加图片到图集",
  btnActionTemplate.Function,
  {
    isShow: (data) => {
      return data && data["length"] && data["length"] > 0;
    },
    function: async (that, data) => {
      let imgIds = [] as number[];
      if (typeof data == "object" && data.imgIds) imgIds = data.imgIds;
      if (typeof data == "object" && data.length > 0)
        imgIds = data.map((x) => x.id);
      if (!imgIds || imgIds.length == 0) return ElMessage.error("请先选择图片");
      let drawerProps = {
        title: "选择图集",
        queryItemTemplate: [
          tableCellTemplateMaker(
            "图集",
            "imgFolderId",
            searchCell(formInputType.searchList, {
              propertiesOption: {
                type: "number",
              },
              funcInputOptionsLoader: async (that) => {
                let attr = {
                  multiple: false,
                };
                attr["remoteMethod"] = async (query) => {
                  let res = await post("/admin/picture/lora/imgFolder/page", {
                    keyWord: query,
                  });
                  return transformDataFromCool(res.data).list.map((x) => {
                    return {
                      label: `${x.name}【${x.mark}】【${x.tagName}】`,
                      value: x.id,
                    };
                  });
                };
                return attr;
              },
            })
          ),
        ],
        data: {
          imgIds,
        },
        btnList: [
          btnMaker("添加", btnActionTemplate.Function, {
            function: async (th, da) => {
              const { imgFolderId } = da;
              let res = await post("/admin/picture/lora/imgFolder/addImages", {
                imgIds,
                imgFolderId,
              });
              repBackMessageShow(th, res);
            },
          }),
        ],
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  }
);

export const 新建图集 = btnMaker("新建图集", btnActionTemplate.Function, {
  elType: "primary",
  icon: "Plus",
  function: async (that, data) => {
    let drawerProps = {
      title: "新建图集",
      queryItemTemplate: [
        ...imgFolderStorage.getByKeyArr(["name", "mark", "targetTag"]),
      ],
      btnList: [
        btnMaker("创建图集", btnActionTemplate.Function, {
          icon: "Position",
          function: async (that, data) => {
            if (data.targetTag.indexOf("needCreate:") > -1) {
              let tagAddRes = await post("/admin/picture/tags/add", {
                name: data.targetTag.replace("needCreate:", ""),
                description: "图集使用",
              });
              data.targetTag = tagAddRes.data.id + "";
            }
            let res = await post("/admin/picture/lora/imgFolder/add", data);
            repBackMessageShow(that, res);
          },
        }),
      ],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

export const 编辑图集 = btnMaker("编辑图集", btnActionTemplate.Function, {
  elType: "primary",
  icon: "Edit",
  function: async (that, data) => {
    let drawerProps = {
      title: `编辑图集【${data.name}】`,
      data: data,
      queryItemTemplate: [
        ...imgFolderStorage.getByKeyArr(["name", "mark", "targetTag"]),
      ],
      btnList: [
        btnMaker("确定", btnActionTemplate.Function, {
          icon: "Position",
          function: async (that, data) => {
            delete data.tagName;
            delete data.imgNum;
            let res = await post("/admin/picture/lora/imgFolder/update", data);
            repBackMessageShow(that, res);
          },
        }),
      ],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

export const 查看图集图片 = btnMaker("查看图片", btnActionTemplate.Function, {
  function: async (that, data) => {
    const getFunc = async (that, dataa) => {
      let res = await post("/admin/picture/lora/imgFolder/getImgFolderAllImg", {
        imgFolderId: data.id,
      });
      return res.data;
    };
    let drawerProps = {
      gridDesktop: true,
      size: 60,
      gridDesktopConfig: {
        desktopData: async () => [
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
                getFunc: getFunc,
                startSearch: true,
              },
            }
          )
            .setPosition(0, 0)
            .setSize(12, 8),
        ],
        gridColNum: 12,
        cusStyle: {
          wholeScreen: true,
          margin: 0.001,
          maxRows: 8,
        },
      },
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

export const 查看图集详情 = btnMaker("详情", btnActionTemplate.Function, {
  function: async (that, data) => {
    if (data["creater"]) {
      let res = await post("/admin/base/sys/user/list", {
        id: data["creater"],
      });
      console.log(res, "asd");
      if (res.data && res.data.length == 1) {
        data["createrName"] = res.data[0].username;
      }
    }
    openDrawerFormEasy(that, {
      title: data.name,
      queryItemTemplate: [
        ...imgFolderStorage.getAll(),
        tableCellTemplateMaker("创建者", "createrName"),
        tableCellTemplateMaker(
          "使用次数",
          "trainTimes",
          showCell(showType.func, {
            showFunc: (data, key) => {
              return data[key] + "次";  
            },
          })
        ),
      ],
      noEdit: true,
      data: {
        ...data,
      },
    });
  },
});

imgFolderStorage.push(
  tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([查看图集详情, 删除图集, 查看图集图片, 编辑图集], {
      noDetail: true,
    })
  )
);

export const imgFolderManage = async () => {
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
          searchItemTemplate: [tableCellTemplateMaker("模糊查询", "keyWord")],
          showItemTemplate: imgFolderStorage.getAll(["targetTag"]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/picture/lora/imgFolder/page", {
              ...query,
              page: query.pageNumber || 1,
              size: query.pageSize || 10,
            });
            return transformDataFromCool(res.data);
          },
          btnList: [新建图集],
          cantSelect: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
