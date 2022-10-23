/*
 * @Date: 2022-04-29 14:11:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-23 22:58:33
 * @FilePath: /configforpagedemo/src/router/util.ts
 */
import { menuInfoTemplate } from "./../components/menu/menuConfigTemplate";
import { RouteRecordRaw } from 'vue-router';
import { CardComponentTemplate } from '../components/basicComponents/grid/module/dataTemplate';

/**
 * @name: metaInfoTemplate
 * @description: 路由meta数据控制
 * @authors: CZH
 * @Date: 2022-04-29 14:45:01
 */
export interface metaInfoTemplate {
    menuInfo: {
        asideMenu: boolean | Array<menuInfoTemplate>,
        headerMenu: boolean | Array<menuInfoTemplate>,
    },
    options: {
        [key: string]: any
    }
}

export const noAsideMenu = (options: { [key: string]: any } = {}): metaInfoTemplate => {
    return {
        menuInfo: {
            asideMenu: false,
            headerMenu: true,
        },
        options,
    }
}
export const noMenu = (options: { [key: string]: any } = {}): metaInfoTemplate => {
    return {
        menuInfo: {
            asideMenu: false,
            headerMenu: false,
        },
        options,
    }
}


/**
 * @name: routerCellMaker
 * @description: 路由单元构建函数
 * @authors: CZH
 * @Date: 2022-04-29 14:49:39
 */
export const routerCellMaker = (
    path: string,
    name: string,
    component: any,
    meta: metaInfoTemplate,
    options: { [key: string]: any } = {},
): RouteRecordRaw => {
    let routerCell: RouteRecordRaw = {
        path,
        name,
        component,
        meta: {
            ...meta,
            options,
        }
    }
    return routerCell;
}

export interface modulesCellTemplate {
    name: string,
    path: string,
    routers: RouteRecordRaw[],
    components: CardComponentTemplate[],
    output?: { [key: string]: any },
    baseInfo?: {
        info: string,
        output?: boolean,
        authorize?: string
        fitScreenSize?: string
    },
}

let moduleList = [] as modulesCellTemplate[]
const pageConfigData = '/PageConfigData/'
const component = '/component/'

/**
 * @name: getModuleFromView
 * @description: 从@/modules文件夹中遍历并生成模块文件列表
 * @authors: CZH
 * @Date: 2022-10-23 21:51:34
 * @param {*} basePath
 */
export const getModuleFromView = (init = false, basePath = 'desktop') => {
    if (!init) {
        console.log('asd', moduleList)
        return moduleList;
    }
    moduleList = [] as modulesCellTemplate[];
    const requireModule = require.context(
        '@/modules/',
        true,
    )
    const requireList = requireModule.keys() as string[];
    requireList.map((fileName: string) => {
        if (fileName.split('/').length == 3 && fileName.indexOf('/Index.vue') != -1) {
            const moduleName = fileName.split('./')[1].split('/')[0]
            moduleList.push({
                name: moduleName,
                path: `@/modules/${moduleName}/`,
                components: [],
                routers: [
                    routerCellMaker(`/${basePath}/${moduleName}/:PageName`, moduleName, () => import('../modules/' + moduleName + '/Index.vue'), noMenu())
                ],
            })
        }
    })
    const moduleNameKeyList = moduleList.map((cell: modulesCellTemplate) => cell.name);

    function getKey(routerName: string) {
        return moduleNameKeyList.indexOf(routerName);
    }

    requireList.map((fileName: string) => {
        const moduleName = fileName.split('./')[1].split('/')[0]
        if (fileName.indexOf(component) != -1 && fileName.split(component).length > 1 && fileName.split(component)[1].indexOf('.ts') != -1) {
            const routerName = fileName.split(component)[1].replace('.ts', '');
            console.log(fileName)
            // if (routerName.toUpperCase() != 'index'.toUpperCase()) {
            // }
        }
    })
    return moduleList
}

export default {}