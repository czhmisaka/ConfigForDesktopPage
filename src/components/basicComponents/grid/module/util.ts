/*
 * @Date: 2022-04-30 14:30:48
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-04 22:35:20
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/util.ts
 */


import { gridCellTemplate, gridSizeMaker } from './dataTemplate';

/**
    * @name: gridPositionByXY
    * @description: 计算并返回grid布局参数
    * @authors: CZH
    * @Date: 2022-04-29 16:11:19
    * @param {*} x
    * @param {*} y
    * @param {*} width
    * @param {*} height
    */
export function gridPositionByXY(
    x: number | gridInfoDefaultOutput,
    y: number,
    width: number,
    height: number,
    options: { [key: string]: any } = {}
) {
    if (typeof x === 'number')
        return {
            gridArea: `${x} / ${y} / ${x + width} / ${y + height}`,
            ...options,
        };
    else {
        return {
            gridArea: `${x.x} / ${x.y} / ${x.x + x.width} / ${x.y + x.height}`,
            zIndex: 99999,
            ...options,
        }
    }
}

export interface gridInfoDefaultOutput {
    x: number,
    y: number,
    width: number,
    height: number,
}

/**
 * @name: outPutPositionAndGridSize
 * @description:  快速获取 x , y , width , height
 * @authors: CZH
 * @Date: 2022-05-04 20:59:29
 * @param {gridCellTemplate} gridCell
 */
export const outPutPositionAndGridSize = (gridCell: gridCellTemplate) => {
    let output: gridInfoDefaultOutput = {
        x: gridCell.gridInfo.default.position.x,
        y: gridCell.gridInfo.default.position.y,
        width: 1,
        height: 1
    }
    if (gridCell.gridInfo.default.size) {
        output.width = gridCell.gridInfo.default.size.width;
        output.height = gridCell.gridInfo.default.size.height;
    } else {
        output = {
            ...gridSizeMaker(2, 2),
            ...output,
        }
    }
    return output
}