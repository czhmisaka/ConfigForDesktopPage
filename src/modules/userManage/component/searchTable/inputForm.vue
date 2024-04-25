<!--
 * @Date: 2022-11-11 09:35:29
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-23 22:30:29
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/searchTable/inputForm.vue
-->
<template>
  <div v-if="(queryItemTemplate && queryItemTemplate.length > 0) ||
    (btnList && btnList.length > 0) ||
    !autoSearch || !noTableEdit
    ">
    <cardBg ref="formBox" class="formBox" :cus-style="{
      padding: '0px',
      height: 'auto',
      paddingBottom: (btnList && btnList.length > 0) || !autoSearch ? '12px' : '0px',
      'border-radius': '6px',
      border: '0px solid',
      filter: 'none',
      'box-shadow': 'none',
      display: 'inline-block',
    }">
      <VueForm v-model="formData" :style="{
        textAlign: 'left',
        marginRight: '-10px'
      }" :schema="schema" :ui-schema="uiSchema" :formProps="formProps" @change="onChange">
        <div v-if="(btnList && btnList.length > 0) || !autoSearch || !noTableEdit" slot-scope="{ formData }" :style="{
          textAlign: 'right',
          marginRight: '10px'
        }">
          <el-button class="btn" type="default" v-if="!noTableEdit" @click="btnClick(editFuncBtn)"
            :icon="'Setting'"></el-button>
          <el-button class="btn" v-if="!autoSearch && modeChange" @click="btnClick(changeFuncBtn)"
            :icon="isCard ? 'Document' : 'Grid'"></el-button>
          <el-button class="btn" v-if="!autoSearch && queryItemTemplate && queryItemTemplate.length > 0"
            @click="refreshData(-1)" icon="RefreshRight">重置</el-button>
          <el-button class="btn" v-if="!autoSearch" type="primary" @click="handleSubmit(formData)"
            style="margin-left: 0px" icon="Search">搜索</el-button>
          <div v-for="(item, index) in 
  (btnList || []).filter((btn) =>
    btn && btn.isShow
      ? btn.isShow({ ...formData, _selectedList: selectedList }, btn)
      : true
  )
" :key="index + 'btn'" class="floatLeft" :style="item.style ? item.style : ''">
            <el-upload ref="uploadRef" :headers="getDownLoadRequestHeaders()" class="upload-demo"
              :action="actionUrl + (item.uploadInfo ? item.uploadInfo.action : '')"
              :limit="item.uploadInfo ? item.uploadInfo.limit : 1" :data="item.uploadInfo ? item.uploadInfo?.data : {}"
              :on-success="(response, file, fileList) => btnClick(item, response)"
              :on-error="(response, file, fileList) => btnClick(item, response)"
              :on-exceed="(response, file, fileList) => btnClick(item, response)" :show-file-list="false"
              v-if="item.type == btnActionTemplate.UploadFunction">
              <el-button plain icon="plus" type="primary">{{ item.label }}</el-button>
            </el-upload>
            <el-button v-else :id="item.label + '_' + 'inputForm'" :loading="item.isLoading" @click="btnClick(item)"
              :disabled="item.isDisable({ ...formData, _selectedList: selectedList }, item)
                " :type="item.elType
    ? typeof item.elType != 'string'
      ? item.elType(formData)
      : item.elType
    : ''
    " :icon="item.icon">
              {{ item.label }}
            </el-button>
          </div>
        </div>
      </VueForm>
      <div class="TopRight" v-if="isNeedClose">
        <iconCell :name="isOpen ? 'ArrowDownBold' : 'ArrowUpBold'" @click="changeOpen" :iconOption="{
          fontSize: '12px',
        }
          " />
      </div>
    </cardBg>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import VueForm from "@lljj/vue3-form-element";
import { propertiesMaker } from "./searchTable";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { ElButton, ElDivider, formProps } from "element-plus";
import {
  tableCellTemplate,
  stringAnyObj,
  btnCellTemplate,
  btnActionTemplate,
} from "@/modules/userManage/types";
import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
import { getPreUrl } from "@/utils/api/requests";
import { btnMaker } from './drawerForm';
import { changeCardProperties } from "@/components/basicComponents/grid/module/cardApi";
import { openTableEditor } from './info/infoTableEdit';
const VITE_PROXY_DOMAIN_REAL = getPreUrl();
let interval = null;

export default defineComponent({
  name: "表单组件",
  props: [
    "query",
    "queryItemTemplate",
    "queryItemConfig",
    "btnList",
    "autoSearch",
    "selectedList",
    "modeChange",
    "isCard",
    "noTableEdit"
  ],
  watch: {
    query: {
      handler(val) {
        this.refreshData(val);
      },
      deep: true,
      immediate: true,
    },
    queryItemTemplate: {
      handler(val) {
        this.initForm(val);
      },
      immediate: true,
    },
  },

  computed: {
    isNeedClose() {
      // return Object.keys(this.schema.properties).length >= 3;
      return false;
    },
  },

  components: { VueForm, cardBg, iconCell },

  data() {
    return {
      formData: {},
      uiSchema: {},
      formFooter: {
        show: false,
      },
      isOpen: true,
      formProps: {
        layoutColumn: 3,
        inlineFooter: false,
        labelSuffix: "：",
        labelPosition: "top",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "120px",
      },
      schema: {
        type: "object",
        properties: {},
      },
      btnActionTemplate,
      actionUrl: VITE_PROXY_DOMAIN_REAL,
      editFuncBtn: btnMaker('', btnActionTemplate.Function, {
        function: async (that1, data) => {
          await openTableEditor(that1 as any, data)
        }
      }),
      changeFuncBtn: btnMaker('', btnActionTemplate.Function, {
        function: async (that1, data) => {
          let fuck = {}
          fuck[that1.detail.label] = {
            isCard: !that1.isCard,
          }
          changeCardProperties(that1, fuck);
        }
      })
    };
  },

  async mounted() {
    this.refreshData(this.query);
    let that = this;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (that.$refs["formBox"] && that.$refs["formBox"]["$el"]) {
        let width = that.$refs["formBox"]["$el"].offsetWidth;
        if (width > 600) {
          that.formProps.layoutColumn = 3;
        } else if (width > 400) {
          that.formProps.layoutColumn = 2;
        } else {
          that.formProps.layoutColumn = 1;
        }
      }
    }, 100);
    await this.initForm(this.queryItemTemplate);
  },

  methods: {
    getDownLoadRequestHeaders() {
      return getDownLoadRequestHeaders();
    },
    /**
     * @name: 初始化搜索用表单和对象
     * @description: initForm
     * @authors: CZH
     * @Date: 2022-11-14 10:17:28
     */
    async initForm(queryItemTemplate: tableCellTemplate[] = this.queryItemTemplate) {
      if (Object.keys(this.query).length > 0) {
      }
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(queryItemTemplate, this, false);
      this.schema.properties = properties;
    },

    // 上报数据修改事件
    onChange() {
      this.$emit("inputChange", this.formData);
    },

    // 回报搜索事件
    handleSubmit(formData: stringAnyObj) {
      this.$emit("search", formData);
    },

    /**
     * @name: btnClick
     * @description: 回报自定义按钮事件
     * @authors: CZH
     * @Date: 2022-11-21 19:03:17
     * @param {*} btn
     */
    btnClick(btn: btnCellTemplate, res?: stringAnyObj) {
      this.$emit("btnClick", btn, res);
    },

    changeOpen() {
      this.isOpen = !this.isOpen;
      this.isOpen
        ? this.initForm()
        : this.initForm(this.queryItemTemplate.slice(0, this.formProps.layoutColumn));
    },

    refreshData(val: any) {
      if (val === -1) {
        this.formData = {};
        this.$emit("inputChange", {});
        // 按照7月11号的要求，删除了重置直接导致的刷新
        // this.$emit("refresh");
        this.$nextTick().then(() => {
          this.handleSubmit();
        });
      } else if (val && Object.keys(val).length > 0) {
        for (let x in val) {
          if (this.formData[x] != val[x]) {
            this.formData[x] = val[x];
          }
        }
      } else {
        this.formData = val;
      }
    },
    addFileCreate(e) {
      console.log(e, "success");
      this.$emit("inputChange", e);
    },
    errorFile(e) {
      console.log(e, "err");
      this.$emit("inputChange", e);
    },
    exceedFile(e) {
      console.log(e, "exceed");
      this.$emit("inputChange", e);
    },
  },
});
</script>

<style lang="scss" scoped>
.formBox {
  width: 100%;
  height: auto;
  transition: all 0.3s;
}

.TopRight {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0px;
  right: 0px;
  margin: 18px;
}

.btn {
  float: right;
  margin-left: 6px;
}

.floatLeft {
  float: left;
  margin-right: 6px;
}
</style>
