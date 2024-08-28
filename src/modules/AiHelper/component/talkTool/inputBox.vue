<!--
 * @Date: 2024-03-25 15:24:54
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-28 09:30:32
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/component/talkTool/inputBox.vue
-->
<template>
	<div class="aiChat_cardBg" style="padding:12px">
		<el-input type="textarea" class="inputClass" placeholder="请输入内容" v-model="text" style="height:100%"
			@keyup="enterKey" :autofocus="true">
		</el-input>
		<div class="btnList">
			<div class="whiteBlock"></div>
			<el-button class="sendBth" v-if="!isTalk" type="primary" icon="Position" :round="true" :plain="true"
				:loading="isLoading" @click="pushToTalkBox">发送</el-button>
		</div>
	</div>
</template>

<script lang="ts">
import { talkCellMaker } from './talkBox/index';
import { defineComponent, onMounted } from 'vue';
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
		detail: {
			type: Object,
			default: () => { return {} }
		},
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			text: '',

			talkSendList: [],
			isTalk: false
		}
	},
	mounted() {
		this.$emit('ready')
	},
	unmounted() {
	},
	methods: {
		msgInput(msg) {
			let msgList = msg.split('\n')
			let needSend = msgList.filter(item => {
				return item.indexOf(':') > -1
			})
			console.log(needSend, 'needSend')
			let sendMsg = needSend[needSend.length - 1] ? needSend[needSend.length - 1] : ''
			if (this.talkSendList.indexOf(sendMsg) == -1 && sendMsg != '') {
				this.talkSendList.push(sendMsg)
				this.pushWord(sendMsg.split(':')[1])
			}
			this.text = msgList.join('\n')
		},
		clear() {
			this.text = ''
		},
		inputChange(msg: string) {
			this.text = msg
		},
		talk() {
			if (this.isTalk) {
				this.isTalk = false
			}
			else {
				let data = {}
				data[this.detail.labelName] = {
					isLoading: true
				}
				changeCardProperties(this, data)
				this.isTalk = true
			}
		},
		enterKey(e: any) {
			if (e.code == 'Enter') {
				this.pushToTalkBox()
			}
		},
		async pushWord(text) {
			const that = this
			changeCardProperties(that, {
				'talkBox': {
					inputList: [
						talkCellMaker('user', text)
					]
				}
			})
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
	padding: 0px;
	width: auto;
	height: auto;

	.sendBth {
		position: relative;
		width: 100px;
		height: 44px;
		border-radius: 4px;
		margin: 6px;
		opacity: 1;
		background: linear-gradient(294deg, #3B80FD -22%, #40FFC3 100%);
		z-index: 1;
		border: 0px #fff solid;
		color: white;
		font-size: 16px;
		font-weight: normal;
		z-index: 10;
	}

	.whiteBlock {
		width: 30px;
		height: 30px;
		position: absolute;
		background: white;
		right: 0px;
		bottom: -3px;
		z-index: 1;
	}
}

.aiChat_cardBg {
	background: white
}
</style>