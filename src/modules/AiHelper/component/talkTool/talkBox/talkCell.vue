<!--
 * @Date: 2024-03-25 17:20:28
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-06 19:07:29
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/component/talkTool/talkBox/talkCell.vue
-->
<template>
  <div v-if="cell.from == 'ai'" class="avater">
    <img
      :src="robotHeader"
      v-if="!preCell || preCell.from != 'ai' || preCell.needShow == false"
      alt=""
    />
  </div>
  <div
    v-if="cell.from == 'user'"
    class="avater"
    style="float: right; margin-left: 12px"
  >
    <img :src="userHeader" alt="" />
  </div>
  <div
    ref="cont"
    v-if="cell.from == 'ai'"
    :class="`aiChat_cardBg cardBg ${cell.needShow ? '' : 'hide'} ${
      preCell && preCell.from == cell.from && preCell.needShow == true
        ? 'noMargin'
        : ''
    } aiBox`"
    :style="cusStyle"
  >
    <div
      class="aiBox_icon"
      :style="{
        background: cusStyle['background'],
      }"
      v-if="!preCell || preCell.from != 'ai' || preCell.needShow == false"
    ></div>
    <div class="content" v-if="cell.showType == showTypeTemplate.text">
      {{ cell.content }}
    </div>
    <div class="content" v-if="cell.showType == showTypeTemplate.html">
      <div v-html="cell.content"></div>
    </div>
    <div class="content" v-if="cell.showType == showTypeTemplate.btns">
      <div
        v-for="(item, index) in cell.btnList.filter((btn) =>
          btn && btn.isShow
            ? btn.isShow(cell, JSON.parse(JSON.stringify(btn)))
            : true
        )"
        style="float: left; margin-right: 6px"
        :key="index + 'btnlistitem'"
      >
        <el-button
          plain
          :loading="item.isLoading"
          @click="btnClick(item, cell)"
          :disabled="item.isDisable(cell)"
          size="small"
          :type="item.elType"
          :icon="item.icon"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <div class="content" v-if="cell.showType == showTypeTemplate.card">
      <el-card class="box-card" :style="cell.cusStyle">
        <div v-for="it in Object.keys(cell.content)" :key="it" class="listBox">
          <div class="title" v-if="it != ' '">{{ it }}</div>
          <div v-html="cell.content[it]"></div>
        </div>
      </el-card>
    </div>
    <div class="content" v-if="cell.showType == showTypeTemplate.list">
      <el-table
        :data="cell.content"
        style="width: 100%"
        border
        max-height="400"
      >
        <el-table-column
          v-for="(item, index) in Object.keys(cell.content[0])"
          :prop="item"
          :label="item"
          width="200"
        >
        </el-table-column>
      </el-table>
    </div>
    <div
      class="content chart"
      v-if="cell.showType == showTypeTemplate.pieChart"
    ></div>

    <!-- 反馈内容 -->
    <div
      class="backReport"
      v-if="
        (!nextCell['showType'] || nextCell['from'] != 'ai') &&
        preCell &&
        preCell['from'] == 'user'
      "
    >
      <el-button @Click="stopTalk" link type="danger" v-if="cell.isLoading">
        停止回答
      </el-button>
      <el-button
        icon="refresh"
        @Click="reTalk"
        link
        v-if="(!nextCell || !nextCell['showType']) && cell.isLoading == false"
      >
        重新回答
      </el-button>
      <div class="reportBackBtn" v-if="!cell.isLoading">
        <div
          class="cell"
          :class="report?.isSelect == 'good' ? 'isSelect' : ''"
          @click="
            (e) => {
              report.isSelect = 'good';
              reportBack(cell);
            }
          "
        >
          <img class="normal deActive" :src="svg.good" alt="" />
          <img class="normal active" :src="svg.good_hover" alt="" />
        </div>
        <el-popover
          :visible="report.isSelect == 'bad'"
          placement="top"
          :width="260"
        >
          <cardBg
            class="card"
            :cusStyle="{
              filter: 'none',
              padding: '12px',
            }"
          >
            <div class="title">
              <p>您的反馈</p>
              <p>将帮助智移回答优化进步</p>
              <div class="close" @click="report.isSelect = ''">
                <el-icon>
                  <Close />
                </el-icon>
              </div>
            </div>
            <div class="twoCellFlex">
              <div
                :class="report.reportData.tagContent == type ? 'isSelect' : ''"
                class="reportType"
                v-for="type in reportIndexType"
                @click="
                  report.reportData.tagContent = type;
                  report.reportData.content = '';
                "
              >
                {{ type }}
              </div>
            </div>
            <div class="reportContent">
              <el-input
                input-style="background: rgba(39, 58, 91, 0.05);"
                v-model="report.reportData.content"
                placeholder="其他"
              ></el-input>
            </div>
            <ElDivider></ElDivider>
            <div class="submitBtn">
              <ElButton type="primary" @click="reportBack(cell)">提交</ElButton>
            </div>
          </cardBg>
          <template #reference>
            <div
              class="cell"
              :class="
                report?.isSelect && report?.isSelect == 'bad' ? 'isSelect' : ''
              "
              :style="{}"
              @click="report.isSelect = 'bad'"
            >
              <img class="normal deActive" :src="svg.bad" alt="" />
              <img class="normal active" :src="svg.bad_hover" alt="" />
            </div>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
  <div ref="cont" v-else class="aiChat_cardBg cardBg userBox">
    <div class="content">
      <div
        class="userBox_icon"
        v-if="!preCell || preCell.from != 'user' || preCell.needShow == false"
      ></div>
      {{ cell.content }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  TalkCellTemplate,
  showTypeTemplate,
  reportDataTemplate,
  reportType,
} from "./index";
import userHeader from "@/modules/AiHelper/assets/userHeader.png";
import robotHeader from "@/modules/AiHelper/assets/robotHeader.png";
import background from "@/modules/knowledge/assets/logo/image.png";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { btnCellTemplate } from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import { ElMessage } from "element-plus";
import item from "element-plus/es/components/space/src/item";
import cell from "element-plus/es/components/table-v2/src/components/cell";
import { report } from "process";

let num = 0;
export default defineComponent({
  components: { cardBg },
  data() {
    return {
      showTypeTemplate,
      dataId: num++,
      userHeader,
      robotHeader,
      // 笑死，全是历史遗留
      svg: {
        bad: "./img/bad.svg",
        bad_hover: "./img/bad_Hover.svg",
        good: "./img/good.svg",
        good_hover: "./img/good_Hover.svg",
      },

      // 又来一个
      reportType,
      reportIndexType: [
        "逻辑问题",
        "格式问题",
        "有害信息",
        "事实错误",
        "没有帮助",
        "答非所问",
      ],
      report: {
        reportData: {} as reportDataTemplate,
        isSelect: "" as "" | "bad" | "good",
      },
    };
  },
  methods: {
    stopTalk() {
      this.$emit("stopTalk");
    },

    reTalk() {
      this.$emit("reTalk");
    },

    btnClick(btn: btnCellTemplate, res?: stringAnyObj) {
      this.$emit("btnClick", btn, res);
    },

    getcont() {
      if (this.$el) return this.$el.parentElement.children[1].clientWidth;
    },
    async reportBack(item) {
      const { report, cell, preCell } = this;
      console.log(report);
      let res = await post("/web/knowledge/questionFeedback", {
        question: preCell.content,
        answer: cell.content + JSON.stringify(cell.docs),
        type: report.isSelect == "good" ? 1 : 2, //反馈类型 1-点赞 2-不满意
        tagContent: report.reportData.tagContent,
        content: report.reportData.content || "",
      });
      this.report.isSelect = "";
      ElMessage.success(res.message);
    },
  },
  props: {
    nextCell: {
      type: Object,
      default: () => {
        return {} as TalkCellTemplate;
      },
    },
    cusStyle: {
      type: String,
      default: "",
    },
    preCell: {
      type: Object,
      default: () => {
        return {} as TalkCellTemplate;
      },
    },
    cell: {
      type: Object,
      default: () => {
        return {} as TalkCellTemplate;
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.resizeBox {
  width: auto;
  display: inline-block;
}

.avater {
  width: 40px;
  height: 40px;
  position: relative;
  float: left;
  margin-top: 6px;
  margin-right: 12px;
}

.content {
  display: inline-block;
  max-width: 100%;
  width: auto;
  text-wrap: break-word;
  word-break: break-all;
  padding: 6px;
  border-radius: 2px;
  cursor: auto;
  user-select: text;
}

.cardBg {
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.001);
  font-size: 14px;
  font-weight: 300;
  height: auto;
  margin: 6px;
  display: inline-block;
  max-width: calc(100% - 132px);
  overflow: auto;
  transition: all 0.3s ease-in-out;
  overflow: unset;
  width: auto;
  border-radius: 4px;
}

.aiBox {
}

.aiBox_icon {
  transition: all 0.3s ease-in-out;
  height: 11px;
  //margin-left: -10px;
  margin-left: -4px;
  margin-top: 2px;
  position: absolute;
  transform: rotate(45deg);
  width: 11px;
  background: white;
}

.userBox {
  float: right;
  width: auto;
  background: #3b80fd;
  color: white;
}

.userBox_icon {
  background: #3b80fd;
  content: "";
  height: 6px;
  position: absolute;
  right: 9px;
  top: -3px;
  transform: rotate(45deg) translateX(100%);
  width: 6px;
}

.hide {
  opacity: 0;
  height: 0px;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
}

.noMargin {
  margin-top: -18px;
}

.chart {
  width: 400px;
  height: 350px;
  // 有点神奇，我也不知道为什么，先加上再说
  margin-bottom: -4px;
}

.listBox {
  display: flex;
  justify-content: space-between;
  height: auto;

  .title {
    font-weight: 300;
  }
}

.box-card {
  display: inline-block;
  width: 320px;
  height: auto;
}

.backReport {
  border-top: 0.5px solid #273a5b26;
  height: 30px;
  line-height: 30px;
  width: calc(100% - 10px);
  margin-top: 5px;
  margin-left: 5px;

  .reportBackBtn {
    align-items: center;
    color: #273a5b;
    cursor: pointer;
    display: flex;
    float: right;
    height: 19px;
    justify-content: space-between;
    margin-top: 8px;
    width: 45px;
  }
}

.card {
  width: 188px;
  height: auto;

  .title {
    font-family: "PingFang SC";
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0px;

    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 12px;
      right: 8px;
      font-size: 1.2em;
      cursor: pointer;
    }
  }

  .twoCellFlex {
    width: 110%;
    margin: 0px -5%;
    margin-top: 21px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .reportType {
      width: calc(50% - 12px);
      height: 32px;
      line-height: 32px;
      margin: 6px;
      text-align: center;
      box-sizing: border-box;
      border: 1px dashed rgba(39, 58, 91, 0.35);
      cursor: pointer;
      transition: all 0.2s;
    }

    .reportType:hover {
      border: 1px solid rgba(59, 128, 253, 0.65);
      color: rgba(59, 128, 253, 0.65);
    }
  }

  .reportContent {
    width: 105%;
    margin: 0px -2.5%;
    margin-top: 21px;

    :deep(.el-input__wrapper) {
      padding: 0px;
    }

    :deep(.el-input__inner) {
      text-indent: 1em;
    }
  }
}

.isSelect {
  border: 1px solid rgba(59, 128, 253, 0.65);
  color: rgba(59, 128, 253, 0.65);
}

.cell {
  .deActive {
    display: block;
  }

  .active {
    display: none;
  }
}

.cell:hover {
  .active {
    display: block;
  }

  .deActive {
    display: none;
  }
}

.isSelect {
  .active {
    display: block;
  }

  .deActive {
    display: none;
  }
}
</style>
