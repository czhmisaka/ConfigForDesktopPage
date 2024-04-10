<!--
 * @Date: 2023-09-08 15:59:49
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-08 23:24:57
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/searchTable/info/cardlist.vue
-->
<template>
  <div class="cardBox" v-loading="loading">
    <div class="scroll" :height="height + 'px'">
      <div class="cardBoxList" v-if="!cardFunc">
        <!-- {{ data }} -->
        <cardBg :class="`card ${isMobile()?'card_Mobile':''}`" v-for="(data, index) in  dataList" :cus-style="{}">
          <el-form size="small">
            <span v-for="(item, index)  in  template ">
              <div v-if="index == 0" class="title">
                <div class="flexBox" :style="item.table?.style" v-if="item.table.type != showType.btnList">
                  <component v-if="item.table.type == showType.funcComponent" @btnClick="btnClick"
                    :is="item.table.showFunc(data, item.key)" @click="(btns) => btnClick(btns, data)"></component>
                  <el-popover v-else-if="item.table.type == showType.func" placement="top-start" trigger="hover"
                    :show-after="500" :content="item.table.showFunc(data, item.key, true) + ''">
                    <template #reference>
                      {{ item.table.showFunc(data, item.key) }}
                    </template>
                  </el-popover>
                </div>
              </div>
              <span v-if="index != 0">
                <el-form-item :label="item.label" width="120px">
                  <div class="flexBox" :style="item.table?.style" v-if="item.table.type != showType.btnList">
                    <component v-if="item.table.type == showType.funcComponent" @btnClick="btnClick"
                      :is="item.table.showFunc(data, item.key)" @click="(btns) => btnClick(btns, data)"></component>
                    <el-popover v-else-if="item.table.type == showType.func" placement="top-start" trigger="hover"
                      :show-after="500" :content="item.table.showFunc(data, item.key, true) + ''">
                      <template #reference>
                        {{ item.table.showFunc(data, item.key) }}
                      </template>
                    </el-popover>
                  </div>
                  <div class="flexBox noOverflow" :style="item.table?.style" v-else>
                    <el-button v-if="!item.table.noDetail" size="small" link type="primary" @click="cellDblclick(data)">
                      详情
                    </el-button>
                    <span v-for="( btns, index ) in  item.table.btnList " :key="index + 'btn'">
                      <el-button v-if="btns.isShow(data, btns)"
                        :loading="loadingMap[btns.label + btns.showAbleKey + index]"
                        style="margin-left: 3px;cursor:pointer" :disabled="btns.isDisable(data, item.key)" size="small"
                        :type="btns.elType
                          ? typeof btns.elType != 'string'
                            ? btns.elType(data)
                            : btns.elType
                          : ''
                          " @click="btnClick(btns, data, index)">
                        {{ btns.label }}
                      </el-button>
                    </span>
                  </div>
                </el-form-item>
              </span>
            </span>
          </el-form>
        </cardBg>
      </div>
      <div class="cardBoxList" v-else-if="cardFunc">
        <component v-for="data in dataList" @btnClick="(e) => btnClick(e, data)" :is="cardFunc(data)">
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { btnCellTemplate, btnActionTemplate } from "@/modules/userManage/types";
import { showType } from '../../../types';
import { translate } from 'element-plus';
import { isMobile } from '../../../../../utils/api/user/header';
export default defineComponent({
  name: "cardList",
  components: { cardBg },
  props: ["template", "loading", "dataList", "baseData", "load", 'cardFunc', 'height', 'canSelect'],
  data: () => {
    return {
      loading: false,
      showType,
      loadingMap: {} as { [key: string]: boolean },
      isMobile,
    }
  },
  methods: {
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
  },
});
</script>

<style lang="scss" scoped>
.scroll {
  height: 100%;
  overflow-x: clip;
  overflow-y: auto;
  width: calc(100% + 24px);
  padding: 12px;
  transform: translate(-12px, -12px);
}

.cardBoxList {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: calc(100% + 12px);

  .card {
    transition: all 0.2s ease-in-out;
    height: auto !important;
    padding: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
    width: calc(25% - 12px) !important;

    .title {
      text-align: left;
      font-weight: 700;
      font-size: 16px;
      width: 100%;
      height: 22px;

      .flexBox {
        display: block;
        float: left;
        height: 22px;
        overflow: hidden;
      }
    }


    .el-form-item {}

    ::v-deep .el-form-item__content {
      line-height: 24px;
      width: auto !important;
      float: right !important;
      display: block !important;
    }

    ::v-deep .el-form-item__label {
      font-weight: 600;
    }

    .flexBox {
      text-wrap: nowrap;
      float: right;
      height: 2em;
      margin-top: 0;
      overflow: hidden;
      position: relative;
      text-align: right;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  }

  .card_Mobile{
    width: calc(100% - 12px) !important;
  }

  .card:hover {
    transform: scale(1.03, 1.03);
  }
}
</style>


right: 0px;