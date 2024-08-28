import {
  cardComponentType,
  cardOnChangeType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { showTypeTemplate, talkCellMaker } from "../component/talkTool/talkBox";
import {
  btnActionTemplate,
  desktopDataTemplate,
} from "@/modules/userManage/types";
import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import {
  setPosition,
  setSize,
} from "../../../components/basicComponents/grid/module/util";
import {
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { ElMessageBox } from "element-plus";

// 定义主要桌面大小
const wholeScreen = {
  size: {
    width: 12,
    height: 8,
  },
};

export function getXpx(vw) {
  return (
    vw /
    (document.getElementById("aiChat_MainBox").clientWidth /
      wholeScreen.size.width)
  );
}
export function getYpx(vh) {
  return (
    vh /
    (document.getElementById("aiChat_MainBox").clientHeight /
      wholeScreen.size.height)
  );
}

const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 24,
    Fullscreen: true,
    allPeopleCanSee: true,
    NoMenu: true,
  },
};

/*
 * @Date: 2024-04-18 08:56:38
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-18 10:52:28
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/PageConfigData/AIChat.ts
 */

let timeOut = null as any;
const AISize = () => {
  return {
    addNew: {
      width: 2.5,
      height: getYpx(54),
    },
    historyBox: {
      width: 2.5,
      height: 8 - getYpx(54),
    },
    talkBox: {
      // width: getXpx(950),
      height: 8 - getYpx(150),
      width: 7,
    },
    inputBox: {
      // width: getXpx(950),
      width: 7,
      height: getYpx(150),
    },
    docBox: {
      width: 2.5,
      // width: 6 - getXpx(950) / 2,
      height: 8,
    },
  };
};
const AIPosition = () => {
  return {
    addNew: {
      x: 0,
      y: 0,
    },
    historyBox: {
      x: 0,
      y: getYpx(54),
    },
    talkBox: { x: 2.5, y: 0 },
    // talkBox: { x: (12 - getXpx(950)) / 2, y: 0 },
    inputBox: { x: 2.5, y: 8 - getYpx(150) },
    // inputBox: { x: (12 - getXpx(950)) / 2, y: 8 - getYpx(150) },
    docBox: { x: 9.5, y: 0 },
    // docBox: { x: 6 + getXpx(950) / 2, y: 0 },
  };
};
const windowResize = windowResizeChecker(async (that, baseData) => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, AISize());
    changeCardPosition(that, AIPosition());
  }, 50);
}, "windowResize");

export const AiChatDesktop = async () => {
  const size = AISize();
  const position = AIPosition();
  return [
    windowResize,
    gridCellMaker(
      "talkBox",
      "talkBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_talkBox",
      },
      {
        props: {
          inputList: [
            // talkCellMaker("ai", "HI，我是集智千问，请问有可以帮助您的吗？"),
            // talkCellMaker("ai", "", true, showTypeTemplate.btns, {
            //   btnList: [
            //     btnMaker("知识来源[1]", btnActionTemplate.Function, {
            //       function: async (that, data) => {
            //         changeCardProperties(that, {
            //           talkBox: {
            //             inputList: [talkCellMaker("user", "问题1")],
            //           },
            //         });
            //       },
            //     }),
            //   ],
            // }),
            // talkCellMaker("user", "展示一下已有的大数据知识库"),
            // talkCellMaker("user", "你现在扮演一个优秀的移动员工"),
          ],
        },
      }
    )
      .setSize(size.talkBox.width, size.talkBox.height)
      .setPosition(position.talkBox.x, position.talkBox.y),
    gridCellMaker(
      "inputBox",
      "inputBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_inputBox",
      },
      {
        props: {},
      }
    )
      .setSize(size.inputBox.width, size.inputBox.height)
      .setPosition(position.inputBox.x, position.inputBox.y),
    gridCellMaker(
      "docBox",
      "docBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_docBox",
      },
      {
        props: {},
      }
    )
      .setSize(size.docBox.width, size.docBox.height)
      .setPosition(position.docBox.x, position.docBox.y),
    gridCellMaker(
      "historyBox",
      "historyBox",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_historyBox",
      },
      {
        // showInGridDesktop: false,
        props: {},
      }
    )
      .setSize(size.historyBox.width, size.historyBox.height)
      .setPosition(position.historyBox.x, position.historyBox.y),
    gridCellMaker(
      "addNew",
      "addNew",
      {},
      {
        type: cardComponentType.componentList,
        name: "AiHelper_addNew",
      },
      {
        // showInGridDesktop: false,
        props: {},
      }
    )
      .setSize(size.addNew.width, size.addNew.height)
      .setPosition(position.addNew.x, position.addNew.y),
  ] as gridCellTemplate[];
};

export const AiChatDesktopCellList = {
  智能问答: {
    ...base,
    name: "智能问答",
    desktopData: AiChatDesktop,
  },
} as { [key: string]: desktopDataTemplate };
