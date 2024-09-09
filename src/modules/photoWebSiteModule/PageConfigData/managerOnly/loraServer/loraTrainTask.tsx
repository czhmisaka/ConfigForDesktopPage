/*
 * @Date: 2024-09-09 14:28:04
 * @LastEditors: CZH
 * @LastEditTime: 2024-09-09 15:16:16
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/loraServer/loraTrainTask.tsx
 */

import { gridCellMaker, cardComponentType, gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { SearchCellStorage, disabledCell, searchCell, showCell, staticSelectCell, tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { formInputType, showType } from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import { ElTag } from "element-plus";

let status = {
    'inQueue': 'inQueue',
    'running': 'running',
    'success': 'success',
    'fail': 'fail',
    'preEdit': 'preEdit',
}

export const loraTrainTaskStorage_lora训练任务字段库 = new SearchCellStorage([
    tableCellTemplateMaker('任务名称', 'name'),
    // tableCellTemplateMaker('truePath', 'truePath'),
    tableCellTemplateMaker('基础模型', 'baseModel'),
    tableCellTemplateMaker('训练次数', 'trainTimes', searchCell(formInputType.number)),
    tableCellTemplateMaker('当前状态', 'status', {
        ...staticSelectCell(status),
        ...disabledCell(),
        ...showCell(showType.funcComponent, {
            showFunc: (data, key) => {
                const statusType = {
                    'inQueue': 'default',
                    'running': 'primary',
                    'success': 'success',
                    'fail': 'danger',
                    'preEdit': 'info',
                }
                let statusTag = {
                    'inQueue': '在等待队列中',
                    'running': '运行中',
                    'success': '训练成功',
                    'fail': '训练失败',
                    'preEdit': '编辑中',
                }
                return <ElTag type={statusType[data[key]]}>{statusTag[data[key]]}</ElTag>
            }
        })
    }),
    tableCellTemplateMaker('当前进度', 'processing',),
    tableCellTemplateMaker('参数', 'options'),
    tableCellTemplateMaker('loraServerId', 'loraServerId'),
    tableCellTemplateMaker('训练服务器', 'loraServer'),
    tableCellTemplateMaker('train', 'trainId'),
])



export const loraTrainTaskManage = async () => {
    return [
        gridCellMaker(
            "searchTable",
            "搜索结果列表",
            {},
            {
                name: "userManage_searchTable",
                type: cardComponentType.componentList,
            },
            {
                props: {
                    searchItemTemplate: [],
                    showItemTemplate: [],
                    searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
                        let res = await post("/admin/picture/lora/server/list", {});
                        return res.data;
                    },
                    btnList: [],
                    cantSelect: true,
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[];
};
