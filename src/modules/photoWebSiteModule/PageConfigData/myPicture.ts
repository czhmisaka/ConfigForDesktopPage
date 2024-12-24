/*
 * @Date: 2023-06-20 16:46:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-10 23:19:26
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\myPicture.ts
 */
import {
    cardComponentType,
    cardOnChangeType,
    gridCellMaker,
    gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { InfoCardBtnList, 打包成册, 批量下载, 移出处理区 } from "./InfoCardBtnList";
import { post } from "@/utils/api/requests";
import { useCartHook } from "@/store/modules/cart";
import { setPosition } from "@/components/basicComponents/grid/module/util";
import { setSize } from "../../../components/basicComponents/grid/module/util";
import { setData } from "@/components/basicComponents/grid/module/cardApi";
import { useUserStoreHook } from "@/store/modules/user";
import {
    btnMaker,
    doubleCheckBtnMaker,
    repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { btnActionTemplate } from "@/modules/userManage/types";
import { 添加图片到图集 } from "./managerOnly/loraServer/imgFolder";

export const myPicture = async () => {
    let user = useUserStoreHook();
    let options = await user.getOptions();
    const 删除 = btnMaker("删除", btnActionTemplate.Function, {
        icon: "Delete",
        elType: "danger",
        isShow: (data) => {
            return options.status == "webmaster" && data && data["path"];
        },
        function: async (that, data) => {
            if (await doubleCheckBtnMaker("删除图片", data.file).catch(() => false)) {
                let res = await post('/piwigo', {
                    method: "pwg.images.delete",
                    image_id: data.id,
                    pwg_token: (await useUserStoreHook().getOptions())["pwg_token"],
                });
                repBackMessageShow(that, res);
            }
        },
    });
    const 批量删除 = btnMaker("批量删除", btnActionTemplate.Function, {
        icon: "Delete",
        elType: "danger",
        isShow: (data) => {
            return (
                options.status == "webmaster" &&
                data &&
                data["length"] &&
                data["length"] > 0
            );
        },
        function: async (that, data) => {
            if (
                await doubleCheckBtnMaker(
                    "删除图片",
                    `【${data.map((x) => x.file).join("】【")}】`
                ).catch(() => false)
            ) {
                let res = await post('/piwigo', {
                    method: "pwg.images.delete",
                    image_id: data.map((x) => x.id),
                    pwg_token: (await useUserStoreHook().getOptions())["pwg_token"],
                });
                repBackMessageShow(that, res);
            }
        },
    });
    return [
        gridCellMaker(
            "waterFall",
            "瀑布流图片展示功能",
            {},
            {
                name: "photoWebSiteModule_waterfall",
                type: cardComponentType.componentList,
            },
            {
                props: {
                    watchKey: ["category", "collection", "query"],
                    startSearch: true,
                    getFunc: async (that, data) => {
                        const { offset, limit } = data;
                        let res = await useCartHook().getCart();
                        return res;
                    },
                },
            }
        )
            .setPosition(0, 0)
            .setSize(10, 12),
        gridCellMaker(
            "icon",
            "清空按钮",
            {},
            {
                type: cardComponentType.componentList,
                name: "icon",
            },
            {
                showInGridDesktop: true,
                props: {
                    name: "Delete",
                    onClickFunc: async ({ props, context, e }) => {
                        if (await doubleCheckBtnMaker("清空暂存区", "确认要清空所有图片吗").catch(() => false)) {
                            useCartHook().clearCart();
                            location.reload();
                        }
                    },
                },
            }
        )
            .setSize(1, 1)
            .setPosition(10, 0),
        gridCellMaker(
            "loadingProgress",
            "下载进度条",
            {},
            {
                type: cardComponentType.componentList,
                name: "photoWebSiteModule_loadingProgress",
            },
            {
                showInGridDesktop: false,
                props: {
                    percentage: 10,
                },
            }
        )
            .setSize(1, 1)
            .setPosition(11, 0),
        gridCellMaker(
            "InfoCard",
            "图片信息",
            {},
            {
                type: cardComponentType.componentList,
                name: "photoWebSiteModule_infoCard",
            },
            {
                props: {
                    btnList: [移出处理区, 打包成册, 批量下载,添加图片到图集, 批量删除, 删除],
                    watchKeyForCategory: "category",
                },
            }
        )
            .setPosition(10, 1)
            .setSize(2, 11),
    ] as gridCellTemplate[];
};