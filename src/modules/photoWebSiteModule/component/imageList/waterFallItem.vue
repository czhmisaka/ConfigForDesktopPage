<!--
 * @Date: 2023-01-26 09:47:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-20 06:57:52
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageList/waterFallItem.vue
-->

<script lang="ts">
import { defineComponent, h, ref, onMounted, watch } from "vue";
import { useDark } from "@pureadmin/utils";
import { ElImage, ElLoading } from "element-plus";

import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";

export default defineComponent({
  name: "waterFallItem",
  props: ["url", "width", "height", "cusStyle", "item", "noPreview", "fit", "noTitle"],

  setup(props, context) {
    const { isDark } = useDark();
    const isLoading = ref(true);
    const randomClass = "asd" + Math.floor(Math.random() * 100000000000000) + "_";
    let load = ref(null);
    onMounted(() => {
      load.value = ElLoading.service({
        target: "." + randomClass,
      });
    });
    return () =>
      h(
        "div",
        {
          class: randomClass,
          style: {
            float: "left",
            width: props.width ? props.width + "px" : "100%",
            height: props.height ? props.height + "px" : "",
            ...props.cusStyle,
            display: "inline-block",
          },
        },
        [
          h(ElImage, {
            style: {
              width: "100%",
              height: "100%",
              borderRadius: "3px",
            },
            draggable: false,
            src: props.url,
            teleported: true,
            fit: props.fit ? props.fit : "cover",
            previewSrcList: props.noPreview
              ? []
              : [`/imageserver/` + props.item.origin.path],
            onLoad: (e) => {
              isLoading.value = false;
              if (load.value) {
                load.value.close();
              }
            },
          }),
          !props.noTitle
            ? h(
                "div",
                {
                  style: {
                    height: "40px",
                    width: "calc(100% - 12px)",
                    position: "relative",
                    marginTop: "-8px",
                    color: isDark.value ? "white" : "#333",
                    padding: "0px 6px ",
                  },
                },
                [
                  h(
                    "div",
                    {
                      style: {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    },
                    props.item.file
                  ),
                  h(
                    "div",
                    {
                      style: {
                        color: "#666",
                        lineHeight: "12px",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    },
                    [
                      props.item?.origin
                        ? `${props.item.origin.width}px * ${props.item.origin.height}px`
                        : "",
                    ]
                  ),
                ]
              )
            : [],
        ]
      );
  },
});
</script>

<style scoped></style>
