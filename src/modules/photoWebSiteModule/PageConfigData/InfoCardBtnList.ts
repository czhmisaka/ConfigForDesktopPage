/*
 * @Date: 2023-02-16 23:41:40
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-27 10:24:58
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
import { piwigoMethod } from "@/utils/api/requests";
import { openDrawerFormEasy } from "../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";
import { useCartHook } from "@/store/modules/cart";
import axios from "axios";
import FileSaver from "file-saver";
import JSZip from "jszip";
import { ElMessage } from "element-plus";
import { path } from "path";
import {
  changeCardProperties,
  changeVisible,
} from "@/components/basicComponents/grid/module/cardApi";

const 提交 = btnMaker("确定", btnActionTemplate.Function, {
  elType: "primary",
  icon: "Position",
  function: async (that, data) => {
    let res = await piwigoMethod({
      method: "pwg.collections.addImages",
      ...data,
      image_ids: data.image_ids,
    });
    repBackMessageShow(that, res);
  },
});

export const 收藏按钮 = btnMaker("收藏", btnActionTemplate.Function, {
  elType: "primary",
  icon: "CollectionTag",
  function: async (that, data) => {
    let drawerProps = {
      title: "选择收藏夹",
      queryItemTemplate: [
        tableCellTemplateMaker(
          "收藏夹",
          "col_id",
          searchCell(formInputType.searchList, {
            funcInputOptionsLoader: async (that) => {
              let attr = {
                multiple: false,
              };
              attr["remoteMethod"] = async (query) => {
                const user = useUserStoreHook();
                let options = JSON.parse(
                  JSON.stringify(await user.getOptions())
                );
                let res = await piwigoMethod({
                  method: "pwg.collections.getList",
                  name: query,
                  user_id: options.id,
                });
                return res.result.collections.map((x) => {
                  return {
                    value: x.id + "",
                    label: x.name,
                  };
                });
              };
              return attr;
            },
          })
        ),
      ],
      data: {
        image_ids: data.id ? [data.id] : data.map((x) => x.id),
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
      return piwigoMethod({
        method: "pwg.tags.add",
        name: x,
      });
    });
    Promise.all(fuckCreate).then((res) => {
      let map = [];
      let ids = [
        ...tag_ids.filter((x) => x * 1),
        ...res.map((x) => x.result.id),
      ];
      data.image_ids.map((x) => {
        map.push(
          piwigoMethod({
            method: "pwg.images.setInfo",
            tag_ids: ids.join(","),
            image_id: x,
          })
        );
      });
      Promise.all([map]).then((res) => {
        repBackMessageShow(that, {
          stat: "ok",
        });
      });
    });
  },
});

export const 添加标签按钮 = btnMaker("添加标签", btnActionTemplate.Function, {
  function: async (that, data) => {
    let drawerProps = {
      title: "选择标签",
      queryItemTemplate: [
        tableCellTemplateMaker(
          "标签",
          "tag_ids",
          searchCell(formInputType.searchList, {
            funcInputOptionsLoader: async (that) => {
              const res = await await piwigoMethod({
                method: "pwg.tags.getAdminList",
              });
              let tags = res.result.tags;
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
        ),
      ],
      data: {
        image_ids: data.id ? [data.id] : data.map((x) => x.id),
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

export const InfoCardBtnList = [收藏按钮, 添加标签按钮, 添加到处理区];

function download(currentChooseImgList, that: any) {
  if (currentChooseImgList.length === 0) {
    this.$message.warning("请先右键勾选下载数据!");
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
      zip.file(item.pictureName + ".png", data, { binary: true }); // 逐个添加文件，需要加后缀".png"
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
        changeCardProperties(that, { loadingProgress: { percentage: 100 } });
        ElMessage.success("图片下载完成");
        changeVisible(that, { loadingProgress: false });
        setTimeout(() => {
          changeCardProperties(that, { loadingProgress: { percentage: 0 } });
        }, 299);
      });
    })
    .catch((res) => {
      ElMessage.warning("文件下载失败!");
    });
}
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
    let res = await useCartHook().getCartImage(0, 10000, needDownload);
    let downloadList = res.map((x, i) => {
      return {
        pictureUrl: `/imageserver/` + x.path,
        pictureName: x.file,
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
    function: async (that, data) => {},
  }
);
