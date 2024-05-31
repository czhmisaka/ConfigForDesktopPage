<!--
 * @Date: 2024-01-27 21:13:58
 * @LastEditors: CZH
 * @LastEditTime: 2024-05-30 19:23:04
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/gridLightControl.vue
-->
<template>
    <cardBg :cus-style="{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-arround',
    }">
        <div class="mainBoard" v-if="mode == 'colorPicker'">
            <div class="colorGrid" v-for="(item, i ) in ControlArr" :style="{
                margin: '0.5px',
                width: `calc(${100 / Math.floor(Math.sqrt(ControlArr.length))}% - 1px)`,
                height: `calc(${100 / Math.floor(Math.sqrt(ControlArr.length))}% - 1px)`,
                backgroundColor: `rgb(${item[0]},${item[1]},${item[2]})`,
                color: `rgb(${255 - item[0]},${255 - item[1]},${255 - item[2]})`,
            }" @click="setColor(color, i)">
            </div>
        </div>
        <div class="mainBoard" v-if="mode == 'imagePicker'">
            <canvas :id="canvas.id" :width="Math.floor(Math.sqrt(ControlArr.length))"
                :height="Math.floor(Math.sqrt(ControlArr.length))"></canvas>
        </div>
        <cardBg class="toolBar">
            <div class="btn">
                <input type="file" accept=".png,.jpg" class="uploadBtn" required @change="upload" multiple />
            </div>
        </cardBg>
        <cardBg class="colorBoard">
            <el-button v-for="c in isUseColors" :color="c" size="small" style="margin-top: 6px" @click="color = c"
                class="colorBox">
            </el-button>
            <el-color-picker v-model="color" color-format="rgb" />
        </cardBg>
    </cardBg>
</template>

<script lang="ts">
import { gridSizeMaker, componentInfo } from '@/components/basicComponents/grid/module/dataTemplate';
import { defineComponent } from 'vue'
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { ElDivider, ElUpload, ElButton } from 'element-plus';
import { pushData } from './iotGridCell';

export default defineComponent({
    componentInfo: {
        labelNameCN: "ws2812灯板控制组件",
        key: "gridLightControl",
        description:
            "ws2812控制用灯板，有回显功能",
        gridInfo: {
            middle: gridSizeMaker(3, 3),
        },
    } as componentInfo,
    components: { cardBg, ElDivider, ElUpload },
    props: [
        'label',
        'sendKey',
        'preKey',
        'size'
    ],
    data: () => {
        return {
            canvas: {
                id: 'canvas',
            },
            ControlArr: [],
            isReady: false,
            color: 'rgb(255, 69, 0)',
            isUseColors: [],
            mode: 'colorPicker' as 'colorPicker' | 'imagePicker'
        }
    },
    watch: {
        ControlArr: {
            handler(val) {
                if (this.isReady) {
                    pushData(this.sendKey, this.preKey + JSON.stringify(val))
                }
            },
            deep: true
        }
    },
    methods: {
        push() {
            pushData(this.sendKey, this.preKey + JSON.stringify(this.ControlArr))
        },

        init(size = 8 * 8) {
            this.isReady = false
            for (let x = 0; x < size; x++) {
                this.ControlArr.push([0, 0, 0])
            }
            this.canvas.id = Math.random().toString(36) + '_' + this.preKey
            this.push()
        },

        upload(e) {
            this.mode = 'imagePicker'
            const that = this
            setTimeout(() => {
                const fileList = e.target.files
                for (let times = 0; times < 2; times++) {
                    for (let i = 0; i < fileList.length; i++) {
                        const file = fileList[i]
                        const image = new Image();
                        const canvas = document.getElementById(that.canvas.id) as any;
                        const ctx = canvas.getContext("2d");
                        image.src = URL.createObjectURL(file);
                        image.onload = function (event) {
                            URL.revokeObjectURL(image.src);
                            canvas.width = image.width;
                            canvas.height = image.height;
                            ctx.drawImage(image, 0, 0);
                            const dataWidth = Math.sqrt(that.ControlArr.length)
                            const step = image.width / dataWidth
                            const firstStep = step / 2
                            for (let y = 0; y < dataWidth; y++) {
                                for (let x = 0; x < dataWidth; x++) {
                                    const color = ctx.getImageData(x * step + firstStep, y * step + firstStep, 1, 1).data;
                                    console.log(color, 'color')
                                    that.ControlArr[y * dataWidth + x] = [0.2 * color[0], 0.2 * color[1], 0.2 * color[2]]
                                }
                            }
                            console.log('pushDatta', that.ControlArr)
                            that.push()
                        }
                    }
                }
            }, 300)

        },

        setColor(color, i) {
            this.ControlArr[i] = color.replace('rgb(', '').replace(')', '').split(',')
            this.push()
        }
    },
    mounted() {
        this.$emit('ready')
        if (this.size)
            this.init(this.size)
        else this.init()
    },
})
</script>

<style lang="scss" scoped>
.toolBar {
    position: absolute;
    top: 0px;
    left: 0px;
    margin: 3px;
    width: calc(20% - 6px) !important;
    height: calc(100% - 6px) !important;
}

.mainBoard {
    position: absolute;
    top: 0%;
    left: 20%;
    width: calc(80% - 24px) !important;
    height: calc(80% - 24px) !important;
    margin: 12px;
    border-radius: 6px;
    overflow: hidden;

    .colorGrid {
        position: relative;
        float: left;
        width: calc(12.5%);
        height: calc(12.5%);
    }
}

.colorBoard {
    position: absolute;
    top: 80%;
    left: 20%;
    margin: 3px;
    width: calc(80% - 6px) !important;
    height: calc(20% - 6px) !important;
}
</style>