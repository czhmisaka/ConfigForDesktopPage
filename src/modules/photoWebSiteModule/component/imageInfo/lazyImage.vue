<!--
 * @Date: 2023-01-26 09:47:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-07 16:10:12
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageInfo/lazyImage.vue
-->

<script lang="ts">
import { defineComponent, h, ref, onMounted, computed, toRefs } from "vue";
import { useDark } from "@pureadmin/utils";
import { ElImage, ElLoading } from "element-plus";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";

export default defineComponent({
  name: "lazyImage",
  props: [
    "baseData",
    "gridList",
    "sizeUnit",
    "detail",
    "cusStyle",
    "item",
    "clickFunc",
    "testProps",
  ],

  propsDetail: {
    cusStyle: { label: "自定义样式", type: inputType.text },
    item: { label: "piwigo图片对象", type: inputType.obj },
    clickFunc: {
      label: "点击事件",
      type: inputType.functionEditor,
    },
  } as propInfo,

  componentInfo: {
    labelNameCn: "懒加载图片",
    key: "lazyImages",
    description: "懒加载图片,如果处于桌面模式，则鼠标悬浮时展示详细信息。",
    gridInfo: {
      middle: gridSizeMaker(1, 1),
    },
  } as componentInfo,

  setup(props, context) {
    const { isDark } = useDark();
    const isLoading = ref(true);
    const randomClass = "asd" + Math.floor(Math.random() * 100000000000000) + "_ asdImg";
    let load = ref(null);
    const sizeMap = ["xxlarge", "large", "medium", "small", "2small"];
    const rate = computed({
      get: () => {
        return (
          (props.detail.gridInfo.default.size.width +
            props.detail.gridInfo.default.size.height) /
          (props.sizeUnit.colNum * 2)
        );
      },
      set: () => {},
    });
    const url = computed({
      get: () => {
        const rate =
          (props.detail.gridInfo.default.size.width +
            props.detail.gridInfo.default.size.height) /
          (props.sizeUnit.colNum * 2);
        let a = 4;
        if (rate > 0) a = 4;
        if (rate > 0.1) a = 3;
        if (rate > 0.2) a = 2;
        if (rate > 0.3) a = 1;
        if (rate > 0.4) a = 0;
        let url = "";
        try {
          url = props.item[sizeMap[a]]?.url;
          if (!url) url = `/imageserver/${props.item["path"].replace("./", "/")}`;
        } catch (e) {}
        return url;
      },
      set: () => {},
    });

    // 鼠标浮动事件
    const { detail, sizeUnit } = toRefs(props);
    const mouseTimeoutController = ref(null);
    const mouseover = (e: any) => {
      console.log(e, "onmouseover");
    };
    const mouseleave = (e: any) => {
      console.log(e, "onmouseout");
    };
    // 鼠标浮动事件结束

    onMounted(() => {
      context.emit("ready");
      load.value = ElLoading.service({
        target: "." + randomClass,
      });
    });
    return () =>
      h(
        cardBg,
        {
          onClick: (e: any) => {
            if (props.clickFunc) props.clickFunc({ props, context });
          },
          cusStyle: {
            transform: props.testProps
              ? `rotateX(10deg) skew(327deg) translate(calc(100 / 24 / 3.3 * ${props.detail.gridInfo.default.size.width}vh), 0%)`
              : "",
          },
          onmouseover: mouseover,
          onmouseleave: mouseleave,
          class: "transform hover",
        },
        () => [
          h(ElImage, {
            class: randomClass,
            style: { width: "100%", height: "100%" },
            src: url.value,
            fit: rate.value > 0.5 ? "contain" : "cover",
            onLoad: (e) => {
              isLoading.value = false;
              if (load.value) {
                load.value.close();
              }
            },
          }),
        ]
      );
  },
});
</script>

<style scoped lang="scss">
.transform {
  transition: all 0.5s;
}
.transform:hover {
  z-index: 10000;
}

.hover {
  box-shadow: inset 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset -0px -0px 0px rgba(255, 255, 255, 0.7), -0px -0px 0px rgba(0, 0, 0, 0.4);
  transition: all 0.4s;
  z-index: 10000;
}
.hover:hover {
  padding: 3px;
  box-shadow: inset 3px 3px 3px rgba(0, 0, 0, 0.3),
    inset -3px -3px 3px rgba(255, 255, 255, 0.7), -3px -3px 12px rgba(0, 0, 0, 0.4);
  .asdImg {
    border-radius: 3px;
    box-shadow: inset -3px -3px 3px rgba(255, 255, 255, 0.7);
  }
}
</style>
