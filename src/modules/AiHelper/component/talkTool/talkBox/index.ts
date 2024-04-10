/*
 * @Date: 2024-03-25 17:05:15
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-28 18:05:59
 * @FilePath: /tymh/src/thirdThemeViews/customWorkbench_aiChat/components/talkBox/index.ts
 */
export enum showTypeTemplate {
  text = "text",
  list = "list",
  html = "html",
  card = "card",
  barChart = "barChart",
  pieChart = "pieChart",
  lineChart = "lineChart",
}

export interface TalkCellTemplate extends stringAnyObj {
  from: "user" | "ai" | "system";
  isLoading: boolean;
  needShow: boolean;
  content: any;
  showType: showTypeTemplate;
  columnHeader?: any;
  cusStyle?:string;
  data?: any;
  other?: any;
}

export interface stringAnyObj {
  [key: string]: any;
}

export function talkCellMaker(
  from: string,
  content: any = "",
  needShow: boolean = true,
  showType: showTypeTemplate = showTypeTemplate.text,
  options: stringAnyObj = {}
) {
  return {
    needShow,
    from,
    content,
    showType,
    ...options,
    isLoading: false,
  } as TalkCellTemplate;
}
