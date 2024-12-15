<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-16 21:33:00
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageInfo/infoCard.vue
-->
<template>
  <cardBg :cus-style="{
    overflow: 'scroll',
  }">
    <span v-if="baseData.image && baseData.image.length && baseData.image.length > 0">
      <el-card :style="{
        ...elCardInfo.style,
        height: baseData.image.length > 5 ? '200px' : '160px',
      }" :body-style="{
  padding: '0px',
  paddingBottom: '-5px',
}">
        <waterFallItem v-for="(image, index) in baseData['image']" :url="image.url" :item="image" :cus-style="{
          width: 'calc(100%)',
          borderRadius: '6px',
          height: '150px',
          position: 'absolute',
          transform: `translateX(-50%) translateY(${baseData.image.length > 5 ? '20px' : '0px'
            }) scale(${0.8}) rotate(${index * 27}deg)`,
        }" :noPreview="true" :noTitle="true"></waterFallItem>
      </el-card>
    </span>
    <span v-else>
      <el-card :style="elCardInfo.style" :body-style="{
        padding: '0px',
        paddingBottom: '-5px',
      }">
        <waterFallItem v-if="baseData['image']" :url="baseData['image'].url" :item="baseData['image']" :cus-style="{
          width: 'calc(100%)',
          borderRadius: '6px',
          height: '150px',
        }" :noPreview="true"></waterFallItem>
      </el-card>
      <el-card :style="elCardInfo.style" :body-style="elCardInfo.bodyStyle" title="颜色">
        <div class="flexBox">
          <div class="tag" v-for="color in colorList" :style="{
            backgroundColor: color,
          }" @click="colorClick(color)"></div>
        </div>
      </el-card>
      <!-- <el-card :style="elCardInfo.style" :body-style="elCardInfo.bodyStyle" title="评分">
        <el-rate
          v-model="imageInfo.rate"
          :colors="['#F7BA2A', '#FF9900', '#ff0000']"
          @change="rate"
        />
      </el-card> -->
      <el-card title="基本信息" :style="elCardInfo.style" :body-style="elCardInfo.bodyStyle">
        <el-descriptions :column="1" size="small" v-if="baseData['image']" border :style="{
          textWrap: 'nowrap',
        }">
          <el-descriptions-item v-for="item in Object.keys(imageInfo)" :align="'left'" :label="item" label-align="left">
            <el-popover placement="top-start" :width="400" trigger="hover" :content="imageInfo[item]">
              <template #reference>{{ imageInfo[item] }} </template>
            </el-popover>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card v-if="categoryInfo.length > 0" title="相册信息" :style="elCardInfo.style"
        :body-style="{ ...elCardInfo.bodyStyle, padding: '3px' }">
        <el-tag class="floatTag" v-for="item in categoryInfo" effect="dark" type="info">相册【{{ item.name }}】</el-tag>
      </el-card>
      <el-card title="标签信息" :style="elCardInfo.style" :body-style="{ ...elCardInfo.bodyStyle, padding: '0px' }"
        v-if="tagList && tagList.length > 0">
        <div v-for="item in tagList" class="floatTag" style="margin: 3px; margin-top: 2px">
          <el-button size="small" type="info">
            {{ item.nameCn||item.name }}
          </el-button>
        </div>
      </el-card>
    </span>
    <el-card title="操作" :style="elCardInfo.style" :body-style="{ ...elCardInfo.bodyStyle, padding: '0px' }"
      v-if="baseData.image">
      <div v-for="item in btnList" class="floatTag" style="margin: 3px; margin-top: 2px">
        <el-button v-if="item.isShow(baseData.image, item)" :loading="item.isLoading" @click="btnClick(item)"
          :type="item.elType" :icon="item.icon" size="small">
          {{ item.label }}
        </el-button>
      </div>
    </el-card>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { get, post } from "@/utils/api/requests";
import {
  btnActionTemplate,
  stringAnyObj,
  btnCellTemplate,
  showType,
  tableCellTemplate,
  tableCellOptions,
} from "@/modules/userManage/types";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import waterFallItem from "@/modules/photoWebSiteModule/component/imageList/waterFallItem.vue";

import {
  setData,
  changeVisible,
  changeCardPosition,
  changeCardSize,
  changeCardProperties,
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi/index";

export default defineComponent({
  componentInfo: {
    labelNameCn: "图片详情介绍",
    key: "InfoCard",
    description: "图片详情介绍",
    gridInfo: {
      middle: gridSizeMaker(2, 12),
    },
  } as componentInfo,

  propsDetail: {
    watchKeyForCategory: {
      label: "baseData监听key(相册key)",
      type: inputType.text,
    },
  } as propInfo,

  baseProps: {},

  props: ["baseData", "sizeUnit", "image", "watchKeyForCategory", "btnList", 'sendSearch'],
  components: { cardBg, waterFallItem },
  watch: {
    "baseData.image": {
      handler(val) {
        if (JSON.stringify(val) != JSON.stringify(this.preVal)) {
          this.preVal = val;
          this.initImageInfo(val);
        }
      },
    },
  },
  async mounted() {
    this.$emit("ready");
  },

  data: () => {
    return {
      preVal: {},
      data: {},
      tagList: [],
      colorList: [] as string[],
      imageInfo: {
        尺寸: "",
        文件大小尺寸: "",
        格式尺寸: "",
        创建日期尺寸: "",
        修改日期尺寸: "",
        // rate: 0,
      },
      categoryInfo: [] as any[],
      elCardInfo: {
        style: {
          margin: "6px",
          // textAlign: "left",
          marginRight: "0px",
        },
        bodyStyle: {
          padding: "0px",
        },
      },
    };
  },

  methods: {
    async rate(e) {
      // await post("/piwigo/ws.php?format=json", {
      //   method: "pwg.images.rate",
      //   rate: e + "",
      //   image_id: this.baseData.image.id,
      // });
    },
    async initImageInfo(image) {
      if (typeof image == "object" && !Array.isArray(image)) {
        if (!image || !image.id) return;
        // let res = await get("/image-info?id=" + image.id, {});
        let res = await post('/admin/picture/pictureInfo/pictureInfo', {
          id: image.id,
        })
        console.log(res, 'fuck')
        if (!res || !res.data) return;
        let { data } = res
        const { tags, colors, Categories } = data;
        this.colorList = colors.map(x => {
          return `rgb(${x.r},${x.g},${x.b})`
        });
        this.tagList = tags;
        this.categoryInfo = Categories
        this.imageInfo = {
          文件名称: data.name,
          尺寸: `${data.width}px × ${data.height}px`,
          文件大小: `${data.size}`,
          格式: data.type,
          创建日期: data.createTime,
          修改日期: data.updateTime,
        };
      } else if (Array.isArray(image)) {
      }
    },

    /**
     * @name: btnClick
     * @description: 按钮点击事件
     * @authors: CZH
     * @Date: 2022-12-02 09:27:05
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate) {
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.drawerData = btn.drawerProps;
        this.$refs["drawer"].open();
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that, this.baseData.image);
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
    },

    // 进入颜色选择
    async colorClick(color) {
      const that = this;
      // changeCardPosition(that, {
      //   waterFall: {
      //     x: 0,
      //     y: 0,
      //   },
      // });
      // changeCardSize(that, {
      //   // InfoCard: {
      //   //   width: 2,
      //   //   height: 10,
      //   // },
      //   waterFall: {
      //     width: 10,
      //     height: 12,
      //   },
      //   categoryList: {
      //     width: 0,
      //     height: 0,
      //   },
      //   collectionList: {
      //     width: 0,
      //     height: 0,
      //   },
      // });
      // changeVisible(that, {
      //   userManage_menuListRemote: false,
      //   searchInfo: false,
      //   upload: false,
      // });
      // changeCardProperties(that, {
      //   waterFall: {
      //     watchKey: ["color"],
      //     getFunc: async function (that, data) {
      //       let { color } = data
      //       let colors = color.replace('rgb(', '').replace(')', '').split(',')
      //       let res = await post('/admin/picture/pictureInfo/search', {
      //         colorRMax: (colors[0] * 1),
      //         colorRMin: (colors[0] * 1),
      //         colorGMax: (colors[1] * 1),
      //         colorGMin: (colors[1] * 1),
      //         colorBMax: (colors[2] * 1),
      //         colorBMin: (colors[2] * 1),
      //       })
      //       return res.data.list
      //     },
      //   },
      // });
      if (this.sendSearch) {
        await this.sendSearch(this, color)
      }
      this.$nextTick(() => {
        setData(that, {
          query: {
            color: color,
            colorRange: 30
          }
        });
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.wholeScreen {
  position: relative;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  margin: 12px;
  overflow-y: scroll;
}

.flexBox {
  display: flex;
  justify-content: flex-start;
  border-radius: 3px;
  overflow: hidden;

  .tag {
    width: 20%;
    height: 15px;
  }
}

.floatTag {
  float: left;
  margin-right: 3px;
  margin-bottom: 3px;
}
</style>
