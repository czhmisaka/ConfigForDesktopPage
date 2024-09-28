/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-09-28 23:39:33
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/newCategoryManage.ts
 */

import {
    gridCellMaker,
    gridSizeMaker,
    cardComponentType,
    cardOnChangeType,
    gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

import {
    btnMaker,
    closeBtn,
    dobuleCheckBtnMaker,
    openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
    changeVisible,
    changeCardSize,
    changeCardPosition,
    changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, post } from "@/utils/api/requests";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
import { xor } from "lodash";
import { btnActionTemplate, drawerProps, formInputType, showType } from "@/modules/userManage/types";
import { SearchCellStorage, actionCell, searchCell, showCell, tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";


export const 上级相册 = tableCellTemplateMaker("上级相册", "parent", searchCell(formInputType.treeSelect, {
    funcInputOptionsLoader: async (that) => {
        let attr = {
            props: {
                isLeaf: "children",
                label: 'name',
                value: 'id'
            },
            setCheckedKeys:false,
            showCheckbox: false,
            multiple: false,
            type: "number",
            nodeKey: "value",
            checkStrictly: true,
        };
        let res = await post("/admin/picture/categories/tree", {});
        // return topic.triggerTopic;
        let data = res.data
        return {
            ...attr,
            data,
        };
    }
}))

const Storage = new SearchCellStorage([
    tableCellTemplateMaker('相册名称', 'name', showCell(showType.dataKey, {
        width: '300px'
    })),
    tableCellTemplateMaker("分级", "rank"),
    tableCellTemplateMaker("评分", "score"),
    tableCellTemplateMaker("描述", "desc"),
    tableCellTemplateMaker("状态", "status"),
    tableCellTemplateMaker("图片数量", "count"),
    tableCellTemplateMaker("private_user", "private_user"),
    上级相册,
    tableCellTemplateMaker("创建时间", "createTime"),
    tableCellTemplateMaker("updateTime", "updateTime"),
])

export const 新增相册 = btnMaker('新增相册', btnActionTemplate.Function, {
    icon: 'Plus',
    elType: 'success',
    function: async (that, data) => {
        const 提交 = btnMaker('确认', btnActionTemplate.Function, {
            icon: 'Position',
            function: async (that, data) => {
                let res = await post("/admin/picture/categories/add", {
                    ...data, rank: 0
                })
                repBackMessageShow(that, res)
            }
        })
        let drawerProps: drawerProps = {
            title: '新增相册',
            queryItemTemplate: Storage.getByKeyArr(['name', 'desc', 'parent']),
            btnList: [提交]
        }
        openDrawerFormEasy(that, drawerProps)
    }
})


const 删除相册 = btnMaker('删除相册', btnActionTemplate.Function, {
    icon: 'Delete',
    function: async (that, data) => {
        if (await dobuleCheckBtnMaker('删除相册', '确认删除相册【' + data.name + '】吗？').catch(x => false)) {
            let res = await post("/admin/picture/categories/delete", {
                ids: [data.id]
            })
            repBackMessageShow(that, res)
        }
    }
})

const 批量删除相册 = btnMaker('批量删除相册', btnActionTemplate.Function, {
    icon: 'Delete',
    isShow: (data) => {
        return data._selectedList && data._selectedList.length > 0
    },
    elType: 'danger',
    function: async (that, data) => {
        if (await dobuleCheckBtnMaker('批量删除相册', '确认删除选中相册吗？').catch(x => false)) {
            let res = await post("/admin/picture/categories/delete", {
                ids: data._selectedList.map(x => x.id)
            })
            repBackMessageShow(that, res)
        }
    }
})

export const transformDataFromCool = (data: any) => {
    const { pagination, list } = data
    return {
        list: list.filter(x => x.id),
        total: pagination.total,
        pageNumber: pagination.page,
        pageSize: pagination.size,
    }
}


export const CategoryManage = async () => {
    return [
        gridCellMaker('searchTable', 'searchTable', {}, {
            name: "userManage_searchTable",
            type: cardComponentType.componentList,
        }, {
            props: {
                searchItemTemplate: [],
                showItemTemplate: [
                    ...Storage.getByKeyArr([
                        'name', 'desc', 'count', 'score'
                    ]),
                    tableCellTemplateMaker('操作', 'asd', actionCell([删除相册]))
                ],
                searchFunc: async (query, that) => {
                    let res = await post("/admin/picture/categories/tree", {});
                    return res.data;
                },
                defaultQuery: {
                    showLink: null,
                },
                btnList: [新增相册, 批量删除相册],
                autoSearch: false,
                modeChange: true,
                isCard: false,
            }
        }).setPosition(0, 0).setSize(12, 12),
    ] as gridCellTemplate[];
};
