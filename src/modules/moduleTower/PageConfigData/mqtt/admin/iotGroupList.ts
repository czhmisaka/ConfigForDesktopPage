/*
 * @Date: 2024-01-24 13:04:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-07 22:53:27
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/mqtt/admin/iotGroupList.ts
 */
import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { IotDeviceTemplate } from "@/modules/moduleTower/component/mqtt/iotCard";
import { openDrawerForIotCardServiceDesktop } from "@/modules/moduleTower/component/mqtt/iotServiceDesktop";
import {
  btnMaker,
  doubleCheckBtnMaker,
  openDrawerFormEasy,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  actionCell,
  tableCellTemplateCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { btnActionTemplate } from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import { openIotListByGroupId } from "./iotInfoList";

let iot分组字段 = new SearchCellStorage([
  tableCellTemplateMaker("分组名称", "name"),
  tableCellTemplateMaker("accessKey", "accessKey"),
]);
const 删除按钮 = btnMaker("删除", btnActionTemplate.Function, {
  elType: "danger",
  icon: "Delete",
  function: async (that, data) => {
    if (
      await doubleCheckBtnMaker(
        "删除",
        `确认删除【${data.name}】分组吗？`
      ).catch((x) => false)
    ) {
      // 删除设备
      let res = await post("/admin/iot/group/delete", {
        id: data.id,
      });
      repBackMessageShow(that, res);
    }
  },
});

const 新增分组 = btnMaker("新增分组", btnActionTemplate.Function, {
  icon: "Plus",
  elType: "primary",
  function: async (that, data) => {
    openDrawerFormEasy(that, {
      title: "新增分组",
      queryItemTemplate: [iot分组字段.getByKey("name")],
      btnList: [
        btnMaker("确定", btnActionTemplate.Function, {
          icon: "Position",
          elType: "primary",
          function: async (th, da) => {
            let res = await post("/admin/iot/group/add", {
              name: da.name,
            });
            repBackMessageShow(th, res);
          },
        }),
      ],
    });
  },
});

const 查看设备 = btnMaker("查看设备", btnActionTemplate.Function, {
  icon: "Grid",
  function: async (that, data) => {
    await openIotListByGroupId(that, data.id);
  },
});

const 操作栏 = tableCellTemplateMaker(
  "操作",
  "asd",
  actionCell([查看设备, 删除按钮], {
    fixed: "right",
    noDetail: true,
  })
);

iot分组字段.push(操作栏);

// iotGroup 分组列表
export const iotGroupList = async (): Promise<gridCellTemplate[]> => {
  return [
    gridCellMaker(
      "列表",
      "list",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          searchItemTemplate: [],
          showItemTemplate: iot分组字段.getAll(),
          searchFunc: async (query, that) => {
            let res = await post("/admin/iot/group/list", {});
            return res.data;
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [新增分组],
          autoSearch: false,
          modeChange: true,
          isCard: false,
        },
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
