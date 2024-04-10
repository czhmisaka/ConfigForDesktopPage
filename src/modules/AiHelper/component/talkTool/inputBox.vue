<!--
 * @Date: 2024-03-25 15:24:54
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-10 23:56:35
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/inputBox.vue
-->
<template>
	<div class="aiChat_cardBg" style="padding:12px">
		<el-input type="textarea" class="inputClass" placeholder="请输入内容" v-model="text" style="height:100%"
			@keyup="enterKey" :autofocus="true">
		</el-input>
		<div class="btnList">
			<el-button type="primary" icon="Position" :round="true" :plain="true" :loading="isLoading"
				@click="pushToTalkBox">发送</el-button>
		</div>
	</div>
</template>

<script lang="ts">
import { talkCellMaker } from './talkBox/index';
import { defineComponent } from 'vue'
import { changeCardProperties } from '../../../../components/basicComponents/grid/module/cardApi/index';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { gridSizeMaker, componentInfo } from '../../../../components/basicComponents/grid/module/dataTemplate';

export default defineComponent({
	name: 'inputBox',
	componentInfo: {
		labelNameCN: "输入框",
		key: "inputBox",
		description:
			"输入框，用于用户输入，并发送给AI助手，搭配对话框使用",
		gridInfo: {
			middle: gridSizeMaker(4, 2),
		},
	} as componentInfo,
	components: { cardBg },
	props: {
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			text: '',
		}
	},
	mounted() {
		this.$emit('ready')
	},
	methods: {
		enterKey(e: any) {
			if (e.code == 'Enter') {
				this.pushToTalkBox()
			}
		},
		async pushToTalkBox() {
			if (this.text && !this.isLoading) {
				const that = this
				changeCardProperties(that, {
					'talkBox': {
						inputList: [
							talkCellMaker('user', that.text)
						]
					}
				})
				this.text = ''
			}
		}
	},
})
</script>

<style lang="scss" scoped>
.inputClass {
	:deep(.el-textarea__inner) {
		padding: 12px 11px;
		min-height: 100%;
		height: 100%;
		border: 0px;
		box-shadow: 0px 0px 0px 0px #000 inset;
	}
}

.btnList {
	position: absolute;
	bottom: 12px;
	right: 12px;
	padding: 6px;
	width: auto;
	height: auto;
}
</style>