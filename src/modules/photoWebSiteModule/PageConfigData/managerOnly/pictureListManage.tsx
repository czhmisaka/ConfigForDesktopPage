/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-08 23:55:43
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\PageConfigData\managerOnly\pictureListManage.tsx
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
  doubleCheckBtnMaker,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, post } from "@/utils/api/requests";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
import { xor } from "lodash";
import {
  btnActionTemplate,
  drawerProps,
  showType,
} from "@/modules/userManage/types";
import {
  SearchCellStorage,
  actionCell,
  staticSelectCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { uploadFile } from "../../api/upload";
import { useCacheHook } from "@/store/modules/cache";
import { showCell } from "../../../userManage/component/searchTable/searchTable";
import {
  ElImage,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElPopover,
  ElTag,
  ElTooltip,
} from "element-plus";
import { 上级相册 } from "./newCategoryManage";
import { actionCellMaker } from "@/modules/TaskList/config/AiAction";
import { h } from "vue";
import { 添加图片到图集 } from "./loraServer/imgFolder";

export const uploadStatus = {
  // 准备上传
  ready: "准备上传",
  // 开始上传
  start: "上传中",
  // 识别分类
  read: "识别分类中",
  // 上传完成
  finish: "上传完成",
  // 出错
  error: "上传出错",
};

// 批量上传
export const 批量上传按钮 = btnMaker(
  "选择文件",
  btnActionTemplate.UploadFunction,
  {
    elType: "success",
    icon: "Select",
    function: async (that, data) => {
      const file = data.file as {
        uid: string;
        lastModified: string;
        lastModifiedDate: string;
        name: string;
        size: string;
        type: string;
      };
      let photos = await useCacheHook().getDataByKey(photoListKey);
      // 准备上传
      photos.push({
        localId: `${photoListKey}${new Date().getTime()}_${Math.round(
          Math.random() * 1000000
        )}_${photos.length}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: "",
        tags: [],
        uploadStatus: uploadStatus.ready,
        data,
      });
      console.log(photos, "asd");
    },
  }
);

export const 开始上传按钮 = btnMaker("上传", btnActionTemplate.Function, {
  elType: "warning",
  icon: "UploadFilled",
  isShow: (data) => data._selectedList.length > 0,
  function: async (that, da) => {
    const 开始上传 = btnMaker("开始上传", btnActionTemplate.Function, {
      elType: "warning",
      icon: "UploadFilled",
      isShow: (d) => d.categoryId,
      function: async (th, dat) => {
        let data = da._selectedList.filter(
          (x) =>
            x.uploadStatus == uploadStatus.ready ||
            x.uploadStatus == uploadStatus.error
        );
        console.log(data, "准备上传的文件");
        data.map(async (x) => {
          try {
            x.uploadStatus = uploadStatus.start;
            let res = await uploadFile(x.data.file);
            x.uploadStatus = uploadStatus.read;
            x.url = res.data.url;
            x.data = res.data;
            let res1 = await post("/admin/picture/categories/addPicture", {
              pictureIds: [res.data.id],
              categoryId: dat.categoryId,
            });
            console.log(res, "查看图片");
            x.uploadStatus = uploadStatus.finish;
            x.tags = res.data.tags;
            let photos = await useCacheHook().getDataByKey(photoListKey);
            photos.map((c) => {
              if (c.localId == x.localId) c = x;
            });
            // useCacheHook().setup(photoListKey,photos.map(c=>{

            // },)
          } catch {
            x.uploadStatus = uploadStatus.error;
          }
        });
        th.close();
      },
    });

    // 选择一个相册
    let drawerProps = {
      title: "选择目标上传的相册",
      queryItemTemplate: [
        {
          ...上级相册,
          label: "选择相册",
          key: "categoryId",
        },
      ],
      btnList: [开始上传],
    } as drawerProps;

    openDrawerFormEasy(that, drawerProps);
  },
});

export const 删除 = btnMaker("删除", btnActionTemplate.Function, {
  icon: "Delete",
  elType: "danger",
  isShow: (data) =>
    data.uploadStatus == uploadStatus.error ||
    data.uploadStatus == uploadStatus.ready ||
    data.uploadStatus == uploadStatus.finish,
  function: async (that, data) => {
    if (
      await doubleCheckBtnMaker(
        "删除图片",
        `确认删除图片【${data.name}】记录`
      ).catch((x) => false)
    ) {
      let photos = await useCacheHook().getDataByKey(photoListKey);
      photos = photos.filter((x) => x.localId != data.localId);
      useCacheHook().setup(
        photoListKey,
        async () => {
          return photos;
        },
        true
      );
      ElMessage.success("已删除！");
      refreshDesktop(that);
    }
  },
});

export const 批量删除 = btnMaker("删除", btnActionTemplate.Function, {
  icon: "Delete",
  elType: "danger",
  isShow: (data) =>
    data._selectedList.filter((x) => {
      return (
        x.uploadStatus == uploadStatus.error ||
        x.uploadStatus == uploadStatus.ready ||
        x.uploadStatus == uploadStatus.finish
      );
    }).length > 0,
  function: async (that, data) => {
    const delPhotos = data._selectedList;
    if (
      await doubleCheckBtnMaker(
        "删除图片",
        `确认删除图片【${delPhotos.map((x) => x.name).join("】、【")}】记录`
      ).catch((x) => false)
    ) {
      let photos = await useCacheHook().getDataByKey(photoListKey);
      delPhotos.map((del) => {
        photos = photos.filter((x) => x.localId != del.localId);
      });
      useCacheHook().setup(
        photoListKey,
        async () => {
          return photos;
        },
        true
      );
      ElMessage.success("已删除！");
      refreshDesktop(that);
    }
  },
});

export const 清空 = btnMaker("清空", btnActionTemplate.Function, {
  elType: "danger",
  icon: "Delete",
  isShow: (data) =>
    !(
      data._selectedList.filter((x) => {
        return (
          x.uploadStatus == uploadStatus.ready ||
          x.uploadStatus == uploadStatus.finish
        );
      }).length > 0
    ),
  function: async (that, data) => {
    if (
      await doubleCheckBtnMaker(
        "清空",
        "确认清空当前所有预备上传、已上传文件吗？"
      ).catch((x) => false)
    ) {
      useCacheHook().setup(
        photoListKey,
        async () => {
          return [];
        },
        true
      );
      ElMessage.success("已清空！");
      refreshDesktop(that);
    }
  },
});

export const 生成图片 = btnMaker("生成图片", btnActionTemplate.Function, {
  function: async (that, data) => {
    ElMessageBox.prompt("请输入提示词", "文本生成图片", {
      confirmButtonText: "开始生成",
      cancelButtonText: "取消",
    }).then(async ({ value }) => {
      const loading = ElLoading.service({
        lock: true,
        text: "图片处理中",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await post("/admin/picture/genEngine/txt2img", {
        prompt: value,
      });
      loading.close();
      ElMessageBox({
        title: value,
        message: () =>
          h("img", {
            src: `data:image/png;base64,` + res.data.images[0],
          }),
      });
    });
  },
});

export const photoListKey = "pictureListManageKey";

useCacheHook().setup(
  photoListKey,
  async () => {
    return [];
  },
  true
);

export const PictureListManage = async () => {
  const photoInfoStorage = new SearchCellStorage([
    tableCellTemplateMaker("图片名称", "name"),
    tableCellTemplateMaker(
      "图片地址",
      "url",
      showCell(showType.funcComponent, {
        showFunc: (data, key) => {
          let url = data[key].replace(
            "http://127.0.0.1:8001",
            window.location.origin + "/api/"
          );
          return (
            <ElTooltip
              effect="dark"
              content={`<a href='${url}' target="_blank">${url}</a>`}
              raw-content
              placement="top"
            >
              <ElImage
                style={{
                  width: "60px",
                  height: "60px",
                }}
                src={url}
                preview-src-list={[url]}
                preview-teleported={true}
              ></ElImage>
            </ElTooltip>
          );
        },
      })
    ),
    tableCellTemplateMaker("上传状态", "uploadStatus", {
      ...staticSelectCell(uploadStatus),
      ...showCell(showType.funcComponent, {
        showFunc: (data, key) => {
          let type = "info" as
            | "primary"
            | "success"
            | "info"
            | "warning"
            | "danger";
          switch (data[key]) {
            case uploadStatus.error:
              type = "danger";
              break;
            case uploadStatus.read:
              type = "warning";
              break;
            case uploadStatus.start:
              type = "primary";
              break;
            case uploadStatus.finish:
              type = "success";
              break;
          }
          return (
            <ElTag effect="dark" type={type}>
              {data[key]}
            </ElTag>
          );
        },
      }),
    }),
    tableCellTemplateMaker("图片类型", "type"),
    tableCellTemplateMaker(
      "图片大小",
      "size",
      showCell(showType.func, {
        showFunc: (data, key) => {
          return data[key] > 1000 * 1000
            ? (data[key] / 1000 / 1000).toFixed(2) + "mb"
            : (data[key] / 1000).toFixed(2) + "kb";
        },
      })
    ),
    tableCellTemplateMaker(
      "标签",
      "tags",
      showCell(showType.funcComponent, {
        showFunc: (data, key) => {
          return data[key] && data[key].length > 0 ? (
            <div>
              {data[key].map((x) => {
                return (
                  <ElTag
                    style={{
                      marginRight: "3px",
                    }}
                    effect="dark"
                    type="info"
                  >
                    {x.name}
                  </ElTag>
                );
              })}
            </div>
          ) : (
            <p>暂无标签</p>
          );
        },
      })
    ),
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([删除], {
        fixed: "right",
      })
    ),
  ]);

  return [
    gridCellMaker(
      "searchTable",
      "searchTable",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          searchItemTemplate: [],
          showItemTemplate: photoInfoStorage.getAll(),
          searchFunc: async (query, that) =>
            await useCacheHook().getDataByKey(photoListKey),
          defaultQuery: {
            showLink: null,
          },
          btnList: [
            批量上传按钮,
            开始上传按钮,
            批量删除,
            清空,
            生成图片,
            添加图片到图集,
          ],
          autoSearch: false,
          modeChange: true,
          isCard: false,
        },
      }
    )
      .setPosition(0, 0)
      .setSize(12, 12),
  ] as gridCellTemplate[];
};
