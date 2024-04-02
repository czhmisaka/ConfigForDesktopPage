<!--
 * @Date: 2024-02-16 23:07:02
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-25 23:52:33
 * @FilePath: /ConfigForDesktopPage/src/modules/taskList/component/numberCard.vue
-->
<template>
    <CardBg :cusStyle="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }">
        <div :style="iotCardTitleStyle">
            {{ label }}
        </div>
        <div style="
            font-size:1.8em;
            font-weight:200;
            width:calc(100% - 12px);
            height:calc(100% - 30px);
            justify-content: space-between;
            margin:0px 6px;
            display:flex;
            flex-basis: fit-content;
            flex-wrap: wrap;">
            <div> {{ data }}</div>
            <div style="font-size: 0.6em;font-weight: 100;margin-top: 0.7em;">
                {{ suffix }}
            </div>
        </div>
    </CardBg>
</template>
<script lang="ts">
import { componentInfo, gridSizeMaker } from '@/components/basicComponents/grid/module/dataTemplate';
import { defineComponent } from 'vue'
import CardBg from '@/components/basicComponents/cell/card/cardBg.vue';
export default defineComponent({
    components:{CardBg},
    componentInfo: {
        labelNameCN: "数字卡片",
        key: "numberCard",
        description:
            "数字卡片",
        gridInfo: {
            middle: gridSizeMaker(1, 1),
        },
    } as componentInfo,

    props: [
        'label',
        'data',
        'suffix',
        'iotCardTitleStyle'
    ],
    mounted(){
        this.$emit('ready')
    },
    setup() {
        return {}
    }
})
</script>

<style scoped>
.box {
    width: 50%;
    height: auto;
}
</style>