<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-24 03:36:27
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageList/waterfall.vue
-->
<template>
  <cardBg>
    <div class="wholeScreen" :id="'waterfall_' + MathRandom" v-loading="isLoading">
      <!-- <div
        :style="{
          position: 'fixed',
          background: '#fff',
          color: '#000',
          zIndex: 10000000,
          width: 'auto',
        }"
      >
        {{
          rowList
            .map((x) => {
              return x.length;cz
            })
            .reduce((a, b) => a + b)
        }}
      </div> -->
      <div
        :id="'scroll_' + MathRandom"
        :class="nowShowType == showType.waterFall ? 'active' : 'hideIn'"
      >
        <div
          class="row"
          v-for="(imgList, rowIndex) in rowList"
          :style="{ height: row.height + 40 + 'px' }"
        >
          <waterFallItem
            v-for="(item, colIndex) in imgList"
            :url="item.url"
            :width="item.width - row.margin * 2"
            :height="row.height"
            :item="item"
            :cusStyle="{
              margin: row.margin + 'px',
            }"
            :class="
              selected.id == item.id || selecteds.map((x) => x.id).indexOf(item.id) > -1
                ? ' normal selectedIn'
                : 'normal'
            "
            @click="
              selected.id == item.id
                ? (nowShowType = showType.list)
                : setImage(item, rowIndex, colIndex)
            "
            @mouseover="setImages(item)"
            @dblclick="nowShowType = showType.list"
            :noPreview="true"
          ></waterFallItem>
        </div>
      </div>
      <div
        :class="nowShowType == showType.list ? 'active' : 'hideIn'"
        @click="nowShowType = showType.waterFall"
      >
        <waterFallItem
          :cusStyle="{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '0%',
            height: 'calc(100% - 100px)',
          }"
          :fit="'contain'"
          :url="`/imageserver/` + selected?.data?.origin?.path"
          :item="selected.data"
          :noPreview="true"
        ></waterFallItem>
      </div>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";

import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import waterFallItem from "@/modules/photoWebSiteModule/component/imageList/waterFallItem.vue";
import { stringAnyObj } from "@/modules/userManage/types";

let fuck = null;
let Index = {};
let isInit = false;
let imageListForReSize = [];
enum showType {
  list,
  waterFall,
}

const MathRandom = Math.random() * 100 + "_asd";

function fuckk(thatt) {
  const that = thatt ? thatt : this;
  if (that.nowShowType != showType.waterFall) return;

  const elw = document.getElementById("waterfall_" + that.MathRandom);
  if (!elw) return;
  const offsetForScrollBar = 0;
  const rowIndexNumber = Math.floor(
    (elw.offsetWidth - offsetForScrollBar) / that.row.rowIndexSize
  );
  const lastOffset = (elw.offsetWidth - offsetForScrollBar) % that.row.rowIndexSize;
  if (
    (that.row.rowIndexNumber != rowIndexNumber || that.row.lastOffset != lastOffset) &&
    rowIndexNumber > 100
  ) {
    that.row.rowIndexNumber = rowIndexNumber;
    that.row.lastOffset = lastOffset;
    that.rowList = [[]];
    that.pkFunc(imageListForReSize, that);
  }
}

function getBaseDataByWatchKey(baseData: stringAnyObj, watchKey: string | string[]) {
  if (typeof watchKey == "string") watchKey = [watchKey];
  let backData = {};
  let num = 0;
  if (watchKey && watchKey.length > 0)
    watchKey.map((x) => {
      if (Object.keys(baseData).indexOf(x) > -1) {
        num++;
        backData[x] = baseData[x];
      }
    });
  return num > 0 ? backData : false;
}

export default defineComponent({
  componentInfo: {
    labelNameCn: "瀑布流",
    key: "waterFall",
    description: "展示图片瀑布流",
    gridInfo: {
      middle: gridSizeMaker(3, 8),
    },
  } as componentInfo,

  propsDetail: {
    getFunc: {
      label: "获取图片的函数，搭配监听key使用",
      type: inputType.text,
    },
    watchKey: {
      label: "baseData监听key(相册key)",
      type: inputType.text,
    },
    imageList: {
      label: "图片列表(直接渲染用）",
      type: inputType.array,
    },
    startSearch: {
      label: "首次搜索",
      type: inputType.boolean,
    },
  } as propInfo,

  baseProps: {},

  props: ["baseData", "sizeUnit", "watchKey", "imageList", "getFunc", "startSearch"],
  components: { cardBg, waterFallItem },
  watch: {
    nowShowType(val: showType) {
      if (val == showType.waterFall) fuckk(this);
    },
    baseData: {
      handler: async function (val) {
        let back = getBaseDataByWatchKey(val, this.watchKey);
        if (back && JSON.stringify(back) != this.preData && this.open) {
          this.preData = JSON.stringify(back);
          this.data.offset = 0;
          this.rowList = [[]];
          imageListForReSize = [];
          // this.isLoading = false;
          await this.getImgList(back, true);
        }
      },
    },
  },
  async created() {
    isInit = false;
  },
  async mounted() {
    const that = this;
    setTimeout(async () => {
      that.open = true;
      if (that.imageList && that.imageList.length > 0) {
      }
      that.$emit("ready");
      await that.$nextTick();
      that.init();
      window.addEventListener("keydown", that.keyDown);
      if (that.startSearch) {
        fuck = null;
        Index = {};
        isInit = false;
        imageListForReSize = [];
        that.rowList = [[]];
        await that.getImgList(that.baseData, true);
      }
    }, 100);
  },
  data: () => {
    return {
      MathRandom,
      rowList: [[]] as {
        url: string;
        width: number;
        height: number;
        rowIndex: number;
        [key: string]: any;
      }[][],
      data: {
        limit: 100,
        offset: 0,
      } as { [key: string]: number },
      open: false,
      selected: {
        id: -1,
        data: {} as stringAnyObj,
        colIndex: -1,
        rowIndex: -1,
      },
      selecteds: [],
      muiltSelected: false,
      row: {
        height: 100,
        rowIndexSize: 2,
        rowIndexNumber: 0,
        lastOffset: 0,
        margin: 3,
      },
      preData: "",
      nowShowType: showType.waterFall as showType,
      showType,
      isLoading: false,
    };
  },
  methods: {
    async init() {
      if (isInit) return;
      isInit = true;
      const that = this;
      if (fuck) clearInterval(fuck);
      fuck = setInterval(() => {
        fuckk(that);
      }, 200);

      const elw = document.getElementById("waterfall_" + this.MathRandom);
      let a = false;

      fuckk(that);

      elw.addEventListener("scroll", (e) => {
        const scroll = document.getElementById("scroll_" + this.MathRandom);
        const box = scroll.parentElement;
        if (box.scrollTop + box.clientHeight > box.scrollHeight - 10) {
          if (a) return;
          a = true;
          that.getImgList();
          setTimeout(() => {
            a = false;
          }, 500);
        }
      });
      this.createBoxSelectEvent();
    },

    /**
     * @name: boxSelectEvent
     * @description: 注册框选事件
     * @authors: CZH
     * @Date: 2023-03-20 00:16:51
     */
    createBoxSelectEvent() {
      const bodyEl = document.getElementById("scroll_" + this.MathRandom);
      bodyEl.onmousedown = (e) => {
        if (!e) return;
        this.muiltSelected = true;
        this.selecteds = [];
        this.selected = {
          id: -1,
          data: {} as stringAnyObj,
          colIndex: -1,
          rowIndex: -1,
        };
      };
      window.onmouseup = () => {
        this.muiltSelected = false;
      };
    },

    // 选中图片
    setImage(data, rowIndex, colIndex) {
      if (!data) return;
      this.selected.id = data.id;
      this.selected.data = data;
      this.selected.rowIndex = rowIndex;
      this.selected.colIndex = colIndex;
      setData(this, { image: data });
    },

    // 批量选中图片
    setImages(item) {
      if (!this.muiltSelected) return;
      if (this.selecteds.map((x) => x.id).indexOf(item.id) > -1) return;
      this.selecteds.push(item);
      setData(this, { image: this.selecteds });
    },

    // 键盘事件
    keyDown(e) {
      if (
        ["Space", "ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].indexOf(e.code) != -1
      )
        e.preventDefault();
      let { rowIndex, colIndex } = this.selected;
      if (colIndex == -1) return;
      const row = this.rowList[rowIndex];
      const afterRow = this.rowList[rowIndex + 1];
      const preRow = this.rowList[rowIndex - 1];
      const offset = row
        .map((x, i) => {
          if (i < colIndex) return x.rowIndex;
          else if (i == colIndex) return x.rowIndex * 0.5;
          else return 0;
        })
        .reduce((a, b) => a + b);
      let nextRowIndex = 0;
      switch (e.code) {
        case "Space":
          // if (this.nowShowType == showType.waterFall) this.nowShowType = showType.list;
          // else if (this.nowShowType == showType.list)
          //   this.nowShowType = showType.waterFall;
          break;
        case "ArrowUp":
          if (rowIndex == 0) break;
          for (let i = 0; i < preRow.length; i++) {
            nextRowIndex += preRow[i].rowIndex;
            if (nextRowIndex > offset) {
              colIndex = i;
              rowIndex--;
              break;
            }
          }
          break;
        case "ArrowDown":
          if (rowIndex == this.rowList.length - 1) break;
          for (let i = 0; i < afterRow.length; i++) {
            nextRowIndex += afterRow[i].rowIndex;
            if (nextRowIndex > offset) {
              colIndex = i;
              rowIndex++;
              break;
            }
          }
          break;
        case "ArrowLeft":
          if (colIndex > 0) colIndex--;
          else if (colIndex == 0 && rowIndex > 0) {
            rowIndex--;
            colIndex = preRow.length - 1;
          }
          break;
        case "ArrowRight":
          if (colIndex < row.length - 1) colIndex++;
          else if (colIndex == row.length - 1 && rowIndex++ < this.rowList.length - 1) {
            rowIndex++;
            colIndex = 0;
          } else {
            this.getImgList();
          }
          break;
      }

      if (rowIndex != this.row.rowIndex || colIndex != this.row.colIndex)
        this.setImage(this.rowList[rowIndex][colIndex], rowIndex, colIndex);
    },

    async getImgList(val = getBaseDataByWatchKey(this.baseData, this.watchKey)) {
      const that = this;
      if (that.isLoading) return null;
      if (!val) return null;
      that.isLoading = true;
      setTimeout(() => {
        that.isLoading = false;
      }, 500);
      let { limit, offset } = that.data;
      let list = await this.getFunc(that, {
        ...val,
        limit,
        offset,
      });
      if (list.length == 0) return;
      that.data = { limit, offset: list.length + offset };
      list = list.map((x) => {
        return {
          ...x,
          origin: x,
          url: x.url,
          path: x.path,
          height: that.row.height,
          width:
            Math.floor(((that.row.height / x.height) * x.width) / that.row.rowIndexSize) *
            that.row.rowIndexSize,
          rowIndex: Math.floor(
            ((that.row.height / x.height) * x.width) / that.row.rowIndexSize
          ),
        };
      });
      imageListForReSize = imageListForReSize.concat(list);
      this.pkFunc(list);
      that.isLoading = false;
    },

    pkFunc(lists, that = this) {
      let list = JSON.parse(JSON.stringify(lists));
      if (that.row.rowIndexNumber == 0) return;
      list.sort((a, b) => b.rowIndex - a.rowIndex);
      function getRow() {
        return that.rowList[that.rowList.length - 1];
      }
      function getRowIndex() {
        let row = getRow();
        let rowIndex =
          row.length > 0
            ? that.row.rowIndexNumber - row.map((x) => x.rowIndex).reduce((a, b) => a + b)
            : that.row.rowIndexNumber;
        return rowIndex;
      }
      let number = 0;
      while (list.length > 0) {
        number++;
        list.sort((a, b) => b.rowIndex - a.rowIndex);
        if (number > that.data.limit) break;
        for (let i = 0; i < list.length; i++) {
          let x = list[i];
          if (getRowIndex() > x.rowIndex) {
            that.rowList[that.rowList.length - 1].push(x);
            list[i] = false;
          }
        }
        list = list.filter(Boolean);
        for (let i = list.length - 1; i >= 0; i--) {
          let x = list[i];
          if (getRowIndex() >= x.rowIndex) {
            that.rowList[that.rowList.length - 1].push(x);
            list[i] = false;
          } else {
            break;
          }
        }
        list = list.filter(Boolean);
        const rowIndex = getRowIndex();
        if (rowIndex > 0 && list.length > 0) {
          let row = that.rowList[that.rowList.length - 1];
          let cell = row[row.length - 1];
          const { rowIndexSize, lastOffset } = that.row;
          if (cell) {
            cell = {
              ...cell,
              rowIndex: cell.rowIndex + rowIndex,
              width: (cell.rowIndex + rowIndex) * rowIndexSize + lastOffset,
            };
            that.rowList[that.rowList.length - 1][row.length - 1] = cell;
            that.rowList.push([]);
          }
        }
        if (list.length > 0 && rowIndex == 0) {
          that.rowList.push([]);
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.wholeScreen {
  position: relative;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  margin: 12px;
  overflow-y: auto;

  .active {
    width: 100%;
    height: 100%;
    animation: moveIn 0.3s ease-in-out;
    z-index: 1000;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .hideIn {
    opacity: 0.2;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform: translateX(100%);
    backdrop-filter: blur(10px);
    animation: moveOut 0.3s ease-in-out;
    z-index: -1;
  }
}
#waterfall {
  min-height: 100%;
}
.row {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.selectedIn {
  box-shadow: 0px 0px 2.5px rgba(9, 13, 255, 0.812), 0px 0px 2.7px rgba(9, 13, 255, 0.922),
    0px 0px 2.6px rgba(9, 13, 255, 0.934), 0px 0px 2.3px rgba(9, 13, 255, 0.906),
    0px 0px 2px rgba(9, 13, 255, 0.863), 0px 0px 1.7px rgba(9, 13, 255, 0.821),
    0px 0px 1.4px rgba(9, 13, 255, 0.794), 0px 0px 1.3px rgba(9, 13, 255, 0.797),
    0px 0px 1.5px rgba(9, 13, 255, 0.852), 0px 0px 4px rgba(9, 13, 255, 1);
}
.normal {
  transition: all 0.1s;
  border-radius: 2px;
}

@keyframes moveIn {
  0% {
    opacity: 0.3;
    transform: translateX(-30px);
    backdrop-filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

@keyframes moveOut {
  0% {
    opacity: 1;
    transform: translateX(0px);
    display: block;
  }
  100% {
    opacity: 0;
    transform: translateX(30px);
    backdrop-filter: blur(10px);
  }
}

.selectBox {
  position: absolute;
  transform-origin: 0% 0%;
  background: rgba(0, 0, 0, 0.1);
  width: 1px;
  height: 1px;
  top: 0px;
  left: 0px;
  z-index: 100000000;
}
</style>
