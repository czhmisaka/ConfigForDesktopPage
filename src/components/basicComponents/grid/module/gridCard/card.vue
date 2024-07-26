<!--
 * @Date: 2022-04-29 15:02:20
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-26 00:20:24
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/module/gridCard/card.vue
-->
<script lang="ts">
import cardBox from "./module/cardBox.vue";
import { getIcon } from "@/utils";
import { defineComponent, h, watch, toRefs, ref, getCurrentInstance } from "vue";
import {
  componentGetter,
  gridCellTemplate,
  CardComponentTemplate,
} from "./../dataTemplate";
import { ElIcon } from "element-plus";
export default defineComponent({
  name: "gridCardBox",
  emits: ["onChange", "openComponentsList"],
  props: {
    componentLists: {
      type: Object,
      default: () => {
        return {} as { [key: string]: CardComponentTemplate };
      },
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
    sizeUnit: {
      type: Object,
      default: () => {
        return {};
      },
    },
    baseData: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },
    gridList: {
      type: Array,
      default: () => {
        return [] as Array<gridCellTemplate>;
      },
    },
  },
  methods: {},
  async setup(props, context) {
    let children = props.detail.options.slots || null;
    let isLoading = ref(true);
    const { sizeUnit, detail } = toRefs(props);

    // 判断动画尺寸
    const editShakeName = (size: { width: number; height: number }): string => {
      const { width, height } = size;
      const big = width > height ? width : height;
      if (big < 4) return "editShakeS_GRID_CARD_BOX";
      if (big < 8) return "editShakeM_GRID_CARD_BOX";
      return "editShakeL_GRID_CARD_BOX";
    };

    // 判断当前组件是否应该显示
    const isShow = () => {
      let back =
        Object.keys(props.detail.options).indexOf("showInGridDesktop") != -1
          ? props.detail.options.showInGridDesktop ? true : false
          : true;
      return back;
    };
    const comp = await (componentGetter(props.detail.component));
    const component = comp.component;
    return () => [
      h(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            userSelect: "none",
            transition: isShow() ? "opacity 0.2s,margin 0.3s !important" : "opacity 0.3,margin 0.2s !important",
            margin: isShow() ? "0px" : "0px 0px 0px -10px",
            opacity: isShow() ? 1 : 0,
            Animation: props.baseData.editable
              ? editShakeName(props.detail.gridInfo.default.size) +
              " 0.3s ease-in-out infinite"
              : "none",
          },
          class: props.detail.options.closeCardAnimate ? "" : "hoverTime",
        },
        [
          isShow()
            ? h(
              "div",
              {
                style: {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  background: "rgba(255,255,255,1)",
                  borderRadius: "12px",
                  zIndex: isLoading.value ? 100000 : -1,
                  display: "flex",
                  opacity: isLoading.value ? 1 : 0,
                },
              },
              [
                h(
                  ElIcon,
                  {
                    style: {
                      top: "50%",
                      left: "50%",
                      margin: "-" + sizeUnit.value.blockSize * 0.25 + "px",
                      fontSize: sizeUnit.value.blockSize * 0.5 + "px",
                    },
                    class: "is-loading",
                  },
                  () => h(getIcon("Loading"))
                ),
              ]
            )
            : null,
          props.baseData.editable && !props?.detail?.options?.isSettingTool
            ? h(cardBox, {
              style: {
                width: "100%",
                height: "100%",
                zIndex:
                  props.baseData.editable && !props?.detail?.options?.isSettingTool
                    ? "100000000000"
                    : "-1",
              },
              blockSize: props.sizeUnit.blockSize,
              detail: props.detail,
              sizeUnit: props.sizeUnit,
              onOnChange: (
                value: { [key: string]: any },
                options: { [key: string]: any }
              ) => {
                context.emit("onChange", value, options);
              },
            })
            : null,
          h(
            component,
            {
              onOnChange: (key: string, value: any, options: { [key: string]: any }) => {
                context.emit("onChange", key, value, options);
              },
              onReady: (e = false) => {
                isLoading.value = e;
              },
              baseData: props.baseData,
              sizeUnit: props.sizeUnit,
              gridList: props.gridList,
              detail: {
                gridInfo: props.detail.gridInfo,
                label: props.detail.label,
                labelNameCN: props.detail.labelNameCN,
                key: props.detail.label,
              },
              ...props.detail.options.props,
            },
            children ? children(props, context) : null
          ),
        ]
      ),
    ];
  },
});
</script>

<style>
@keyframes editShakeL_GRID_CARD_BOX {
  0% {
    transform: rotate(0deg);
  }

  33% {
    transform: rotate(-0.2deg);
  }

  66% {
    transform: rotate(0.2deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes editShakeS_GRID_CARD_BOX {
  0% {
    transform: rotate(0deg);
  }

  33% {
    transform: rotate(-1deg);
  }

  66% {
    transform: rotate(1deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes editShakeM_GRID_CARD_BOX {
  0% {
    transform: rotate(0deg);
  }

  33% {
    transform: rotate(-0.5deg);
  }

  66% {
    transform: rotate(0.5deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>
