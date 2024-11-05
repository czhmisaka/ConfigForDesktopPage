<!--
 * @Date: 2022-10-20 21:59:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-11-04 01:23:36
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\component\upload.vue
-->
<template>
  <cardBg>
    <!-- 
        :data="{ ...data, ...optionsData, categoryId: baseData?.category?.id }" 
     -->
    <div class="box">
      <el-upload
        style="width:100%;height;100%"
        v-model:file-list="fileList"
        :on-change="handleChange"
        :auto-upload="true"
        :show-file-list="false"
        :action="action"
        :on-success="success"
        multiple
        :headers="headers"
      >
        <el-button :icon="Upload" circle size="large" class="center">
        </el-button>
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
import { post } from "@/utils/api/requests";
import { getPreUrl } from "../../../utils/api/requests";
import { getHeaders } from "../../../utils/api/user/header";

export default defineComponent({
  name: "upload",
  componentInfo: {
    labelNameCn: "上传组件",
    key: "upload",
    description: "用于对接某个piwigo - pythonserver 的服务器",
    gridInfo: {
      middle: gridSizeMaker(3, 2),
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
  props: [
    "action",
    "sizeUnit",
    "onClickFunc",
    "tips",
    "detail",
    "baseData",
    "optionsData",
  ],
  data() {
    return {
      Upload,
      fileList: [],
      data: {},
      timeCheckToRestore: null,
      action: getPreUrl() + "/admin/picture/pictureInfo/upload",
      // action:getPreUrl()+'/admin/base/comm/upload',
      headers: {
        ...getHeaders(),
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary6gdw9ktqWd9RaXF9",
      },
    };
  },
  mounted() {
    this.$emit("ready");
  },

  methods: {
    async success(e) {
      const category = this.baseData.category;
      let res = await post("/admin/picture/categories/addPicture", {
        pictureIds: [e.data.id],
        categoryId: category.id,
      });
      if (this.timeCheckToRestore) clearTimeout(this.timeCheckToRestore);
    },

    handleChange(e) {
      console.log(this.fileList);
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
