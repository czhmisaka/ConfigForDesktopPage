/*
 * @Date: 2024-02-17 00:19:21
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-14 15:03:58
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/chartCardComponent.tsx
 */
import { gridCellMaker, cardComponentType } from "@/components/basicComponents/grid/module/dataTemplate";
import { IotDeviceGridDesktopCellTemplate, IotDeviceTemplate } from "../iotCard";


/**
 * @name: chartCardComponent
 * @description: 制作一个图表展示组件
 * @authors: CZH
 * @Date: 2024-02-17 00:23:19
 * @param {IotDeviceGridDesktopCellTemplate} gridCell
 * @param {IotDeviceTemplate} IotCardInfo
 */
let fuckNum = 0
export const chartCardComponent = (gridCell: IotDeviceGridDesktopCellTemplate, IotCardInfo: IotDeviceTemplate) => {
    let sendKey = gridCell.sendKey || IotCardInfo.mainTopic
    let name = gridCell.preKey + sendKey + gridCell.type + (fuckNum++)
    let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''
    return gridCellMaker(name, name + gridCell.type, {}, {
        type:cardComponentType.componentList,
        name:'moduleTower_gridLightControl'
    }, {
        props: {
            sendKey,
            preKey,
            ...gridCell.data
        }
    }).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
}