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
  dobuleCheckBtnMaker,
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
  tableCellTemplateMaker(
    "共同tag",
    "targetTag",
    searchCell(formInputType.searchList, {
      propertiesOption: {
        type: "number",
      },
      funcInputOptionsLoader: async (that) => {
        let attr = {
          multiple: false,
        };
        attr["remoteMethod"] = async (query) => {
          let res = await post("/admin/picture/tags/page", {
            keyWord: query,
          });
          return transformDataFromCool(res.data).list.map((x) => {
            return {
              label: x.name,
              value: x.id,
            };
          });
        };
        return attr;
      },
    })
  ),
  ...baseCoolTableCell,
]);

const 删除图集 = btnMaker("删除", btnActionTemplate.Function, {
  elType: "danger",
  icon: "Delete",
  function: async (that, data) => {
    if (
      await dobuleCheckBtnMaker(
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
    function: async (that, data) => {
      const { imgIds } = data;
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
              const { imgIds, imgFolderId } = da;
              let res = await post("/admin/picture/lora/imgFolder/addImages", {
                imgIds,
                imgFolderId,
              });
              repBackMessageShow(th,res)
            },
          }),
        ],
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  }
);

imgFolderStorage.push(
  tableCellTemplateMaker("操作", "asd", actionCell([删除图集]))
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
            let res = await post("/admin/picture/lora/imgFolder/add", data);
            repBackMessageShow(that, res);
          },
        }),
      ],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

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
          searchItemTemplate: [tableCellTemplateMaker("", "keyWord")],
          showItemTemplate: imgFolderStorage.getAll(["targetTag"]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/picture/lora/imgFolder/page", {
              ...query,
              page: query.pageNumber,
              size: query.pageSize,
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
