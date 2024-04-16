import { Development } from '../../wholeScreen/TJJHighEnergyLevelWholeScreen/data/interface/index';
<!--
 * @Date: 2024-03-25 15:24:36
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-14 15:19:42
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/talkTool/talkBox/talkBox.vue
-->

<template>
	<div class="aiChat_cardBg" style="padding: 12px;">
		<div class="title">
			{{ name }}
			{{ isLoading ? '【思考中】' : '' }}
		</div>
		<div class="mainBox">
			<div v-for="(item, index) in talkCellList" :key="index" style="width:100%;display: inline-block;
			height: auto;">
				<talkCell :ref="'talkCell_' + index" :cell="item" :preCell="index < 2 ? {} : talkCellList[index - 1]"
					:cusStyle="talkCellStyleMap['talkCell_' + (index + 1)]">
				</talkCell>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import talkCell from './talkCell.vue'
import { defineComponent } from 'vue'
import { TalkCellTemplate, talkCellMaker, stringAnyObj } from './index';

import { HistoryTemplate, HistoryManage } from '../menu/index';
// import { action, extractJSON } from '../../config/AiAction';
import { extractJSON, action, useAbleWord } from '../../../../taskList/config/AiAction';
import { changeCardProperties } from '../../../../../components/basicComponents/grid/module/cardApi/index';
import { gridSizeMaker, componentInfo, propInfo, inputType } from '../../../../../components/basicComponents/grid/module/dataTemplate';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { chat } from '../../../../../utils/api/requests';
export default defineComponent({
	data() {
		return {
			talkCellStyleMap: {} as stringAnyObj,
			talkCellList: [] as TalkCellTemplate[],
			isLoading: false,
			nowHistory: {} as HistoryTemplate,
			sessionId: '',
			name: '小爱',
			prompt: '',
		}
	},
	components: { talkCell, cardBg },
	componentInfo: {
		labelNameCN: "对话框组件",
		key: "talkBox",
		description:
			"对话框组件,用于展示对话内容，并支持多种信息内容。",
		gridInfo: {
			middle: gridSizeMaker(4, 8),
		},
	} as componentInfo,
	propsDetail: {
		inputList: {
			label: '对话单元列表',
			type: inputType.array
		},
		history: {
			label: '历史记录',
			type: inputType.obj
		}
	} as propInfo,
	props: ['inputList', 'historyCell','gridList'],
	watch: {
		inputList: {
			handler(val) {
				this.pushData(this.inputList)
			}
		},
		historyCell: {
			handler(val) {
				this.initHistory()
			}
		}
	},
	async mounted() {
		this.$emit('ready')
		if (this.historyCell && this.historyCell.talkCellList) {
			await this.initHistory()
			await this.checkTalkCell()
		}
		if (this.inputList && this.inputList.length > 0) {
			await this.pushData(this.inputList)
		}
		window.addEventListener('resize', this.checkTalkCell)
	},
	methods: {

		async initHistory() {
			if (this.historyCell && this.historyCell.talkCellList && this.historyCell.name && this.historyCell.sessionId) {
				this.isLoading = true
				this.$set(this, 'talkCellList', JSON.parse(JSON.stringify(this.historyCell.talkCellList)))
				this.sessionId = this.historyCell.sessionId
				this.prompt = this.historyCell.prompt
				// this.name = this.historyCell.name
				this.isLoading = false
				changeCardProperties(this, {
					aiChat_talkBox: {
						historyCell: []
					},
				})
			}
		},

		async pushData(cells: TalkCellTemplate[]) {
			if (!cells || cells.length == 0) return;
			cells.map(cell => {
				this.talkCellList.push(cell)
			})
			let data = {} as any
			if (cells[cells.length - 1].from == 'user') {
				data['inputBox'] = {
					isLoading: true
				}
				changeCardProperties(this, data)
				this.isLoading = true
				// await this.getAiChatBack(cells[cells.length - 1])
				await this.getAiChatBackOnce(cells[cells.length - 1])
				this.isLoading = false
				data['inputBox'] = {
					isLoading: false
				}
				changeCardProperties(this, data)
			}
			if (this.talkCellList.length == 2) {
				// this.name = cells[0].content
			}
			HistoryManage.save({
				name: this.name,
				sessionId: this.sessionId,
				talkCellList: this.talkCellList
			})
			data['aiChat_talkBox'] = {
				inputList: ''
			}
			changeCardProperties(this, data)
		},

		async getAiChatBackOnce(userTalk: TalkCellTemplate) {
			let res = await chat(await useAbleWord(true) + userTalk.content)
			let backWord = res.data.choices[0].message.content
			let data = {} as any
			const tryData = extractJSON(backWord)
			backWord.replaceAll('{', '').replaceAll('}', '').replaceAll('"', '').replaceAll(' ', '').split(",").map(x => {
				const r = x.split(':')
				if (r && r.length > 1)
					data[r[0]] = r[1]
			})
			if (!data.actionType)
				tryData.map(x => {
					if (x.actionType) data = x
				})
			if (data && data.actionType) {
				(await action(true)).map(x => {
					if (x.actionType == data.actionType) {
						setTimeout(() => {
							x.action(this, data)
						}, 200)
					}
				})
				this.talkCellList.push(talkCellMaker('ai', '指令执行中'))
			}
			else
				this.talkCellList.push(talkCellMaker('ai', backWord))
		},

		// 获取ai的回复
		async getAiChatBack(userTalk: TalkCellTemplate) {
			this.isLoading = true
			const that = this
			return new Promise((r, j) => {
				fetch(`/ai/qa?sessionId=${that.sessionId}&query=${userTalk.content}`, {
					method: "POST",
					headers: {
						"Content-Type": "text/event-stream",
						"accept": "text/event-stream"
					},
				}).then(async (response: any) => {
					this.isLoading = false
					that.talkCellList.push(talkCellMaker('ai', ''))
					const reader = response.body.getReader();
					const decoder = new TextDecoder("utf-8");
					let actions = await action()
					async function dataGetter(chunk: any) {
						let str = decoder.decode(chunk.value, { stream: !chunk.done });
						str = str.replace(/data\:/g, '').replace(/\n/g, '')
						that.talkCellList[that.talkCellList.length - 1].content += str;
						(that.$refs['talkCell_' + (that.talkCellList.length - 1)] as any)[0]['$el'].scrollIntoView({
							behavior: 'smooth' // 平滑滚动
						});
						if (!chunk.done) {
							// 未完成
							reader.read().then(dataGetter)
						}
						else {
							// 已完成 // 判断是否为指令并执行
							const allStr = that.talkCellList[that.talkCellList.length - 1].content
							try {
								let tryData = extractJSON(allStr.replaceAll("'", '"').replaceAll("\n", "").replaceAll(' ', ''))[0]
								if (tryData && tryData['actionType']) {
									actions.map(async (x) => {
										if (x.actionType == tryData['actionType'] && x.action) {
											const index = that.talkCellList.length - 1
											that.talkCellList[index].content = `【${x.actionType}】指令执行中...`
											await x.action(that, tryData)
											that.talkCellList[index].needShow = false
											HistoryManage.save({
												name: that.name,
												sessionId: that.sessionId,
												talkCellList: that.talkCellList
											});
											(that.$refs['talkCell_' + (that.talkCellList.length - 1)] as any)[0]['$el'].scrollIntoView({
												behavior: 'smooth' // 平滑滚动
											});
										}
									})
								}
							} catch { }
							setTimeout(() => that.checkTalkCell(), 100)
							r('')
						}
					}
					return reader.read().then(dataGetter);
				})
			})
		},

		// 检查所有的talkCellList 中的元素
		// 有可以合并的内容则需要加入 宽度对齐
		async checkTalkCell() {
			const that = this
			if (that.talkCellList.length == 0) return;
			// 检查有可以合并的内容
			let needMergeCellList = [{ ...that.talkCellList[0], index: 0 }]
			for (let i = 1; i < that.talkCellList.length; i++) {
				let cell = that.talkCellList[i]
				let preCell = needMergeCellList[needMergeCellList.length - 1]
				// 排除不显示的元素
				if (cell.needShow == false) continue;
				if (preCell.from == cell.from) needMergeCellList.push({ ...cell, index: i })
				else needMergeCellList = [{ ...cell, index: i }]
				if (needMergeCellList.length > 1) {
					// 需要合并
					let widthList = [] as number[]
					for (let x = 0; x < needMergeCellList.length; x++) {
						let index = needMergeCellList[x].index
						const width = (that.$refs['talkCell_' + index] as any)[0]['$el'].clientWidth
						widthList.push(width)
					}
					let maxWidth = Math.max(...widthList)
					for (let x = 0; x < needMergeCellList.length; x++) {
						let index = needMergeCellList[x].index
						// that.talkCellStyleMap['talkCell_' + index] = `width:${maxWidth}px;`
						that.$set(that.talkCellStyleMap, 'talkCell_' + index, `width:${maxWidth}px !important;`)
					}
				}
			}
			this.$forceUpdate()
		},
	}
})	
</script>
<style lang="scss" scoped>
.mainBox {
	width: 100%;
	height: calc(100% - 30px);
	margin-top: 9px;
	overflow-x: hidden;
	overflow-y: auto;
	//background-color: rgba(0, 0, 0, 0.01);
	background-color: #f5f5f5;
	border-radius: 6px;
	padding: 6px;
	box-shadow: 2px 2px 6px rgba(255, 255, 255, 0.05) inset, 0px 0px 6px rgba(0, 0, 0, 0.05);
}


.title {
	width: 100%;
	display: inline-block;
	font-size: 18px;
	font-weight: 500;
	line-height: 18px;
}
</style>

