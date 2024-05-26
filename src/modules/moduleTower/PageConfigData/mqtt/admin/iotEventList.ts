import { changeCardProperties } from "@/components/basicComponents/grid/module/cardApi";
import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { gridEditList } from "@/modules/main/PageConfigData/main";
import {
  iotEventActionTypeObject,
  iotEventTemplate,
  iotEventTriggerTypeObject,
} from "@/modules/moduleTower/types";
import { ai表单填写 } from "@/modules/taskList/config/AiForm";
import {
  eventCenterCell,
  eventTriggerType,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import {
  btnMaker,
  dobuleCheckBtnMaker,
  openDrawerFormEasy,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  actionCell,
  searchCell,
  staticSelectCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
} from "@/modules/userManage/types";
import { useCacheHook } from "@/store/modules/cache";
import { useUserStoreHook } from "@/store/modules/user";
import { post } from "@/utils/api/requests";

export interface groupTopic {
  name: string;
  groupId: string;
  children: string[];
}

export interface allTopic {
  triggerTopic: groupTopic[];
  targetTopic: groupTopic[];
}
useCacheHook().setup(
  "allTopic",
  async () => {
    let res = await post("/admin/iot/group/getAllTopic", {});
    return res.data as allTopic;
  },
  false,
  true
);

let iotEventStorage = new SearchCellStorage([
  tableCellTemplateMaker("id", "id"),
  tableCellTemplateMaker("createTime", "createTime"),
  tableCellTemplateMaker("updateTime", "updateTime"),
  /** 事件名称 */
  tableCellTemplateMaker("事件名称", "name"),
  /** 事件描述 */
  tableCellTemplateMaker(
    "事件描述",
    "description",
    searchCell(formInputType.textarea)
  ),
  /** 触发主题 */
  tableCellTemplateMaker(
    "触发主题",
    "triggerTopic",
    searchCell(formInputType.treeSelect, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          props: {
            isLeaf: "isLeaf",
          },
          showCheckbox: false,
          multiple: false,
          type: "string",
          nodeKey: "value",
          checkStrictly: false,
        };
        let topic = await useCacheHook().getDataByKey("allTopic");
        // return topic.triggerTopic;
        let data = [];
        topic.triggerTopic.forEach((item) => {
          let cell = {
            label: item.name,
            value: item.groupId,
            children: item.children.map((x) => {
              return {
                label: `${x.device.name}【${x.name}】`,
                value: x.topic,
                isLeaf: true,
              };
            }),
          };
          data.push(cell);
        });
        console.log(data, "fuck");
        return {
          ...attr,
          data,
        };
      },
    })
  ),
  /** 触发范围 */
  tableCellTemplateMaker("触发范围", "triggerTarget"),
  /** 触发方式 */
  tableCellTemplateMaker(
    "触发方式",
    "triggerType",
    staticSelectCell(iotEventTriggerTypeObject)
  ),
  /** 触发事件类型 */
  tableCellTemplateMaker(
    "触发事件类型",
    "eventType",
    staticSelectCell(iotEventActionTypeObject)
  ),
  /** 目标主题 */
  tableCellTemplateMaker(
    "目标主题",
    "targetTopic",
    searchCell(formInputType.treeSelect, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          props: {
            isLeaf: "isLeaf",
          },
          showCheckbox: false,
          multiple: false,
          type: "string",
          nodeKey: "value",
          checkStrictly: false,
        };
        let topic = await useCacheHook().getDataByKey("allTopic");
        // return topic.triggerTopic;
        let data = [];
        topic.targetTopic.forEach((item) => {
          let cell = {
            label: item.name,
            value: item.groupId,
            children: item.children.map((x) => {
              return {
                label: x.device.name + `【${x.name}】`,
                value: x.topic,
                isLeaf: true,
              };
            }),
          };
          data.push(cell);
        });
        return {
          ...attr,
          data,
        };
      },
    })
  ),
  tableCellTemplateMaker("数据", "data"),
]);

const openDrawerForIotEvent = async (that, data: iotEventTemplate = null) => {
  const isEdit = data && data?.id ? true : false;
  let drawerProps = {
    title: isEdit ? "编辑事件" : "新增事件",
    data: {
      userId: (await useUserStoreHook().getOptions())["id"],
    },
    queryItemTemplate: iotEventStorage.getAll([
      "id",
      "createTime",
      "updateTime",
      "asd",
    ]),
    btnList: [
      btnMaker(isEdit ? "保存" : "新增", btnActionTemplate.Function, {
        function: async (that, data) => {
          let res = await post(
            "/admin/iot/iotEvent/" + (!isEdit ? "add" : "update"),
            data
          );
          repBackMessageShow(that, res);
        },
      }),
      // ai表单填写,
    ],
  } as drawerProps;
  openDrawerFormEasy(that, drawerProps);
};

const 新增事件 = btnMaker("新增事件", btnActionTemplate.Function, {
  icon: "Plus",
  function: async (that, data) => {
    await openDrawerForIotEvent(that);
  },
});

const 编辑事件 = btnMaker("编辑事件", btnActionTemplate.Function, {
  icon: "Edit",
  function: async (that, data: iotEventTemplate) => {
    await openDrawerForIotEvent(that, data);
  },
});

const 删除事件 = btnMaker("删除事件", btnActionTemplate.Function, {
  function: async (that, data) => {
    if (
      await dobuleCheckBtnMaker(
        `删除事件【${data.name}】`,
        `事件简介【${data.description}】`
      ).catch(() => false)
    ) {
      let res = await post("/admin/iot/iotEvent/delete", {
        id: data.id,
      });
      repBackMessageShow(that, res);
    }
  },
});

const 批量删除事件 = btnMaker("批量删除事件", btnActionTemplate.Function, {
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
          .map((x) => "【" + x.name + "】")
          .join("、")}事件吗？`
      ).catch((x) => false)
    ) {
      const res = await post("/admin/iot/iotEvent/delete", {
        ids: selectedList.map((x) => x.id),
      });
      repBackMessageShow(that, res);
    }
  },
});

const 操作栏 = tableCellTemplateMaker(
  "操作",
  "asd",
  actionCell([删除事件], {
    fixed: "right",
    noDetail: true,
  })
);

iotEventStorage.push(操作栏);

// iot设备事件管理列表
export const iotEventManage = async () => {
  const iotCardTitleStyle = {
    textAlign: 'left',
    fontWeight: 600,
    fontSize: "1em",
    margin: '3px 6px'
}
  let { data } = await post("/admin/iot/iotEvent/sysInfo", {});
  const { averageTime, eventCheck, eventDeal, publish } = JSON.parse(data);
  const init = eventCenterCell(
    eventTriggerType.onMounted,
    async (that, data) => {
      setInterval(async () => {
        let { data } = await post("/admin/iot/iotEvent/sysInfo", {});
        const { averageTime, eventCheck, eventDeal, publish } =
          JSON.parse(data);
        let dataa = {
          averageTime: { data: averageTime },
          eventCheck: { data: eventCheck },
          eventDeal: { data: eventDeal },
          publish: { data: publish },
        };
        changeCardProperties(that, dataa);
      }, 1000);
    }
  );
  return [
    init,
    gridCellMaker(
      "averageTime",
      "averageTime",
      {},
      {
        name: "TaskList_numberCard",
        type: cardComponentType.componentList,
      },
      {
        props: {
          iotCardTitleStyle,
          label: "平均处理事件时间",
          data: averageTime,
          suffix: "ms",
        },
      }
    )
      .setSize(2, 1)
      .setPosition(0, 0),

    gridCellMaker(
      "eventCheck",
      "eventCheck",
      {},
      {
        name: "TaskList_numberCard",
        type: cardComponentType.componentList,
      },
      {
        props: {
          iotCardTitleStyle,

          label: "事件检查",
          data: eventCheck / 5,
          suffix: "/s",
        },
      }
    )
      .setSize(2, 1)
      .setPosition(2, 0),
    gridCellMaker(
      "eventDeal",
      "eventDeal",
      {},
      {
        name: "TaskList_numberCard",
        type: cardComponentType.componentList,
      },
      {
        props: {
          iotCardTitleStyle,

          label: "事件处理",
          data: eventDeal / 5,
          suffix: "/s",
        },
      }
    )
      .setSize(2, 1)
      .setPosition(4, 0),
    gridCellMaker(
      "publish",
      "publish",
      {},
      {
        name: "TaskList_numberCard",
        type: cardComponentType.componentList,
      },
      {
        props: {
          iotCardTitleStyle,

          label: "推送",
          data: publish / 5,
          suffix: "/s",
        },
      }
    )
      .setSize(2, 1)
      .setPosition(6, 0),
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
          showItemTemplate: iotEventStorage.getAll([
            "id",
            "createTime",
            "updateTime",
          ]),
          searchFunc: async (query, that) => {
            let res = await post("/admin/iot/iotEvent/list", {});
            return res.data;
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [新增事件, 批量删除事件],
          autoSearch: false,
          modeChange: true,
          isCard: false,
        },
      }
    )
      .setPosition(0, 1)
      .setSize(12, 7),
  ] as gridCellTemplate[];
};
