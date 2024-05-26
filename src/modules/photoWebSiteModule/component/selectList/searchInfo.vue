<!--
 * @Date: 2023-01-20 23:35:00
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-24 03:21:06
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/selectList/searchInfo.vue
-->
<template>
  <cardBg>
    <div
      class="wholeBox"
      :style="{
        lineHeight: sizeUnit.blockSize + 'px',
      }"
    >
      <span
        style="top: 3px; position: relative; margin-right: 6px; display: inline-block"
      >
        <el-color-picker
          v-model="query['color']"
          color-format="rgb"
          validate-event
          size="default"
          :style="{
            margin: '3px',
          }"
        />
      </span>

      <el-input v-model="query['name']" placeholder="图片名字" class="item"></el-input>
      <el-select
        v-model="query['tags']"
        :placeholder="'标签'"
        style="width: auto"
        class="item"
        multiple
        clearable
        collapse-tags
      >
        <el-option v-for="tag in tagList" :value="tag.id" :label="tag.name"></el-option>
      </el-select>
      <el-popover
        v-if="canSearchByImage"
        placement="bottom-start"
        :width="200"
        trigger="hover"
      >
        <template #reference>
          <el-button icon="plus" type="primary" :plain="true"> 以图搜图 </el-button>
        </template>
        <template #default>
          <el-upload
            class="upload-demo"
            :action="`/api/upload/searchImage?token=${token}`"
            drag
            :data="{}"
            :before-upload="beforeAvatarUpload"
            :on-success="searchByImages"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">以图搜图</div>
          </el-upload>
        </template>
      </el-popover>

      <el-popover placement="top-start" :width="200" trigger="click">
        <template #reference>
          <el-button
            :plain="!checkQuery(['file_size_min', 'file_size_max'])"
            :type="checkQuery(['file_size_min', 'file_size_max']) ? 'primary' : 'info'"
            @click="clearQuery(['file_size_min', 'file_size_max'])"
          >
            大小
            <el-icon v-if="checkQuery(['file_size_min', 'file_size_max'])"
              ><Close
            /></el-icon>
          </el-button>
        </template>
        <template #default>
          <div class="twoInputRow">
            <el-input
              class="half"
              v-model="query['file_size_min']"
              placeholder="最小"
            ></el-input>
            ~
            <el-input
              class="half"
              v-model="query['file_size_max']"
              placeholder="最大"
            ></el-input>
          </div>
        </template>
      </el-popover>

      <el-popover placement="top-start" :width="300" trigger="click">
        <template #reference>
          <el-button
            :style="{
              marginLeft: '6px',
            }"
            :plain="!checkQuery(['width_min', 'width_max', 'height_min', 'height_max'])"
            :type="
              checkQuery(['width_min', 'width_max', 'height_min', 'height_max'])
                ? 'primary'
                : 'info'
            "
            @click="clearQuery(['width_min', 'width_max', 'height_min', 'height_max'])"
          >
            尺寸
            <el-icon
              v-if="checkQuery(['width_min', 'width_max', 'height_min', 'height_max'])"
              ><Close
            /></el-icon>
          </el-button>
        </template>
        <template #default>
          <div class="threeInputRow">
            宽
            <el-input
              class="half"
              v-model="query['width_min']"
              placeholder="最小"
            ></el-input>
            ~
            <el-input
              class="half"
              v-model="query['width_max']"
              placeholder="最大"
            ></el-input>
          </div>
          <br />
          <div class="threeInputRow">
            高
            <el-input
              class="half"
              v-model="query['height_min']"
              placeholder="最小"
            ></el-input>
            ~
            <el-input
              class="half"
              v-model="query['height_max']"
              placeholder="最大"
            ></el-input>
          </div>
        </template>
      </el-popover>

      <el-popover
        placement="top-start"
        :width="dataType['date_available_end'] ? 'auto' : 200"
        trigger="click"
      >
        <template #reference>
          <el-button
            :style="{
              marginLeft: '6px',
            }"
            :plain="!checkQuery(['date_available_start', 'date_available_end'])"
            :type="
              checkQuery(['date_available_start', 'date_available_end'])
                ? 'primary'
                : 'info'
            "
            @click="
              (e) => {
                dataType['date_available_end'] = false;
                clearQuery(['date_available_start', 'date_available_end']);
              }
            "
          >
            添加日期
            <el-icon v-if="checkQuery(['date_available_start', 'date_available_end'])"
              ><Close
            /></el-icon>
          </el-button>
        </template>
        <template #default>
          <el-radio-group
            v-model="query['date_available_start']"
            class="ml-4"
            @click="dataType['date_available_end'] = false"
          >
            <el-radio
              style="width: 100%; margin-left: -1em"
              v-for="item in dateList"
              :label="new Date(item.time).toLocaleString()"
              size="small"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
          <el-divider style="margin: 3px" />
          <el-radio-group v-model="dataType['date_available_end']" label="自定时间">
            <el-radio
              style="width: 100%; margin-left: 0.15em"
              size="small"
              :label="true"
              @click="clearQuery(['date_available_start'])"
              >{{ "自定时间" }}</el-radio
            >
          </el-radio-group>
          <br />
          <div
            id="fuckteleported"
            :style="{
              width: '100%',
            }"
          >
            <el-date-picker
              :teleported="false"
              v-if="dataType['date_available_end']"
              v-model="query['date_available_end']"
              type="datetimerange"
              range-separator="To"
              start-placeholder="开始"
              end-placeholder="结束"
            />
          </div>
        </template>
      </el-popover>
      <el-button
        v-if="Object.keys(query).length > 0"
        :style="{ margin: `${(sizeUnit.blockSize - 30) / 2}px 0px`, float: 'right' }"
        @click="clear"
        >重置</el-button
      >
    </div>
  </cardBg>
</template>

<script lang="ts">
let category = {};
import { defineComponent } from "vue";
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  setData,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { useUserStoreHook } from "@/store/modules/user";
import { post } from "@/utils/api/requests";
import { getFunc } from "../../PageConfigData/main";
import { ElMessage } from "element-plus";

const dateList = [] as {
  name: string;
  time: number;
}[];
const nowDay = new Date(new Date().toLocaleDateString()).getTime();
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = oneDay * 7;
const oneMounth = oneDay * 30;
const oneYear = oneDay * 365;
dateList.push({
  name: "今日",
  time: nowDay,
});
dateList.push({
  name: "昨日",
  time: nowDay - oneDay,
});
dateList.push({
  name: "最近7日",
  time: nowDay - oneWeek,
});
dateList.push({
  name: "最近30日",
  time: nowDay - oneMounth,
});
dateList.push({
  name: "最近90日",
  time: nowDay - 3 * oneMounth,
});
dateList.push({
  name: "最近365日",
  time: nowDay - oneYear,
});

export default defineComponent({
  name: "searchInfo",
  componentInfo: {
    labelNameCn: "搜索栏",
    key: "searchInfo",
    description:
      "用于对接某个piwigo - pythonserver 的服务器，展示当前的所有相册列表，并提供部相册的增删功能 , 展示可搜索的选项列表",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,

  propsDetail: {},

  baseProps: {},

  components: { cardBg },
  watch: {
    query: {
      handler(val) {
        if (this.amd_timeOut) clearTimeout(this.amd_timeOut);
        const that = this;
        this.amd_timeOut = setTimeout(() => {
          that.amd(val);
        }, 200);
      },
      deep: true,
      immediate: true,
    },
  },
  props: ["baseData", "sizeUnit", "onClickFunc", "tagList", "outputKey", "searchByImage"],
  data() {
    return {
      dateList,

      dataType: {},
      query: {},

      token: "",
      canSearchByImage: false,
      amd_timeOut: null,
    };
  },
  async mounted() {
    this.token = (await useUserStoreHook().getOptions())["pwg_token"];
    let that = this;
    setTimeout(async () => {
      let res = await post("/resetRetImageStorage", {}).catch((x) => false);
      // 修改if 内即可
      if (!res) that.canSearchByImage = true;
      else that.canSearchByImage = true;
    }, 0);
    this.$emit("ready");
  },

  methods: {
    amd(val) {
      let value = JSON.parse(JSON.stringify(val));
      if (value.tags && value.tags.length == 0) delete value.tags;
      if ("name" in value && value.name == "") delete value.name;
      let data = {};
      data[this.outputKey] = value;
      const that = this;
      if (Object.keys(value).length != 0) {
        changeCardPosition(that, {
          waterFall: { x: 0, y: 1 },
          searchInfo: { x: 0, y: 0 },
        });
        changeCardSize(that, {
          waterFall: {
            width: 10,
            height: 11,
          },
          categoryList: {
            width: 0,
            height: 0,
          },
          collectionList: {
            width: 0,
            height: 0,
          },
          searchInfo: {
            width: 10,
            height: 1,
          },
        });
        changeVisible(that, {
          upload: false,
        });
        if (that.baseData.category)
          category = JSON.parse(JSON.stringify(that.baseData.category));
        data["category"] = null;
      } else {
        changeCardPosition(that, {
          waterFall: { x: 2, y: 1 },
          searchInfo: { x: 2, y: 0 },
        });
        changeCardSize(that, {
          waterFall: {
            width: 8,
            height: 11,
          },
          categoryList: {
            width: 2,
            height: 5,
          },
          collectionList: {
            width: 2,
            height: 5,
          },

          searchInfo: {
            width: 8,
            height: 1,
          },
        });
        changeVisible(that, {
          upload: true,
        });
        if (category != null) {
          data["category"] = category;
          category = null;
        }
      }
      setData(that, data);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpg";
      const isPng = file.type === "image/png";
      const isJpeg = file.type === "image/jpeg";

      //1MB=1024*1024(1MB=1024KB 1KB=1024MB)
      const is10M = file.size / 1024 / 1024 < 10;

      //限制文件上传类型
      if (!isJPG && !isPng && !isJpeg) {
        ElMessage.error("上传图片只能是 png,jpg,jpeg 格式!");
        return false;
      }

      //限制文件上传大小
      if (!is10M) {
        ElMessage.error("上传图片大小不能超过 10MB!");
        return false;
      }

      return true;
    },
    clear() {
      const context = this;
      this.query = {};
      changeCardPosition(context, {
        waterFall: {
          x: 2,
          y: 1,
        },
        searchInfo: { x: 2, y: 0 },
      });
      changeCardSize(context, {
        InfoCard: {
          width: 2,
          height: 12,
        },
        waterFall: {
          width: 8,
          height: 11,
        },
        categoryList: {
          width: 2,
          height: 5,
        },
        collectionList: {
          width: 2,
          height: 5,
        },
        cate: {
          width: 2,
          height: 10,
        },
        searchInfo: {
          width: 8,
          height: 1,
        },
      });
      changeVisible(context, {
        upload: true,
        icon: false,
        searchInfo: true,
      });
      // setData(context, {
      //   query: {},
      // });
      changeCardProperties(context, {
        waterFall: {
          watchKey: ["category", "query", "collection"],
          getFunc: getFunc,
        },
      });
    },

    checkQuery(arr: string[]) {
      let back = false;
      arr.map((x) => {
        if (this.query[x]) back = true;
      });
      return back;
    },

    searchByImages(e) {
      const { list } = e.data;
      const that = this;
      if (this.searchByImage) {
        this.searchByImage(that, list);
      }
    },

    clearQuery(arr) {
      let { query } = this;
      arr.map((x) => {
        query[x] = null;
        delete query[x];
      });
      this.query = query;
    },
  },
});
</script>

<style lang="scss" scoped>
.wholeBox {
  width: calc(100%);
  height: 100%;
  text-align: left;
  padding: 0px 12px;
  .item {
    width: 80px;
    margin-right: 6px;
  }
}
.twoInputRow {
  display: flex;
  justify-content: space-between;
  line-height: 100%;
  .half {
    width: calc(50% - 10px);
  }
}
.threeInputRow {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  .half {
    width: calc(40% - 10px);
  }
}
</style>
