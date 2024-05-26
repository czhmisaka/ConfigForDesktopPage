<!--
 * @Date: 2023-02-13 10:25:34
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-25 23:19:25
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/userCard/userInfoCard.vue
-->
<template>
  <cardBg :cusStyle="cardBgCusStyle" class="userInfoCardBox">
    <div :style="{
      width: '100%',
      height: '100%',
      overflow: 'auto',
      overflowX: 'hidden',
    }">
      <div class="wholeWidthBox" :style="{
        height: 'auto'
      }" v-if="userInfoData['username']">
        <el-image v-if="userInfoData['icon']
          ? userInfoData['icon'].replace('/lcdp', '/api')
          : ''
          " :style="{
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    margin: '6px',
  }" class="mainColorBorder" :src="userpng" fit="cover" />

        <div class="flexCol" :style="{
          width: `120px`,
        }">
          <span class="name">
            {{ userInfoData["username"] }}
            <br />
            <el-dropdown ref="dropdown1" trigger="click">
              <el-tag class="mobile" effect="dark" style="text-wrap: wrap;
            padding: 3px;
            height: auto;
            font-size: 8px;">
                <!-- {{ userInfoData['units'][0] ? userInfoData['units'][0].name : '' }} -->
                <!-- {{ userInfoData['units'].filter(x => x.id == userInfoData['loginUnitId'])[0].name }} -->
              </el-tag>
              <template #dropdown>
                <cardBg>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="item in userInfoData['units']" style="padding: 6px;"
                      @click="checkUnit(item.id)">
                      <!-- {{ item.name }} -->

                      <el-tag class="mobile" :effect="item.id == userInfoData['loginUnitId'] ? 'dark' : 'plain'"
                        :type="item.id == userInfoData['loginUnitId'] ? 'default' : 'info'" style="
                      text-wrap: wrap;
                      padding: 3px;
                      height: auto;
                      font-size: 12px;">
                        {{ item.name }}
                      </el-tag>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </cardBg>
              </template>
            </el-dropdown>
            <!-- <span class="mobile">部门：{{ userInfoData['units'][0] ? userInfoData['units'][0].name : '' }}</span> -->
          </span>
        </div>
      </div>
    </div>

  </cardBg>
  <ElDivider class="userInfoCardDivider" />
  <!-- mainActionBtnList -->
  <cardBg class="userInfoCardBox" :cusStyle="{ ...cardBgCusStyle, padding: '3px 12px 6px 12px ' }"
    v-if="mainActionBtnList && mainActionBtnList.length">
    <div class="btnList" :style="{}">
      <div :key="index" v-for="(item, index) in mainActionBtnList.filter((btn) =>
        btn && btn.isShow
          ? btn.isShow(userInfoData, JSON.parse(JSON.stringify(btn)))
          : true
      )" style="float: left; margin-right: 6px">
        <el-button class="btn" :loading="item.isLoading" @click="btnClick(item)" :type="item.elType" :icon="item.icon"
          :size="blockSizePercent(1, '') as number < 40 ? 'small' : 'default'" plain link>
          {{ item.label }}
        </el-button>
      </div>
    </div>
  </cardBg>
  <ElDivider class="userInfoCardDivider" />
  <!-- BtnList -->
  <cardBg class="userInfoCardBox" :cusStyle="{ ...cardBgCusStyle, padding: '3px 12px 6px 12px ' }"
    v-if="btnList && btnList.length">
    <div class="btnList" :style="{}">
      <div :key="index" v-for="(item, index) in btnList.filter((btn) =>
        btn && btn.isShow
          ? btn.isShow(userInfoData, JSON.parse(JSON.stringify(btn)))
          : true
      )" style="float: left; margin-right: 6px">
        <el-button class="btn" :loading="item.isLoading" @click="btnClick(item)" :type="item.elType" :icon="item.icon"
          :size="blockSizePercent(1, '') as number < 40 ? 'small' : 'default'" plain link>
          {{ item.label }}
        </el-button>
      </div>
    </div>
  </cardBg>
</template>
<script lang="ts">
import userpng from "@/assets/img/user.png";

import { defineComponent, ref, watch, onMounted, toRefs } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  setData,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { useUserStoreHook } from "@/store/modules/user";
import { ElDivider, ElMessage } from 'element-plus';

import {
  btnActionTemplate,
  stringAnyObj,
  btnCellTemplate,
  showType,
  tableCellTemplate,
  tableCellOptions,
} from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import { useCacheHook } from '../../../../store/modules/cache';
import { Link } from '@element-plus/icons-vue';
export default defineComponent({
  componentInfo: {
    labelNameCN: "用户信息展示组件",
    key: "userInfoCard",
    description: "展示用户信息",
    gridInfo: {
      middle: gridSizeMaker(4, 3),
    },
  } as componentInfo,

  propsDetail: {
    userInfo: {
      label: "用户信息",
      type: inputType.functionEditor,
    },
    showTemplate: {
      label: "可用展示模板函数",
      description: "需要输出SearchStorage构建的对象",
      type: inputType.array,
    },
    mainActionBtnList: {
      label: "主要操作按钮列表",
      type: inputType.array,
    },
    btnList: {
      label: "按钮列表",
      type: inputType.array,
    },
  } as propInfo,

  baseProps: {
    userInfo: async () => {
      return await useUserStoreHook().getOptions();
    },
  },

  props: [
    "mainActionBtnList",
    "btnList",
    "userInfo",
    "showTemplate",
    "title",
    "baseData",
    "sizeUnit",
    "detail",
  ],

  components: {
    cardBg,
  },

  data: () => {
    return {
      userpng,
      userInfoData: {},
      showType,
      isHover: false,
    };
  },

  computed: {
    cardBgCusStyle() {
      let data = {
        padding: "12px",
        boxShadow: this.isHover ? "5px 5px 12px rgba(0,0,0,0.1) " : "",
        transform: this.isHover ? "translate(6px ,6px)" : "",
        transition: "box-shadow 0.4s,transform 0.4s",
        overflow: "none",
        width: '100%',
        margin: '0px',
        filter: 'none',
      };
      Object.keys(data).map((x) => {
        if (!data[x]) delete data[x];
      });
      return data;
    },
  },

  methods: {
    // 选择部门
    async checkUnit(id) {
      console.log(id);
      let res = await post(`/web/usc/switchUnit/${id}`, {})
      useCacheHook().setup('loginUserInfo', async () => {
        return res
      })
      if (this.userInfo) this.userInfoData = await this.userInfo();
      ElMessage.success(res.message)
    },

    hightLight(value = true) {
      // highLightComponent(this, value ? [this.detail.label] : []);
      // this.isHover = value;
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
        await btn.function(that, this.userInfoData);
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
    },
  },

  async mounted() {
    this.$emit("ready", true);
    if (this.userInfo) this.userInfoData = await this.userInfo();
    this.$emit("ready");
  },
  setup(props, context) {
    // 方便获取 尺寸
    const blockSizePercent = (num, unit = "px"): string | number => {
      return 30 * num + unit;
    };

    return { blockSizePercent };
  },
});
</script>

<style lang="scss" scoped>
.wholeWidthBox {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.mainColorBorder {
  display: inline-block;
  border: 2px white solid;
  box-shadow: 0px 0px 2px $subMenuActiveBg;
}

.flexCol {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .name {
    font-size: 14px;
    font-weight: 900;
    line-height: 1.4em;

    .mobile {
      cursor: pointer;
    }
  }
}

.btnList {
  display: inline-block;
  margin-bottom: -6px;
  position: relative;
  width: 100%;

  .btn {
    bottom: 0px;
    position: absolute;
  }
}

.userInfoCardBox {
  background: white !important;
  color: $menuActiveBefore !important;
  margin-top: 4px !important;
  margin-bottom: 6px !important;
}

.userInfoCardDivider {
  width: calc(100% - 24px);
  padding: 0px;
  margin: 0px 12px;
}
</style>
