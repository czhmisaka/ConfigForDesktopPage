<!--
 * @Date: 2023-03-20 14:36:17
 * @LastEditors: CZH
 * @LastEditTime: 2024-05-30 19:23:36
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/module/baseToolComponents/editor.vue
-->
<script setup lang="ts">
// import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
// import { onBeforeUnmount, ref, shallowRef, onMounted, watchEffect } from "vue";
// import Edit from "@iconify-icons/ep/edit";
// import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
// import { loadEnv } from "@build/index";
// import { getPreUrl } from "@/utils/api/requests";
// import { nextTick } from "process";

// defineOptions({
//   name: "Editor",
// });
// const mode = "default";
// // 编辑器实例，必须用 shallowRef
// const editorRef = shallowRef();
// // 内容 HTML
// const valueHtml = ref("");
// const toolbarConfig: any = { excludeKeys: "fullScreen" };
// const editorConfig = {
//   placeholder: "请输入内容...",
// } as { [key: string]: any };
// editorConfig["MENU_CONF"] = {};
// editorConfig["MENU_CONF"]["uploadImage"] = {
//   fieldName: "file",
//   server: getPreUrl() + "/web/sys/file/upload",
//   headers: {
//     ...getDownLoadRequestHeaders(),
//   },
//   data: {
//     returnPath: true,
//   },
//   customInsert(res: any, insertFn: any) {
//     if (res.data) insertFn(res.data, "", res.data);
//   },
// };
// const props = defineProps({
//   modelValue: {
//     type: String,
//     default: "",
//   },
// });
// onMounted(() => {
//   if (props.modelValue) {
//     const editor = editorRef.value;
//     editor && editor.setHtml(props.modelValue);
//   }
// });
// // 组件销毁时，也及时销毁编辑器
// onBeforeUnmount(() => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   editor.destroy();
// });

// watchEffect(() => {
//   const editor = editorRef.value;
//   if (!editor) return;
//   if (props.modelValue) editor.setHtml(props.modelValue);
//   else editor.setHtml(" ");
// });
// const handleCreated = (editor) => {
//   editorRef.value = editor; // 记录 editor 实例，重要！
// };

// const emit = defineEmits(["update:modelValue"]);
// const handleChange = (editor) => {
//   emit("update:modelValue", editor.getHtml());
// };
</script>

<template>
  <!-- <cardBg
    :cus-style="{
      width: 'calc(100% - 12px)',
    }"
  >
    <div class="wangeditor">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <div style="height: calc(100% - 100px);">
        <Editor
        style="overflow-y: hidden;" 
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
          @onChange="handleChange"
        />
      </div>
      
    </div>
  </cardBg> -->
</template>
<style>
.wangeditor {
  height: 100%;
  overflow:hidden;
}
</style>