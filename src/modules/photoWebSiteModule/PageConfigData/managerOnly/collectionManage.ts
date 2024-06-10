/*
 * @Date: 2023-02-18 19:50:20
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-09 22:05:33
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/collectionManage.ts
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
import { ElMessage } from "element-plus";

const categorysStorage = new SearchCellStorage([
  tableCellTemplateMaker("收藏夹名", "name"),
  tableCellTemplateMaker("描述", "description"),
  tableCellTemplateMaker("图片数量", "nb_images"),
  tableCellTemplateMaker("所有者", "username"),
  tableCellTemplateMaker("最近编辑时间", "date_creation"),
]);

export const 删除收藏夹 = btnMaker("删除", btnActionTemplate.Function, {
  icon: "Delete",
  elType: "danger",
  function: async (that, data) => {
    if (
      await dobuleCheckBtnMaker(`删除收藏夹${data.name}`, "确认删除").catch(
        () => false
      )
    ) {
      let res = await post('/piwigo',{
        method: "pwg.collections.delete",
        col_id: data.id,
      });
      repBackMessageShow(that, res);
    }
  },
});

export const 新增收藏夹 = btnMaker("新增收藏夹", btnActionTemplate.Function, {
  icon: "Plus",
  elType: "primary",
  function: async (that, data) => {
    const submit = btnMaker("提交", btnActionTemplate.Function, {
      function: async (that, data) => {
        let res = await post('/admin/picture/categories/add',data)
        // let res = await post('/piwigo',{
        //   method: "pwg.collections.create",
        //   ...data,
        // });
        repBackMessageShow(that, res);
      },
    });
    openDrawerFormEasy(that, {
      title: "新增收藏夹",
      queryItemTemplate: categorysStorage.getByKeyArr(["name", "description"]),
      btnList: [submit],
    });
  },
});

export const 编辑收藏夹 = btnMaker("编辑", btnActionTemplate.Function, {
  icon: "Edit",
  elType: "info",
  function: async (that, data) => {
    const submit = btnMaker("提交", btnActionTemplate.Function, {
      function: async (that, data) => {
        let res = await post("/collection/set-info", {
          ...data,
        });
        repBackMessageShow(that, res);
      },
    });
    openDrawerFormEasy(that, {
      title: `编辑收藏夹${data.name}`,
      queryItemTemplate: categorysStorage.getByKeyArr(["name", "comment"]),
      btnList: [submit],
      data: data,
    });
  },
});

categorysStorage.push(
  tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([删除收藏夹], {
      fixed: "right",
      noDetail: true,
    })
  )
);

export const 批量删除收藏夹 = btnMaker("删除", btnActionTemplate.Function, {
  icon: "Delete",
  elType: "danger",
  isShow: (data) => data["_selectedList"] && data._selectedList.length > 0,
  function: async (that, data) => {
    const { selectedList } = that;
    if (!(selectedList && selectedList.length > 0))
      ElMessage.error("请选择收藏夹");
    if (
      await dobuleCheckBtnMaker(
        "批量删除",
        selectedList.map((x) => x.name).join(",")
      ).catch(() => false)
    ) {
      let res = {};
      for (let x in selectedList) {
        const { id } = selectedList[x];
        res = await post('/piwigo',{
          method: "pwg.collections.delete",
          col_id: id,
        });
      }
      repBackMessageShow(that, res);
    }
  },
});

export const collectionManage = async () => {
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
          searchItemTemplate: [tableCellTemplateMaker("关键词", "search")],
          showItemTemplate: categorysStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post('/piwigo',{
              method: "pwg.collections.getList",
              user_id: (await useUserStoreHook().getOptions())["id"],
            });
            let back = res.result.collections;
            back = back.filter((x) => {
              if (query.search)
                return (
                  x.name.toUpperCase().indexOf(query.search.toUpperCase()) > -1
                );
              else return true;
            });
            return back;
          },
          btnList: [新增收藏夹, 批量删除收藏夹],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
