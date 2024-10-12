/*
 * @Date: 2024-09-09 14:28:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-13 05:56:54
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\managerOnly\loraServer\loraTrainTask.tsx
 */

import {
  gridCellMaker,
  cardComponentType,
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
  SearchCellStorage,
  disabledCell,
  searchCell,
  showCell,
  staticSelectCell,
  tableCellTemplateMaker,
  actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
  showType,
} from "@/modules/userManage/types";
import { getPreUrl, post } from "@/utils/api/requests";
import data from "@iconify-icons/ep/check";
import { ElTag } from "element-plus";
import { transformDataFromCool } from "../newCategoryManage";
import { imgFolderStorage, 查看图集图片, 查看图集详情 } from "./imgFolder";
import { 选择loraServer } from "./loraServerManage";

let status = {
  inQueue: "inQueue",
  running: "running",
  success: "success",
  fail: "fail",
  preEdit: "preEdit",
  createPath: "createPath",
};

export const 删除训练任务_单个 = btnMaker("删除", btnActionTemplate.Function, {
  icon: "Delete",
  elType: "danger",
  function: async (that, data) => {
    if (
      await doubleCheckBtnMaker("删除训练任务" + `【${data.name}】`, "").catch(
        (x) => false
      )
    ) {
      let res = await post("/admin/picture/lora/task/delete", {
        ids: [data.id],
      });
      repBackMessageShow(that, res);
    }
  },
});

export const 删除训练任务_批量 = btnMaker("删除", btnActionTemplate.Function, {
  icon: "Delete",
  elType: "danger",
  isShow: (data) => {
    return data["_selectedList"].length > 0;
  },
  function: async (that, data) => {
    const list = data["_selectedList"];
    if (
      await doubleCheckBtnMaker(
        "删除训练任务" + `【${list.map((x) => x.name).join("】、【")}】`,
        ""
      ).catch((x) => false)
    ) {
      let res = await post("/admin/picture/lora/task/delete", {
        ids: list.map((x) => x.id),
      });
      repBackMessageShow(that, res);
    }
  },
});

export const loraTrainTaskStorage_lora训练任务字段库 = new SearchCellStorage([
  tableCellTemplateMaker("任务名称", "name"),
  // tableCellTemplateMaker('truePath', 'truePath'),
  tableCellTemplateMaker(
    "基础模型",
    "baseModel",
    searchCell(formInputType.input, disabledCell())
  ),
  tableCellTemplateMaker(
    "训练次数",
    "trainTimes",
    searchCell(formInputType.number)
  ),
  tableCellTemplateMaker("当前状态", "status", {
    ...staticSelectCell(status),
    ...disabledCell(),
    ...showCell(showType.funcComponent, {
      showFunc: (data, key) => {
        const statusType = {
          inQueue: "default",
          running: "primary",
          success: "success",
          fail: "danger",
          preEdit: "info",
          createPath: "warning",
        };
        let statusTag = {
          inQueue: "在等待队列中",
          createPath: "训练环境准备中",
          running: "运行中",
          success: "训练成功",
          fail: "训练失败",
          preEdit: "编辑中",
        };
        return (
          <ElTag type={statusType[data[key]]}>{statusTag[data[key]]}</ElTag>
        );
      },
    }),
  }),
  tableCellTemplateMaker(
    "当前进度",
    "processing",
    showCell(showType.funcComponent, {
      showFunc: (data, key) => {
        if (data[key]) {
          return () => (
            <div>
              <el-progress
                text-inside="true"
                stroke-width="20"
                percentage={data[key].toFixed(2)}
                status={data[key] == 100 ? "success" : "primary"}
              ></el-progress>
            </div>
          );
        } else return () => <div>暂无进度</div>;
      },
    })
  ),
  tableCellTemplateMaker("参数", "options"),
  tableCellTemplateMaker("loraServerId", "loraServerId"),
  tableCellTemplateMaker("训练服务器", "loraServer"),
  tableCellTemplateMaker("train", "trainId"),
  tableCellTemplateMaker("关联图集数量", "imgFolderNum"),
  tableCellTemplateMaker("关联图集", "imgFolderIds", {
    ...searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        let attr = { multiple: true };
        attr["remoteMethod"] = async (query) => {
          let res = await post("/admin/picture/lora/imgFolder/page", {
            keyWord: query,
            size: 200,
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
    }),
  }),
]);

export const 创建训练任务 = btnMaker(
  "创建训练任务",
  btnActionTemplate.Function,
  {
    icon: "Plus",
    elType: "success",
    function: async (that, data) => {
      let drawerProps = {
        title: "创建训练任务",
        queryItemTemplate: loraTrainTaskStorage_lora训练任务字段库.getByKeyArr([
          "name",
          "baseModel",
          "trainTimes",
          "imgFolderIds",
        ]),
        btnList: [
          btnMaker("创建训练任务", btnActionTemplate.Function, {
            function: async (that, data) => {
              let res = await post("/admin/picture/lora/task/add", { ...data });
              repBackMessageShow(that, res);
            },
          }),
        ],
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  }
);

export const 开始训练 = btnMaker("开始训练", btnActionTemplate.Function, {
  icon: "VideoPlay",
  elType: "primary",
  isShow: (data) => {
    return data.status == "preEdit" || data.status == "fail";
  },
  function: async (that, data) => {
    let drawerProps = {
      title: "选择训练服务器",
      queryItemTemplate: [选择loraServer],
      btnList: [
        btnMaker("确定", btnActionTemplate.Function, {
          icon: "Position",
          function: async (th, da) => {
            // 添加loraserver到当前训练任务中
            let changeLoraServer = await post(
              "/admin/picture/lora/task/update",
              {
                id: data.id,
                loraServerId: da.loraServer,
              }
            );
            let res = await post("/admin/picture/lora/task/startOneTask", {
              id: data.id,
            });
            repBackMessageShow(th, res);
          },
        }),
      ],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

export const 下载lora = btnMaker("下载lora", btnActionTemplate.Function, {
  icon: "Download",
  elType: "primary",
  isShow: (data) => data.status == "success",
  function: async (that, data) => {
    window.open(
      getPreUrl() +
        "/public/loraTrainTask/loraTrainTask_" +
        data.id +
        "/model/" +
        data.name +
        ".safetensors"
    );
  },
});

export const 编辑 = btnMaker("编辑", btnActionTemplate.Function, {
  icon: "EditPen",
  elType: "primary",
  isShow: (data) => data.status == "preEdit" || data.status == "fail",
  function: async (that, data) => {
    openDrawerFormEasy(that, {
      gridDesktop: true,
      size: 80,
      gridDesktopConfig: {
        name: "选择图集",
        gridColNum: 12,
        cusStyle: {
          wholeScreen: true,
          Fullscreen: true,
          maxRows: 8,
          margin: 4,
        },
        desktopData: async () => {
          return [
            gridCellMaker(
              "1",
              "2",
              {},
              {
                type: cardComponentType.componentList,
                name: "userManage_searchTable",
              },
              {
                props: {
                  autoSearch: true,
                  showItemTemplate: [
                    ...imgFolderStorage.getAll(["asd"]),
                    tableCellTemplateMaker(
                      "操作",
                      "asd",
                      actionCell(
                        [
                          查看图集详情,
                          查看图集图片,
                          btnMaker("删除图集", btnActionTemplate.Function, {
                            elType: "danger",
                            function: async (th, da) => {
                              if (
                                await doubleCheckBtnMaker(
                                  `将从【${data.name}】删除图集【${da.name}】`,
                                  ""
                                ).catch((x) => false)
                              ) {
                                let res = await post(
                                  "/admin/picture/lora/task/delImgFolderToTask",
                                  {
                                    imgFolderIds: [da.id],
                                    loraTrainTaskId: data.id,
                                  }
                                );
                                repBackMessageShow(th, res);
                              }
                            },
                          }),
                        ],
                        {
                          noDetail: true,
                        }
                      )
                    ),
                  ],
                  btnList: [
                    btnMaker("添加图集", btnActionTemplate.Function, {
                      icon: "Plus",
                      function: async (t, d) => {
                        openDrawerFormEasy(t, {
                          queryItemTemplate: [
                            tableCellTemplateMaker(
                              "选择图集",
                              "imgFolders",
                              searchCell(formInputType.searchList, {
                                funcInputOptionsLoader: async (that) => {
                                  let attr = {
                                    multiple: true,
                                    "default-first-option": true,
                                    remoteMethod: async (data) => {
                                      let res = await post(
                                        "/admin/picture/lora/imgFolder/page",
                                        {
                                          keyWord: data,
                                          size: 1000,
                                        }
                                      );
                                      let d = transformDataFromCool(res.data);
                                      return d.list.map((x) => {
                                        return { value: x.id, label: x.name };
                                      });
                                    },
                                  };
                                  return attr;
                                },
                              })
                            ),
                          ],
                          btnList: [
                            btnMaker("确定", btnActionTemplate.Function, {
                              icon: "Plus",
                              function: async (thy, day) => {
                                console.log(day,'asd')
                                let res = await post(
                                  "/admin/picture/lora/task/addImgFolderToTask",
                                  {
                                    imgFolderIds: day.imgFolders,
                                    loraTrainTaskId: data.id,
                                  }
                                );
                                repBackMessageShow(thy, res);
                              },
                            }),
                          ],
                        });
                      },
                    }),
                  ],
                  searchFunc: async (
                    query: stringAnyObj,
                    that: stringAnyObj
                  ) => {
                    let res = await post(
                      "/admin/picture/lora/server/getImgFolderByTrainTask",
                      {
                        id: data.id,
                      }
                    );
                    return res.data;
                  },
                },
              }
            )
              .setSize(12, 8)
              .setPosition(0, 0),
          ];
        },
      },
    });
  },
});

loraTrainTaskStorage_lora训练任务字段库.push(
  tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([下载lora, 编辑, 删除训练任务_单个, 开始训练], {
      noDetail: true,
    })
  )
);

export const loraTrainTaskManage = async () => {
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
          showItemTemplate: loraTrainTaskStorage_lora训练任务字段库.getByKeyArr(
            [
              "name",
              "status",
              "processing",
              "loraServer",
              "imgFolderNum",
              "asd",
            ]
          ),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/picture/lora/task/page", {
              ...query,
              page: query.pageNumber,
              size: query.pageSize,
            });
            return transformDataFromCool(res.data);
          },
          btnList: [创建训练任务, 删除训练任务_批量],
          cantSelect: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
