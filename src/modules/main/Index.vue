<!--
 * @Date: 2023-12-27 20:42:06
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-17 13:20:10
 * @FilePath: /ConfigForDesktopPage/src/modules/main/Index.vue
-->


<template>
  <div :style="{
    width: `calc(100% - ${desktopData.cusStyle.margin})`,
    height: 'calc(100%)',
    background: 'rgba(0,0,0,0)',
    overflow: 'hidden',
  }">
    <gridDesktop v-if="Object.keys(componentList).length > 0" :grid-col-num="desktopData.gridColNum"
      :desktopData="desktopDataList" :component-lists="[]" :cus-style="desktopData?.cusStyle"
      :noAnimate="false" />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";
import { isValidKey } from "@/utils/index";
import { GetAllUser } from "@/utils/api/user/user";
import { timeConsole } from "@/router/util";
import { getAction, getModuleFromView } from '../../router/util';

export default defineComponent({
  components: {
    gridDesktop,
  },
  data() {
    return {
      desktopDataList: [],
      desktopData: PageConfig[Object.keys(PageConfig)[0]],
      Env: {},
      dataText: "",
      componentList: []
    }
  },
  methods: {
    async init() {
      timeConsole.checkTime("index页面");
      if (this.$route) {
        let PageName = "";
        if (this.$route.meta && this.$route.meta.PageName) {
          PageName = this.$route.meta.PageName.split("/")[
            this.$route.meta.PageName.split("/").length - 1
          ];
          PageName = PageName.toUpperCase();
        } else {
          PageName = String(
            this.$route.path.split("/")[this.$route.path.split("/").length - 1]
          ).toUpperCase();
        }
        if (Object.keys(PageConfig).indexOf(PageName) > -1) {
          let res = PageConfig[PageName];
          this.desktopData = res;
          this.desktopDataList = await this.desktopData.desktopData();
        }
      }
      timeConsole.checkTime("index页面");
    },
  },
  watch: {
    $route: {
      handler(): void {
        this.init();
      },
      deep: true,
    },
  },
  async created() {
    await getModuleFromView(false)
    this.componentList = await getAction().getAllComponents()
    this.init();
  },
  async mounted() {
    // this.init();
  },
});
</script>
