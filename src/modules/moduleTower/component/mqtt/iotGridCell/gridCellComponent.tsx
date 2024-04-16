
/*
 * @Date: 2024-01-25 13:30:19
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-14 15:04:08
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/gridCellComponent.tsx
 */
import { gridCellMaker } from "@/components/basicComponents/grid/module/dataTemplate";
import { IotDeviceGridDesktopCellTemplate, IotDeviceTemplate } from "../iotCard";
import { cardComponentType } from '../../../../../components/basicComponents/grid/module/dataTemplate';
import CardBgVue from "@/components/basicComponents/cell/card/cardBg.vue";
import { ElDivider, ElInput, ElButton, ElSlider } from 'element-plus';
import { defineComponent, markRaw, ref } from "vue";
import { iotCardTitleStyle, pushData } from "./iotGridCell";


let fuckNum = 0
export const sliderComponent = (gridCell: IotDeviceGridDesktopCellTemplate, IotCardInfo: IotDeviceTemplate) => {
    let sendKey = gridCell.sendKey || IotCardInfo.mainTopic
    let name = gridCell.preKey + sendKey + gridCell.type +(fuckNum++)
    let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''
    return gridCellMaker(name, name + gridCell.type, {}, {
        type: cardComponentType.cusComponent,
        data: markRaw(defineComponent({
            props: ['label', 'min', 'max'],
            setup(props, context) {
                context.emit("ready");
                const word = ref('')
                const click = (e) => {
                    pushData(sendKey, preKey + word.value)
                }
                console.log(props, 'props')
                return () => [
                    <CardBgVue cusStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        {props.label ? <div style={{
                            ...iotCardTitleStyle
                        }}>
                            {props.label}
                        </div> : null}
                        <div style="width:calc(100% - 32px);height:auto;margin:0px 16px">
                            <ElSlider vModel={word.value} onChange={click} min={props.min} max={props.max}></ElSlider>
                        </div>
                    </CardBgVue>
                ]
            },
        }))
    }, {
        ...gridCell?.data,
    }).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
}



export const gridLightControlComponent = (gridCell: IotDeviceGridDesktopCellTemplate, IotCardInfo: IotDeviceTemplate) => {
    let sendKey = gridCell.sendKey || IotCardInfo.mainTopic
    let name = gridCell.preKey + sendKey + gridCell.type +(fuckNum++)
    let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''
    return gridCellMaker(name, name + gridCell.type, {}, {
        type: cardComponentType.componentList,
        name: 'moduleTower_gridLightControl'
    }, {
        ...gridCell?.data,
        props: {
            sendKey,
            preKey,
            ...gridCell.data.props
        }
    }).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
}
