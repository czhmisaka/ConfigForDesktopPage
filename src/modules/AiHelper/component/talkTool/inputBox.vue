<!--
 * @Date: 2024-03-25 15:24:54
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-23 20:35:12
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/inputBox.vue
-->
<template>
	<div class="aiChat_cardBg" style="padding:12px">
		<el-input type="textarea" class="inputClass" placeholder="请输入内容" v-model="text" style="height:100%"
			@keyup="enterKey" :autofocus="true">
		</el-input>
		<div class="btnList">
			<el-button :type="isTalk ? 'warning' : 'primary'" :icon="isTalk ? 'Close' : 'Microphone'" :round="true"
				:plain="isTalk ? false : true" :loading="isLoading" @click="talk">{{ isTalk ? '结束' : '语音输入' }}</el-button>
			<el-button v-if="!isTalk" type="primary" icon="Position" :round="true" :plain="true" :loading="isLoading"
				@click="pushToTalkBox">发送</el-button>
		</div>
	</div>
</template>

<script lang="ts">
import { talkCellMaker } from './talkBox/index';
import { defineComponent, onMounted } from 'vue';
import { changeCardProperties } from '../../../../components/basicComponents/grid/module/cardApi/index';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { gridSizeMaker, componentInfo } from '../../../../components/basicComponents/grid/module/dataTemplate';
import { mainControl } from '@/modules/AiHelper/component/funasr/main.js'

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
			audioTalker: null,
			isTalk: false
		}
	},
	mounted() {
		this.audioTalker = mainControl(this.msgInput)
		this.$emit('ready')
	},
	unmounted() {
		if (this.isTlk) {
			this.audioTalker.stop()
		}
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
				this.audioTalker.stop()
				this.isTalk = false
			}
			else {
				let data = {}
				data[this.detail.labelName] = {
					isLoading: true
				}
				changeCardProperties(this, data)
				this.isTalk = true
				const that = this
				this.audioTalker.start()
				setTimeout(() => {
					that.audioTalker.record()
					data[this.detail.labelName] = {
						isLoading: false
					}
					changeCardProperties(that, data)
				}, 500)
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
	padding: 6px;
	width: auto;
	height: auto;
}
</style>