import { Development } from '../../wholeScreen/TJJHighEnergyLevelWholeScreen/data/interface/index';
<!--
 * @Date: 2024-03-25 15:24:36
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-02 11:10:17
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/component/talkTool/talkBox/talkBox.vue
-->

<template>
	<div class="aiChat_cardBg" style="padding: 0px;">
		<div class="mainBox">
			<el-scrollbar ref="mainBox">
				<div ref="innerRef">
					<div v-for="(item, index) in talkCellList" :key="index" style="width:100%;display: inline-block;
			height: auto;" @click="clickTalkCell(index)" @mouseover="hoverTalkCell(index)"
						:style="`${index < 1 ? '' : (talkCellList[index - 1].from == item.from && talkCellList[index - 1].needShow == true) ? 'margin-bottom:-10px' : ''}`">
						<talkCell :ref="'talkCell_' + index" :cell="item"
							:nextCell="index > talkCellList.length ? {} : talkCellList[index + 1]"
							:preCell="index < 1 ? {} : talkCellList[index - 1]"
							:cusStyle="talkCellStyleMap['talkCell_' + (index + 1)]" @stopTalk="stopTalk(item)"
							@reTalk="reTalk(item)" @btnClick="btnClick">
						</talkCell>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts">
import talkCell from './talkCell.vue'
import { defineComponent, ref } from 'vue';
import { TalkCellTemplate, talkCellMaker, stringAnyObj, showTypeTemplate } from './index';
import { HistoryTemplate, HistoryManage } from '../menu/index';
import { changeCardProperties } from '../../../../../components/basicComponents/grid/module/cardApi/index';
import { gridSizeMaker, componentInfo, propInfo, inputType } from '../../../../../components/basicComponents/grid/module/dataTemplate';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { getFlowUrl } from '@/utils/api/requests';
import { btnCellTemplate, btnActionTemplate } from '@/modules/userManage/types';

export default defineComponent({
	data() {
		return {
			talkCellStyleMap: {} as stringAnyObj,
			talkCellList: [] as TalkCellTemplate[],
			isLoading: false,
			nowHistory: {} as HistoryTemplate,
			sessionId: '',
			name: '',
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
	props: ['inputList', 'historyCell', 'gridList'],
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
		setTimeout(() => {
			this.checkTalkCell()
		}, 500);
		window.addEventListener('resize', this.checkTalkCell)
	},
	methods: {

		async btnClick(btn: btnCellTemplate, res?: stringAnyObj) {
			if (btn.type == btnActionTemplate.OpenDrawer) {
				this.drawerData = btn.drawerProps;
				this.$refs["drawer"].open();
			} else if (btn.type == btnActionTemplate.Function && btn.function) {
				btn.function(this, res);
			} else if (btn.type == btnActionTemplate.UploadFunction && btn.function) {
				await btn.function(this, res);
			} else if (btn.type == btnActionTemplate.Url) {
				window.open(btn.url);
			}
		},

		async initHistory() {
			if (this.historyCell && this.historyCell.talkCellList && this.historyCell.name && this.historyCell.sessionId) {
				this.isLoading = true
				// this.$set(this, 'talkCellList', JSON.parse(JSON.stringify(this.historyCell.talkCellList)))
				this.talkCellList = JSON.parse(JSON.stringify(this.historyCell.talkCellList))
				this.sessionId = this.historyCell.sessionId
				this.prompt = this.historyCell.prompt
				this.name = this.historyCell.name
				this.nowHistory = this.historyCell
				this.isLoading = false
				changeCardProperties(this, {
					talkBox: {
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
				await this.getAiChatBack(cells[cells.length - 1])
				this.isLoading = false
				data['inputBox'] = {
					isLoading: false
				}
				changeCardProperties(this, data)
			}
			if (this.talkCellList.length == 3) {
				this.name = cells[0].content
			}
			await HistoryManage.save({
				...this.nowHistory,
				name: this.name,
				talkCellList: this.talkCellList
			})
			data['talkBox'] = {
				inputList: ''
			}
			data['historyBox'] = {
				needRefresh: true
			}
			changeCardProperties(this, data)
		},


		// 获取ai的回复
		async getAiChatBack(userTalk: TalkCellTemplate) {
			this.isLoading = true
			const that = this
			const mainBox = that.$refs['mainBox']
			const innerRef = that.$refs['innerRef']
			that.talkCellList.push(talkCellMaker('ai', '', true, showTypeTemplate.text, {
				question: userTalk.content
			}))
			let chunkStr = ''
			that.talkCellList[that.talkCellList.length - 1].isLoading = true
			return new Promise((r, j) => {
				const controller = new AbortController();
				const { signal } = controller;
				fetch(`${getFlowUrl()}/knowledge_base_chat`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(
						{
							'query': userTalk.content,
							'knowledge_base_name': 'knowledge_base_prod',
							'top_k': 5,
							'history': [],
							// 'history': this.talkCellList.map((x: TalkCellTemplate) => {
							// 	return x.content
							// }).filter(Boolean),
							'stream': true,
							'local_doc_url': false,
						}),
					signal
				}).then(async (response: any) => {
					this.isLoading = false
					const reader = response.body.getReader();
					const decoder = new TextDecoder("utf-8");
					async function dataGetter(chunk: any) {
						let res = decoder.decode(chunk.value, { stream: !chunk.done });
						res = res.replace(/data\:/g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/\ /g, '').replace(/\s+/g, '').replace(/\\n/g, '')
						function setData(data) {
							console.log(data, '完整回答数据')
							let str = data.answer;
							let docs = data.docs
							if (str)
								that.talkCellList[that.talkCellList.length - 1].content += str;
							if (docs && docs.length && docs.length > 1) {
								that.talkCellList[that.talkCellList.length - 1].docs = docs
							}
						}

						if (that.talkCellList[that.talkCellList.length - 1].isLoading == false) {
							r('')
						} else {
							// 处理区块大小问题
							if (res.split('}{').length > 1) {
								res.split('}{').map(x => {
									if (x[0] != '{') x = '{' + x
									if (x[x.length - 1] != '}') x = x + '}'
									setData(JSON.parse(x))
								})
							} else if (chunkStr[0] == '{' && res[res.length - 1] == '}') {
								setData(JSON.parse(chunkStr + res))
								chunkStr = ''
							} else if (res[0] == '{' && res[res.length - 1] == "}") {
								setData(JSON.parse(res))
								chunkStr = ''
							} else {
								chunkStr += res
							} if (!chunk.done) {
								// 未完成
								reader.read().then(dataGetter)
								mainBox.setScrollTop(innerRef.clientHeight)
							}
							// 完成
							else {
								that.talkCellList[that.talkCellList.length - 1].isLoading = false
								that.clickTalkCell(that.talkCellList.length - 1)
								// that.talkCellList.push(talkCellMaker('ai', '以上信息仅供参考', true, showTypeTemplate.text, {
								// 	question: that.talkCellList[that.talkCellList.length - 1].question,
								// 	docs: that.talkCellList[that.talkCellList.length - 1].docs,
								// }))
								setTimeout(() => that.checkTalkCell(), 100)
								r('')
							}
						}
						// else {
						// 	// 已完成 // 判断是否为指令并执行
						// 	const allStr = that.talkCellList[that.talkCellList.length - 1].content
						// 	try {
						// 		let tryData = extractJSON(allStr.replaceAll("'", '"').replaceAll("\n", "").replaceAll(' ', ''))[0]
						// 		if (tryData && tryData['actionType']) {
						// 			actions.map(async (x) => {
						// 				if (x.actionType == tryData['actionType'] && x.action) {
						// 					const index = that.talkCellList.length - 1
						// 					that.talkCellList[index].content = `【${x.actionType}】指令执行中...`
						// 					await x.action(that, tryData)
						// 					that.talkCellList[index].needShow = false
						// 					HistoryManage.save({
						// 						name: that.name,
						// 						sessionId: that.sessionId,
						// 						talkCellList: that.talkCellList
						// 					});
						// 					(that.$refs['talkCell_' + (that.talkCellList.length - 1)] as any)[0]['$el'].scrollIntoView({
						// 						behavior: 'smooth' // 平滑滚动
						// 					});
						// 				}
						// 			})
						// 		}
						// 	} catch { }
						// 	setTimeout(() => that.checkTalkCell(), 100)
						// 	r('')
						// }
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
			for (let i = 0; i < that.talkCellList.length; i++) {
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
						if ((that.$refs['talkCell_' + index] as any)[0]) {
							const width = (that.$refs['talkCell_' + index] as any)[0].getcont()
							widthList.push(width)
						}
					}
					let maxWidth = Math.max(...widthList)
					for (let x = 0; x < needMergeCellList.length; x++) {
						let index = needMergeCellList[x].index + 1
						that.talkCellStyleMap['talkCell_' + index] = {
							width: maxWidth + 'px'
						}
					}
				}
			}
			this.$forceUpdate()
		},

		async hoverTalkCell(index: number) {
			const that = this
			const talkCell = that.talkCellList[index]
			if (talkCell.from != 'ai') return;
		},

		// 点击时切换知识列表
		async clickTalkCell(talkCellIndex: number) {
			const talkCell = JSON.parse(JSON.stringify(this.talkCellList[talkCellIndex]))
			if (talkCell.from != 'ai') return;
			const that = this;
			const keys = Object.keys(that.talkCellStyleMap).sort((a, b) => {
				return Number(a.split('_')[1]) - Number(b.split('_')[1])
			})
			keys.map((x, i) => {
				that.talkCellStyleMap[x]['color'] = '#000000'
				that.talkCellStyleMap[x]['background'] = ""
			})
			// 若不存在对应配置则新建
			if (that.talkCellStyleMap['talkCell_' + (talkCellIndex + 1)]) {
				that.talkCellStyleMap['talkCell_' + (talkCellIndex + 1)]['background'] = '#D5E7FB'
				that.talkCellStyleMap['talkCell_' + (talkCellIndex + 1)]['color'] = '#3B80FD'
			}
			else {
				that.talkCellStyleMap['talkCell_' + (talkCellIndex + 1)] = { background: "#D5E7FB", color: '#3B80FD' }
			}
			for (let li = 0; li < keys.length; li++) {
				const liIndex = keys[li].split('_')[1] as unknown as number
				let hasBg = false
				let needBg = []
				for (let lr = li; lr < keys.length; lr++) {
					const lrIndex = keys[lr].split('_')[1] as unknown as number
					if ((lr - li) > (lrIndex - liIndex)) {
						break;
					} else if ((lr - li) == (lrIndex - liIndex)) {
						needBg.push(keys[lr])
						if (that.talkCellStyleMap[keys[lr]].background && that.talkCellStyleMap[keys[lr]].background == '#D5E7FB') {
							hasBg = true
						}
					}
				}
				if (needBg.length > 0 && hasBg) {
					needBg.map(x => {
						that.talkCellStyleMap[x]['background'] = '#D5E7FB'
						that.talkCellStyleMap[x]['color'] = '#3B80FD'
					})
					break;
				}
			}
			changeCardProperties(that, {
				docBox: {
					cell: talkCell,
					docList: JSON.parse(JSON.stringify(talkCell.docs && talkCell.docs.length > 0 ? talkCell.docs : [false]))
				}
			})
		},

		async stopTalk(cell: TalkCellTemplate) {
			cell.isLoading = false
		},

		async reTalk(cell: TalkCellTemplate) {
			this.talkCellList.pop()
			let data = {} as stringAnyObj
			data['inputBox'] = {
				isLoading: true
			}
			changeCardProperties(this, data)
			this.isLoading = true
			await this.getAiChatBack(this.talkCellList[this.talkCellList.length - 1])
			this.isLoading = false
			data['inputBox'] = {
				isLoading: false
			}
			changeCardProperties(this, data)
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
	overflow-y: hidden;
	//background-color: rgba(0, 0, 0, 0.01);
	border-radius: 6px;
	text-align: left;
	padding-bottom: 6px;
}


.title {
	width: 100%;
	display: inline-block;
	font-size: 18px;
	font-weight: 500;
	line-height: 18px;
}
</style>

