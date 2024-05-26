<!--
 * @Date: 2022-10-20 21:59:36
 * @LastEditors: CZH
 * @LastEditTime: 2024-05-14 22:14:24
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/upload.vue
-->
<template>
  <cardBg>
    <div class="box">
      <el-upload style="width:100%;height;100%" v-model:file-list="fileList" :on-change="handleChange" :auto-upload="true"
        :data="data" :action="action" :on-success="success" multiple :headers="headers">
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
import { post } from "@/utils/api/requests";
import { getPreUrl } from '../../../utils/api/requests';
import { getHeaders } from '../../../utils/api/user/header';

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
  props: ["action", "sizeUnit", "onClickFunc", "tips", "detail", "baseData"],
  data() {
    return {
      Upload,
      fileList: [],
      data: { },
      timeCheckToRestore: null,
      action: getPreUrl() + '/admin/picture/pictureInfo/upload',
      // action:getPreUrl()+'/admin/base/comm/upload',
      headers: {
        ...getHeaders(),
        'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundary6gdw9ktqWd9RaXF9' 
      }
    };
  },
  mounted() {
    this.$emit("ready");
  },

  methods: {
    async success(e) {
      ElMessage.success("上传成功" + JSON.stringify(e));
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
