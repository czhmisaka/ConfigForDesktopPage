/*
 * @Date: 2023-02-16 23:41:40
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-25 22:16:55
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/InfoCardBtnList.ts
 */
import {
    btnMaker,
    repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
    btnActionTemplate,
    drawerProps,
    formInputType,
} from "@/modules/userManage/types";
import { tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { searchCell } from "../../userManage/component/searchTable/searchTable";
import { chat, post } from "@/utils/api/requests";
import { openDrawerFormEasy } from "../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";
import { useCartHook } from "@/store/modules/cart";
import axios from "axios";
import FileSaver from "file-saver";
import JSZip from "jszip";
import { ElLoading, ElLoadingService, ElMessage, ElMessageBox } from "element-plus";
import { deepClone } from '../../../utils/index';
import {
    changeCardProperties,
    changeVisible,
    refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi";

//批量
function getFile(url) {
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url,
            responseType: "blob",
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error.toString());
            });
    });
}
function download(currentChooseImgList, that: any) {
    if (currentChooseImgList.length === 0) {
        ElMessage.warning('请先勾选需要下载的图片!')
        return;
    }
    //多张图片下载成压缩包
    const zip = new JSZip();
    const promises = [];
    const cache = {};
    let num = 0;
    for (const item of currentChooseImgList) {
        const promise = getFile(item.pictureUrl).then((data) => {
            // 下载文件, 并存成ArrayBuffer对象
            // const file_name = item.realName // 获取文件名
            zip.file(item.pictureName, data, { binary: true }); // 逐个添加文件，需要加后缀".png"
            cache[item.pictureName] = data;
            num++;
            changeCardProperties(that, {
                loadingProgress: {
                    percentage: Math.round((num / currentChooseImgList.length) * 99),
                },
            });
        });
        promises.push(promise);
    }
    changeVisible(that, { loadingProgress: true });
    changeCardProperties(that, { loadingProgress: { percentage: 0 } });
    Promise.all(promises)
        .then(() => {
            zip.generateAsync({ type: "blob" }).then((content) => {
                // 生成二进制流
                FileSaver.saveAs(content, "图片"); // 利用file-saver保存文件  自定义文件名
                changeCardProperties(that, {
                    loadingProgress: { percentage: 100 },
                });
                ElMessage.success("图片下载完成");
                changeVisible(that, { loadingProgress: false });
                setTimeout(() => {
                    changeCardProperties(that, {
                        loadingProgress: { percentage: 0 },
                    });
                }, 299);
            });
        })
    // .catch((res) => {
    //     ElMessage.warning("文件下载失败!");
    // });
}

const 提交 = btnMaker("确定", btnActionTemplate.Function, {
    elType: "primary",
    icon: "Position",
    function: async (that, data) => {
        let res = await post('/admin/picture/collection/addPicture', {
            pictureIds: that.plugInData.data.pictureIds,
            collectionId: data.collectionId,
        })
        repBackMessageShow(that, res);
    },
});

export const 收藏按钮 = btnMaker("收藏", btnActionTemplate.Function, {
    elType: "primary",
    icon: "CollectionTag",
    function: async (that, data) => {
        console.log(data.id ? [data.id] : data.map((x) => x.id))
        const pictureIds = data.id ? [data.id] : data.map((x) => x.id)
        let drawerProps = {
            title: "选择收藏夹",
            queryItemTemplate: [
                tableCellTemplateMaker(
                    "收藏夹",
                    "collectionId",
                    searchCell(formInputType.searchList, {
                        propertiesOption: {
                            type: "number",
                        },
                        funcInputOptionsLoader: async (that) => {
                            let attr = {
                                multiple: false,
                            };
                            attr["remoteMethod"] = async (query) => {
                                let res = await post("/admin/picture/collection/tree", {});
                                return res.data.map(x => {
                                    return {
                                        ...x,
                                        label: x.name,
                                        value: x.id,
                                    }
                                });
                            };
                            return attr;
                        },
                    })
                ),
            ],
            data: {
                pictureIds,
            },
            btnList: [提交],
        } as drawerProps;
        openDrawerFormEasy(that, drawerProps);
    },
});

const 提交标签绑定 = btnMaker("提交", btnActionTemplate.Function, {
    icon: "Position",
    elType: "primary",
    function: async (that, data) => {
        let { tag_ids } = data;
        let needCreate = tag_ids.filter((x) => !(x * 1));
        let fuckCreate = needCreate.map((x) => {
            return post('/admin/picture/tags/add', {
                name: x,
                description: '暂无'
            })
        });
        Promise.all(fuckCreate).then(async (res) => {
            let tagIds = [
                ...tag_ids.filter((x) => x * 1),
                ...res.map((x) => x.data.id),
            ];
            let PictureRes = await post('/admin/picture/tags/addPicture', {
                pictureIds: that.plugInData.data.pictureIds,
                tagIds
            })
            repBackMessageShow(that, PictureRes);
        });
    },
});

const 标签混选cell = tableCellTemplateMaker(
    "标签",
    "tag_ids",
    searchCell(formInputType.searchList, {
        funcInputOptionsLoader: async (that) => {
            const res = await post('/admin/picture/tags/list', {});
            let tags = res.data;
            let attr = {
                multiple: true,
                "default-first-option": true,
                remoteMethod: async (data) => {
                    if (!data)
                        return tags.map((x) => {
                            return {
                                ...x,
                                value: x.id + "",
                                label: x.name,
                            };
                        });
                    else
                        return [
                            {
                                value: data,
                                label: data,
                            },
                            ...tags
                                .filter((x) => x.name.indexOf(data) > -1)
                                .map((x) => {
                                    return {
                                        ...x,
                                        value: x.id + "",
                                        label: x.name,
                                    };
                                }),
                        ];
                },
            };
            return attr;
        },
    })
);

export const 添加标签按钮 = btnMaker("添加标签", btnActionTemplate.Function, {
    function: async (that, data) => {
        let drawerProps = {
            title: "选择标签",
            queryItemTemplate: [标签混选cell],
            data: {
                pictureIds: data.id ? [data.id] : data.map((x) => x.id),
            },
            btnList: [提交标签绑定],
        } as drawerProps;
        openDrawerFormEasy(that, drawerProps);
    },
});

export const 添加到处理区 = btnMaker(
    "添加到处理区",
    btnActionTemplate.Function,
    {
        icon: "Plus",
        elType: "primary",
        function: async (that, data) => {
            const cart = useCartHook();
            if (data.length && data.length > 0) cart.setCart(data.map((x) => x.id));
            else cart.setCart([data.id]);
        },
    }
);

export const 下载单张 = btnMaker("下载", btnActionTemplate.Function, {
    icon: "Download",
    elType: "info",
    isShow: (data) => {
        return data && data["path"];
    },
    function: async (that, data) => {
        //单张图片下载
        function downloadIamge(imgsrc, name) {
            //下载图片地址和图片名
            var image = new Image();
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);
                var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

                var a = document.createElement("a"); // 生成一个a元素
                var event = new MouseEvent("click"); // 创建一个单击事件
                a.download = name || "photo"; // 设置图片名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
            };
            image.src = imgsrc;
        }
        downloadIamge(data.url.replace('http://127.0.0.1:8001', window.location.origin + '/api/'), data.name);
    },
});

export const 下载多张 = btnMaker("下载", btnActionTemplate.Function, {
    icon: "Download",
    elType: "info",
    isShow: (data) => {
        return data && data["length"] && data["length"] > 0;
    },
    function: async (that, data) => {
        console.log(data);
        download(
            data.map((x) => {
                return {
                    pictureUrl: x.url.replace('http://127.0.0.1:8001', window.location.origin + '/api/'),
                    pictureName: x.name,
                };
            }),
            that
        );
    },
});




export const 打包成册 = btnMaker("打包成册", btnActionTemplate.Function, {
    icon: "Files",
    elType: "primary",
    isShow: (data) => {
        return data && data["length"] && data["length"] > 0;
    },
    function: async (that, data) => {
        ElMessageBox.prompt("输入主题", "Tip", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
        }).then(async ({ value }) => {
            let res1 = await post('/admin/picture/categories/add', {
                name: value
            })
            let res = await post('/admin/picture/categories/addPicture', {
                pictureIds: data.id ? [data.id] : data.map((x) => x.id),
                categoryId: res1.data.id
            })
            repBackMessageShow(that, res)
        });
    },
});

export const 解析图片信息 = btnMaker("解析图片信息", btnActionTemplate.Function, {
    icon: 'Check',
    elType: 'warning',
    function: async (that, data) => {
        console.log(data, 'asd')
        const loading = ElLoading.service({
            lock: true,
            text: "模型处理中",
            background: "rgba(0, 0, 0, 0.7)",
        });
        let res = await post('/admin/picture/pictureInfo/checkPicture', {
            id: data.id,
            model: 'clip'
        })
        let resa = await chat(`${res.data.caption}请把上述内容翻译成中文，并对其适当的扩充，同时在最后用【xxx】、【xx】的格式输出这段话的关键词。(不要输出思考过程)`,"glm-4-flash")
        loading.close()
        ElMessageBox({
            message: resa.data.choices[0].message.content,
            title: '解析结果',
            type: 'success'
        })
    }
})

export const InfoCardBtnList = [
    打包成册,
    收藏按钮,
    添加标签按钮,
    添加到处理区,
    下载单张,
    解析图片信息,
    下载多张,
];

export const 批量下载 = btnMaker("打包下载", btnActionTemplate.Function, {
    icon: "Download",
    elType: "primary",
    function: async (that, data) => {
        let needDownload = [];
        if (!data.length) {
            needDownload = JSON.parse(JSON.stringify(useCartHook().image_id));
        } else {
            needDownload = data.map((x) => x.id);
        }
        let res = await useCartHook().getCartImage(needDownload);
        console.log(data, 'asd', needDownload, res)
        let downloadList = res.map((x, i) => {
            return {
                pictureUrl: x.url.replace('http://127.0.0.1:8001', window.location.origin + '/api/'),
                pictureName: i + 1 + "_" + x.name,
            };
        });
        download(downloadList, that);
    },
});

export const 批量添加标签 = btnMaker(
    "批量添加标签",
    btnActionTemplate.Function,
    {
        icon: "PriceTag",
        elType: "primary",
        function: async (that, data) => {
            let needDeal = [];
            if (!data.length) {
                needDeal = JSON.parse(JSON.stringify(useCartHook().image_id));
            } else {
                needDeal = data.map((x) => x.id);
            }
            let drawerProps = {
                title: "选择标签",
                queryItemTemplate: [标签混选cell],
                data: {
                    image_ids: needDeal,
                },
                btnList: [提交标签绑定],
            } as drawerProps;
            openDrawerFormEasy(that, drawerProps);

            // let res = await useCartHook().getCartImage(0, 10000, needDeal);
        },
    }
);

export const 移出处理区 = btnMaker("移出处理区", btnActionTemplate.Function, {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
        const cart = useCartHook();
        if (data.length && data.length > 0) cart.deleteCart(data.map((x) => x.id));
        else cart.deleteCart([data.id]);
        refreshDesktop(that);
    },
});
