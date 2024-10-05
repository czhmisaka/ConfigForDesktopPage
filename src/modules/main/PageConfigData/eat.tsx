/*
 * @Date: 2023-06-17 11:42:47
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-18 13:08:16
 * @FilePath: /ConfigForDesktopPage/src/modules/main/PageConfigData/eat.tsx
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

import {
  btnMaker,
  closeBtn,
  doubleCheckBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  addGridCell,
  highLightComponent,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, post } from "@/utils/api/requests";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
import { xor } from "lodash";
import { openDrawerFormEasy } from "../../userManage/component/searchTable/drawerForm";
import { openDrawerForm } from "../../userManage/component/searchTable/drawerForm";
import { btnActionTemplate, drawerProps, formInputType } from "@/modules/userManage/types";
import { searchCell, staticSelectCell, tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { stringAnyObj } from "../../userManage/types";
import { changeCardProperties } from "../../../components/basicComponents/grid/module/cardApi/index";
import {
  eventCenterCell,
  eventTriggerType,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import { defineComponent } from "vue";
import CardBgVue from "@/components/basicComponents/cell/card/cardBg.vue";
import { gridEditList } from "./main";
import { ElMessage } from "element-plus";

const wholeScreen = {
  width: 24,
  height: 16,
};

let nameArr = [
  "陈俊杰",
  "楼婷婷",
  "卢静",
  "屠牧云",
  "张姝灵",
  "汤志敏",
  "祝振杰",
  "吴晓",
  "王露",
  "万小磊",
  "吴灵丹",
  "王锋",
  "蒋任舟",
  "王珂",
  "傅逸苑",
  "丁岩",
  "李姮",
  "陈虎",
  "汪博",
  "吴永光",
  "张小烜",
  "陈之罕",
  "徐孔瑞",
  "陈新宇",
  "周瑞琦",
  "李靖华",
  "张宇飞",
  "高源",
  "邵阳",
  "陈广宽",
  "缪仕磊",
  "王清",
  "蔡慧",
  "冯辰懋",
  "薛晓义",
  "詹佳辉",
  "李召玉",
  "汪卫东",
  "周海俊",
  "程奕镠",
  "张振南",
  "程序",
  "王郅皓",
  "夏玉才",
  "朱庆楠",
  "闫文忍",
  "郑博耀",
  "陈梦琪",
  "王熊",
  "刘雨田",
  "袁学楠",
  "马阳阳",
  "李旭春",
  "邵宁川",
  "姚晨笛",
];

let isSelected = []
let isSelectedIndex = []

function makeIsSelectedCard(that, num) {
  let key = "elcard" + num;
  let position = {}
  position[key] = {
    x: wholeScreen.width - 3 * Math.floor(isSelected.length / (wholeScreen.height / 2)) - 3,
    y: Math.floor(isSelected.length % (wholeScreen.height / 2)) * 2
  }
  let size = {}
  size[key] = {
    width: 3,
    height: 2
  }
  isSelected.push(nameArr[num])
  isSelectedIndex.push(num)
  changeCardPosition(that, position)
  changeCardSize(that, size)
  setTimeout(() => {
    highLightComponent(that, [])
  }, 300)
}

function maker(name, num) {
  const position = {
    x: Math.floor(num / wholeScreen.height) * 2,
    y: num % wholeScreen.height,
  };
  return gridCellMaker(
    "elcard" + num,
    "卡片",
    {},
    {
      type: cardComponentType.componentList,
      name: "main_nameCard"
    },
    {
      props: {
        isBlack: false,
        title: name,
        clickFunc: async (that) => {
          if (that.isBlack && that.detail.gridInfo.default.size.width != 3) {
            makeIsSelectedCard(that, num)
          }
        }
      },
      showInGridDesktop: false
    }
  )
    .setPosition(position.x, position.y)
    .setSize(2, 1);
}

const init = eventCenterCell(
  eventTriggerType.onMounted,
  async (that, baseData) => {
    nameArr.map((x, i) => {
      addGridCell(that, maker(x, i));
    });
    nameArr.map((x, i) => {
      setTimeout(() => {
        let data = {}
        data['elcard' + i] = true
        changeVisible(that, data)
      }, 500 + i * 50)
    })
  }
);

function big(that, num, f = false) {
  let key = "elcard" + num;
  let prop = {};
  let prop1 = {};
  prop[key] = {
    isBlack: true,
  };
  prop1[key] = {
    isBlack: false,
  };
  changeCardProperties(that, prop);
  if (!f)
    setTimeout(() => {
      changeCardProperties(that, prop1);
    }, 400);
}

function moveSide(that, num, word = '') {
  let key = "elcard" + num;
  let size = {}
  size[key] = {
    width: wholeScreen.width - 6,
    height: wholeScreen.height - 4,
  }
  let position = {}
  position[key] = {
    x: 3,
    y: 2
  }
  highLightComponent(that, [key])
  changeCardPosition(that, position)
  setTimeout(() => {
    changeCardSize(that, size)
    if (word) {
      let data = {}
      data[key] = {
        title: nameArr[num] + word
      }
      changeCardProperties(that, data)
    }
  }, 200)
}

export const eat = async () => {
  let mainList = [];
  return [
    init,
    // ...gridEditList,
    gridCellMaker(
      "随机",
      "打开组件菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_button",
      },
      {
        isSettingTool: true,
        props: {
          icon: "Coordinate",
          label: '抽一个',
          onClickFunc: (content: any) => {
            let a = Math.random() * nameArr.length + nameArr.length;
            let num = 0;
            const interval = () => {
              num++;
              let key = num % nameArr.length
              if (isSelectedIndex.indexOf(key) > -1) {
                a++
              } else {
                if (num > a) {
                  big(content, key, true);
                  moveSide(content, key)
                  return;
                } else {
                  big(content, num % nameArr.length);
                }
              }
              setTimeout(() => interval(), num * num / 100 + 10)
            }
            interval()
          },
        },
      }
    )
      .setPosition(12, 11)
      .setSize(2, 1),
    gridCellMaker(
      "随机1",
      "打开组件菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_button",
      },
      {
        isSettingTool: true,
        props: {
          type: 'primary',
          icon: "Coordinate",
          label: '自定义配置',
          onClickFunc: (content: any) => {
            openDrawerFormEasy(content, {
              title: '配置抽奖方案',
              queryItemTemplate: [
                tableCellTemplateMaker('幸运人数', 'maxTimes', staticSelectCell({
                  0: '一',
                  1: '二',
                  2: '三',
                  3: '四',
                  4: '五',
                  // 15:'123'
                })),
                tableCellTemplateMaker('抽奖类目', 'type', staticSelectCell({
                  '【一等奖】': '【一等奖】',
                  '【二等奖】': '【二等奖】',
                  '【三等奖】': '【三等奖】',
                  '【舞力全开】': '【舞力全开】',
                }))
              ],
              btnList: [
                btnMaker('确认', btnActionTemplate.Function, {
                  icon: 'Position',
                  elType: 'primary',
                  function: async (that, data) => {
                    if (await doubleCheckBtnMaker('确认抽奖', `${data.type}共${data.maxTimes * 1 + 1}人`, {
                    }).catch(x => false)) {
                      that.isOpen = false
                      that.formData = {};
                      let type = data.type
                      let times = 0
                      let maxTimes = data.maxTimes
                      let useAbleLength = nameArr.length - isSelected.length
                      let a = Math.random() * useAbleLength * 2 + useAbleLength;
                      let num = 0;
                      const interval = () => {
                        num++;
                        let key = num % nameArr.length
                        if (isSelectedIndex.indexOf(key) > -1) {
                          a++
                        } else {
                          if (num > a) {
                            big(content, key, true);
                            moveSide(content, key, type)
                            if (times < maxTimes) {
                              times++
                              return setTimeout(() => {
                                makeIsSelectedCard(content, key)
                                setTimeout(() => {
                                  a = Math.random() * useAbleLength * 2 + useAbleLength;
                                  num = 0
                                  interval()
                                }, 500)
                              }, 1500)
                            }
                            return;
                          } else {
                            big(content, num % nameArr.length);
                          }
                        }
                        // setTimeout(() => interval(), num * num / useAbleLength / 10 + 30)
                        setTimeout(() => interval(), 0)
                      }
                      interval()
                    }
                  }
                })
              ]
            })

          },
        },
      }
    )
      .setPosition(10, 11)
      .setSize(2, 1),
    gridCellMaker(
      "随机1",
      "打开组件菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_button",
      },
      {
        isSettingTool: true,
        props: {
          label: '置灰已选',
          type: 'info',
          onClickFunc: (that: any) => {
            let data = {}
            isSelectedIndex.map(x => {
              let key = 'elcard' + x;
              data[key] = {
                bgColor: '#666'
              }
            })
            changeCardProperties(that, data)
          },
        },
      }
    )
      .setPosition(10, 12)
      .setSize(2, 1),
    gridCellMaker(
      "随机1",
      "打开组件菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_button",
      },
      {
        isSettingTool: true,
        props: {
          label: '复原',
          type: 'error',
          onClickFunc: (that: any) => {
            let data = {}
            let size = {}
            let position = {}
            isSelected = []
            isSelectedIndex = []
            nameArr.map((x, i) => {
              let key = 'elcard' + i
              data[key] = {
                title: x,
                bgColor: 'red',
                isBlack: false
              }
              size[key] = {
                width: 2,
                height: 1
              }
              position[key] = {
                x: Math.floor(i / wholeScreen.height) * 2,
                y: i % wholeScreen.height,
              }
            })
            changeCardSize(that, size)
            changeCardPosition(that, position)
            changeCardProperties(that, data)
          },
        },
      }
    )
      .setPosition(12, 12)
      .setSize(2, 1),
  ] as gridCellTemplate[];
};
