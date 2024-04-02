<template>
    <div :style="isOpen ? '' : 'transform:translateX(800px);opactiy:0'" class="commandTool" ref="prevent">
        <div class="codeHistoryBox">
            <div class="codeHistory" :style="history.length ? 'border: 4px rgba(0, 0, 0, 0.05) solid;' : ''">
                <div v-for="(item, index) in history" v-bind:key="index + ':' + item" @dblclick="setCode(item)"
                    :class="index == key ? '' : ''">
                    {{ `$: ${item}` }}
                </div>
            </div>
        </div>
        <el-input ref="code" v-model="code" @change="sureSelect" @keyup="check" placeholder="请输入指令" class="codeInput"
            :style="isOpen ? '' : 'margin-left:-50px'">
            <template slot="prepend" v-if="!isOpen">
                <i class="el-icon-caret-left"></i>
            </template>
        </el-input>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { commandList } from "@/modules/taskList/config/taskAction";
import { get, post } from "@/utils/api/requests";
import { chat } from '../../../../utils/api/requests';
import { ElMessage, ElLoading, ElNotification } from 'element-plus';
import { useAbleWord, action, extractJSON } from '../../config/AiAction';

let EnterNum = 0;
export default defineComponent({
    name: "commandTool.vue",
    components: {},
    watch: {
        code: {
            handler(e) {
                this.isOpen = e ? true : false;
            },
        }
    },
    data() {
        return {
            isLoading: false,
            isOpen: false,
            commandList: commandList,
            history: [],
            code: "",
            key: -1,
        };
    },
    mounted() {
        const that = this
        window.addEventListener('keyup', (e) => {
            if (e.code == 'Backquote')
                that.change(true, 'talk ')
        })
    },
    methods: {
        // 打开
        async change(e, preWord = "") {
            if (e) {
                this.isOpen = e;
                await this.$nextTick();
                this.$refs.code.focus();
                this.code = preWord;
            } else {
                this.$refs.code.blur();
                this.isOpen = e;
            }
        },

        // 确认选择
        sureSelect(e) { },

        // 设置指令输入
        setCode(code) {
            code = code.replace(/-- .*? --/g, "");
            this.code = code;
        },

        // 阻止冒泡
        preventEvent(e) { },

        // 搜索指令补全(还没做) or 其他处理
        check(e) {
            switch (e.code) {
                case "Backquote":
                    this.setCode("talk ");
                    break;
                case "ArrowUp":
                    if (this.history.length != 0) {
                        this.key = this.history.length > this.key + 1 ? this.key + 1 : this.key;
                        this.setCode(this.history[this.key].split('--')[0]);
                    }
                    break;
                case "ArrowDown":
                    if (this.history.length != 0) {
                        this.key = this.key >= 0 ? this.key - 1 : this.key;
                        this.setCode(this.key === -1 ? "" : this.history[this.key].split('--')[0]);
                    }
                    break;
                case "Space":
                    break;
                case "Escape":
                    this.change(false);
                    break;
                case "Enter":
                    EnterNum++;
                    if (EnterNum >= 1 && this.code) this.applyTheCode();
                    break;
            }
            if (e.code != "Enter") {
                EnterNum = 0;
            }
        },

        // 应用指令
        async applyTheCode() {
            EnterNum = 0;
            let code = this.code.replace(/(^\s*)|(\s*$)/g, "").toUpperCase();
            let codeL = code.split(" ");
            switch (codeL[0]) {
                case "CLS":
                case "CLEAR":
                    this.history = [];
                    this.code = "";
                    break;
                case "TALK":
                    const loading = ElLoading.service({
                        lock: true,
                        text: '思考中',
                        background: 'rgba(0, 0, 0, 0.7)',
                    })
                    console.log('问：',await useAbleWord() + codeL[1])
                    let res = await chat(await useAbleWord() + codeL[1])
                    const backWord = res.data.choices[0].message.content
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
                        (await action()).map(x => {
                            console.log('fuck cell', x, x.actionType == data.actionType)
                            if (x.actionType == data.actionType) {
                                ElNotification({
                                    type: "success",
                                    title: "Tutu: ",
                                    message: `【${x.actionType}】指令执行中`,
                                    duration: 2,
                                })
                                setTimeout(() => {
                                    x.action(this, data)
                                }, 200)
                            }
                        })
                    } else {
                        ElNotification({
                            type: 'info',
                            title: 'Tutu: ',
                            message: backWord,
                            showClose: true,
                            duration: 5,
                        });
                    }
                    this.history.unshift(this.code + " -- Tutu: " + backWord);
                    loading.close()
                    break;
                case "HELP":
                    let list = commandList;
                    if (commandList[codeL[1]] || codeL[1]) {
                        let upCode1 = codeL[1];
                        if (commandList[upCode1]) {
                            list[upCode1] = commandList[upCode1];
                        } else {
                            this.code = "";
                            return this.$msg("没找到【" + upCode1 + "】组件", "info");
                        }
                    }
                    for (let x in list) {
                        list[x].value.forEach((item) => {
                            this.history.unshift(x + item);
                        });
                    }
                    break;
                default:
                    this.history.unshift(this.code);
                    this.$emit("dealCode", this.code);
            }
            this.code = "";
        },
    },
})
</script>
<style scoped>
.commandTool {
    width: 400px;
    position: fixed;
    bottom: 0px;
    right: 0px;
    margin: 30px;
    opacity: 1;
    transition: all 0.4s;
    z-index: 10000000;
}

.codeHistoryBox {
    padding-bottom: 50px;
}

.codeHistory {
    max-height: 30vh;
    width: calc(100% - 40px);
    margin: 0px 10px;
    height: auto;
    display: inline-block;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    transform: translateY(50px);
}

.codeHistory::-webkit-scrollbar {
    width: 4px;
    height: 1px;
}

.codeHistory::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    width: 1px;
    border-radius: 2px;
    background: #535353;
}

.codeHistory::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
}

.codeHistory>div {
    padding-left: 0.6em;
    text-align: left;
    /* white-space: nowrap; */
    text-overflow: ellipsis;
    font-size: 0.6em;
    margin: 2px 5px;
    cursor: pointer;
    user-select: none;
}

.codeInput>>>.el-input__inner {
    text-indent: 10px;
}
</style>
  