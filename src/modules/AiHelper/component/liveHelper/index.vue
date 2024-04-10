<!--
 * @Date: 2024-04-09 14:13:58
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-10 23:11:22
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/liveHelper/index.vue
-->
<template>
    <div class="mainBox" :class="[`${isShow ? '' : 'hide'}`]" @mouseover="mouseHover" @mouseleave="mouseLeave"
        @click="click" v-if="isRealGridDesktop">
        <div class="base body" :style="{
            transform: `translate(${status.bodyPosition.x}px,${status.bodyPosition.y}px)`
        }" alt=""></div>
        <div class="base head" :style="{
            transform: `translate(${status.headPosition.x}px,${status.headPosition.y}px)`
        }">
            <div class="headBg" alt=""></div>
            <div class="eye" :class="[`eye_status_${status.eye}`]" :style="{
                transform: `translate(${status.eyePosition.x}px,${status.eyePosition.y}px)`
            }" alt="">
            </div>
            <div class="info" v-if="showInfo.needShow">
                <cardBg ref="mainBox" :cus-style="{
                    borderRaidus: '12px',
                    padding: '12px'
                }
                    ">
                    <p v-if="showInfo.type == InfoType.word">
                        {{ showInfo.data }}
                    </p>
                </cardBg>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, Transition } from 'vue';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { AiTalkerDrawer, InfoType, InfoCellTemplate } from './TalkerDrawer';

enum roleType {
    'robot' = 'robot',
    'command' = 'command',
    'talkBox' = 'talkBox'
}


function getAllParents(element) {
    let parents = [];
    while (element.parentNode) {
        element = element.parentNode;
        if (element.nodeName !== "#document") { // 排除最顶层的document元素
            parents.push(element);
        }
    }
    return parents;
}

export default defineComponent({
    name: 'liveHelper',
    components: { cardBg },
    props: ["plugInData", "baseData", 'detail'],
    data() {
        return {
            // 确认是否在正确的桌面上
            isRealGridDesktop: true,

            isShow: true,
            role: roleType.robot,
            status: {
                // 眼睛状态
                eye: 'close',
                // 鼠标运动偏移量
                eyePosition: { x: 0, y: 0, },
                headPosition: { x: 0, y: 0 },
                bodyPosition: { x: 0, y: 0 },
            },

            commandStatus: {},

            talkBoxStatus: {},

            // 信息展示状态
            InfoType,
            showInfo: {
                needShow: false,
                type: InfoType.word as InfoType,
                data: null,
                timeOut: 0,
                setTimeOutId: null
            },
        }
    },
    methods: {
        // close gridDesktop 触发modelApi用的
        close(e) {
            this.isShow = false
            this.initRobotStatus()
        },

        // open gridDesktop 触发modelApi用的
        async open() {
            await this.$nextTick();
            this.isShow = true
            this.initRobotStatus()
            const { plugInData } = this
            if (plugInData)
                this.setInfo(plugInData)
        },

        async setInfo(info: InfoCellTemplate) {
            const that = this
            if (that.showInfo.setTimeOutId)
                clearTimeout(that.showInfo.setTimeOutId)
            that.showInfo.data = info.data
            that.showInfo.type = info.type
            that.showInfo.needShow = true
            if (info.timeOut) {
                that.showInfo.setTimeOutId = setTimeout(() => {
                    that.showInfo.needShow = false
                }, info.timeOut * 1000)
            } else {
                that.showInfo.setTimeOutId = setTimeout(() => {
                    that.showInfo.needShow = false
                }, 3000)
            }
        },

        click(e) {
            AiTalkerDrawer(this)
        },

        mouseHover(e) {
            this.status.eye = 'open'
        },

        mouseLeave(e) {
            this.status.eye = 'close'
        },

        initRobotStatus() {
            this.status = {
                // 眼睛状态
                eye: 'close',
                // 鼠标运动偏移量
                eyePosition: { x: 0, y: 0, },
                headPosition: { x: 0, y: 0 },
                bodyPosition: { x: 0, y: 0 },
            }
            this.showInfo.needShow = false;
        }
    },
    async mounted() {
        const parents = getAllParents(this.$el)
        if (parents.length != 10 || parents.map(item => item.className).join().indexOf('drawerForm') != -1)
            this.isRealGridDesktop = false
        // this.isRealGridDesktop = false

        const that = this
        window.addEventListener('mousemove', (e) => {
            const windowWidth = window.screen.width
            const windowHeight = window.screen.height
            const EyeOffsetXY = {
                x: -5 + (e.clientX / windowWidth) * 5,
                y: -5 + (e.clientY / windowHeight) * 5,
            }
            const HeadOffsetXY = {
                x: -3 + (e.clientX / windowWidth) * 6,
                y: -3 + (e.clientY / windowHeight) * 6,
            }
            const BodyOffsetXY = {
                x: -2 + (e.clientX / windowWidth) * 4,
                y: 0
            }
            that.status.eyePosition = EyeOffsetXY
            that.status.headPosition = HeadOffsetXY
            that.status.bodyPosition = BodyOffsetXY
        })
    }
})
</script>

<style lang="scss" scoped>
.mainBox {
    position: fixed;
    right: 0px;
    bottom: 0px;
    z-index: 10000;
    width: 200px;
    height: 200px;
    transform: scale(0.8);
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    .body {
        position: absolute;
        left: 50%;
        margin-left: -40px;
        top: 95px;
        width: 80px;
        height: 80px;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
    }

    .head {
        position: absolute;
        left: 50%;
        margin-left: -60px;
        top: 0px;
        width: 120px;
        height: 100px;
        z-index: 20;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 6px;

        .eye {
            position: absolute;
            left: 50%;
            margin-left: -40px;
            top: 45px;
            width: 80px;
            height: 20px;
            z-index: 30;
            transition: background-size 0.1s ease-in-out;
        }

        .eye_status_open {
            background-image:
                linear-gradient(#fff, #fff),
                linear-gradient(#fff, #fff);
            background-position:
                0px 0px,
                60px 0px;
            background-size:
                20px 20px,
                20px 20px;
            background-repeat: no-repeat;
        }

        .eye_status_close {
            background-image:
                linear-gradient(#fff, #fff),
                linear-gradient(#fff, #fff),
                linear-gradient(#fff, #fff),
                linear-gradient(#fff, #fff);
            background-position:
                5px 0px,
                0px 0px,
                60px 0px,
                55px 0px;
            background-size:
                10px 10px,
                20px 5px,
                10px 10px,
                20px 5px;
            background-repeat: no-repeat;
        }
    }

    .info {
        position: absolute;
        height: auto;
        transform: translateY(calc(-100% - 24px));
        max-width: 430px;
        width: auto;
    }
}

.hide {
    transform: rotateY(90deg);
}

.baseImage {
    width: 100%;
    height: 100%;
}
</style>


<style>
.aiChat_cardBg {
    border-radius: 12px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 6px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.01);
}
</style>