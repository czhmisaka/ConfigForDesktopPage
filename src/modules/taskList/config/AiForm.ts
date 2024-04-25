/*
 * @Date: 2024-03-26 22:09:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-23 23:31:10
 * @FilePath: /ConfigForDesktopPage/src/modules/taskList/config/AiForm.ts
 */

import {
  btnMaker,
  dobuleCheckBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { btnActionTemplate, formInputType } from "@/modules/userManage/types";
import { chat } from "@/utils/api/requests";
import {
  ElLoading,
  ElLoadingService,
  ElMessage,
  ElMessageBox,
} from "element-plus";
import { extractJSON } from "./AiAction";

export const formGetter = async (that) => {
  const { schema } = that;
  const { properties } = schema;
  const backArr = Object.keys(properties).map((key) => {
    const cell = properties[key];
    let backWord = `label：${cell.title},key:${key},数据类型：${cell.type}`;
    if (cell.enumNames && cell.enum && cell.enum.length > 0) {
      backWord += `,可选值：[${cell.enum.join(",")}]`;
    }
    return backWord;
  });
  return backArr.join(";\n");
};

export const AiFormPreWord = async (that, topic) => `
你现在是一名出色的表单分析填写人员，你可以充分分析以下表单内容，并给出相应的填写内容。

Skill：
不要输出的代码。
返回一个单层的JSON，其中包含了表单的关键词和你认为应该填写的内容。
回复精确简短。

example:
"表单内容：[
    label：事件名称,key:name,数据类型：string;
    label：事件描述,key:description,数据类型：string;
    label：触发事件类型,key:eventType,数据类型：string,可选值：[sendMsg,keyMapTransform,saveDataToMySql];
],主题：主动触发会议通知 => {name:'会议通知',description:'触发会议通知',eventType:'sendMsg'}"

接下来请为以下内容给出填写建议。
表单内容：[${await formGetter(that)}],
主题：${topic}
`;

// export const ai表单填写 = btnMaker("自动填写", btnActionTemplate.Function, {
//   icon: "Cpu",
//   elType: "warning",
//   function: async (that, data) => {
//     ElMessageBox.prompt("用一句话描述要填写的内容", "AI 填写", {
//       confirmButtonText: "确定",
//       cancelButtonText: "取消",
//       showCancelButton: true,
//     }).then(async ({ value }) => {
//       const loading = ElLoading.service({
//         lock: true,
//         text: "思考中",
//         background: "rgba(0, 0, 0, 0.7)",
//       });
//       let res = await chat(await AiFormPreWord(that, value));
//       loading.close();
//       let back = res.data.choices[0].message.content;
//       const tryData = extractJSON(back);
//       if (tryData && tryData.length > 0) {
//         const ai_data = tryData[0];
//         that.formData = {
//           ...that.formData,
//           ...ai_data,
//         };
//       }
//     });
//   },
// });
