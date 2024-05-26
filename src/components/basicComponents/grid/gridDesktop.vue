<!--
 * @Date: 2022-04-28 21:57:48
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-26 01:08:26
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/gridDesktop.vue
-->

<template>
  <div :ref="'screenId_' + idRandom" :id="'screenId_' + idRandom" :style="{
    overflowY: cusStyle.wholeScreen ? 'hidden' : 'auto',
    overflowX: 'hidden',
    ...(cusStyle['desktopStyle'] || {})
  }" class="baseGrid">
    <!-- <div style="position:fixed;top:0px;z-index: 10000000;">{{ gridList.map(x => x.label) }} </div>-->
    <grid-layout :layout="gridListComputed()" :col-num="gridColNum" :row-height="gridRowNumAndUnit.blockSize"
      :responsive="false" :isDraggable="baseData.editable" :isResizable="false" :vertical-compact="false"
      :prevent-collision="false" :use-css-transforms="true" :maxRows="cusStyle.maxRows || 30"
      :margin="[gridRowNumAndUnit.margin, gridRowNumAndUnit.margin]">
      <div :class="'grayBg ' + (highLightComponentsList.length > 0 ? 'grayBg_Active' : '')" :style="{
        zIndex: highLightComponentsList.length > 0 ? 20000 : -1,
        width: highLightController.show ? '100vw' : '0px',
        height: highLightController.show ? '100vh' : '0px',
      }"></div>
      <grid-item v-for="(item, index) in gridListComputed()" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
        :key="item.i" @move="gridItemOnMove" @resize="gridItemOnResize" class="grid-item" :style="{
          ...gridItemStyle(gridList[index]),
          transition: (gridList[index].options.noAnimate) ? '' : (noAnimate
            ? ''
            : baseData.editable
              ? fastMode
                ? 'max-width 0.4s, width 0.3s , height 0.3s'
                : ''
              : fastMode
                ? 'max-width 0.4s, transform 0.5s ease-in-out , width 0.3s , height 0.3s'
                : '') + ' !important',
        }">
        <card :ref="'card_' + index" :detail="{ ...gridList[index], index }" :baseData="baseData"
          :sizeUnit="gridRowNumAndUnit" :gridList="gridList" :componentLists="componentLists"
          @onChange="(value, options) => cardOnChange(index, value, options)" />
      </grid-item>
    </grid-layout>
    <componentsListModal v-if="needEdit" :gridList="gridList" :componentLists="componentLists" ref="componentsListModal"
      @onChange="(index, value) =>
        cardOnChange(index, value, {
          type: [cardOnChangeType.gridCardListonChange],
        })
        " />
    <cardEditModal v-if="needEdit" :detail="baseData._componentDetail" ref="cardEdit" :gridList="gridList"
      :componentIndex="baseData._componentIndex" :sizeUnit="gridRowNumAndUnit" :componentLists="componentLists" @onChange="(index, value) =>
        cardOnChange(index, value, {
          type: [cardOnChangeType.gridCardListonChange],
        })
        " />
    <component v-for="item in Object.keys(PlugInComponents)" :is="PlugInComponents[item]" :ref="`PlugIn_${item}`"
      :plugInData="plugInData[item]" :baseData="baseData" :gridList="gridList" :componentLists="componentLists"
      :detail="{ label: item, index: -1 }" @onChange="(value, options) => cardOnChange(-1, value, options)"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef, markRaw } from "vue";
import { getAction } from "@/router/util";
import { deepMerge } from "@/components/basicComponents/grid/module/cardApi";
import cardEditModal from "@/components/basicComponents/grid/module/baseToolComponents/cardEditModal.vue";
import { testData } from "./module/testData";
import {
  cardOnChangeType,
  gridCellTemplate,
  CardComponentTemplate,
} from "./module/dataTemplate";
import { gridPositionByXY, outPutPositionAndGridSize } from "./module/util";
import componentsListModal from "@/components/basicComponents/grid/module/baseToolComponents/componentsListModal.vue";
import card from "@/components/basicComponents/grid/module/gridCard/card.vue";
import gridLayout from "./GridLayout/GridLayout.vue";
import gridItem from "./GridLayout/GridItem.vue";
import { takeRight } from "lodash";
import { timeConsole } from "@/router/util";
import { gridCell } from '../../../modules/userManage/component/searchTable/searchTable';
import { deepClone } from '../../../utils/index';
let useAble = 0;
function throttle(func, delay) {
  let timer = null;
  let lastTime = 0;
  return function () {
    const context = this;
    const args = arguments;
    const now = new Date().getTime();
    if (now - lastTime >= delay) {
      clearTimeout(timer);
      func.apply(context, args);
      lastTime = now;
    } else {
      clearTimeout(timer);
      timer = setTimeout(function () {
        func.apply(context, args);
        lastTime = now;
      }, delay);
    }
  };
}
function fuck(that) {
  let width = 0;
  let height = 0;
  if (that.$refs["screenId_" + that.idRandom]) {
    width = that.$refs["screenId_" + that.idRandom].offsetWidth;
    height = that.$refs["screenId_" + that.idRandom].offsetHeight;
  }
  let screen = {
    width: width || document.body.offsetWidth,
    height: height || document.body.offsetHeight,
    rowNum: 0,
    colNum: that.gridColNum,
    unit: "vw",
    blockSize: 0, // px单位的 单个grid单元大小
    colSize: 0,
    margin: that.cusStyle?.margin || 12,
  };
  if (that.cusStyle.wholeScreen == true) {
    screen.rowNum = Math.floor(screen.width / (screen.height / that.gridColNum));
    screen.unit = "vh";
    let rowOrColKey = that.cusStyle.maxRows || that.gridColNum;
    screen.blockSize = (screen.height - screen.margin * (rowOrColKey + 1)) / rowOrColKey;
  } else {
    screen.rowNum = Math.floor(screen.height / that.gridColNum);
    screen.blockSize =
      screen.unit == "vw"
        ? (screen.width - that.gridColNum * that.cusStyle.margin - that.cusStyle.margin) /
        that.gridColNum
        : screen.height / that.gridColNum;
  }
  that.gridRowNumAndUnit = screen;
}

let fuckk = throttle(fuck, 50);
export default defineComponent({
  name: "gridDesktop",
  components: {
    card,
    gridLayout,
    gridItem,
    cardEditModal,
    componentsListModal,
  },
  setup() {
    const PlugInComponents = shallowRef(getAction()["getAllPluginComponent"]());
    return {
      PlugInComponents,
    };
  },
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {
          wholeScreen: false,
          maxRows: 12,
          margin: 10,
        } as {
          // 全屏幕展示
          wholeScreen: false;
          maxRows: number;
          margin: number;
          [key: string]: any;
        };
      },
    },

    // 是否需要编辑界面
    needEdit: {
      type: Boolean,
      default: false
    },

    // 可编辑状态 // 目前尚未实装功能
    editable: {
      type: Boolean,
      default: false,
    },

    // 渲染间隔
    gridColNum: {
      type: Number,
      default: 12,
    },

    // 当前桌面使用的组件数据
    desktopData: {
      type: Array,
      default: () => {
        return testData as Array<gridCellTemplate>;
      },
    },

    // 可以使用的组件列表
    componentLists: {
      type: Object,
      default: () => {
        return {} as { [key: string]: CardComponentTemplate };
      },
    },

    // 动画加速模式 / gpu
    fastMode: {
      type: Boolean,
      default: true,
    },

    // 无动画模式
    noAnimate: {
      type: Boolean,
      default: true,
    },

    // 桌面配置方案预置数据
    preBaseData: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },

    modelValue: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },
  },
  computed: {},

  watch: {
    modelValue: {
      handler(val) {
        if (typeof val === "object" && val !== null)
          this.baseData["modelValue"] = {
            ...this.baseData["modelValue"],
            ...val,
          };
        else if (typeof val === "string") {
          this.baseData["modelValue"] = val;
        }
      },
      deep: true,
      immediate: true,
    },
    preBaseData(val) { },
    editable(val) {
      this.baseData.editable = val;
    },

    desktopData(val) {
      this.forceUpdateGridList();
    },
  },
  data() {
    return {
      cardOnChangeType,
      // 渲染用组件列表
      gridList: [] as gridCellTemplate[],
      // 更新组件用
      updateTimes: 0,

      // 插入式能力组件列表
      // PlugInComponents: {},
      // 插入式组件数据使用列表
      plugInData: {},

      // 基础数据存放
      baseData: {
        margin: 12,
        editable: false,
        wholeScreen: false,
        _componentDetail: {},
        _componentIndex: -1,
      } as { [key: string]: any },

      idRandom: (useAble += Math.random()),

      // 高光组件列表
      highLightComponentsList: [] as string[],
      highLightController: {
        show: false,
        timeOut: null,
      },

      // 组件实际渲染用数据
      gridListToLayout: [],

      gridRowNumAndUnit: {} as any,
    };
  },
  methods: {
    gridPositionByXY,
    outPutPositionAndGridSize,

    // 列表修改
    setGridInfo(gridInfo: any, index: number): void {
      this.gridList[index].gridInfo = gridInfo;
    },

    // 输出gridLayout需要的数据
    // gridListToLayout() {
    gridListComputed() {
      const back: Array<any> = this.gridList.map(
        (item: gridCellTemplate, index: number) => {
          let cell = outPutPositionAndGridSize(item);
          if (cell.x > this.gridColNum) cell.x = 0;
          if (cell.width > this.gridColNum) cell.width = this.gridColNum;
          return {
            x: cell.x,
            y: cell.y,
            w: cell.width,
            h: cell.height,
            i: index,
          };
        }
      );
      this.gridListToLayout = back;
      return back;
    },

    getGridListComputed() {
      return this.gridListToLayout;
    },

    /**
     * @name: gridRowNum
     * @description: 计算行数 和使用单位
     * @authors: CZH
     * @Date: 2022-05-04 18:14:23
     */
    gridRowNumAndUnitDeal() {
      fuckk(this);
    },
    // 移动gridItem
    gridItemOnMove(i: number, x: number, y: number): void {
      this.gridList[i].setPosition(x, y);
    },

    // 形状编辑gridItem
    gridItemOnResize(i: number, newH = 0, newW = 0): void {
      this.gridList[i].setSize(newW, newH);
    },

    /**
     * @name: cardOnChange
     * @description: 卡片回传事件处理中心
     * @authors: CZH
     * @Date: 2022-05-12 15:29:55
     */
    async cardOnChange(
      index: number,
      value: any,
      options: {
        type: Array<cardOnChangeType>;
        [key: string]: any;
      },
      name = ""
    ) {
      options.type.map(async (type) => {
        if (index != -1)
          console.log(
            index < this.gridList.length
              ? "组件「" + this.gridList[index].labelNameCN + "」"
              : "桌面组件",
            "请求执行事件<" + type + ">",
            value
          );
        else
          console.log(
            `插入式能力组件「${name}」请求事件<${type}>`,
            JSON.parse(JSON.stringify(value))
          );
        if (type == cardOnChangeType.onChange) {
          for (let x in value) {
            this.baseData[x] = value[x];
          }
          this.baseData = { ...this.baseData };
        } else if (type == cardOnChangeType.upOnChange) {
          this.$emit("update:modelValue", value);
        } else if (type == cardOnChangeType.forceRefresh) {
          const gridList = [...this.gridList];
          this.gridList = [];
          await this.$nextTick();
          this.gridList = gridList;
        } else if (type == cardOnChangeType.forceRefreshToOrgin) {
          this.gridList = [] as Array<gridCellTemplate>;
          await this.$nextTick();
          this.forceUpdateGridList();
          this.$forceUpdate();
        } else if (type == cardOnChangeType.cardConfigChange) {
          if (typeof value == "object") {
            const changeList = Object.keys(value);
            const needRefreshCardList = [] as number[];
            // debugger;
            this.gridList = this.gridList.map((card: gridCellTemplate, index: number) => {
              changeList.map((x: string) => {
                if (card.label == x) {
                  needRefreshCardList.push(index);
                  card = deepMerge(value[x], card);
                }
              });
              return card;
            });
            needRefreshCardList.map((item) => {
              if (this.$refs["card_" + item] && this.$refs["card_" + item].length > 0) {
                this.$refs["card_" + item][0].$forceUpdate();
              }
            });
          } else {
            console.error("输入数据有误", value);
          }
        } else if (type == cardOnChangeType.cardConfigChangeNoMerge) {
          if (typeof value == "object") {
            const changeList = Object.keys(value);
            const needRefreshCardList = [] as number[];
            // debugger;
            this.gridList = this.gridList.map((card: gridCellTemplate, index: number) => {
              changeList.map((x: string) => {
                if (card.label == x) {
                  needRefreshCardList.push(index);
                  for (let c in value[x]) {
                    card.options.props[c] = value[x][c];
                  }
                }
              });
              return card;
            });
            needRefreshCardList.map((item) => {
              if (this.$refs["card_" + item] && this.$refs["card_" + item].length > 0) {
                this.$refs["card_" + item][0].$forceUpdate();
              }
            });
          } else {
            console.error("输入数据有误", value);
          }
        } else if (type == cardOnChangeType.highLightCard) {
          if (this.highLightController.timeOut)
            clearTimeout(this.highLightController.timeOut);
          if (typeof value == "object" && value.length > 0) {
            const cardLabelList = this.gridList.map((card: gridCellTemplate) => {
              return card.label;
            });
            this.highLightController.show = true;
            value.map((cardLabel) => {
              if (
                cardLabelList.indexOf(cardLabel) > -1 &&
                this.highLightComponentsList.indexOf(cardLabel) == -1
              )
                this.highLightComponentsList.push(cardLabel);
            });
          } else {
            this.highLightComponentsList = [];
            const that = this;
            this.highLightController.timeOut = setTimeout(() => {
              that.highLightController.show = false;
            }, 300);
          }
        } else if (type == cardOnChangeType.cardEdit) {
          this.baseData._componentDetail = this.gridList[index];
          this.baseData._componentIndex = index;
          await this.$nextTick();
          this.$refs?.cardEdit?.open();
        } else if (type == cardOnChangeType.gridCardListonChange) {
          if (index != -1) {
            this.gridList[index] = value[index];
          } else {
            this.gridList = [...value];
          }
        } else if (type == cardOnChangeType.cardAdd) {
          // 这里写的尽量简单了，后期优化
          if (value) {
            this.gridList.push(value)
          } else {
            console.error('请勿添加空组件')
          }
        } else if (type == cardOnChangeType.cardDelete) {
          if (value && value.length > 0) {
            for (let i = this.gridList.length - 1; i > 0; i--) {
              for (let label in value) {
                if (value[label] == this.gridList[i].label) {
                  this.gridList.splice(i, 1)
                  break;
                }
              }
            }
          } else this.gridList.splice(index, 1).filter(Boolean);
        } else if (type == cardOnChangeType.openComponentsList) {
          this.$refs.componentsListModal.open();
        } else if (type == cardOnChangeType.moduleApi) {
          if (typeof value == "object") {
            for (let refs in value) {
              if (this.$refs[`PlugIn_${refs}`]) {
                const plugInComponent = this.$refs[`PlugIn_${refs}`][0];
                if (!value[refs]) {
                  if (plugInComponent && plugInComponent["close"]) {
                    plugInComponent["close"]();
                  }
                } else {
                  this.plugInData[refs] = value[refs];
                  if (plugInComponent && plugInComponent["open"]) {
                    plugInComponent["open"]();
                  }
                }
              }
            }
          }
        } else if (type == cardOnChangeType.upEmit) {
          if (value && Object.keys(value).length > 0)
            Object.keys(value).map(x => {
              this.$emit(x, value[x])
            })
        }
      });
      // this.gridListComputed()
    },

    /**
     * @name: gridItemStyle
     * @description: 计算组件grid Item 属性的数据
     * @authors: CZH
     * @Date: 2022-08-18 18:16:17
     * @param {*} gridCell
     */
    gridItemStyle(gridCell: gridCellTemplate): { [key: string]: string } {
      let style: { [key: string]: string } = {};
      if (
        "options" in gridCell &&
        gridCell.options &&
        "showInGridDesktop" in gridCell.options
      ) {
        if (gridCell.options.showInGridDesktop) {
          style = {
            maxWidth: "10000px",
            zIndex:
              this.highLightComponentsList.indexOf(gridCell.label) > -1
                ? "20001"
                : "100",
            opacity: "1",
          };
        } else {
          style = {
            maxWidth: "100%",
            opacity: "0",
            overflow: "hidden",
            zIndex: "1",
          };
        }
      }

      return style;
    },

    // 填充gridList
    forceUpdateGridList() {
      this.gridList = markRaw(this.desktopData as Array<gridCellTemplate>)
      // this.gridListComputed()
    },
  },

  async created() {
    timeConsole.checkTime("gridDesktop");
    if (this.preBaseData && Object.keys(this.preBaseData).length > 0)
      Object.keys(this.preBaseData).map((key) => {
        this.baseData[key] = this.preBaseData[key];
      });

    if (this.modelValue) {
      this.baseData["modelValue"] = {
        ...this.baseData["modelValue"],
        ...this.modelValue,
      };
    }
    this.forceUpdateGridList();

    // 添加触发器
    const that = this;
    const data = {};
    const name = "griddesktop_func_" + this.idRandom;
    data[name] = that.gridRowNumAndUnitDeal;
    window.addEventListener("resize", data[name]);
  },

  async unmounted() {
    // 删除触发器
    const that = this;
    const data = {};
    const name = "griddesktop_func_" + this.idRandom;
    data[name] = that.gridRowNumAndUnitDeal;
    window.removeEventListener("resize", data[name]);
  },

  async mounted() {
    const that = this;
    // that.gridRowNumAndUnitDeal();
    setTimeout(() => {
      that.gridRowNumAndUnitDeal();
      timeConsole.checkTime("gridDesktop");
    }, 100);
  },
});
</script>

<style lang="scss" scoped>
.baseGrid {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}

.grayBg {
  transition: background-color 0.3s;
  //background-image: radial-gradient(transparent 1px, var(--bg-color) 1px);
  //background-size: 4px 4px;
  //backdrop-filter: saturate(50%) blur(4px);
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
  background-image: radial-gradient(rgba(0, 0, 0, 0) 0px, rgb(0, 0, 0, 0.1) 0px);
  background-size: 0px 0px;
  border-bottom-color: rgb(220, 223, 230);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  top: 0px;
  left: 0px;
}

.grayBg_Active {
  background-color: rgba(0, 0, 0, 0.1);
  background-size: 4px 4px;
  background-image: radial-gradient(rgba(0, 0, 0, 0) 1px, rgba(180, 180, 180, 0.3) 1px);
}

@keyframes hoverFadeInOut {
  0% {
    background-color: rgba(0, 0, 0, 0);
  }

  50% {
    background-color: rgba(0, 0, 0, 0.5);
  }

  100% {
    background-color: rgba(0, 0, 0, 0);
  }
}

.bgGridCell {
  opacity: 0;
}

.grid-item {
  transition: opacity 0.4;
}

.bgGridCell:hover {
  animation: hoverFadeInOut 1.2s infinite;
}
</style>
