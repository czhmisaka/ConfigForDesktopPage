<!--
 * @Date: 2024-04-23 14:36:31
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-15 10:40:36
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/component/talkTool/menu/historyBox.vue
-->
<template>
    <cardBg :cus-style="{
        borderRadius: '8px',
        filter: 'none'
    }">
        <div class="header_bar">
            <div class="mainColor"></div>
            <div class="title">
                历史对话
            </div>
        </div>
        <el-scrollbar ref="mainBox" class="scrollBox">
            <div :style="{
                display: 'inline-block',
                width: '100%',
                height: 'auto',
                paddingBottom: '120px'
            }">
                <div v-for="(item, index) in historyList">
                    <div v-if="index == 0 && checkNotToday(item)" class="splitHistoryTitle">
                        今天
                    </div>
                    <div class="splitHistoryTitle"
                        v-if="(index == 0 && !checkNotToday(item)) || !checkNotToday(item) && index > 0 && checkNotToday(historyList[index - 1])">
                        本年
                    </div>
                    <historyCell :history="item" @check="check(item)" @edit="edit(item)" @delete="deleteHistory(item)"
                        :nowCheck="nowCheckOne == index">
                    </historyCell>
                </div>
            </div>
        </el-scrollbar>
    </cardBg>
</template>

<script lang="ts">
import { componentInfo, gridSizeMaker } from '@/components/basicComponents/grid/module/dataTemplate';
import { defineComponent } from 'vue'
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { HistoryManage } from '.';
import historyCell from './historyCell.vue';
import { HistoryTemplate } from './index';
import { changeCardProperties } from '../../../../../components/basicComponents/grid/module/cardApi/index';
import { ElMessageBox } from 'element-plus';


export default defineComponent({
    components: { cardBg, historyCell },
    componentInfo: {
        labelNameCN: "历史记录列表",
        key: "historyBox",
        description: "历史记录列表",
        gridInfo: {
            middle: gridSizeMaker(4, 8),
        },
    } as componentInfo,
    data() {
        return {
            historyList: [],
            nowCheckOne: 0,
            timeSetIndex: {}
        }
    },
    props: ['needRefresh', 'detail'],
    watch: {
        needRefresh: {
            handler(val) {
                if (val) {
                    this.initHistory();
                    let data = {}
                    data[this.detail.label] = {
                        needRefresh: false
                    }
                    changeCardProperties(this, data)
                }

            },
        },
    },
    async mounted() {
        this.initHistory();
        this.$emit('ready')
    },
    methods: {
        checkNotToday(historyCell: HistoryTemplate) {
            let date = new Date()
            date.setHours(0, 0, 0, 0)
            return date.getTime() < historyCell.updatedTime
        },

        async initHistory() {
            this.historyList = await HistoryManage.load()
            if (this.historyList.length == 0) {
                await HistoryManage.create('新对话')
                await this.initHistory();
            }
            else {
                await this.check(this.historyList[0])
            }
            this.nowCheckOne = 0
        },

        async check(historyCell: HistoryTemplate) {
            let data = {
                'talkBox': {
                    historyCell: historyCell
                }
            }
            this.nowCheckOne = this.historyList.indexOf(historyCell)
            changeCardProperties(this, data)
        },

        async edit(historyCell: HistoryTemplate) {
            const that = this
            ElMessageBox.prompt('修改对话名称', historyCell.name, {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            }).then(async ({ value }) => {
                await HistoryManage.save({
                    ...historyCell,
                    name: value
                })
                that.historyList = []
                that.initHistory();
            })
        },

        async deleteHistory(historyCell: HistoryTemplate) {
            await HistoryManage.deleteCell(historyCell.sessionId)
            this.initHistory();
        },

    }
})
</script>

<style lang="scss" scoped>
.header_bar {
    background: linear-gradient(327deg, rgba(219, 241, 253, .304) 47%, #bee8ff7a 81%, #e2f5ff7a);
    border-radius: 8px 8px 0 0;
    opacity: 1;
    top: 0px;
    position: absolute;
    width: 100%;
    height: 48px;
    line-height: 48px;

    .mainColor {
        background-color: var(--el-menu-active-color);
        height: 16px;
        margin-right: 13px;
        margin-top: 15px;
        width: 2px;
    }

    .title {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 500;
        line-height: 26px;
        color: #273A5B;
        position: absolute;
        top: 0px;
        height: 48px;
        line-height: 48px;
        text-indent: 20px;
    }
}

.scrollBox {
    height: calc(100% - 50px);
    margin-top: 50px;
}

.splitHistoryTitle {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
    border-bottom: .5px solid #273a5b26;
    width: calc(100% - 48px);
    text-align: left;
    line-height: 50px;
    margin: 0px 24px;
    margin-bottom: 12px;
}
</style>