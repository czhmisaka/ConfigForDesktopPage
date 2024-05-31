/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-05-30 21:36:02
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/pictureListManage.ts
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
import { btnActionTemplate, drawerProps } from "@/modules/userManage/types";
import { SearchCellStorage, tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";

export const PictureListManage = async () => {
    const photoInfoStorage = new SearchCellStorage([
        tableCellTemplateMaker('图片名称', 'name'),
        tableCellTemplateMaker('图片地址', 'url'),
        tableCellTemplateMaker('图片类型', 'type'),
        tableCellTemplateMaker('图片宽', 'width'),
        tableCellTemplateMaker('图片高', 'height'),
        tableCellTemplateMaker('图片大小', 'size'),
        tableCellTemplateMaker('图片描述', 'description'),
        tableCellTemplateMaker('经度', 'longitude'),
        tableCellTemplateMaker('纬度', 'latitude'),
        tableCellTemplateMaker('md5', 'md5'),
        tableCellTemplateMaker('上传者', 'uploader'),
        tableCellTemplateMaker('作者', 'author'),
        tableCellTemplateMaker('评分', 'score'),
    ])
    return [
        gridCellMaker('searchTable', 'searchTable', {}, {
            name: "userManage_searchTable",
            type: cardComponentType.componentList,
        }, {
            props: {
                searchItemTemplate: [],
                showItemTemplate: photoInfoStorage.getAll(),
                searchFunc: async (query, that) => {
                    let res = await post("/admin/picture/pictureInfo/search", {});
                    return res.data;
                },
                defaultQuery: {
                    showLink: null,
                },
                btnList: [],
                autoSearch: false,
                modeChange: true,
                isCard: false,
            }
        }).setPosition(0, 1).setSize(12, 11),
        gridCellMaker(
            "upload",
            "上传",
            {},
            {
                type: cardComponentType.componentList,
                name: "photoWebSiteModule_upload",
            },
            {}
        )
            .setPosition(0, 0)
            .setSize(1, 1),

    ] as gridCellTemplate[];
};
