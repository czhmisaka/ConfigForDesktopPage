<!--
 * @Author: czhmisaka
 * @Date: 2024-11-04 02:10:38
 * @FilePath: \github\config-for-desktop-page\src\modules\main\trans.vue
-->
<!--
 * @Date: 2023-12-27 20:42:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-11-04 02:18:55
 * @FilePath: /ConfigForDesktopPage/src/modules/main/Index.vue
-->


<template>
  <div
    :style="{
      width: `calc(100% - ${desktopData.cusStyle.margin})`,
      height: 'calc(100%)',
      background: 'rgba(0,0,0,0)',
      overflow: 'hidden',
    }"
  >
    <gridDesktop
      :grid-col-num="desktopData.gridColNum"
      :desktopData="desktopDataList"
      :component-lists="[]"
      :cus-style="desktopData?.cusStyle"
      :noAnimate="false"
    />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";
import { isValidKey } from "@/utils/index";
import { GetAllUser } from "@/utils/api/user/user";
import { timeConsole } from "@/router/util";
import { getAction, getModuleFromView } from "../../router/util";

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
      componentList: [],
    };
  },
  methods: {
    async init() {
      timeConsole.checkTime("index页面");
      let res = PageConfig["TRANSIMGE"];
      console.log(res,PageConfig)
      this.desktopData = res;
      this.desktopDataList = await this.desktopData.desktopData();
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
    await getModuleFromView(false);
    this.componentList = await getAction().getAllComponents();
    this.init();
  },
  async mounted() {
    // this.init();
  },
});
</script>
