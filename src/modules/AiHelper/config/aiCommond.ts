/*
 * @Date: 2024-04-23 21:32:33
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-24 15:11:07
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/config/aiCommond.ts
 */

import {
  aiWordMaker,
  actionCellTemplate,
  actionCellMaker,
  extractJSON,
} from "@/modules/taskList/config/AiAction";
import { AiFormPreWord } from "@/modules/taskList/config/AiForm";
import { useCacheHook } from "@/store/modules/cache";
import { chat } from "@/utils/api/requests";
import { ElLoading } from "element-plus";

const cache = useCacheHook();

export enum aiCacheKey {
  aiMemory = "aiMemory",
  aiAction = "aiAction",
  aiPreWord = "aiPreWord",
  aiForm = "aiForm",
}

// 一般ai可能会使用的一些东西
cache.setup(aiCacheKey.aiAction, async () => {});
cache.setup(aiCacheKey.aiMemory, async () => {});
cache.setup(aiCacheKey.aiPreWord, async () => {});
cache.setup(aiCacheKey.aiForm, async () => {});

export const refreshAllAiProps = () => {
  cache.setRefresh(aiCacheKey.aiAction);
  cache.setRefresh(aiCacheKey.aiMemory);
  cache.setRefresh(aiCacheKey.aiPreWord);
  cache.setRefresh(aiCacheKey.aiForm);
};

// 面对普通searchTable 等组件构建的页面，执行的初始操作
export const baseAction = async (that) => {
  refreshAllAiProps();
  const { baseData, gridList } = that;
  const form = await cache.getDataByKey(aiCacheKey.aiForm);
  //   console.log(gridList, "gridList，baseAction");
  let preWord = ``;
  let action = [
    actionCellMaker(
      "go",
      ["前往{pageName}", "去{pageName}"],
      [
        {
          key: "pageName",
          label: "页面名称",
          range: [
            "moduleTower_事件列表",
            "moduleTower_分组列表",
            "moduleTower_设备列表",
          ],
        },
      ],
      `"前往分组"=>{ "actionType": "go", "pageName": "moduleTower_分组列表"};
    "前往分组列表"=>{ "actionType": "go", "pageName": "moduleTower_分组列表"};
  "去设备列表"=>{ "actionType": "go", "pageName": "moduleTower_设备列表"};`,
      (that, data) => {
        const pageName = data.pageName;
        that.$router.push({
          path: "/" + pageName,
        });
      }
    ),
  ] as actionCellTemplate[];
  // 判断处于什么页面状态
  console.log(form, "fuck ");
  if (!form)
    gridList.forEach((item) => {
      switch (item.component.name) {
        case "userManage_searchTable":
          const { searchItemTemplate, showItemTemplate, btnList } =
            item.options.props;
          preWord += `当前用户所在页面中含有一个列表组件\n`;
          if (searchItemTemplate && searchItemTemplate.length != 0)
            preWord += `该列表中可搜索:${searchItemTemplate
              .map((x) => {
                return x.label + ":" + x.key;
              })
              .join(",")}\n`;
          if (showItemTemplate && showItemTemplate.length != 0)
            preWord += `该列表中展示的列如下:${showItemTemplate.map((x) => {
              return x.label + ":" + x.key;
            })}\n`;
          if (btnList && btnList.length != 0) {
            preWord += `该列表中可点击的按钮如下:${btnList.map((x) => {
              return x.label;
            })}`;
            action.push(
              actionCellMaker(
                "clickBtn",
                ["点击{label}按钮", "{label}", "打开{label}"],
                [
                  {
                    key: "label",
                    label: "按钮名称",
                    range: btnList.map((x) => {
                      x.label;
                    }),
                    required: true,
                  },
                ],
                `"${btnList[0].label}"=>{"actionType:"clickBtn",label:"${btnList[0].label}"}`,
                async (that, data) => {
                  console.log(data);
                  document
                    .getElementById(data.label + "_" + "inputForm")
                    .click();
                }
              )
            );
          }
          break;
      }
    });
  else {
    const { btnList, title, queryItemTemplate } = form.plugInData;
    preWord += `当前用户在【${title}】表单中\n`;
    action.push(
      actionCellMaker(
        "autoInput",
        ["自动填写表单{theme}", "基于{theme}自动填写表单"],
        [
          {
            key: "theme",
            label: "表单主题",
          },
        ],
        `"自动填写表单用于改善邻里关系"=>{"actionType":"autoInput","theme":"用于改善邻里关系"};
        "自动填写表单"=>{"actionType":"autoInput","theme":""};
        `,
        async (that, data) => {
          const loading = ElLoading.service({
            lock: true,
            text: "思考中",
            background: "rgba(0, 0, 0, 0.7)",
          });
          let res = await chat(await AiFormPreWord(form, data.theme), "glm-4");
          loading.close();
          let back = res.data.choices[0].message.content;
          const tryData = extractJSON(back);
          if (tryData && tryData.length > 0) {
            const ai_data = tryData[0];
            form.formData = {
              ...form.formData,
              ...ai_data,
            };
          }
        }
      )
    );

    action.push(
      actionCellMaker(
        "back",
        ["返回", "关闭弹窗"],
        [],
        `"返回"=>{"actionType":"back"};`,
        async (that, data) => {
          form.close();
        }
      )
    );
    
    if (queryItemTemplate && queryItemTemplate.length != 0) {
      preWord += `该表单中可填写的内容有:${queryItemTemplate
        .map((x) => {
          return "(" + x.label + ":" + x.key + ")";
        })
        .join(",")}`;
      action.push(
        actionCellMaker(
          "input",
          ["{label}为{data}"],
          [
            {
              key: "label",
              label: "字段名称",
              range: queryItemTemplate.map((x) => {
                return "(" + x.label + ":" + x.key + ")";
              }),
            },
            { key: "data", label: "输入内容" },
          ],
          `${queryItemTemplate[0].label}为123456发达=>{"actionType":"input","label":"${queryItemTemplate[0].label}","data":"123456发达"}
          ${queryItemTemplate[0].label}修改为一个新分组=>{"actionType":"input","label":"${queryItemTemplate[0].label}","data":"一个新分组"}
          `,
          async (th, data) => {
            console.log(data, "fuckform", form);
            data.key = queryItemTemplate.filter(
              (x) => x.label == data.label
            )[0].key;
            form.formData[data.key] = data.data;
          }
        )
      );
    }

    if (btnList && btnList.length != 0) {
      preWord += `该表单中可点击的按钮如下:${btnList.map((x) => {
        return x.label;
      })}`;
      action.push(
        actionCellMaker(
          "clickBtn",
          ["点击{label}按钮", "{label}", "打开{label}"],
          [
            {
              key: "label",
              label: "按钮名称",
              range: btnList.map((x) => {
                x.label;
              }),
            },
          ],
          `"${btnList[0].label}"=>{"actionType:"clickBtn",label:"${btnList[0].label}"}`,
          async (that, data) => {
            console.log(data, "fuckform fuckBtn", btnList);
            document.getElementById(data.label + "_" + "drawerForm").click();
          }
        )
      );
    }
  }

  console.log(
    action,
    preWord,
    "fuck",
    await aiWordMaker(() => action, preWord)
  );
  cache.setup(aiCacheKey.aiAction, async () => {
    return action;
  });
  cache.setup(aiCacheKey.aiPreWord, async () => {
    return await aiWordMaker(() => action, preWord);
  });
};
