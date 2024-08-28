<!--
 * @Date: 2022-11-11 10:18:58
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-26 17:47:16
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/searchTable/info/infoTable.vue
-->
<template>
  <div ref="tableBox" class="tableBox" v-loading="loading" :style="{
    boxShadow: cardStyle.get('shadow'),
    borderRadius: cardStyle.get('borderRadius') + 'px',
  }">
    <ElTable v-if="dataList && dataList.length > 0" v-loading="loading" ref="tableController" :key="fuckKey"
      :data="dataList" height="100%"
      :row-style="{ 'min-height': '60px', 'min-width': '100px', 'height': rowHeightKey + 'px' }"
      :header-cell-style="isDark ? tableHeaderDark : tableHeader" :fit="true" :border="false"
      :row-key="(row) => { return row.id + '' }" @select-all="selectPosition" @select="selectPosition"
      style="cursor: default" lazy :load="load" :tree-props="{ children: 'children' }">
      <ElTableColumn :selectable="judgeSelect" type="selection" align="center" fixed="left" v-if="canSelect"
        :sort-by="(row, index) => sortBy(row, index, item.key)"></ElTableColumn>
      <ElTableColumn v-for="(item, index) in template.filter(x => x.showAble)" :key="index + 'tablecolumn'"
        :label="item.label" :width="item.table?.width || 'auto'" :prop="item.key" :fixed="item?.table?.fixed || 'right'">
        <template #header>
          <div class="ColumnHeader">
            {{ item.label }}
          </div>
        </template>
        <template #default="scope" v-if="item.table.type != showType.dataKey">
          <div class="flexBox" :style="item.table?.style" v-if="item.table.type != showType.btnList">
            <component v-if="item.table.type == showType.funcComponent" @btnClick="btnClick"
              :is="item.table.showFunc(scope.row, item.key)" @click="(btns) => btnClick(btns, scope.row)"></component>
            <el-popover v-else-if="item.table.type == showType.func" placement="top-start" trigger="hover"
              :show-after="500" :content="item.table.showFunc(scope.row, item.key, true) + ''">
              <template #reference>
                {{ item.table.showFunc(scope.row, item.key) }}
              </template>
            </el-popover>
          </div>
          <div class="flexBox noOverflow" :id="scope.row.id + '__ForExpand'" :style="item.table?.style" v-else>
            <el-button v-if="!item.table.noDetail" size="small" link type="primary" @click="cellDblclick(scope.row)">
              详情
            </el-button>
            <span v-for="(btns, index) in item.table.btnList" :key="index + 'btn'">
              <el-button v-if="btns.isShow(scope.row, btns)"
                :loading="loadingMap[btns.label + btns.showAbleKey + scope['$index']]"
                :disabled="btns.isDisable(scope.row, item.key)" size="small" link
                :type="btns.elType ? btns.elType : (btns.isDisable(scope.row, item.key) ? 'info' : 'primary')"
                @click="btnClick(btns, scope.row, scope)"
                :style="btns.isDisable(scope.row, item.key) ? 'color:rgba(39, 58, 91, 0.6)' : btns.btnColor ? ('color:' + btns.btnColor) : ''">
                {{ btns.label }}
              </el-button>
            </span>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="centerImg" v-else>
      <img src="../assets/noData.png">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElButton, ElPopover, ElTable, ElTableColumn, ElTableV2 } from "element-plus";
import { useDark } from "@pureadmin/utils";
import { useCardStyleConfigHook } from '../../../../../store/modules/cardStyleConfig';
import {
  btnCellTemplate,
  btnActionTemplate,
  showType,
  stringAnyObj,
  tableCellTemplate,
} from "../../../types";

export default defineComponent({
  components: { ElTable, ElTableV2, ElTableColumn },
  props: ["template", "loading", "dataList", "baseData", "load", 'defalutSelectedList', 'canSelect', 'rowHeightKey', 'expandRowKeys'],
  data() {
    return {
      showType,
      fuckKey: Math.random() * 100000,
      selectedList: [] as any[],
      loadingMap: {} as { [key: string]: boolean },
      cardStyle: useCardStyleConfigHook()
    };
  },

  computed: {
    tableHeader() {
      return {
        backgroundColor: "#f8f9fb",
        fontWeight: 900,
        color: "#333",
      };
    },
    tableHeaderDark() {
      return {
        backgroundColor: "rgba(0,0,0,0.3)",
        fontWeight: 900,
        color: "#ddd",
      };
    },
  },
  watch: {
    defalutSelectedList: {
      handler(val) {
        this.initSelected()
      },
      immediate: true,
      deep: true
    },
  },
  async mounted() {
    if (this.defalutSelectedList)
      await this.initSelected()
    await this.initExpend()
  },
  methods: {
    async initExpend() {
      function toArray(itemList) {
        let arr = [];
        itemList.map((x) => {
          let hasChildren = (x.children && x.children.length) > 0;
          const children = x.children;
          delete x.children;
          arr.push({
            ...x,
          });
          if (hasChildren)
            toArray(children).map((x) => {
              arr.push(x);
            });
        });
        return arr;
      }
      const that = this
      setTimeout(() => {
        let num = 0
        let fuck = setInterval(() => {
          if (that.expandRowKeys && that.expandRowKeys.length > 0) {
            const x = that.expandRowKeys[num]
            if (document.getElementById(x + '__ForExpand')) {
              document.getElementById(x + '__ForExpand').parentNode.parentNode.parentNode.childNodes[1].childNodes[0].getElementsByClassName('el-table__expand-icon')[0].click()
              num++
            } else clearInterval(fuck)
          } else clearInterval(fuck)
        }, 0)
      }, 500)
    },

    async initSelected() {
      let table = await new Promise((r, j) => {
        let interval = setInterval(() => {
          const table = this.$refs['tableController']
          if (table) {
            clearInterval(interval)
            r(table)
          }
        }, 100)
      }) as any
      let needDeal = []
      let needDelete = []
      const isSelected = table.getSelectionRows().map(x => x.value)
      let thisDataList = this.dataList || []
      const dataList = thisDataList.map(x => x.value)
      const thisDefaultSelectedList = this.defalutSelectedList || []
      thisDefaultSelectedList.map(x => {
        if (dataList.indexOf(x.value) > -1 && isSelected.indexOf(x.value) == -1) {
          needDeal.push(x.value)
        }
      })
      dataList.map(x => {
        if (isSelected.indexOf(x) != -1 && thisDefaultSelectedList.map(c => c.value).indexOf(x) == -1) {
          needDelete.push(x)
        }
      })

      if (needDeal.length > 0 || needDelete.length > 0) {
        table.clearSelection()
        thisDataList.map(x => {
          if (needDeal.indexOf(x.value) != -1)
            table.toggleRowSelection(x, true)
          if (needDelete.indexOf(x.value) != -1)
            table.toggleRowSelection(x, false)
        })
      }
    },

    judgeSelect(row, index) {
      if (row.unshow) {
        return false; // 返回true该行可选，返回false则不可选
      } else {
        return true;
      }
    },

    /**
     * @name: cellDblclick
     * @description: 行内双击事件
     * @authors: CZH
     * @Date: 2022-11-15 15:07:10
     * @param {*} data
     */
    cellDblclick(data) {
      let btnList = [];
      this.template.map((item) => {
        if (item.table.type == showType.btnList && item.table.btnList) {
          item.table.btnList.map((btn) => {
            btnList.push(btn);
          });
        }
      });
      this.$modules.getModuleApi()["userManage_openDrawerForm"](this, {
        title: "详情",
        queryItemTemplate: this.template,
        btnList,
        data,
        noEdit: true,
      });
    },

    close() {
      this.$emit("search");
    },

    /**
     * @name: selectPosition
     * @description: 选择行变化
     * @authors: CZH
     * @Date: 2022-11-15 15:08:32
     */
    selectPosition(e) {
      this.selectedList = e;
      this.$emit("selectedChange", this.selectedList);
    },

    /**
     * @name: tableHeight
     * @description: 获取表格高度
     * @authors: CZH
     * @Date: 2022-11-15 17:20:46
     */
    tableHeight() {
      if (this.$refs["tableBox"]) return this.$refs["tableBox"].offsetHeight;
      else return null;
    },

    /**
     * @name: btnClick
     * @description: 回报自定义按钮事件
     * @authors: CZH
     * @Date: 2022-11-21 19:03:17
     * @param {*} btn
     */
    btnClick(btn: btnCellTemplate, res?: stringAnyObj, index: any = {}) {
      this.loadingMap[btn.label + btn.showAbleKey + index["$index"]] = true;
      this.$emit("btnClick", btn, { ...res });
      const that = this
      setTimeout(() => {
        that.loadingMap[btn.label + btn.showAbleKey + index["$index"]] = false;
      }, 500)
    },

    sortBy(row, index, key) {
      return row[key];
    },
  },

  setup() {
    const { isDark } = useDark();
    return {
      isDark,
    };
  },
});
</script>

<style lang="scss" scoped>
.tableBox {
  overflow: hidden;
  // box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
}

.flexBox {
  display: contents;
  float: left;
  user-select: text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.noOverflow {
  overflow: hidden;
  text-overflow: unset;
}

.ColumnHeader {
  float: left;
  width: calc(100% - 26px);
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.centerImg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
