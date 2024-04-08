/*
 * @Date: 2024-01-12 15:14:00
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-08 22:20:21
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/iotGridCell.tsx
 */

import CardBgVue from "@/components/basicComponents/cell/card/cardBg.vue";
import { gridCellMaker, cardComponentType } from "@/components/basicComponents/grid/module/dataTemplate";
import { post } from "@/utils/api/requests";
import { ElButton, ElDivider, ElInput, ElSwitch } from "element-plus";
import { defineComponent, markRaw, ref, reactive, onMounted } from "vue";
import { IotDeviceCellOptionsTemplate, IotDeviceGridDesktopCellTemplate, IotDeviceTemplate } from "../iotCard";
import { gridLightControlComponent, sliderComponent } from "./gridCellComponent";
import progressCard from './progressCard.vue'
import infoNumberCard from './infoNumber.vue'
import streamChartCard from './streamChartCard.vue'

export enum IotDeviceCellGridDesktopType {
    // 文本展示
    infoCard = "infoCard",
    // 数字展示
    infoNumberCard = "infoNumberCard",
    // 图表展示工具
    chartCard = "chartCard",
    // 滑动控制器
    sliderCard = "sliderCard",
    // 按钮控制器
    buttonCard = "buttonCard",
    // 开关控制器
    switchCard = "switchCard",
    // 文本输入
    inputCard = "inputCard",
    // 多选一
    radioCard = "radioCard",
    // 格栅状态展示
    gridStatus = 'gridStatus',
    // 格栅光板控制 ws2812b
    gridLightControl = 'gridLightControl',
    // 进度条
    progressCard = 'progressCard',
    // 流式图表
    streamChart = 'streamChart'
}

export const pushData = async (topic, data) => {
    await post('/admin/iot/mqtt/publish', {
        uniqueId: topic,
        data
    })
}

export const iotCardTitleStyle = {
    textAlign:'left',
    fontWeight: 600,
    fontSize: "1em",
    margin: '3px 6px'
}

import infoCard from '../iotGridCell/infoCard.vue'

// 获取各种iot设备控制面板
export function getIotDeviceCellGridDesktopCardComponent(
    gridCell: IotDeviceGridDesktopCellTemplate,
    IotCardInfo: IotDeviceTemplate
) {
    let sendKey = gridCell.sendKey || IotCardInfo.mainTopic
    let name = gridCell.preKey + sendKey + gridCell.type
    let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''
    let getKey = gridCell.getKey || '';
    gridCell.gridInfo = typeof gridCell.gridInfo === 'string' ? JSON.parse(gridCell.gridInfo) : gridCell.gridInfo;
    let gridCellData = JSON.parse(JSON.stringify(gridCell.data)) || {};
    getKey = getKey.replace('$|mainTopic|', IotCardInfo.mainTopic)

    switch (gridCell.type) {
        case IotDeviceCellGridDesktopType.switchCard:
            return gridCellMaker(
                name,
                name,
                {},
                {
                    type: cardComponentType.cusComponent,
                    data: markRaw(defineComponent({
                        props: ['label'],
                        setup(props, context) {
                            context.emit("ready");
                            const value1 = ref(true)
                            function handleClick(e) {
                                if (e) pushData(sendKey, preKey + 'on')
                                else pushData(sendKey, preKey + 'off')
                            }
                            return () => [<CardBgVue cusStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}>
                                {props.label ? <div style={{
                                    ...iotCardTitleStyle
                                }}>
                                    {props.label}
                                </div> : null}
                                <div style="width:calc(100% - 12px);height:auto;margin:0px 6px;text-align: left;">
                                    <ElSwitch
                                        vModel={value1.value}
                                        size='large'
                                        onChange={handleClick}
                                        style={{
                                            margin: 'auto'
                                        }}></ElSwitch>
                                </div>
                            </CardBgVue>]
                        },
                    })),
                },
                gridCellData
            ).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
        case IotDeviceCellGridDesktopType.buttonCard:
            return gridCellMaker('', '', {}, {
                type: cardComponentType.cusComponent,
                data: markRaw(defineComponent({
                    setup(props, context) {
                        return () => []
                    },
                }))
            }, gridCellData)
        case IotDeviceCellGridDesktopType.inputCard:
            return gridCellMaker(name, name, {}, {
                type: cardComponentType.cusComponent,
                data: markRaw(defineComponent({
                    props: ['label'],
                    setup(props, context) {
                        context.emit("ready");
                        const word = ref('')
                        const click = () => {
                            pushData(sendKey, preKey + word.value)
                        }
                        return () => [<CardBgVue cusStyle={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                            {props.label ? <div style={{
                                ...iotCardTitleStyle
                            }}>
                                {props.label}
                            </div> : null}
                            <div style="width:calc(100% - 12px);height:auto;margin:6px">
                                <ElInput vModel={word.value} >
                                    {{ append: () => <ElButton onClick={click} size='small' icon='position'></ElButton> }}
                                </ElInput>
                            </div>
                        </CardBgVue>]
                    },
                }))
            }, gridCellData).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
        case IotDeviceCellGridDesktopType.infoCard:
            return gridCellMaker(
                name,
                name,
                {},
                {
                    type: cardComponentType.cusComponent,
                    data: markRaw(infoCard)
                },
                {
                    ...gridCell?.data,
                    props: {
                        ...gridCell?.data?.props,
                        getKey,
                        sendKey,
                        name,
                        preKey,
                        IotCardInfo,
                    },
                }
            ).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
        case IotDeviceCellGridDesktopType.sliderCard:
            return sliderComponent(gridCell, IotCardInfo)
        case IotDeviceCellGridDesktopType.gridLightControl:
            return gridLightControlComponent(gridCell, IotCardInfo)
        case IotDeviceCellGridDesktopType.progressCard:
            return gridCellMaker(
                name,
                name,
                {},
                {
                    type: cardComponentType.cusComponent,
                    data: markRaw(progressCard)
                },
                {
                    ...gridCell?.data,
                    props: {
                        ...gridCell?.data?.props,
                        getKey,
                        sendKey,
                        name,
                        preKey,
                        IotCardInfo,
                    },
                }
            ).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
        case IotDeviceCellGridDesktopType.infoNumberCard:
            return gridCellMaker(name, name, {}, {
                type: cardComponentType.cusComponent,
                data: markRaw(infoNumberCard)
            }, {
                ...gridCell?.data,
                props: {
                    ...gridCell?.data?.props,
                    getKey,
                },
            }).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
        case IotDeviceCellGridDesktopType.streamChart:
            return gridCellMaker(name, name, {}, {
                type: cardComponentType.cusComponent,
                data: markRaw(streamChartCard)
            }, {
                ...gridCell?.data,
                props: {
                    ...gridCell?.data?.props,
                    getKey,
                },
            }).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
    }
}
