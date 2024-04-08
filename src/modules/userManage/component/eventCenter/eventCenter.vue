<!--
 * @Date: 2023-10-11 16:02:44
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-08 20:43:20
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/eventCenter/eventCenter.vue
-->

<script lang="ts">
import { defineComponent, watch } from "vue";
import {
    componentInfo,
    propInfo,
    gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { eventTriggerType } from './eventCenter';
import { removeGridCell } from '../../../../components/basicComponents/grid/module/cardApi/index';
import { inputType } from '../../../../components/basicComponents/grid/module/dataTemplate';


export default defineComponent({
    componentInfo: {
        labelNameCN: "事件触发器",
        key: "eventCenters",
        description: "一个用于触发事件的工具",
        gridInfo: {
            middle: gridSizeMaker(0, 0),
        },
    } as componentInfo,

    propsDetail: {
        event: {
            label: '事件',
            type: inputType.functionEditor
        },
        triggerType: {
            label: '触发类型',
            type: inputType.text
        },
        stop: {
            label: '停止标识',
            type: inputType.boolean
        },
    } as propInfo,
    props: ['baseData', 'gridList', 'event', 'triggerType', 'stop','sizeUnit'],
    watch: {
        baseData: {
            handler(val) {
                if (this.triggerType == eventTriggerType.onBaseDataChange) { }
            }
        },

    },
    data: () => {
        return {
        }
    },
    async mounted() {
        const that = this
        if (that.triggerType === eventTriggerType.onMounted && that.event && !this.stop) {
            await that.event(that, that.baseData)
        }
        if (that.triggerType === eventTriggerType.windowResize) {
            window.addEventListener('resize', async (e) => {
                await that.event(that, that.baseData)
            })
        }
        this.$emit('ready')
    },
    async unmounted() {
        const that = this
        if (that.triggerType === eventTriggerType.windowResize) {
            window.addEventListener('resize', async (e) => {
                await that.event(that, that.baseData)
            })
        }
    },
})
</script>