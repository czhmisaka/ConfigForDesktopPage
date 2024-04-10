<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-10 23:17:48
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/Index.vue
-->

<template>
  <div :style="{
    width: `calc(100% - ${desktopData.cusStyle.margin})`,
    height: 'calc(100%)',
    background: 'rgba(0,0,0,0)',
    overflow: 'hidden',
  }">
    <gridDesktop v-if="Object.keys(componentList).length > 0" :grid-col-num="desktopData.gridColNum"
      :desktopData="desktopDataList" :component-lists="componentList" :cus-style="desktopData?.cusStyle"
      :noAnimate="true" />
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


