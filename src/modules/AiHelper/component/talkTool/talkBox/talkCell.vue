<!--
 * @Date: 2024-03-25 17:20:28
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-10 23:30:22
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/talkBox/talkCell.vue
-->
<template>
	<div v-if="cell.from == 'ai'" :class="`aiChat_cardBg cardBg ${cell.needShow ? '' : 'hide'} 
		${(preCell && preCell.from == cell.from && preCell.needShow == true) ? 'noMargin' : ''}`" :style="cusStyle">
		<div class="avater" v-if="!preCell || preCell.from != 'ai' || preCell.needShow == false">
			<span class="icon iconfont" style="vertical-align: 0em;">&#xe613;</span>
			智能助理：
		</div>
		<br v-if="!preCell || preCell.from != 'ai' || preCell.needShow == false" />
		<div class="content" v-if="cell.showType == showTypeTemplate.text">
			{{ cell.content }}
		</div>
		<div class="content" v-if="cell.showType == showTypeTemplate.html">
			<div v-html="cell.content"></div>
		</div>
		<div class="content" v-if="cell.showType == showTypeTemplate.card">
			<el-card class="box-card" :style="cell.cusStyle">
				<div v-for="it in Object.keys(cell.content)" :key="it" class="listBox">
					<div class="title" v-if="it != ' '">{{ it }}</div>
					<div v-html="cell.content[it]"> </div>
				</div>
			</el-card>
		</div>
		<div class="content" v-if="cell.showType == showTypeTemplate.list">
			<el-table :data="cell.content" style="width: 100%" border max-height="400">
				<el-table-column v-for="(item, index) in Object.keys(cell.content[0])" :prop="item" :label="item"
					width="200">
				</el-table-column>
			</el-table>
		</div>
		<div class="content chart" v-if="cell.showType == showTypeTemplate.pieChart">
		</div>
	</div>
	<div v-else class="aiChat_cardBg cardBg userBox">
		<div class="content">
			{{ cell.content }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TalkCellTemplate, showTypeTemplate } from './index';
let num = 0
export default defineComponent({
	components: {},
	data() {
		return {
			showTypeTemplate,
			dataId: num++
		}
	},
	methods: {},
	props: {
		cusStyle: {
			type: String,
			default: ''
		},
		preCell: {
			type: Object,
			default: () => {
				return {} as TalkCellTemplate
			}
		},
		cell: {
			type: Object,
			default: () => {
				return {} as TalkCellTemplate
			}
		}
	},
})
</script>

<style lang="scss" scoped>
.avater {
	display: inline-block;
	width: auto;
	line-height: 24px;
	font-weight: 300;
}

.content {
	display: inline-block;
	max-width: 100%;
	width: auto;
	text-wrap: break-word;
	word-break: break-all;
	padding: 12px;
	background-color: rgba(0, 0, 0, 0.02);
	border-radius: 6px;
}

.cardBg {
	border-radius: 6px;
	height: auto;
	margin: 6px;
	max-width: calc(100% - 12px - 40px);
	width: auto !important;
	display: inline-block;
	box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.001);
	font-size: 14px;
	font-weight: 300;
	transition: all .3s ease-in-out;
	overflow: auto;
}

.userBox {
	float: right;
	width: auto;
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
</style>