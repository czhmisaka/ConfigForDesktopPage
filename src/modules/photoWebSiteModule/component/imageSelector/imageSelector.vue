<!--
 * @Date: 2024-12-07 23:38:46
 * @LastEditors: CZH
 * @LastEditTime: 2024-12-16 17:40:17
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageSelector/imageSelector.vue
-->


<template>
    <div style="height:100%;overflow:scroll">
        <DrawerCanvasVue></DrawerCanvasVue>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { componentInfo, gridSizeMaker } from '../../../../components/basicComponents/grid/module/dataTemplate';
import DrawerCanvasVue from './DrawerCanvas.vue';
export default defineComponent({
    componentInfo: {
        labelNameCN: '图片蒙版',
        key: 'imageSelector',
        description: '通过图片id获取图片，并进行选区',
        gridInfo: { middle: gridSizeMaker(1, 1) }
    } as componentInfo,

    props: ['imageId'],
    components: {DrawerCanvasVue  },
    watch: {},
    mounted(){
        this.$emit('ready')
    },
    data() {
        return {}
    },

    methods: {}
})
</script>

<style scoped></style>