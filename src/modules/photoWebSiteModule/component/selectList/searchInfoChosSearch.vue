<!--
 * @Date: 2023-03-12 23:09:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-16 02:01:37
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\component\selectList\searchInfoChosSearch.vue
-->
<template>
  <cardBg @mouseenter="changeVisiable(true)" @mouseleave="changeVisiable(false)">
    <div
      class="wholeBox"
      :style="{
        lineHeight: size(),
      }"
    >
      <el-input
        :style="{
          height: size(0.6),
          transition: 'width 0.3s',
          width: `calc(80% - ${size(0.2)})`,
        }"
        @keydown.enter.prevent="search"
        v-model="searchString"
        placeholder="请输入..."
      />
      <el-button
        :style="{
          transition: 'all 0.5s',
          height: size(0.6),
          width: `calc(20%)`,
          marginLeft: size(0.2),
          opacity: searchString && searchString.length > 0 ? 1 : 0.2,
        }"
        :loading="loading"
        @click="search"
        type="primary"
      >
        {{ btnName ? btnName : "搜索" }}
      </el-button>
    </div>
    <div
      class="tagBox"
      :style="{
        opacity: isOpen ? 1 : 0,
      }"
    >
      <el-button
        style="margin-left: 0px; margin-right: 3px; margin-bottom: 3px"
        v-for="(item, i) in tags"
        :color="item.color"
        size="small"
        @click="tagClick(item)"
      >
        {{ item.name }}
      </el-button>
      {{preUrl}}
      <el-upload
        class="upload-demo"
        :action="preUrl+`/admin/picture/pictureInfo/searchByPicture`"
        drag
        :data="{}"
        :limit="1"
        :before-upload="searchByImage"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">以图搜图</div>
        <template #file></template>
      </el-upload>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  setData,
  highLightComponent,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post } from "@/utils/api/requests";
import { useUserStoreHook } from "@/store/modules/user";
import { getPreUrl } from "../../../../utils/api/requests";

export default defineComponent({
  name: "searchInfoChosSearch",

  componentInfo: {
    labelNameCn: "混沌搜索用搜索栏",
    key: "searchInfoChosSearch",
    description: "一个非常普通的搜索栏",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,
  propsDetail: {},
  baseProps: {},
  components: { cardBg },

  props: [
    "baseData",
    "sizeUnit",
    "onClickFunc",
    "searchFunc",
    "gridList",
    "btnName",
    "showMoreProps",
    "detail",
    "updateSearch",
  ],
  data: () => {
    return {
      searchString: "食物",
      loading: false,
preUrl:getPreUrl(),
      preGridInfo: {},
      isOpen: false,
      closeBySearch: false,
      tags: [],
      userId: 0,
      token: "",
    };
  },
  async mounted() {
    this.userId = (await useUserStoreHook().getOptions())["id"];
    this.token = (await useUserStoreHook().getOptions())["pwg_token"];
    let res = await post('/piwigo',{ method: "pwg.tags.getList" });
    this.tags = res.result.tags.splice(0, 20);
  },
  methods: {
    changeVisiable(isTrue: boolean) {
      if (this.showMoreProps) {
        let size = this.preGridInfo?.size || this.detail.gridInfo.default.size;
        let position =
          this.preGridInfo?.position || this.detail.gridInfo.default.position;
        if (isTrue) {
          this.preGridInfo = this.detail.gridInfo.default;
          size = {
            width: size.width,
            height: size.height + 6,
          };
          highLightComponent(this, [this.detail.label]);
        } else {
          highLightComponent(this, []);
        }
        // if (isTrue) {
        let posData = {};
        posData[this.detail.label] = position;
        changeCardPosition(this, posData);
        let sizeData = {};
        sizeData[this.detail.label] = size;
        changeCardSize(this, sizeData);
        this.isOpen = isTrue;
        // }
      }
    },

    tagClick(item) {
      this.searchString = item.name;
      this.search();
    },

    searchByImage(data) {
      if (this.updateSearch) {
        this.updateSearch(this, data.data.list);
      }
    },

    /**
     * @name: size
     * @description: 基于sizeUnit.blocksize 计算
     * @authors: CZH
     * @Date: 2023-03-13 00:02:49
     */
    size(num = 1) {
      return this.sizeUnit.blockSize * num + "px";
    },

    /**
     * @name: search
     * @description: 执行搜索
     * @authors: CZH
     * @Date: 2023-03-13 00:35:14
     */
    async search() {
      let { searchString } = this;
      if (searchString && searchString.length > 1) {
        try {
          this.loading = true;
          this.changeVisiable(false);
          await this.searchFunc(this, searchString);
          this.loading = false;
          this.searchString = "";
        } catch {
          this.$message.warning("搜索函数出问题啦！");
        }
      }
    },
  },
  setup(props, context) {
    onMounted(() => {
      context.emit("ready");
    });
    return {};
  },
});
</script>

<style scoped>
.wholeBox {
  width: calc(100%);
  text-align: left;
  padding: 0px 12px;
}
.tagBox {
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: calc(100%);
  padding: 6px;
}
.upload-demo {
  width: 100%;
  line-height: 30px;
  border: 1px #ccc dotted;
  height: 60px;
  border-radius: 6px;
}
</style>
