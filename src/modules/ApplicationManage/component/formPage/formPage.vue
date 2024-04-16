
<!--
 * @Date: 2022-11-09 11:19:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-14 14:19:00
 * @FilePath: /ConfigForDesktopPage/src/modules/ApplicationManage/component/formPage/formPage.vue
-->
<template>
  <cardBg :cusStyle="{
    padding: '12px',
    ...cusStyle,
  }">
    <div class="formPageTitle" v-if="title">{{ title }}</div>
    <div class="formBody" :class="{
      formBody_noBtn: !btnList || btnList.length == 0,
      formBody_noTitle: !title,
      formBody_noTitle_noBtn: (!btnList || btnList.length == 0) && !title,
    }" v-if="(!showTypeProp || showTypeProp == 'edit') && formData && formProps && formInputTemplate">
      <el-scrollbar>
        <VueForm v-if="showTypeProp == 'edit'" v-model="formData" :style="{
          textAlign: 'left',
        }" :schema="schema" :ui-schema="uiSchema" :formProps="formProps">
          <div slot-scope="{ formData }" :style="{ textAlign: 'right' }"></div>
        </VueForm>
        <!-- {{ formData }} -->
        <!-- {{ formData['appGroupList'] }}
        <br />
        1
        <br />

        {{ defaultFormData['appGroupList'] }} -->
      </el-scrollbar>
    </div>
    <div :class="{
      formBody_noBtn: !btnList || btnList.length == 0,
      formBody_noTitle: !title,
      formBody_noTitle_noBtn: (!btnList || btnList.length == 0) && !title,
    }" v-if="showTypeProp == 'show'">
      <!-- {{ formData['appGroupList'] }}
      <br />
      1
      <br />
      {{ defaultFormData['appGroupList'] }} -->
      <!-- <cardBg :cusStyle="{
        margin: '6px',
        width: 'calc(100 % - 12px)',
        height: 'auto'
      }"> -->
      <el-form ref="form" v-if="showTypeProp == 'show'" v-on:submit.prevent :label-position="'left'" size="large"
        style="text-align: left;">
        <el-form-item :label-width="'160px'" :label="item.label" v-for="(item, index) in showItemTemplate.filter(
          (x) => x.table.type != showType.btnList
        )" :key="index + 'btnFormList'">
          <template #label="it">
            <div :style="{
              width: '100%',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              marginLeft: '1em'
            }">
              <div> {{ it.label }}</div>
              <div>:</div>
            </div>
          </template>
          <span v-if="item.table.type == showType.funcComponent">
            <component :is="item.table.showFunc(defaultFormData, item.key)"></component>
          </span>
          <span v-else-if="item.table.type == showType.func" style="cursor:auto;    user-select: all;">
            {{ item.table.showFunc(defaultFormData, item.key) }}
          </span>
          <span v-else-if="item.table.type == showType.dataKey" style="cursor:auto;    user-select: all;">
            {{ defaultFormData[item.key] }}
          </span>
          <!-- {{ item }} -->
        </el-form-item>
      </el-form>
      <!-- </cardBg> -->
    </div>
    <!-- {{ btnList }} -->
    <div :style="{ textAlign: 'left' }" v-if="btnList && btnList.length > 0">
      <el-divider></el-divider>
      <div class="btnListStyle">
        <div v-for="(item, index) in btnList.filter((btn) =>
          btn && btn.isShow
            ? btn.isShow(defaultFormData, JSON.parse(JSON.stringify(btn)))
            : true
        )" :key="index + 'btn'" style="margin-right: 6px; display: inline-block">
          <el-button :loading="item.isLoading" @click="btnClick(item)" :type="item.elType" :icon="item.icon">
            {{ item.label }}
          </el-button>
        </div>
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

import {
  propertiesMaker,
  uiSchemaMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import VueForm from "@lljj/vue3-form-element";
import { showType, tableCellTemplate, btnCellTemplate, btnActionTemplate } from "@/modules/userManage/types";
import { stringAnyObj } from '../../types';
import { deepClone } from "@/utils";
import { marginKey } from '../../../../components/basicComponents/grid/GridLayout/helpers/utils';
import { ElTag } from 'element-plus';
let formDataForCheck = {};

export default defineComponent({
  componentInfo: {
    labelNameCN: "表单页面",
    key: "formPage",
    description: "",
    gridInfo: {
      middle: gridSizeMaker(12, 8),
    },
  } as componentInfo,

  propsDetail: {
    title: {
      label: "表单展示模版",
      description: "一次性获取所有数据",
      type: inputType.text,
    },
    formDataFunc: {
      label: '表单数据获取',
      type: inputType.functionEditor
    },
    defaultFormData: {
      label: "表单默认数据",
      description: "",
      type: inputType.obj,
    },
    showItemTemplate: {
      label: "表单展示模版",
      description: "一次性获取所有数据",
      type: inputType.functionEditor,
    },
    formInputTemplate: {
      label: "表单输入模版",
      type: inputType.obj,
    },
    btnList: {
      label: "操作按钮列表",
      type: inputType.obj,
    },
    showTypeProp: {
      label: '展示方式',
      type: inputType.boolean
    },
  } as propInfo,

  baseProps: {},
  props: ['formDataFunc', "title", "defaultFormData", "showItemTemplate", "formInputTemplate", "btnList", 'showTypeProp', 'cusStyle'],
  components: { cardBg, VueForm },
  watch: {
    defaultFormData: {
      async handler(val) {
        if (!this.isReady) { }
        else {
          this.$emit("ready", false);
          await this.init();
          await this.initForm();
          this.$emit("ready");
        }
      },
      immediate: true,
      deep: true,
    },
    formData: {
      handler(val) {
        if (this.isReady) this.checkOnChange(val);
      },
      immediate: true,
      deep: true,
    },
  },
  data: () => {
    return {
      searchResult: [],
      formItemTemplate: [] as tableCellTemplate[],
      showType,
      schema: {
        type: "object",
        properties: {},
      },
      formData: {},
      uiSchema: {},
      formProps: {
        layoutColumn: 1,
        inlineFooter: false,
        labelSuffix: "",
        labelPosition: "left",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "120px",
      },
      isReady: false
    };
  },
  async mounted() {
    await this.init();
    await this.initForm();
    this.$emit("ready");
    this.isReady = true;
  },
  methods: {
    // 初始化表单
    async initForm(formInputTemplate: tableCellTemplate[] = this.formInputTemplate) {
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(formInputTemplate, this, true);
      this.schema = {
        ...this.schema,
        properties,
        // ...(this.plugInData["schema"] || {}),
      };
      this.uiSchema = uiSchemaMaker(formInputTemplate, this);
    },

    async init() {
      if (this.defaultFormData) {
        this.formData = this.defaultFormData;
        formDataForCheck = deepClone(this.formData);
      }
      if (this.formDataFunc)
        this.formData = await this.formDataFunc(this);
    },

    async btnClick(btn: btnCellTemplate) {
      btn["isLoading"] = true;
      if (btn.type == btnActionTemplate.OpenDrawer)
        this.$modules.getModuleApi()["userManage_openDrawerForm"](this, btn.drawerProps);
      else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        try {
          await btn.function(that, that.formData);
        }
        catch { }
        this.$emit("search");
      } else if (btn.type == btnActionTemplate.Url)
        window.open(btn.url);
      btn["isLoading"] = false;
    },


    async checkOnChange(val = this.formData, force = false) {
      Object.keys(val).map((key) => {
        if (val[key] != formDataForCheck[key] || force) {
          this.formInputTemplate.map(async (cell) => {
            if (cell.key == key && cell.input && cell.input.onChangeFunc) {
              // 如有返回则可以重置表单的输入方案
              const that = this;
              const queryItemTemplate = await cell.input.onChangeFunc(
                that,
                this.formData,
                key
              );
              if (
                queryItemTemplate &&
                queryItemTemplate.length &&
                queryItemTemplate[0].key
              )
                this.initForm(queryItemTemplate);
              else if (queryItemTemplate) {
                for (let x in queryItemTemplate) {
                  this.formData[x] = queryItemTemplate[x];
                }
                this.$forceUpdate();
              }
            }
          });
          formDataForCheck[key] = val[key];
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.formPageTitle {
  text-align: left;
  height: 34px;
  line-height: 34px;
}

.formBody {
  height: calc(100% - 119px);
  overflow-y: auto;
  overflow-x: hidden;
}

.formBody_noBtn {
  height: calc(100% - 34px);
  overflow-y: auto;
  overflow-x: hidden;
}

.formBody_noTitle {
  height: calc(100% - 85px);
  overflow-y: auto;
  overflow-x: hidden;
}

.formBody_noTitle_noBtn {
  height: calc(100%);
  overflow-y: auto;
}

.btnListStyle {
  height: 36px;
  width: 100%;
  overflow: hidden;
  overflow-x: auto !important;
  white-space: nowrap;
}
</style>
