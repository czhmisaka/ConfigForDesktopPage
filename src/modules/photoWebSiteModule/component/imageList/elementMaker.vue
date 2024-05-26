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
} from "@/components/basicComponents/grid/module/cardApi/index";

export default defineComponent({
  name: "elementMaker",

  componentInfo: {
    labelNameCn: "元素制造者",
    key: "elementMaker",
    description: "用来制造一些随机的元素去充满桌面啦",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,
  propsDetail: {},
  baseProps: {},

  props: ["baseData", "sizeUnit", "girdlist"],
  watch: {
    baseData: {
      handler(val) {},
      deep: true,
    },
  },
});
</script>

<style scoped></style>
