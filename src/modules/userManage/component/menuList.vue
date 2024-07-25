<!--
 * @Date: 2022-11-09 11:19:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-16 01:02:42
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/menuList.vue
-->
<template>
  <cardBg :cusStyle="{
    padding: '12px',
  }">
    <div :class="`menuBox box_${random}`">
      <div class="searchBar" v-if="searchBtn">
        <el-input :style="{
          width: '100%',
          marginRight: searchBtn || selectedKey != '' ? '6px' : '',
        }" v-model="selectedKey" :size="size" :placeholder="searchFuncPlaceHolder || '搜索'"
          @keydown.enter.prevent="searchFuncByName ? searchFuncByName() : search({})" clearable></el-input>
        <el-button v-show="selectedKey && selectedKey.length > 0"
          @click="searchFuncByName ? searchFuncByName() : search({})" :size="size" plain type="primary">
          搜索
        </el-button>
        <el-button style="margin-left: 0px" :size="size"
          v-if="searchBtn && isBtnShow(searchBtn) && searchBtn && selectedKey.length == 0" :loading="searchBtn.isLoading"
          :type="searchBtn.elType" plain @click="btnClick(searchBtn)">
          {{ searchBtn.label }}
        </el-button>
      </div>

      <!-- 这里展示的是搜索结果 -->
      <div class="content" v-if="searchResult.length != 0 && selectedKey">
        <el-tree :data="searchResult" :props="defaultProps" @node-click="nodeClick" :highlight-current="true"
          node-key="id" :default-expanded-keys="expandedKey">
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div class="text">{{ data[defaultProps["label"]] }}</div>
              <el-button v-if="clickItemDetailFunc" text size="small" icon="More" class="btns"
                @click.stop="clickItemDetail(data)"></el-button>
            </div>
          </template>
        </el-tree>
      </div>

      <!-- 这里展示的是默认树形结构 -->
      <div class="content" v-if="searchResult.length == 0 && selectedKey == ''">
        <el-tree :data="treeData" :props="defaultProps" @node-click="nodeClick" :highlight-current="true" node-key="id"
          ref="elTree" @node-expand="nodeChangeOpen" @node-collapse="nodeChangeClose"
          :default-expanded-keys="expandedKey">
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div class="text">{{ data[defaultProps["label"]] }}</div>
              <el-button v-if="clickItemDetailFunc" text size="small" icon="More" class="btns"
                @click.stop="clickItemDetail(data)"></el-button>
            </div>
          </template>
        </el-tree>
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
import { btnCellTemplate, btnActionTemplate, showType, stringAnyObj } from "../types";

const random = Math.floor(Math.random() * 10000000);

enum sizeTem {
  small = "small",
  large = "large",
  default = "default",
}

export default defineComponent({
  componentInfo: {
    labelNameCN: "菜单列表组件",
    key: "menuList",
    description: "更具输入的menuData展示列表，点击输出对应的单元对象",
    gridInfo: {
      middle: gridSizeMaker(3, 8),
    },
  } as componentInfo,

  propsDetail: {
    treeDataFunc: {
      label: "树状列表数据（一次性获取）",
      description: "一次性获取所有数据",
      type: inputType.functionEditor,
    },
    outputKey: {
      label: "baseData输出key",
      type: inputType.text,
    },
    defaultProps: {
      label: "数据替换方案",
      description: "参考文档：https://element-plus.org/zh-CN/component/tree.html#props",
      type: inputType.obj,
    },
    clickItemDetailFunc: {
      label: "点击元素详情事件",
      description: "一般用于展示元素弹窗等",
      type: inputType.functionEditor,
    },
    clickItemFunc: {
      label: "点击元素详情事件",
      description: "一般用于展示元素弹窗等",
      type: inputType.functionEditor,
    },
    searchBtn: {
      label: "定制按钮1",
      type: inputType.obj,
    },
  } as propInfo,

  baseProps: {
    clickItemDetailFunc: false,
    treeDataFunc: (that, searchData) => {
      let num = 0;
      let testData = (str = "") => {
        return { label: "Hello World _ " + str, value: "测试数据" + num++ };
      };
      if (searchData) {
        return "1234567".split("").map((x) => testData(searchData));
      } else
        return [
          {
            ...testData(),
            children: [testData(), testData()],
          },
        ];
    },
    outputKey: "menuSelectCell",
    defaultProps: {
      children: "children",
      label: "label",
    },
  },

  props: [
    "baseData",
    "sizeUnit",
    "outputKey",
    "defaultProps",
    "treeDataFunc",
    "treeDataFuncByLevel",
    "clickItemDetailFunc",
    "clickItemFunc",
    "searchBtn",
    "searchFuncPlaceHolder",
    "searchFuncByName",
    "detail",
  ],
  components: { cardBg },
  watch: {
    selectedKey(val) {
      this.searchResult = [];
    },
  },
  data: () => {
    return {
      treeData: [],
      selectedKey: "",
      random,
      size: sizeTem.small,
      searchResult: [],
      expandedKey: [],
    };
  },
  async mounted() {
    await this.init();
    // 选中第一个
    if (this.treeData && this.treeData[0] && this.treeData[0].children && this.treeData[0].children[0]) {
      const node = this.treeData[0].children[0];
      const that = this;
      this.$nextTick(() => {
        this.$refs.elTree.setCurrentKey(node.id);
        if (this.clickItemFunc)
          this.clickItemFunc(that, node);
      });
    }
  },
  methods: {
    isBtnShow(btn: btnCellTemplate) {
      const that = this;
      return btn.isShow(that, btn);
    },

    nodeChangeOpen(node) {
      const that = this;
      // const tree = this.$refs["elTree"];
      // console.log(tree, "tree");
      that.expandedKey.push(node.id);
      localStorage.setItem(location.hash, JSON.stringify(that.expandedKey));
    },
    nodeChangeClose(node) {
      const that = this;
      that.expandedKey = that.expandedKey.filter((x) => x != node.id);
      localStorage.setItem(location.hash, JSON.stringify(that.expandedKey));
    },
    /**
     * @name: nodeClick
     * @description: 点击上报事件
     * @authors: CZH
     * @Date: 2022-11-09 16:55:30
     * @param {*} node
     */
    nodeClick(node) {
      const that = this;
      let data = {};

      if (this.outputKey) {
        let outputKey = this.outputKey;
        data[outputKey] = JSON.parse(JSON.stringify(node));
        setData(this, data);
      }
      if (this.clickItemFunc) {
        this.clickItemFunc(that, node);
      }
      // if (that.expandedKey.indexOf(node.id)) {
      //   that.expandedKey = that.expandedKey.filter((x) => x != node.id);
      // } else that.expandedKey.push(node.id)
    },

    /**
     * @name: init
     * @description: 初始化
     * @authors: CZH
     * @Date: 2022-11-18 17:04:57
     */
    async init() {
      if (this.treeDataFunc) {
        let that = this;
        that.expandedKey = Array.from(
          new Set(JSON.parse(localStorage.getItem(location.hash)))
        );
        that.treeData = await that.treeDataFunc(that);
      }
      const that = this;

      setTimeout(() => {
        const el = document.querySelector(`.box_${that.random} .custom-tree-node`);
        if (el && "click" in el) el["click"]();
        that.$emit("ready");
      }, 100);
    },

    async search(e) {
      const that = this;
      let res = await this.treeDataFunc(that, this.selectedKey);
      this.searchResult =
        res.length > 1
          ? res.reduce((pre, item) => {
            let children = [];
            if (item.children) {
              children = item.children;
              delete item.children;
            }
            if (!pre.length) return [pre].concat(item).concat(children);
            else {
              return pre.concat(item).concat(children);
            }
          })
          : res;
    },

    /**
     * @name: clickItemDetail
     * @description: 点击元素详情按钮事件
     * @authors: CZH
     * @Date: 2023-01-28 15:08:50
     * @param {*} data
     */
    async clickItemDetail(data) {
      const that = this;
      if (this.clickItemDetailFunc) this.clickItemDetailFunc(that, data);
    },

    /**
     * @name: btnClick
     * @description: 按钮点击事件
     * @authors: CZH
     * @Date: 2022-12-02 09:27:05
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate, data?: stringAnyObj) {
      btn["isLoading"] = true;
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.$modules.getModuleApi()["userManage_openDrawerForm"](this, btn.drawerProps);
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that, data);
        this.$emit("search");
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
      btn["isLoading"] = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.menuBox {
  width: 100%;
  height: 100%;
  transition: all 0.3s;

  ::v-deep .el-tree-node__label {
    width: calc(100% - 12px);
  }

  .searchBar {
    display: flex;
  }

  .content {
    width: 100%;
    height: auto;
    max-height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;

    .searchItem {
      margin: 4px 18px;
      width: calc(100% - 16px);
    }
  }
}

.treeNode {
  flex: 1;
  align-items: center;
  justify-content: space-between;
  display: flex;
  line-height: 30px;
  width: 100%;
  overflow: hidden;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .text {
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .btns {
    position: absolute;
    right: 0px;
  }
}

::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
  transition: all 0.2s;
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: var(--el-color-primary);
  border-radius: 6px;
  color: #fff;
  margin: 3px 0px;
}
</style>
