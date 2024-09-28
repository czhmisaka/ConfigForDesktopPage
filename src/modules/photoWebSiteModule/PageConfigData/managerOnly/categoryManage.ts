/*
 * @Date: 2023-02-18 19:50:20
 * @LastEditors: CZH
 * @LastEditTime: 2024-09-28 23:25:31
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/categoryManage.ts
 */
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
  stringAnyObj,
} from "@/modules/userManage/types";
import {
  actionCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { searchCell } from "@/modules/userManage/component/searchTable/searchTable";
import { post} from "@/utils/api/requests";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { SearchCellStorage } from "../../../userManage/component/searchTable/searchTable";
import { dobuleCheckBtnMaker } from "../../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";

import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

export const categoryManage = async () => {
  const categoryStorage = new SearchCellStorage([
    tableCellTemplateMaker("相册名", "name"),
    tableCellTemplateMaker("描述", "comment"),
    tableCellTemplateMaker("图片数量", "total_nb_images"),
    tableCellTemplateMaker("子相册数量", "nb_categories"),
    tableCellTemplateMaker("最近编辑时间", "lastmodified"),
  ]);

  const 提交 = btnMaker("提交", btnActionTemplate.Function, {
    elType: "primary",
    function: async (that, data) => {
      let res = await post('/piwigo',{
        method: "pwg.categories.add",
        ...data,
      });
      repBackMessageShow(that, res);
    },
  });

  const 新增相册 = btnMaker("新增相册", btnActionTemplate.Function, {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
      let base = {};
      if (data && data.id) base["parent"] = data.id;
      let drawerProps = {
        title: "新增相册",
        queryItemTemplate: categoryStorage.getByKeyArr(["name", "comment"]),
        btnList: [提交],
        data: base,
      };
      openDrawerFormEasy(that, drawerProps);
    },
  });

  const 编辑提交 = btnMaker("提交", btnActionTemplate.Function, {
    icon: "Position",
    elType: "primary",
    function: async (that, data) => {
      let res = await post('/piwigo',{
        method: "pwg.categories.setInfo",
        category_id: data.id,
        name: data.name,
        comment: data.comment,
      });
      repBackMessageShow(that, res);
    },
  });

  const 编辑相册 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
      let drawerProps = {
        title: "编辑相册",
        queryItemTemplate: categoryStorage.getByKeyArr(["name", "comment"]),
        btnList: [编辑提交],
        data: data,
      };
      openDrawerFormEasy(that, drawerProps);
    },
  });

  const 删除相册 = btnMaker("删除", btnActionTemplate.Function, {
    elType: "danger",
    icon: "Delete",
    function: async (that, data) => {
      if (await dobuleCheckBtnMaker("删除", data.name).catch(() => false))
        repBackMessageShow(
          that,
          await post('/piwigo',{
            method: "pwg.categories.delete",
            category_id: data.id,
            pwg_token: (await useUserStoreHook().getOptions())["pwg_token"],
          })
        );
    },
  });

  const 打开相册预览 = btnMaker("预览图片", btnActionTemplate.Function, {
    elType: "success",
    icon: "Position",
    function: async (that, data) => {
      const getCategory = async (that, dataa) => {
        let { limit, offset, query } = dataa;
        let res = await post(
          `/images?offset=${offset}&limit=${1000000}${"&catrgory=" + data.id}`,
          {}
        );
        return res.data.list.map((x) => {
          let path = x.path.replace("./", "/");
          return {
            ...x,
            url: `/imageserver/i.php?` + path.replace(".", "-sm.") + "",
          };
        });
      };
      let drawerProps = {
        gridDesktop: true,
        size: 70,
        gridDesktopConfig: {
          gridColNum: 12,
          cusStyle: {
            wholeScreen: true,
            maxRows: 8,
            margin: 6,
          },
          desktopData: async () => {
            return [
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
                    getFunc: getCategory,
                    startSearch: true,
                  },
                }
              )
                .setPosition(0, 0)
                .setSize(12, 8),
            ];
          },
        },
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  });

  categoryStorage.push(
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([新增相册, 打开相册预览, 编辑相册, 删除相册], {
        fixed: "right",
      })
    )
  );

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
          searchItemTemplate: [
            tableCellTemplateMaker('关键词','search'),
          ],
          showItemTemplate: categoryStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post('/piwigo',{
              // method: "pwg.categories.getList",
              method: "pwg.categories.getAdminList",
              ...query
            });
            let back = res.result.categories;
            return back;
          },
          btnList: [新增相册],
          // autoSearch: true,
          cantSelect: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
