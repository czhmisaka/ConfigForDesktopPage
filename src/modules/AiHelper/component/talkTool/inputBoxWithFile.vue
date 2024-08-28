<!--
 * @Date: 2024-03-25 15:24:54
 * @LastEditors: CZH
 * @LastEditTime: 2024-07-05 17:10:29
 * @FilePath: /lcdp_fe_setup/src/modules/AiHelper/component/talkTool/inputBoxWithFile.vue
-->
<template>
    <div class="aiChat_cardBg" style="padding:12px;width:100%;height:100%">
        <!--  超过五十个字，就转换成textarea模式 -->
        <!-- <el-input v-if="text.length < 50" class="inputClass" placeholder="请告诉我需要协助的事情，enter键发送" v-model="text"
            style="height:100%" @keyup="enterKey" :autofocus="true" maxlength="500">
        </el-input> -->
        <el-input type="textarea" :style="{
            marginTop: text.length > 50 ? '0px' : '-6px',
        }" class="inputClass inputClass_textarea" placeholder="请告诉我需要协助的事情，enter键发送" v-model="text" style="height:100%"
            @keyup="enterKey" :autofocus="true" maxlength="5000">
        </el-input>
        <div class="btnBox">
            <el-upload style="margin: 0px auto;
            top: 7px;
            position: relative;
            right: 7px;" v-model:file-list="fileList" :action="url" :headers="header" :http-request="getData" multiple
                :disabled="uploadDisabled" :limit="999999" :show-file-list="false" :accept="`
            .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.xlsx,.xls,.pdf,.txt
            `">
                <el-tooltip class="box-item" effect="dark" content="支持上传文件（最多6个，每个20MB） 接受pdf、doc、xlsx、txt等"
                    placement="top">
                    <el-button link :icon="'FolderAdd'" :type="'default'" style="margin-left:12px">
                    </el-button>
                </el-tooltip>
            </el-upload>
            <el-button link :icon="'Promotion'" type="default" @click="pushToTalkBox" :disabled="text.length == 0">
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { changeCardProperties } from '../../../../components/basicComponents/grid/module/cardApi/index';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { gridSizeMaker, componentInfo, gridCellTemplate } from '../../../../components/basicComponents/grid/module/dataTemplate';
import { getPreUrl, previewFile, request } from '../../../../utils/api/requests';
import { getHeaders } from '../../../../utils/api/user/header';
let timeout = null
const fileUpload = async (file) => {
    var formData = new FormData();
    formData.append("file", file);
    let res = await request({
        url: getPreUrl() + '/web/sys/file/searchContent',
        method: 'POST',
        data: formData,
        headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data"
        },
    })
    return res
};

export default defineComponent({
    name: 'inputBoxWithFile',
    componentInfo: {
        labelNameCN: "输入框(带文件上传）",
        key: "inputBoxWithFile",
        description:
            "输入框，用于用户输入，并发送给AI助手，搭配对话框使用",
        gridInfo: {
            middle: gridSizeMaker(4, 2),
        },
    } as componentInfo,
    components: { cardBg },
    props: {
        inputText: {
            type: String,
            default: ''
        },
        uploadDisabled: {
            type: Boolean,
            default: true
        },
        detail: {
            type: Object,
            default: () => { return {} }
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        talkLabel: {
            type: String
        },
        gridList: {
            type: Array,
            default: () => {
                return [] as Array<gridCellTemplate>;
            },
        },
        preUploadFile: {
            type: Function,
            default: () => {
                return (that, data) => {
                    console.log(data, '默认函数上传前')
                }
            }
        },
        uploadFile: {
            type: Function,
            default: () => {
                return (that, data) => {
                    console.log(data, '默认函数上传')
                }
            }
        },
        pushFunc: {
            type: Function,
            default: () => {
                return (that, data) => {
                    console.log(data, '默认函数')
                }
            }
        },
        wordFunc: {
            type: Function,
            default: () => {
                return (that, data) => {
                    console.log(data, '默认函数')
                }
            }
        }
    },
    watch: {
        text: {
            handler(val) {
                const that = this
                if (timeout) clearTimeout(timeout)
                if (this.wordFunc)
                    timeout = setTimeout(() => {
                        that.wordFunc(that, val)
                    }, 200);
            },
            deep: true,
            immediate: true
        },
        inputText: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val != '') {
                    this.text = val
                    let data = {}
                    data[this.detail.labelName] = {
                        inputText: ''
                    }
                    changeCardProperties(this, data)
                }
            }
        }
    },
    data() {
        return {
            text: '',
            talkSendList: [],
            isTalk: false,

            fileList: [],
            url: getPreUrl() + '/web/sys/file/searchContent',
            header: {
                ...getHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        }
    },
    mounted() {
        this.$emit('ready')
    },
    unmounted() {
    },
    methods: {
        async getData(e) {
            if (this.preUploadFile) {
                await this.preUploadFile(this, e.file)
            }
            let res = await fileUpload(e.file)
            if (this.uploadFile) {
                await this.uploadFile(this, {
                    uid: e.file.uid,
                    title: e.file.name,
                    type: e.file.type,
                    size: e.file.size > 1000 * 1000 ? (e.file.size / 1000 / 1000).toFixed(2) + 'mb' : (e.file.size / 1000).toFixed(2) + 'kb',
                    isUploaded: true,
                    ...res,
                })
            }
        },
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
            if (this.pushFunc) {
                await this.pushFunc(that, text)
                this.text = ''
            }
        },

        async pushToTalkBox() {
            if (this.text && !this.isLoading) {
                const that = this
                await this.pushWord(this.text)
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
        resize: none;
    }

    :deep(.el-input__wrapper) {
        box-shadow: none
    }
}

.inputClass_textarea {
    transition: all .5s;
}

.btnBox {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 30px;
    justify-content: flex-end;
    width: 60px;
    position: absolute;
    bottom: 12px;
    right: 12px;
}

.aiChat_cardBg {
    display: flex;
    background: white;
    border-radius: 8px;
    border: 1px solid #D1E6FF;
    box-shadow: 0px 4px 10px 0px rgba(80, 112, 255, 0.05);
}
</style>