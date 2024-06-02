<!--
 * @Date: 2022-11-09 19:26:59
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-02 22:57:26
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/searchTable/searchTable.vue
-->
<template>
  <cardBg ref="mainBox" :cusStyle="{
    padding: '12px',
  }">
    <inputForm ref="inputBox" :query="query" @search="search" @refresh="refresh" @btnClick="btnClick"
      :queryItemTemplate="searchItemTemplate" :selectedList="selectedList" @inputChange="queryChange" :btn-list="btnList"
      :autoSearch="autoSearch" />
    <infoTable :template="showItemTemplate" :data-list="PageData?.data" :loading="isLoading" @search="search"
      :cantSelect="cantSelect" @refresh="refresh" :style="{
        height: TableHeight + 'px',
      }" :load="load" :baseData="baseData" @selectedChange="selectedChange"
      @onChange="(value, options) => $emit('onChange', value, options)" />
    <el-pagination :style="{
      marginTop: '6px',
      float: 'right',
    }" v-if="PageData.total" v-model:current-page="PageData.pageNumber" v-model:page-size="PageData.pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 100]" :small="true" :background="true"
      layout="total, sizes, prev, pager, next, jumper" :total="PageData.total"
      @size-change="(e) => search({ pageSize: e })" @current-change="(e) => search({ pageNumber: e })"
      :hide-on-single-page="false" />
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sideDialogForm from "@/modules/userManage/component/searchTable/drawerForm.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import inputForm from "./inputForm.vue";
import infoTable from "./info/infoTable.vue";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { tableCellTemplateMaker } from "./searchTable";
import search from "@iconify-icons/ep/search";
import { ElPagination } from "element-plus";
import {
  PageDataTemplate,
  stringAnyObj,
  btnCellTemplate,
  btnActionTemplate,
} from "@/modules/userManage/types";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";
import { timeConsole } from "@/main";
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
  timeConsole.checkTime("表单高度计算");
  const mainBox = that.$refs["mainBox"];
  const inputBox = that.$refs["inputBox"];
  if (mainBox && inputBox) {
    let baseHeight = 0;
    let offsetHeight = -16;
    if (that.PageData.total) baseHeight = 32;
    if (inputBox.$el.offsetHeight)
      that.TableHeight =
        mainBox.$el.offsetHeight -
        inputBox.$el.offsetHeight -
        34 -
        baseHeight -
        offsetHeight;
    else that.TableHeight = mainBox.$el.offsetHeight - 24 - baseHeight - offsetHeight;
  }
  timeConsole.checkTime("表单高度计算");
}

let fuckk = throttle(fuck, 200);
export default defineComponent({
  componentInfo: {
    labelNameCn: "搜索列表组件",
    key: "searchTable",
    description:
      "搜索列表组件，可以监听baseData内的参数作为搜索传参数，支持对接不同风格的表单搜索组件",
    gridInfo: {
      middle: gridSizeMaker(9, 8),
    },
  } as componentInfo,

  propsDetail: {
    defaultQuery: {
      label: "初始化搜索值",
      type: inputType.obj,
    },
    searchFunc: {
      label: "搜索函数",
      type: inputType.functionEditor,
    },
    showItemTemplate: {
      label: "展示单元模板列表",
      type: inputType.array,
    },
    searchItemTemplate: {
      label: "搜索单元模板列表",
      type: inputType.array,
    },
    searchKeyWithBaseData: {
      label: "需要读取的baseDataKey值",
      type: inputType.array,
    },
    pageConfig: {
      label: "分页配置",
      type: inputType.obj,
    },
    btnList: {
      label: "按钮行为列表",
      type: inputType.array,
    },
    autoSearch: {
      label: "自动搜索",
      type: inputType.boolean,
    },
  } as propInfo,

  baseProps: {
    autoSearch: false,
    defaultQuery: { helloworld: "hello world" },
    searchFunc: (data) => {
      return [data];
    },
    showItemTemplate: [tableCellTemplateMaker("HELLO WORLD", "helloworld")],
    searchItemTemplate: [tableCellTemplateMaker("HELLO WORLD", "helloworld")],
    btnList: [],
  },

  watch: {
    baseData: {
      handler(val) {
        this.searchKeyWithBaseData
          ? this.searchKeyWithBaseData.map((key) => {
            if (
              Object.keys(val).indexOf(key) > -1 &&
              this.baseDataForCheck[key] != val[key]
            ) {
              this.baseDataForCheck[key] = val[key];
              this.search();
            }
          })
          : null;
      },
      deep: true,
      immediate: true,
    },
  },
  props: [
    "defaultQuery",
    "baseData",
    "sizeUnit",
    "searchFunc",
    "showItemTemplate",
    "searchItemTemplate",
    "searchKeyWithBaseData",
    "btnList",
    "autoSearch",
    "pageConfig",
    "load",
    "cantSelect"
  ],
  components: { cardBg, inputForm, infoTable, sideDialogForm },
  data() {
    return {
      query: {},
      PageData: {
        pageSize: 1000,
      } as PageDataTemplate,
      isLoading: false,

      isReady: false,

      // 当前选择项
      selectedList: [],

      // 计算列表可用高度
      TableHeight: 500,

      interval: null,
      baseDataForCheck: {},
      idRandom: (useAble += Math.random()),
    };
  },

  async created() {
    timeConsole.checkTime("searchTable");
    this.isReady = false;
    await this.initData();
    this.isReady = true;
    this.$emit("ready");
    timeConsole.checkTime("initData");
    await this.search();
    timeConsole.checkTime("initData");
  },
  async mounted() {
    const that = this;
    const data = {};
    const name = "searchTable_func_" + this.idRandom;
    data[name] = that.changeSize;
    window.addEventListener("resize", data[name]);
    let num = 0;
    const interval = setInterval(() => {
      that.changeSize();
      num++;
      if (num > 10) clearInterval(interval);
    }, 400);
    timeConsole.checkTime("searchTable");
  },

  async unmounted() {
    const that = this;
    const data = {};
    const name = "searchTable_func_" + this.idRandom;
    data[name] = that.changeSize;
    window.removeEventListener("resize", data[name]);
  },

  methods: {
    changeSize() {
      fuckk(this);
    },

    async initData() {
      if (this.defaultQuery && Object.keys(this.defaultQuery).length > 0) {
        this.query = deepClone(this.defaultQuery);
      }
    },

    /**
     * @name: queryChange
     * @description: 承接inputForm 回传数据
     * @authors: CZH
     * @Date: 2022-11-21 18:24:28
     */
    queryChange(query: stringAnyObj) {
      this.query = query;
      if (this.autoSearch) this.search();
    },
    uploadChange(query: stringAnyObj) { },
    refresh() {
      if (
        this.autoSearch == false &&
        this?.searchKeyWithBaseData &&
        this?.searchKeyWithBaseData?.length > 0
      ) {
        let data = {};
        this.searchKeyWithBaseData.map((x) => {
          data[x] = {};
        });
        const that = this;
        setData(that, data);
      }
      this.initData();
    },

    /**
     * @name: btnClick
     * @description: 自定义按钮事件
     * @authors: CZH
     * @Date: 2022-11-21 19:04:03
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate, data?: stringAnyObj) {
      btn["isLoading"] = true;
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.$modules.getModuleApi()["userManage_openDrawerForm"](this, btn.drawerProps);
      } else if (
        (btn.type == btnActionTemplate.Function ||
          btn.type == btnActionTemplate.UploadFunction) &&
        btn.function
      ) {
        let that = this;
        await btn.function(that, data);
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
      btn["isLoading"] = false;
    },

    async selectedChange(selectedList: any[]) {
      this.selectedList = selectedList;
    },

    /**
     * @name: search
     * @description: 执行搜索事件
     * @authors: CZH
     * @Date: 2022-11-29 11:01:28
     * @param {*} query
     */
    async search(query: { [key: string]: any } = this.query) {
      this.query = {
        ...this.query,
        ...query,
      };
      let result = null;
      if (this.searchFunc && this.isReady) {
        this.isLoading = true;
        // try {
        timeConsole.checkTime("searchFunc");
        result = await this.searchFunc(this.query, this);
        if (result) {
          if (result.total || result.total == 0) {
            this.PageData.data = [];
            const data = result.list;
            this.PageData = {
              ...result,
              data,
              pageNumber: result.pageNum == 0 ? 1 : result.pageNum,
            };
          } else this.PageData.data = result;
          this.isLoading = false;
        } else {
          this.PageData = { data: [] };
        }
        timeConsole.checkTime("searchFunc");
        // } catch (e) {
        //   console.error("【searchTable】组件search事件报错", e, result);
        // } finally {
        this.selectedChange([]);
        this.isLoading = false;
        // }
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
