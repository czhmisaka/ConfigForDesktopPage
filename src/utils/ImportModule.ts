/*
 * @Date: 2021-12-30 20:04:42
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 21:45:01
 * @FilePath: /configforpagedemo/src/utils/ImportModule.ts
 */

import * as fs from "fs";

/**
 * @name: searchOptions
 * @description: 路径搜索参数单元
 * @authors: CZH
 * @Date: 2021-12-30 20:00:57
 */
export interface searchOptions {
    src: string,
    needDeep?: boolean,
    endTag?: string
}


/**
 * @Author: czh
 * @name: _getPathInfo
 * @Description: Do not show any view
 * @Date: 2021-11-11 16:23:37
 * @param {src:string,needDeep:Boolean,endTag:string}
 * @type {needDeep为是否进行深度搜索,endTag为文件后缀名}
 * @return {*}
 */
const _getPathInfo = (src: string, needDeep: boolean, endTag: string = '.js', pathList: Array<string> = []) => {
    let needSearchList: Array<any> = []
    fs.readdirSync(src, {
        withFileTypes: true
    }).map((x: any) => {
        if (x.isDirectory()) {
            needSearchList.push(src + x.name + '/')
        } else {
            pathList.push(src + String(x.name))
        }
    })
    if (!needDeep) return pathList;
    needSearchList.map(x => [
        pathList = _getPathInfo(x, needDeep, endTag, pathList)
    ])
    return pathList;
}


const searchModulesByPath = (pathList: Array<searchOptions>) => {
    let modules: Array<object> = [];
    if (!pathList || pathList.length == 0) {
        console.error('Api加载错误:【searchApiFromJS】', pathList)
        return new Array<object>();
    }
    pathList.map(x => {
        _getPathInfo(x.src, x.needDeep || false, x.endTag || '.js').map((y) => {
            console.log(y)
            modules.push(require(y))
        })
    })
    return modules;
}

export default {
    searchModulesByPath,
}