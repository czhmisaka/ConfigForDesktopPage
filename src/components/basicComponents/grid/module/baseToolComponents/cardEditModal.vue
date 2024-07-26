<!--
 * @Date: 2022-05-24 14:14:42
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-26 01:20:18
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/module/baseToolComponents/cardEditModal.vue
-->

<template>
  <span>
    <div :class="'baseModal ' + (modalControl.isOpen ? 'open' : 'close')" @click="close(true)">
      <div class="formModalBox" @click.stop="fuckNothing">
        <cardBg :cus-style="cusStyle">
          <el-divider content-position="left">{{ baseComponentInfo.labelNameCN }}</el-divider>
          <el-form ref="form" v-on:submit.prevent>
            <el-form-item v-if="cardComponentDetail.name">
              <el-descriptions class="card" v-if="baseComponentInfo" direction="vertical" :column="4" border>
                <el-descriptions-item v-for="(item, index) in Object.keys(baseComponentInfo)" :label="item">
                  {{ baseComponentInfo[item] }}
                </el-descriptions-item>
              </el-descriptions>
            </el-form-item>
          </el-form>
        </cardBg>
        <cardBg :cus-style="cusStyle">
          <el-divider content-position="left">组件模式</el-divider>
          <el-form ref="form" v-on:submit.prevent>
            <el-form-item label="模式">
              <el-radio-group v-model="cardComponentDetail.type" size="large" placeholder="组件加载模式">
                <el-radio-button :label="item" :value="item" v-for="item in cardComponentType"
                  :key="item + 'cardComponentType'" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="固有组件" v-if="cardComponentDetail.type == cardComponentType.componentList">
              <el-select v-model="cardComponentDetail.name" placeholder="选择组件" @change="componentLoaderChange">
                <el-option v-for="(item, index) in Object.keys(componentList)" :value="item"
                  :key="componentList[item].name + '_' + index">
                  {{
                    componentList[item]?.componentInfo?.label +
                    ":" +
                    componentList[item]?.componentInfo?.description
                  }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="代码" v-if="cardComponentDetail.type == cardComponentType.fromData">
              <Codemirror v-model:value="cardComponentDetail.data" :options="cmOptions" border
                placeholder="test placeholder" :height="600" />
            </el-form-item>
          </el-form>
        </cardBg>
        <cardBg :cus-style="cusStyle">
          <el-divider content-position="left">组件属性</el-divider>
          <el-form :model="componentsProps" v-on:submit.prevent>
            <el-form-item v-for="(formItem, index) in componentsPropsInputTemplate" :key="index + '_FormItem'"
              :label="formItem.label" style="margin-bottom: 6px;">
              <el-input v-model="componentsProps[formItem.key]" />
            </el-form-item>
          </el-form>
        </cardBg>
        <cardBg :cus-style="cusStyle" v-if="componentsGridInfo && componentsGridInfo.default">
          <el-divider content-position="left">布局属性</el-divider>

          <el-form :model="componentsGridInfo" v-on:submit.prevent>
            <el-form-item label="X轴距离">
              <el-slider v-model="componentsGridInfo.default.position.x" :step="1" :min="0"
                :max="sizeUnit.colNum - componentsGridInfo.default.size.width" show-stops />
            </el-form-item>
            <el-form-item label="Y轴距离">
              <el-slider v-model="componentsGridInfo.default.position.y" :step="1" :min="0"
                :max="componentsGridInfo.default.position.y + 6" show-stops />
            </el-form-item>
          </el-form>
          <el-form-item label="组件 宽">
            <el-slider v-model="componentsGridInfo.default.size.width" :step="1" :min="0"
              :max="sizeUnit.colNum - componentsGridInfo.default.position.x" show-stops />
          </el-form-item>
          <el-form-item label="组件 高">
            <el-slider v-model="componentsGridInfo.default.size.height" :step="1" :min="1"
              :max="componentsGridInfo.default.size.height + 6" show-stops />
          </el-form-item>
        </cardBg>
        <cardBg :cus-style="{ ...cusStyle, paddingTop: '12px' }">
          <el-button class="btn" type="primary" @click="close(true)">保存</el-button>
          <el-button @click="close">取消</el-button>
        </cardBg>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";
import {
  componentGetter,
  cardComponent,
  cardComponentType,
  componentsGridInfo,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { defineComponent } from "vue";

// 引入编辑器
import Codemirror from "codemirror-editor-vue3";
import { componentInfo } from "../dataTemplate";
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';

export default defineComponent({
  name: "cardEditModal",
  components: {
    Codemirror,
    cardBg
  },
  props: ["detail", "gridList", "componentIndex", "sizeUnit", "componentLists"],
  computed: {
    // componentsType.componentList 加载方式中可使用的组件列表
    componentList() {
      console.log({
        ...componentLists,
        ...this.componentLists,
      },'组件列表')
      return {
        ...componentLists,
        ...this.componentLists,
      };
    },
    baseComponentInfo() {
      if (Object.keys(this.componentList).indexOf(this.cardComponentDetail.name) > -1)
        return this.componentList[this.cardComponentDetail.name]["componentInfo"];
      else return {};
    },
  },
  data() {
    return {
      modalControl: {
        isOpen: false,
      } as { [key: string]: any },

      premission: {} as { [key: string]: any },

      // 组件属性配置
      componentsProps: {} as { [key: string]: any },
      componentsPropsInputTemplate: [] as Array<{
        [key: string]: any;
      }>,

      // 组件布局配置
      componentsGridInfo: {} as componentsGridInfo,
      componentsGridInfoInputTemplate: [] as Array<{
        [key: string]: any;
      }>,

      // 组件数据
      cardComponentDetail: {} as cardComponent,
      cardComponentType,

      // 代码编辑器
      cmOptions: {
        mode: "text/javascript", // Language mode
        theme: "dracula", // Theme
        lineNumbers: true, // Show line number
        smartIndent: true, // Smart indent
        indentUnit: 2, // The smart indent unit is 2 spaces in length
        foldGutter: true, // Code folding
        styleActiveLine: true, // Display the style of the selected row
      },

      cusStyle: {
        'height': 'auto',
        'margin': '12px',
        'width': 'calc(100% - 24px)',
        'padding': '12px',
        'padding-top': '0px',
      }
    };
  },
  methods: {
    /**
     * @name: getPropsData
     * @description: 载入组件数据
     * @authors: CZH
     * @Date: 2022-06-28 21:53:23
     */
    async getPropsData() {
      // 拆分组件属性,设置表单数据
      this.componentsPropsInputTemplate = [];
      this.componentsProps = { ...this.detail.options.props };
      // componentList 模式属性预先加载
      if (this.detail.component.type == cardComponentType.componentList) {
        const props = (await componentGetter(this.detail.component))?.settingDetail?.props;
        for (let x in props) {
          this.componentsPropsInputTemplate.push({
            key: x,
            ...props[x],
          });
        }
      }

      // 获取组件布局信息
      this.componentsGridInfo = { ...this.detail.gridInfo };

      // 获取当前组件模式
      this.cardComponentDetail = { ...this.detail.component };
      // 检查组件加载模式，设置fromData组件的初始值（假如为空）
      if (!this.cardComponentDetail.data || this.cardComponentDetail.data == "") {
        this.cardComponentDetail.data = `{
      setup(props) {
        const name = ref('小米')
        return { name }
      },
      render() {
        return h('div', { style: { fontSize: '24px' } }, '你好' + this.name)
      }
    }`;
      }

      this.$forceUpdate();
    },

    /**
     * @name: componentLoaderChange
     * @description: 判断组件加载状态&&加载模式，更新组件props输入表单
     * @authors: CZH
     * @Date: 2022-06-28 21:55:51
     */
    async componentLoaderChange() {
      const { cardComponentDetail } = this;
      let cardComponent = await componentGetter(cardComponentDetail);

      console.log(cardComponentDetail,'asdasdasd',cardComponent)

      // 根据不同的组件加载模式执行对应的检查方式
      switch (cardComponentDetail.type) {
        case cardComponentType.componentList:
          // 重置输入模板
          this.componentsPropsInputTemplate = [];
          await this.$nextTick();
          for (let x in cardComponent.settingDetail.props) {
            this.componentsPropsInputTemplate.push({
              key: x,
              ...cardComponent.settingDetail.props[x],
            });
          }
          break;
        case cardComponentType.fromData:
          break;
        case cardComponentType.cusComponent:
          break;
      }
    },

    /**
     * @name: open
     * @description: 载入组件数据，之后打开编辑窗口
     * @authors: CZH
     * @Date: 2022-06-28 21:53:14
     */
    async open() {
      await this.getPropsData();
      await this.componentLoaderChange()
      await this.$nextTick();
      this.modalControl.isOpen = true;
    },

    /**
     * @name: close
     * @description: 关闭组件编辑窗口，回填编辑后？的组件数据，目前版本会导致所有的组件重新加载
     * @authors: CZH
     * @Date: 2022-06-28 21:49:58
     * @param {*} needSave
     */
    async close(needSave = false) {
      if (needSave) {
        const gridList = [...this.gridList];
        gridList[this.componentIndex] = {
          ...this.detail,
          options: {
            ...this.detail.options,
            props: {
              ...this.detail.options.props,
              ...this.componentsProps,
            },
          },
          component: {
            ...this.detail.component,
            ...this.cardComponentDetail,
          },
          gridInfo: {
            ...this.detail.gridInfo,
            ...this.componentsGridInfo,
          },
        } as cardComponent;
        this.$emit("onChange", this.componentIndex, gridList);
      }
      this.modalControl.isOpen = false;
    },

    // 一个无用的函数
    fuckNothing() { },
  },
});
</script>

<style lang="scss" scoped>
.baseModal {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
  opacity: 0.7;
  top: 0px;
  left: 0px;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.05);
  transition: all 0.5s;
  display: flex;
  justify-content: center;

  .formModalBox {
    transform: scale(0.4);
  }
}

.open {
  opacity: 1;
  z-index: 100000;
  transform: translate(0%);

  .formModalBox {
    transform: scale(1);
  }
}

.close {
  transform: translateX(100vw);
}

.formModalBox {
  transition: all 0.4s;
  position: absolute;
  width: 80%;
  top: 10%;
  height: 80%;
  min-width: 800px;
  max-width: 1400px;
  border-radius: 12px;
  background: #fefefe;
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 1;

  .card {
    width: calc(100% - 20px);
    height: auto;
    margin: 10px;
    border-radius: 6px;
    text-align: left;
  }

  .BtnList {
    position: relative;
    text-align: left;
    bottom: 12px;
    width: 100%;
    right: 12px;
    width: auto;
    height: auto;
    margin-top: 30px;

    .btn {
      margin-right: 12px;
    }
  }
}

.cm-s-xq-dark .CodeMirror-line::selection,
.cm-s-xq-dark .CodeMirror-line>span::selection,
.cm-s-xq-dark .CodeMirror-line>span>span::selection {
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
</style>
