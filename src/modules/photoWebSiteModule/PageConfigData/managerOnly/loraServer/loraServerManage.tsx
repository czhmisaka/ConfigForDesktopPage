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
import { ElTag } from "element-plus";
export const baseCoolTableCell = [
  tableCellTemplateMaker("更新时间", "updateTime"),
  tableCellTemplateMaker("创建时间", "createTime"),
  tableCellTemplateMaker("id", "id"),
];

export const loraServerStorage = new SearchCellStorage([
  tableCellTemplateMaker("节点名称", "name"),
  tableCellTemplateMaker("服务器地址", "server"),
  tableCellTemplateMaker("状态", "status", {
    ...showCell(showType.funcComponent, {
      showFunc: (row, key) => {
        const colorMap = {
          offline: "info",
          onLine: "success",
          onWork: "primary",
        };
        return <ElTag type={colorMap[row[key]]}>{row[key]}</ElTag>;
      },
    }),
  }),
  ...baseCoolTableCell,
]);

loraServerStorage.push(
  tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([
      btnMaker("检查状态", btnActionTemplate.Function, {
        function: async (that, data) => {
          let res = await post("/admin/picture/lora/server/checkStatus", {
            id: data.id,
          });
          repBackMessageShow(that, res);
        },
      }),
    ])
  )
);

const 创建lora节点 = btnMaker("创建lora节点", btnActionTemplate.Function, {
  elType: "primary",
  icon: "Plus",
  function: async (that, data) => {
    let drawerProps = {
      title: "创建lora节点",
      queryItemTemplate: loraServerStorage.getByKeyArr(["name", "server"]),
      btnList: [
        btnMaker("提交", btnActionTemplate.Function, {
          elType: "primary",
          function: async (that, data) => {
            let res = await post("/admin/picture/lora/server/add", {
              ...data,
            });
            repBackMessageShow(that, res);
          },
        }),
      ],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

export const loraServerManage = async () => {
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
          searchItemTemplate: [],
          showItemTemplate: loraServerStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/picture/lora/server/list", {});
            return res.data;
          },
          btnList: [创建lora节点],
          cantSelect: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
