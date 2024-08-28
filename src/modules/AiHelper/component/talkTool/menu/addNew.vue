<!--
 * @Date: 2024-04-23 15:40:29
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-26 17:47:03
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/menu/addNew.vue
-->

<template>
    <div class="aiChat_cardBg btn" @click="click">
        <div>
            <el-icon style="margin-top: 2px;margin-right: 4px;">
                <CirclePlus />
            </el-icon>
        </div>
        <div>
            新对话
        </div>
    </div>
</template>

<script lang="ts">
import { componentInfo, gridSizeMaker } from '@/components/basicComponents/grid/module/dataTemplate';
import { defineComponent } from 'vue'
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { HistoryManage } from '.';
import { changeCardProperties } from '../../../../../components/basicComponents/grid/module/cardApi/index';

export default defineComponent({
    components: { cardBg },
    componentInfo: {
        labelNameCN: "新增历史记录按钮",
        key: "addNew",
        description: "用于新增一条历史记录，需要搭配talkBox和historyBox一起使用",
        gridInfo: {
            middle: gridSizeMaker(1, 0.5),
        },
    } as componentInfo,
    async mounted() {
        this.$emit('ready')
    },
    methods: {
        async click() {
            const historyCell = await HistoryManage.create('新对话');
            const that = this;
            let data = {
                talkBox: {
                    historyCell
                },
                historyBox: {
                    needRefresh: true
                }
            }
            changeCardProperties(that, data)
        }
    },

})
</script>

<style lang="scss" scoped>
.btn {
    cursor: pointer;
    align-items: center;
    background: linear-gradient(276deg, #3b80fd -22%, #40ffc3);
    border-radius: 4px;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-family: PingFang SC;
    font-size: 16px;
    font-variation-settings: "opsz" auto;
    font-weight: 500;
    justify-content: center;
    flex-flow: row;
    opacity: 1;

    div {
        height: 20px;
        line-height: 20px;
    }
}
</style>