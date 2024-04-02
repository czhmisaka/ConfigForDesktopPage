/*
 * @Date: 2024-01-24 13:04:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-26 20:26:20
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/mqtt/admin/iotInfoList.ts
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
  dobuleCheckBtnMaker,
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

let iot设备字段 = new SearchCellStorage([
  tableCellTemplateMaker("设备名称", "name"),
  tableCellTemplateMaker("设备名称（En)", "nameEn"),
  tableCellTemplateMaker("简介", "description"),
  tableCellTemplateMaker("设备服务", "service"),
  tableCellTemplateMaker("userKey",'mainUser'),
  tableCellTemplateMaker("更新时间", "updateTime"),
  tableCellTemplateMaker("创建时间", "createTime"),
]);
const 删除按钮 = btnMaker("删除", btnActionTemplate.Function, {
  elType: "danger",
  icon: "Delete",
  function: async (that, data: IotDeviceTemplate) => {
    if (
      await dobuleCheckBtnMaker(
        "删除",
        `确认删除【${data.name}】设备吗？`
      ).catch((x) => false)
    ) {
      // 删除设备
      let res = await post("/admin/iot/iot/delete", {
        ids: [data.id],
      });
      repBackMessageShow(that, res);
    }
  },
});
const 批量删除按钮 = btnMaker("删除", btnActionTemplate.Function, {
  elType: "danger",
  icon: "Delete",
  isShow: (data) => {
    return data._selectedList.length > 0;
  },
  function: async (that, data) => {
    let selectedList = that.selectedList;
    if (
      await dobuleCheckBtnMaker(
        "删除",
        `确认删除${selectedList
          .map((x: IotDeviceTemplate) => "【" + x.name + "】")
          .join("、")}设备吗？`
      ).catch((x) => false)
    ) {
      // 删除设备
      let res = await post("/admin/iot/iot/delete", {
        ids: selectedList.map((x) => x.id),
      });
      repBackMessageShow(that, res);
    }
  },
});

const 展开Iot设备控制面板 = btnMaker("控制面板", btnActionTemplate.Function, {
  icon: "Grid",
  elType: "primary",
  function: async (that, data: stringAnyObj) => {
    openDrawerForIotCardServiceDesktop(that, {
      ...(data as IotDeviceTemplate),
      gridCell: JSON.parse(data.gridCell),
      service: JSON.parse(data.service),
    });
  },
});

const 操作栏 = tableCellTemplateMaker(
  "操作",
  "asd",
  actionCell([展开Iot设备控制面板, 删除按钮], {
    fixed: "right",
    noDetail: true,
  })
);

iot设备字段.push(操作栏);

// iotInfo 设备列表
export const iotInfoList = async (groupId = 0): Promise<gridCellTemplate[]> => {
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
          showItemTemplate: iot设备字段.getAll(),
          searchFunc: async (query, that) => {
            let res = await post("/admin/iot/iot/list", {
              groupId,
            });
            return res.data;
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [批量删除按钮],
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

export const openIotListByGroupId = async (that, groupId) => {
  openDrawerFormEasy(that, {
    gridDesktop: true,
    size: 50,
    gridDesktopConfig: {
      name: "设备信息列表",
      desktopData: async () => await iotInfoList(groupId),
      gridColNum: 12,
      cusStyle: {
        margin: 3,
        wholeScreen: true,
        maxRows: 8,
      },
    },
  });
};
