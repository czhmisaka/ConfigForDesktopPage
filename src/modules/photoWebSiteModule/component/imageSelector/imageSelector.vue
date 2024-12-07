<!--
 * @Date: 2024-12-07 23:38:46
 * @LastEditors: CZH
 * @LastEditTime: 2024-12-08 02:23:25
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageSelector/imageSelector.vue
-->


<template>
    <div>
        <Painter :pressure="false" :width="800" :height="600" :maxLine="500" :minLine="1"></Painter>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { componentInfo, gridSizeMaker } from '../../../../components/basicComponents/grid/module/dataTemplate';

export default defineComponent({
    componentInfo: {
        labelNameCN: '图片蒙版',
        label: 'imageSelector',
        description: '通过图片id获取图片，并进行选区',
        gridInfo: { middle: gridSizeMaker(1, 1) }
    } as componentInfo,

    props: ['imageId'],
    components: {  },
    watch: {},

    data() {
        return {}
    },

    methods: {}
})
</script>

<style scoped></style>