import { getFlowUrl, post } from "@/utils/api/requests";

/*
 * @Date: 2024-03-25 17:05:15
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-03 15:24:50
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/component/talkTool/talkBox/index.ts
 */
export enum showTypeTemplate {
  text = "text",
  list = "list",
  btns = "btns",
  html = "html",
  card = "card",
  barChart = "barChart",
  pieChart = "pieChart",
  lineChart = "lineChart",
  markDown = "markDown",
  fromDocs = "fromDocs",
}

export enum reportType {
  good = 1,
  bad = 2,
}

// 每次点击赞同或者反对的时候构建的傻逼玩意
export interface reportDataTemplate extends stringAnyObj {
  question: string;
  answer: string;
  isSelected: boolean;
  type: reportType;
  tagContent: string;
  content: string;
}

export interface docDataTemplate extends stringAnyObj {
  code: string;
  title: string;
  text: string;
  fileType: string;
  score: number | string;
}

type userTendType = "翻译" | "搜索" | "摘要文本" | "辅助写作" | "未知";

export interface TalkCellTemplate extends stringAnyObj {
  from: "user" | "ai" | "system";
  id: string;
  // 归属提问
  question?: string;
  // 用户询问的意图
  userIntent?: userTendType;
  // 是否处于请求预检中
  isPreLoading: boolean;
  // 是否处于回答流状态中
  isLoading: boolean;
  // 需要显示的语句
  needShow: boolean;
  // 文本等内容
  content: any;
  // 展示方式
  showType: showTypeTemplate;
  // 表头 - 用于显示列表
  columnHeader?: any;
  // 自定义样式
  cusStyle?: string;
  // 可选数据
  data?: any;
  other?: any;
  // 回答参考的文档等属性
  docs?: stringAnyObj[];
  // 用户上传的文档
  userDocs?: stringAnyObj[];
}

export interface TalkCellOptions extends stringAnyObj {
  id?: string;
  cusStyle?: string;
  data?: any;
  docs?: stringAnyObj[];
  content?: any;
  columnHeader?: any;
  other?: any;
  needShow?: boolean;
  isLoading?: boolean;
  question?: string;
}

export interface stringAnyObj {
  [key: string]: any;
}


export const getUserIntent = async (question) => {
  return new Promise(async (r, j) => {
    await fetch(`${getFlowUrl()}/chat/generic_chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context: `现在你是一个语言意图识别大师，请根据用户的输入判断用户的意图处于以下列表中的那种【${[
          "翻译",
          "搜索",
          "摘要文本",
          "辅助写作",
          "未知",
        ].join(
          "】、【"
        )}】，只需要用【xx】格式输出你判断的意图即可。用户的输入为：
          ${question}
          `,
        stream: false,
      }),
    }).then(async (resp) => {
      const reader = resp.body.getReader();
      reader
        .read()
        .then((chunk) => {
          const decoder = new TextDecoder("utf-8");
          let re = decoder.decode(chunk.value, { stream: !chunk.done });
          return r(re.split("【")[1].split("】")[0]);
        })
        .catch(() => {
          r("未知");
        });
    });
  });
};

const preKey = "talkCellId_";

export function talkCellMaker(
  from: "user" | "ai" | "system",
  content: any = "",
  needShow: boolean = true,
  showType: showTypeTemplate = showTypeTemplate.text,
  options: TalkCellOptions = {}
) {
  // 生成一个id
  if (!options.id)
    options.id = `${preKey}${new Date().getTime()}_${Math.round(
      Math.random() * 1000000
    )}`;
  return {
    needShow,
    from,
    docs: [],
    content,
    // 只有ai返回请求需要使用 预检状态
    isPreLoading: false,
    ...options,
    showType,
    isLoading: false,
  } as TalkCellTemplate;
}
