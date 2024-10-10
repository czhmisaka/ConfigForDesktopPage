<!--
 * @Date: 2023-09-13 14:37:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-11 00:10:17
 * @FilePath: \github\config-for-desktop-page\src\layout\components\modules\modulesLIst.vue
-->
<script setup lang="ts">
import { useModuleHook } from "@/store/modules/module";
import { useUserStoreHook } from "@/store/modules/user";
import { onMounted, reactive } from "vue";
import { toRefs } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const { moduleList, checkModule } = toRefs(useModuleHook());
const { nowModule } = toRefs(useModuleHook());
</script>

<template>
  <cardBg
    :class="`modulesItem ${
      nowModule.name == item.name ? 'modulesItem_active' : ''
    }`"
    :cus-style="{
      display: 'flex',
      backgroundImage: `linear-gradient(135deg, ${
        item.icon && item.icon[0] == '{'
          ? JSON.parse(item.icon).color
          : 'rgba(0,0,0,0.05)'
      } -150%, rgba(0,0,0,0) 50%)`,
      backdropFilter: 'saturate(50%) blur(4px)',
    }"
    v-for="(item, index) in moduleList"
    @click="nowModule.name != item.name ? checkModule(index, '/', true) : ''"
  >
    <!-- <component
      :size="'16px'"
      :style="{ margin: '2px 6px 0px 0px', lineHeight: '1em' }"
      :is="
        useRenderIcon(
          item.icon && item.icon[0] == '{' ? JSON.parse(item.icon) : useRenderIcon(item.icon)
        )
      "
    /> -->
    {{ item.meta.title ? item.meta.title : item.name }}
  </cardBg>
</template>

<style lang="scss" scoped>
.modulesItem {
  margin: 6px 6px;
  padding: 6px 12px;
  width: calc(100% - 12px) !important;
  transition: all 0.3s;
  cursor: pointer;
  font-weight: 600;
  background-repeat: no-repeat !important;
  background-size: 100% !important;
  background-position: -80px !important;
}
.modulesItem:hover {
  background-position: 0px !important;
}
.modulesItem_active {
  background-position: 0px !important;
}
</style>
