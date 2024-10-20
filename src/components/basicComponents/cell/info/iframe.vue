<!--
 * @Date: 2022-05-22 18:23:04
 * @LastEditors: CZH
 * @LastEditTime: 2024-10-07 19:12:37
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/cell/info/iframe.vue
-->
<script lang="ts">
import { defineComponent, ref, h, toRefs } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import { changeVisible } from "@/components/basicComponents/grid/module/cardApi";
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { useCardStyleConfigHook } from '../../../../store/modules/cardStyleConfig';

export default defineComponent({
  mixins: [baseComponents],
  props: {
    url: String,
    sizeUnit: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, context) {
    const { url } = toRefs(props);
    context.emit("ready");
    return () => [
      h(
        cardBg,
        {
          style: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRaidus: useCardStyleConfigHook().get('borderRadius'),
          },
        },
        () => [
          h("iframe", {
            style: {
              width: "100%",
              height: "100%",
              border: "none",
              overflow: "hidden",
            },
            src: url.value,
            onLoad: () => {
              context.emit("ready");
            },
          }),
        ]
      ),
    ];
  },
});
</script>
