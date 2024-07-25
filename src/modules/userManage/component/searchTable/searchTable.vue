<!--
 * @Date: 2022-11-09 19:26:59
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-28 22:44:31
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/searchTable/searchTable.vue
 * @FuckToUi: 改这么多图啥呢，又不好看
-->
<template>
  <cardBg ref="mainBox" :cusStyle="{
    padding: '12px',
  }">
    <screenInputform ref="inputBox" :query="query" @search="search" @refresh="refresh" @btnClick="btnClick"
      :queryItemTemplate="searchItemTemplate" :selectedList="selectedList" @inputChange="queryChange" :btn-list="btnList"
      :autoSearch="autoSearch" v-if="screenStatus && isReady" />
    <inputForm ref="inputBox" :query="query" @search="search" @refresh="refresh" @btnClick="btnClick"
      :noTableEdit="noTableEdit" :queryItemTemplate="searchItemTemplate" :selectedList="selectedList"
      @inputChange="queryChange" :btn-list="btnList" :modeChange="modeChange" :autoSearch="autoSearch" :isCard="isCard"
      v-else />
    <infoTable v-if="!isCard" :template="showItemTemplate" :data-list="PageData?.data" :loading="isLoading"
      :rowHeightKey="rowHeightKey" :canSelect="isCanSelect()" @search="search" @refresh="refresh" :style="{
        height: TableHeight + 'px',
      }" :load="load" :baseData="baseData" @selectedChange="selectedChange" :defalutSelectedList="selectedList"
      :expandRowKeys="expandRowKeys" @onChange="(value, options) => $emit('onChange', value, options)"
      @btnClick="btnClick" />
    <cardList v-else-if="isCard" :template="showItemTemplate" :data-list="PageData?.data" :loading="isLoading"
      :canSelect="isCanSelect()" :height="TableHeight" @search="search" @refresh="refresh" :style="{
        height: TableHeight + 'px',
      }" :cardFunc="cardFunc" :load="load" :baseData="baseData" @selectedChange="selectedChange"
      @onChange="(value, options) => $emit('onChange', value, options)" @btnClick="btnClick" />
    <el-pagination :style="{
      marginTop: '6px',
      float: 'right',
    }" v-if="PageData.total" v-model:current-page="PageData.pageNumber" v-model:page-size="PageData.pageSize"
      :page-sizes="[10, 20, 50, 100]" :small="true" :background="true" layout="total, sizes, prev, pager, next, jumper"
      :total="PageData.total" @size-change="(e) => search({ pageSize: e })"
      @current-change="(e) => search({ pageNumber: e })" :hide-on-single-page="false" />
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
import screenInputform from './screenInputform.vue'
import infoTable from "./info/infoTable.vue";
import cardlist from './info/cardlist.vue'
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
import { timeConsole } from "@/router/util";
import { useUserStore, useUserStoreHook } from '../../../../store/modules/user';
import { changeCardProperties } from '../../../../components/basicComponents/grid/module/cardApi/index';
import { isMobile } from '../../../../utils/api/user/header';

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

let num = true
let fuckk = throttle(fuck, 200);
export default defineComponent({
  componentInfo: {
    labelNameCN: "搜索列表组件",
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
    modeChange: {
      label: '展示列表和卡片模式的切换按钮',
      type: inputType.boolean
    },
    isCard: {
      label: '展示卡片模式',
      type: inputType.boolean,
    },
    cardFunc: {
      label: '卡片模式渲染方式',
      type: inputType.functionEditor
    },
    canSelect: {
      label: '是否可以选择列表项',
      description: '默认为true',
      type: inputType.boolean,
    },

    // 以下功能需要组合使用构造checkBox 选择机制
    selectedChangeFunc: {
      label: '选择改变时触发的函数',
      type: inputType.functionEditor
    },
  } as propInfo,

  baseProps: {
    autoSearch: false,
    defaultQuery: { helloworld: "hello world" },
    searchFunc: (data) => {
      return [data];
    },
    canSelect: true,
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
    "detail",
    "baseData",
    "sizeUnit",
    "detail",
    "searchFunc",
    "showItemTemplate",
    "searchItemTemplate",
    "searchKeyWithBaseData",
    "btnList",
    "canSelect",
    // 真tmd的脑子有病
    "selectedChangeFunc",
    // 结束
    // 是否可以编辑列选项
    "noTableEdit",
    "autoSearch",
    "pageConfig",
    "load",
    "modeChange",
    "isCard",
    "cardFunc",
    // 用来规范行高
    "rowHeightKey",
    "screenStatus",
    "expandRowKeys"
  ],
  components: { cardBg, inputForm, infoTable, sideDialogForm, cardList: cardlist, screenInputform },

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
      interval1: null,
      baseDataForCheck: {},
      idRandom: (useAble += Math.random()),
    };
  },

  async created() {
    timeConsole.checkTime("searchTable");
    if (isMobile() != "PC") {
      console.log('手机模式')
      let data = {}
      data[this.detail.label] = {
        isCard: true
      }
      changeCardProperties(this, data)
    }
    this.isReady = false;
    // await this.loadUserConfig();
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
    // 初始化已经选择的数据
    data[name] = that.changeSize;
    window.addEventListener("resize", data[name]);
    let num = 0;
    this.interval1 = setInterval(() => {
      that.changeSize();
      num++;
      if (num > 100000000) clearInterval(that.interval1);
    }, 50);
    timeConsole.checkTime("searchTable");
  },

  async unmounted() {
    const that = this;
    const data = {};
    const name = "searchTable_func_" + this.idRandom;
    data[name] = that.changeSize;
    clearInterval(that.interval1);
    window.removeEventListener("resize", data[name]);
  },

  methods: {
    async loadUserConfig() {
      const config = await useUserStoreHook().getPageConfig(this.detail.label)
      let data = {
        rowHeightKey: 32
      }
      if (config['showItemTemplate'] && config['showItemTemplate'].length > 0) {
        const configMap = config['showItemTemplate']
        data['showItemTemplate'] = configMap.map(x => {
          let find = false
          this.showItemTemplate.map(b => {
            if (b.key == x.key && b.label == x.label) {
              find = true
              x = {
                ...b,
                showAble: x.showAble
              }
            }
          })
          return find ? x : null
        }).filter(Boolean)
      }
      if (config['rowHeightKey']) {
        data.rowHeightKey = config['rowHeightKey']
      }
      let keyData = {}
      keyData[this.detail.label] = data
      console.log(keyData, 'asd')
      changeCardProperties(this, keyData)
    },

    isCanSelect() {
      if (this.canSelect === false) return false
      else return true
    },

    changeSize() {
      fuckk(this);
    },

    async initData() {
      if (this.defaultQuery && Object.keys(this.defaultQuery).length > 0)
        this.query = deepClone(this.defaultQuery);
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
        (btn.type == btnActionTemplate.Function || btn.type == btnActionTemplate.UploadFunction) &&
        btn.function
      ) {
        let that = this;
        await btn.function(that, { ...data, _selectedList: this.selectedList });
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
      btn["isLoading"] = false;
    },

    async selectedChange(selectedList: any[]) {
      this.selectedList = selectedList;
      // 触发选择事件
      if (this['selectedChangeFunc']) await this.selectedChangeFunc(this, this.selectedList, this.PageData.data)
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
        try {
          timeConsole.checkTime("searchFunc");
          result = await this.searchFunc(this.query, this);
          if (result) {
            if (result.total || result.total == 0) {
              this.PageData.data = [];
              const data = result.list;
              this.PageData = {
                ...result,
                data,
                pageNumber: result.pageNum && result.pageNum == 0 ? 1 : result.pageNum,
              };
            } else this.PageData.data = result;
            this.isLoading = false;
          } else {
            this.PageData = { data: [] };
          }
          timeConsole.checkTime("searchFunc");
        } catch (e) {
          console.error("【searchTable】组件search事件报错", e, result);
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
