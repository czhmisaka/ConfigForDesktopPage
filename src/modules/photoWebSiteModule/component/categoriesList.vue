<!--
 * @Date: 2023-01-20 23:35:00
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-21 15:37:05
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/categoriesList.vue
-->
<!--
 * @Date: 2022-10-20 21:59:36
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-19 23:05:52
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/upload.vue
-->
<template>
  <cardBg>
    <div class="box">
      <el-upload
        style="width:100%;height;100%"
        :action="action ? action : '/api/upload/'"
        :on-success="success"
        multiple
      >
        <el-button :icon="Upload" circle size="large" class="center"> </el-button>
      </el-upload>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Upload } from "@element-plus/icons-vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "categories",
  componentInfo: {
    labelNameCn: "相册列表组件",
    key: "categories",
    description:
      "用于对接某个piwigo - pythonserver 的服务器，展示当前的所有相册列表，并提供部相册的增删功能",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,

  propsDetail: {
    name: {
      label: "name",
      description: "组件名称",
      type: inputType.text,
    },
  },

  baseProps: {},

  components: { cardBg },
  props: ["action", "sizeUnit", "onClickFunc", "tips", "detail"],
  data() {
    return {
      Upload,
      fileList: [],
    };
  },
  mounted() {
    this.$emit("ready");
  },

  methods: {
    success(e) {
      ElMessage.success("上传成功");
    },
  },
});
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
}

.center {
  position: absolute;
  top: 50%;
  margin-top: -1.5em;
}
</style>
