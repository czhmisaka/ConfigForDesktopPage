import { useUserStoreHook } from "@/store/modules/user";
import { TalkCellTemplate, stringAnyObj, talkCellMaker } from "../talkBox";
import { get, post } from "@/utils/api/requests";
import history from '@/modules/Customs/assets/history.png';

/*
 * @Date: 2024-03-27 09:39:36
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-24 16:00:55
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/component/talkTool/menu/index.ts
 */
export interface HistoryTemplate extends stringAnyObj {
  id?: string,
  name: string;
  sessionId: string;
  prompt?: "";
  talkCellList: TalkCellTemplate[];
  createdTime: number;
  updatedTime?: number;
}

const preKey = "talkHistory_";

const getUserId = async () => {
  let id = '暂无'
  try {
    id = (await useUserStoreHook().getOptions()).userId || (await useUserStoreHook().getOptions()).id
  }
  catch {
    console.error('获取用户id失败')
  }
  return id + ''
}

const getUserName = async () => {
  let id = '暂无'
  try {
    id = (await useUserStoreHook().getOptions()).name || (await useUserStoreHook().getOptions()).userName
  }
  catch {
    console.error('获取用户名称失败')
  }
  return id + ''
}

const create = async (name: string, talkCellList = []): Promise<HistoryTemplate> => {
  let back = {
    name,
    sessionId: `${preKey}${new Date().getTime()}_${Math.round(
      Math.random() * 1000000
    )}_${(await useUserStoreHook().getOptions()).id}`,
    prompt: "",
    talkCellList: [
      ...(talkCellList && talkCellList.length > 0 ? [] : [
        talkCellMaker("ai", "Hi，我是行政小助手～ 很高兴遇见你！"),
        talkCellMaker('ai', '你可以随时问我问题或者把文件丢给我，我来帮你回答。'),
      ]),
      ...talkCellList
    ].filter(Boolean),
    createdTime: new Date().getTime(),
    updatedTime: new Date().getTime(),
  } as HistoryTemplate;
  await save(back);
  back = await loadOne(back.sessionId)
  return back;
};

const load = async (pageNumber = 1) => {
  const historyList = [];
  // const res = await get('/web/knowledge/ai/sell/history/getAll?userId=' + await getUserId(), {}).catch(x => console.error('获取历史记录报错', x))
  const res = await post('/web/knowledge/ai/sell/history/page', {
    userId: await getUserId(),
    pageNumber,
    pageSize: 50
  }).catch(x => console.error('获取历史记录报错', x))
  res.data.list.map(x => {
    try {
      historyList.push({
        ...JSON.parse(decodeURI(x.historyCell).replace(/\n/g, '')),
        id: x.id
      })
    } catch {
      console.error('解析异常', x.historyCell)
    }
  })
  historyList.sort(
    (a: HistoryTemplate, b: HistoryTemplate) => b.updatedTime - a.updatedTime
  );
  return historyList;
};

const loadOne = async (sessionId: string) => {
  // let data = localStorage.getItem(sessionId);
  let res = await get('/web/knowledge/ai/sell/history/getOne?sessionId=' + sessionId, {})
  let data = res.data[0]
  if (data) return { ...data, ...JSON.parse(decodeURI(data.historyCell)) } as HistoryTemplate;
  else return null;
};

const save = async (history: HistoryTemplate) => {
  let data = {
    "sessionId": history.sessionId,
    "userName": await getUserName(),
    "userId": await getUserId(),
    "historyCell": encodeURI(JSON.stringify(history)),
    "title": history.name
  }
  let res = {}
  // 此处需要判断是否为新增
  if (history.id) {
    // 非新增，覆盖
    res = await post('/web/knowledge/ai/sell/history/update', data)
  } else {
    // 新增
    res = await post('/web/knowledge/ai/sell/history/add', data)
  }
};

const deleteCell = async (sessionId: string) => {
  localStorage.removeItem(sessionId);
  let res = await post('/web/knowledge/ai/sell/history/delete', {
    sessionId
  })
};

const deleteAll = async () => {
  const list = await load();
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
