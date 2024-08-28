<!--
 * @Date: 2024-04-23 14:52:00
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-26 17:45:58
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/menu/historyCell.vue
-->
<template>
    <div :class="`mainBox ${nowCheck ? 'isCheck' : ''}`" @click="$emit('check')">
        <div class="leftBox">
            <div class="title">
                <!-- <img class="img" :src="document" alt=""> -->
                {{ history.name }}
                <!-- {{ history.sessionId }} -->
            </div>
            <div class="time">
                {{ new Date((history as HistoryTemplate).updatedTime || (history as
                    HistoryTemplate).createdTime).toLocaleDateString() }}
            </div>
        </div>
        <div class="btnBox">
            <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
                <el-button class="btn" size="small" text icon="edit" @click.stop="$emit('edit')"></el-button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
                <el-button class="btn" size="small" type="danger" text icon="delete"
                    @click.stop="$emit('delete')"></el-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HistoryTemplate } from './index';
export default defineComponent({
    props: [
        'history',
        'nowCheck'
    ],
    data() {
        return {
        }
    },
})
</script>

<style lang="scss" scoped>
.mainBox {
    width: calc(100% - 48px);
    margin: 0px 24px;
    height: 66px;
    display: flex;
    justify-content: space-between;
    transition: all 0.3s;
    background-position-x: -100px;
    padding: 8px;

    .leftBox {
        width: calc(100% - 60px);
        height: 100%;
        text-align: left;

        div {
            height: 25px;
            line-height: 25px;
        }

        .title {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            img {
                float: left;
                height: 24px;
                margin-left: 6px;
                width: 24px;
                margin-right: 7px;
            }
        }

        .time {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: normal;
            color: rgba(39, 58, 91, 0.45) !important;
            margin-left: 36px;
        }
    }

    .btnBox {
        width: 60px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        flex-flow: row nowrap;
        opacity: 0;

        .btn {
            width: 50%;
            height: 50px;
            margin: 0px !important;
        }
    }
}

.isCheck {
    //background: rgba(39, 58, 91, 0.05);
    //background: rgba(255, 255, 255, 0.65);
    //border-radius: 4px;
}

.mainBox:hover {
    background: rgba(213, 231, 251, 0.35);
    color: #3B80FD;
    background-position-x: 0px;

    .btnBox {
        opacity: 1;
    }
}
</style>