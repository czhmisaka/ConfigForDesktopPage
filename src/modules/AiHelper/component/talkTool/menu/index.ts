import { TalkCellTemplate, talkCellMaker } from "../talkBox";
import { post } from "@/utils/api/requests";

/*
 * @Date: 2024-03-27 09:39:36
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-10 21:21:25
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/menu/index.ts
 */
export interface HistoryTemplate {
  name: string;
  sessionId: string;
  prompt?: "";
  talkCellList: TalkCellTemplate[];
}

const preKey = "talkHistory_";

const create = async (name: string) => {
  let back = {
    name,
    sessionId: `${preKey}${new Date().getTime()}_${Math.round(
      Math.random() * 1000000
    )}`,
    prompt: "",
    talkCellList: [],
  } as HistoryTemplate;
  // let res = await post(
  //   `/ai/newSession?sessionId=${back.sessionId}&prompt=${back.prompt}`,
  //   {}
  // );
  save(back);
  return back;
};

const load = () => {
  const historyList = [];
  let num = 0;
  while (true) {
    let key = localStorage.key(num);
    if (key == null) break;
    if (key?.indexOf(preKey) == 0)
      historyList.push(JSON.parse(localStorage.getItem(key) as string));
    num++;
  }
  return historyList;
};

const loadOne = (sessionId: string) => {
  let data = localStorage.getItem(sessionId);
  if (data) return JSON.parse(data) as HistoryTemplate;
  else return null;
};

const save = (history: HistoryTemplate) => {
  localStorage.setItem(history.sessionId, JSON.stringify(history));
};

const deleteCell = (sessionId: string) => {
  localStorage.removeItem(sessionId);
};

const deleteAll = () => {
  const list = load();
  list.map((x) => {
    deleteCell(x.sessionId);
  });
};

export const HistoryManage = {
  deleteAll,
  create,
  load,
  loadOne,
  save,
  deleteCell,
};
