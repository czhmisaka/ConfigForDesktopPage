/*
 * @Author: czhmisaka
 * @Date: 2024-11-04 01:29:12
 * @FilePath: \github\config-for-desktop-page\src\modules\main\PageConfigData\uploadImage.tsx
 */

import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { uploadFile } from "@/modules/photoWebSiteModule/api/upload";
import { post } from "@/utils/api/requests";
import { ElLoading, ElMessageBox } from "element-plus";
import { markRaw, defineComponent, h } from "vue";
import { setPosition } from '../../../components/basicComponents/grid/module/util';
import { changeVisible } from "@/components/basicComponents/grid/module/cardApi";
import { gridEditList } from "./main";

export const uploadImage = async () => {
  return [
    gridCellMaker(
      "测试",
      "test",
      {},
      {
        type: cardComponentType.cusComponent,
        data: markRaw(
          defineComponent({
            setup(props, context) {
              context.emit("ready");

              const upload = async (data) => {
                let loading = ElLoading.service({
                  text: "风格迁移图片生成中",
                });
                console.log(data);
                let re = await uploadFile(data.file);
                let res = await post(
                  "/admin/picture/lora/server/TransformImgTask",
                  {
                    imgId: re.data.id,
                  }
                );
                const img = res.data.imgData;
                console.log(res.data);
                loading.close();
                ElMessageBox({
                  message: () =>
                    h("img", {
                      src: img.replace("127.0.0.1", window.location.hostname),
                    }),
                });
              };
              return () => [
                <el-upload
                  class="upload-demo"
                  drag
                  auto-upload={true}
                  show-file-list={false}
                  multiple={false}
                  http-request={upload}
                  style={{
                    height: "100%",
                  }}
                >
                  <el-icon class="el-icon--upload">
                    <upload-filled />
                  </el-icon>
                  <div class="el-upload__text">上传需要风格迁移的图片</div>
                </el-upload>,
              ];
            },
          })
        ),
      },
      {
        props: {
          url: window.location.origin.replace(":10500", ":8188"),
        },
      }
    ).setSize(12, 8),
  ] as gridCellTemplate[];
};


export const uploadImage_new = async () => {
  return [
    gridCellMaker('imageSelector', 'imageSelector', {}, {
      type: cardComponentType.componentList,
      name: 'photoWebSiteModule_imageSelector'
    }, {
      showInGridDesktop: true,
      props: {
        imageId: ''
      }
    }).setSize(12, 8).setPosition(0, 0),
    // ...gridEditList,
    
  ] as gridCellTemplate[]
}