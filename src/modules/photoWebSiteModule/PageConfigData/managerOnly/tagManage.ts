/*
 * @Date: 2023-02-18 19:50:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-08 23:00:32
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\managerOnly\tagManage.ts
 */
import {
  btnMaker,
  closeDrawerFormEasy,
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
import { post } from "@/utils/api/requests";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { SearchCellStorage } from "../../../userManage/component/searchTable/searchTable";
import { doubleCheckBtnMaker } from "../../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";

import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { ElMessage } from "element-plus";
import { transformDataFromCool } from "./newCategoryManage";

export const tagManage = async () => {
  const tagsStorage = new SearchCellStorage([
    tableCellTemplateMaker("标签名", "name"),
    tableCellTemplateMaker('简介', 'description'),
    // tableCellTemplateMaker("图片数量", "counter"),
    tableCellTemplateMaker("最近编辑时间", "updateTime"),
  ]);

  const 查看图片 = btnMaker("查看图片", btnActionTemplate.Function, {
    elType: "success",
    icon: "Search",
    function: async (that, dataa) => {
      const getFunc = async (that, data) => {
        let { limit, offset } = data;
        let res = await post('/admin/picture/pictureInfo/search', {
          tags:[dataa.id]
        })
        return res.data.list
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
            maxRows: 8,
          },
        },
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  });

  const 添加标签 = btnMaker("添加", btnActionTemplate.OpenDrawer, {
    elType: "primary",
    icon: "Plus",
    drawerProps: {
      title: "添加标签",
      queryItemTemplate: tagsStorage.getByKeyArr(["name", 'description']),
      btnList: [
        btnMaker("提交", btnActionTemplate.Function, {
          icon: "Position",
          function: async (that, data) => {
            let res = await post('/admin/picture/tags/add', {
              ...data
            })
            repBackMessageShow(that, res);
          },
        }),
      ],
    },
  });

  const 删除标签 = btnMaker("删除", btnActionTemplate.Function, {
    icon: "Delete",
    elType: "danger",
    function: async (that, data) => {
      if (await doubleCheckBtnMaker("删除标签", data.name).catch(() => false))
        repBackMessageShow(
          that,
          await post('/admin/picture/tags/delete', {
            ids: [data.id]
          })
        );
    },
  });

  const 编辑标签 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Edit",
    elType: "primary",
    isShow: (data) => {
      let a = [
        "植物花卉",
        "抽象",
        "文字",
        "叶子",
        "人物",
        "动物",
        "肌理",
        "盆景",
        "树",
        "几何图案",
        "纹饰",
        "线条",
        "鸟",
        "城市建筑",
        "涂鸦",
        "瓶罐",
        "戴头巾的女人",
        "海滩",
        "森林",
        "海天",
        "建筑",
        "海螺海贝",
        "卡通动物",
        "天空",
        "花鸟",
        "时尚",
        "浴室",
        "海景",
        "绿植",
        "地图",
        "圣诞",
        "鹿",
        "原野",
        "海浪",
        "船",
        "海岸",
        "大象",
        "马",
        "牛",
        "蝴蝶",
        "山丘",
        "海洋风景",
        "酒",
        "风景",
        "山川",
        "帆船",
        "海草珊瑚",
        "简笔人物",
        "裙子",
        "水果",
        "宗教",
        "莫迪兰",
        "昆虫",
        "杯子",
        "佛像",
        "海星",
        "卡通",
        "浴缸",
        "羽毛",
        "狗",
      ].indexOf(data.name);
      return a == -1;
    },
    function: async (that, data) => {
      let drawerForm = {
        title: "编辑标签",
        queryItemTemplate: [tableCellTemplateMaker("标签名", "newName")],
        data: {
          ...data,
          newName: data.name,
        },
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            function: async (that, data) => {
              if (
                await doubleCheckBtnMaker(
                  "修改标签",
                  `即将修改标签名称为【${data.newName}】`
                ).catch((x) => false)
              ) {
                let res = await post('/piwigo', {
                  method: "pwg.tags.rename",
                  "pwg_token": (await useUserStoreHook().getOptions())["pwg_token"],
                  "new_name": data.newName,
                  "tag_id": data.id,
                });
                repBackMessageShow(that, res);
              }
            },
          }),
        ],
      } as drawerProps;
      openDrawerFormEasy(that, drawerForm);
    },
  });

  tagsStorage.push(
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([查看图片, 删除标签, 编辑标签], {
        fixed: "right",
        noDetail: true,
      })
    )
  );

  const 批量删除标签 = btnMaker("批量删除", btnActionTemplate.Function, {
    icon: "Delete",
    elType: "danger",
    isShow: (data) => data["_selectedList"] && data._selectedList.length > 0,
    function: async (that, data) => {
      const { selectedList } = that;
      if (!(selectedList && selectedList.length > 0))
        ElMessage.error("请选择标签");
      if (
        await doubleCheckBtnMaker(
          "批量删除",
          selectedList.map((x) => x.name).join(",")
        ).catch(() => false)
      ) {
        let res = {};
        res = await post('/admin/picture/tags/delete', {
          ids: selectedList.map(x => x.id)
        })
        repBackMessageShow(that, res);
      }
    },
  });

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
          searchItemTemplate: [tableCellTemplateMaker("关键词", "keyWord")],
          showItemTemplate: tagsStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post('/admin/picture/tags/page', {
              ...query,
              page:query.pageNumber,
              size:query.pageSize
            })
            return transformDataFromCool(res.data)
          },
          btnList: [添加标签, 批量删除标签],
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
