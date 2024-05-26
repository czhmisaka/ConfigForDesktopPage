<!--
 * @Date: 2023-06-27 09:02:02
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-27 09:49:13
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/downloadStatus/loadingProgress.vue
-->
<template>
  <card-bg>
    <div class="mainBox">
      <el-progress
        :type="type || 'circle'"
        :percentage="percentage"
        :status="percentage >= 100 ? 'success' : ''"
        striped
        striped-flow
        :duration="10"
        :width="sizeUnit.blockSize - 6"
      >
      </el-progress>
    </div>
  </card-bg>
</template>

<script lang="ts">
import { Check } from "@element-plus/icons-vue";
import { defineComponent } from "vue";
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
export default defineComponent({
  name: "loadingProgress",
  componentInfo: {
    labelNameCn: "混沌搜索用搜索栏",
    key: "searchInfoChosSearch",
    description: "一个非常普通的搜索栏",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,

  props: ["baseData", "sizeUnit", "gridList", "type", "percentage"],
  data: () => {
    return {
      Check,
    };
  },
  mounted() {
    this.$emit("ready");
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.mainBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 3px;
}
.mainBox > .el-progress-circle {
  height: 100%;
  width: 100%;
}
</style>
