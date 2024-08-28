<!--
 * @Date: 2024-04-18 19:01:03
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-26 17:55:59
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/talkBox/docBox.vue
-->

<template>
    <cardBg :cus-style="{
        borderRadius: '8px',
        filter: 'none',
    }">
        <div class="header_bar">
            <div class="mainColor"></div>
            <div class="title">
                知识来源
            </div>
        </div>
        <div class="question" v-if="cell && (docListLocal ? docListLocal : []).filter(Boolean).length != 0">
            <div class="word">
                {{ cell.question }}
            </div>
            <div class="block">
                {{ docListLocal && docListLocal.filter(Boolean).length > 0 ? docListLocal.length : 0 }}
            </div>
        </div>
        <el-scrollbar ref="mainBox">
            <div :style="{
                display: 'inline-block',
                width: '100%',
                height: 'auto',
                paddingBottom: '120px'
            }">
                <div class="centerImg" v-if="(docListLocal ? docListLocal : []).filter(Boolean).length == 0">
                    <!-- <img :src="empty" /> -->
                    暂无
                </div>
                <div v-for="item in (docListLocal ? docListLocal : []).filter(Boolean)" class="card"
                    @click="goDetail(item.code, item.fileType)">
                    <div class="title">{{ item.title }}</div>
                    <div class="text">{{ item.text }}</div>
                    <div class="score">相关度：{{ Math.round(item.score * 100) }}%</div>
                </div>
            </div>
        </el-scrollbar>
    </cardBg>
</template>

<script lang="ts">
import { componentInfo, gridSizeMaker } from '@/components/basicComponents/grid/module/dataTemplate';
import { defineComponent } from 'vue'
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { cacheStore } from '../../../../../store/modules/cache';
import background from '@/modules/knowledge/assets/logo/image.png';
import { docDataTemplate } from './index';
import { get } from '@/utils/api/requests';
import { hasAuth } from '@/router/utils';

export default defineComponent({
    components: { cardBg },
    componentInfo: {
        labelNameCN: "文档列表",
        key: "docBox",
        description:
            "文档列表",
        gridInfo: {
            middle: gridSizeMaker(4, 8),
        },
    } as componentInfo,
    props: ['docList', 'cell'],
    mounted() {
        this.$emit('ready')
    },
    data() {
        return {
            docListLocal: []
        }
    },
    watch: {
        docList: {
            handler(newVal) {
                if (newVal) this.checkDocList(newVal)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        async checkDocList(docList: docDataTemplate[]) {
            this.docListLocal = []
            docList.map(async (x) => {
                this.docListLocal.push(x)
            })
        },
        goDetail(code, fileType) {
            let openUrl = ''
            if (code.indexOf('http') == 0) {
                window.open(code.replace('0.73.153.150', '0.73.150.150'))
                // return ''
                openUrl = window.location.origin + window.location.pathname + '#/previewPage?fileType=' + fileType + '&url=' + Base64.encode(code.replace('0.73.153.150', '0.73.150.150'))
            } else {
                openUrl = window.location.origin + window.location.pathname + '#/previewPage?code=' + encodeURI(code) + '&fileType=' + fileType
            }
            window.open(openUrl)
        },
    },
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
        width: 2px;
        height: 16px;
        background-color: var(--el-menu-active-color);
        margin-right: 24px;
        margin-top: 16px;
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

.question {
    text-wrap: nowrap;
    align-items: center;
    border-bottom: .5px solid #273a5b26;
    display: flex;
    font-size: 14px;
    font-weight: 400;
    height: 51px;
    letter-spacing: 0;
    line-height: 60px;
    margin: 49px 12px 0px 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 24px);

    .word {
        text-overflow: ellipsis;
        overflow: hidden;
        color: #273A5B80 !important;
    }


    .block {
        background: #273a5b1a;
        font-size: .8em;
        height: 14px;
        line-height: 14px;
        padding: 0 4px;
        position: relative;
        margin-left: 6px;
        width: 14px;
    }
}

.centerImg {
    height: 258px;
    width: 100%;
    margin-top: -50%;
    top: 50%;
    position: absolute;
}

.card {
    padding: 12px;
    cursor: pointer;

    .title {

        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
        text-align: justify;
        /* 浏览器可能不支持 */
        display: flex;
        align-items: center;
        letter-spacing: 0px;

        font-variation-settings: "opsz" auto;
        color: #3B80FD;

        z-index: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
    }

    .text {

        font-family: PingFang SC;
        font-size: 14px;
        font-weight: normal;
        line-height: 24px;
        text-align: justify;
        /* 浏览器可能不支持 */
        display: flex;
        align-items: center;
        letter-spacing: 0px;

        font-variation-settings: "opsz" auto;
        color: #273A5B;

        z-index: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
    }

    .score {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
        display: flex;
        align-items: center;
        letter-spacing: 0px;

        color: #273A5B;

        z-index: 2;
    }
}
</style>