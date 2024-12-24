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
import { ElLoadingService, ElTag } from "element-plus";
import { transformDataFromCool } from "../newCategoryManage";
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

const 删除loraServer = btnMaker("删除", btnActionTemplate.Function, {
  elType: "danger",
  icon: "DeleteFilled",
  function: async (that, data) => {
    let res = await post("/admin/picture/lora/server/delete", {
      ids: [data.id],
    });
    repBackMessageShow(that, res);
  },
});

const 详情 = btnMaker("详情", btnActionTemplate.Function, {
  icon: "Document",
  elType: "primary",
  function: async (that, data) => {
    if (data["creater"]) {
      let res = await post("/admin/base/sys/user/list", {
        id: data["creater"],
      });
      console.log(res,'asd')
      if(res.data && res.data.length == 1 ){
        data['createrName'] = res.data[0].username
      }
    }
    openDrawerFormEasy(that, {
      title: data.name,
      queryItemTemplate: [
        ...loraServerStorage.getAll(),
        tableCellTemplateMaker("创建者", "createrName"),
      ],
      noEdit: true,
      data: {
        ...data,
      },
    });
  },
});

loraServerStorage.push(
  tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell(
      [
        详情,
        删除loraServer,
        btnMaker("检查状态", btnActionTemplate.Function, {
          function: async (that, data) => {
            let res = await post("/admin/picture/lora/server/checkStatus", {
              id: data.id,
            });
            repBackMessageShow(that, res);
          },
        }),
      ],
      {
        noDetail: true,
      }
    )
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

export const 选择loraServer = tableCellTemplateMaker(
  "lora训练服务器",
  "loraServer",
  searchCell(formInputType.searchList, {
    propertiesOption: {
      type: "number",
    },
    funcInputOptionsLoader: async (that) => {
      let attr = { multiple: false };
      attr["remoteMethod"] = async (query) => {
        let res = await post("/admin/picture/lora/server/page", {
          keyWord: query,
          size: 200,
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
);

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
          searchItemTemplate: [
            tableCellTemplateMaker("模糊查询", "keyWord"),
            tableCellTemplateMaker(
              "状态",
              "status",
              staticSelectCell({
                onLine: "在线",
                offLine: "离线",
                onWork: "工作中",
              })
            ),
          ],
          showItemTemplate: loraServerStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/picture/lora/server/page", {
              ...query,
              page: query.pageNumber,
              size: query.pageSize,
            });
            return transformDataFromCool(res.data);
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