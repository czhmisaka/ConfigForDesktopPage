/*
 * @Date: 2022-10-31 08:52:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-25 21:51:27
 * @FilePath: /ConfigForDesktopPage/vite.config.js
 */
import { loadEnv } from "vite";
import pkg from "./package.json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import ViteRequireContext from "@originjs/vite-plugin-require-context";
import envCompatible from "vite-plugin-env-compatible";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import { warpperEnv } from "./build";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import { getPluginsList } from "./build/plugins";

/** 当前执行node命令时文件夹的地址（工作目录） */
const root = process.cwd();

/** 路径查找 */
const pathResolve = (dir) => {
  return path.resolve(__dirname, ".", dir);
};

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: {
    dependencies,
    devDependencies,
    name,
    version,
  },
  lastBuildTime: new Date().getTime(),
};

// 配置参考
// https://vitejs.dev/config/
export default ({ mode, command }) => {
  const {
    VITE_CDN,
    VITE_PORT,
    VITE_LEGACY,
    VITE_COMPRESSION,
    VITE_PUBLIC_PATH,
    VITE_PROXY_DOMAIN,
    VITE_PROXY_DOMAIN_REAL,
  } = warpperEnv(loadEnv(mode, root), mode);
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js',
        "@": pathResolve("src"),
        "@build": pathResolve("build"),
        fs: require.resolve("rollup-plugin-node-builtins/src/es6/util.js"),
      },
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    plugins: [
      ViteRequireContext(),
      viteCommonjs(),
      envCompatible(),
      nodeResolve(),
      createHtmlPlugin({
        inject: {
          data: {
            title: "configForDesktopPage",
          },
        },
      }),
      ...getPluginsList(command, VITE_LEGACY, VITE_CDN, VITE_COMPRESSION),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    optimizeDeps: {
      include: ["pinia", "lodash-es", "@vueuse/core", "dayjs"],
      exclude: ["@pureadmin/theme/dist/browser-utils"],
    },
    build: {
      sourcemap: false,
      // target: "esnext",
      target: ['chrome64'],
      cssTarget: ["chrome64"],
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 10000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html"),
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    server: {
      strictPort: false,
      port: 9040,
      proxy: {
        "/api_api_xcb/": {
          name: "dev",
          target: 'http://192.168.174.99:8001/',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => {
            return path.replace(/^\/api_api_xcb/, "")
          }
        },
        // 本地测试文档服务器用的
        "/api/docMaker/": {
          name: "dev",
          target: 'http://127.0.0.1:4900/',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, "")
          }
        },
        "/api/piwigo": {
          name: 'dev31',
          target: 'http://42.192.134.238:1200/',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api\/piwigo/, "/")
        },
        "/api": {
          name: "dev",
          target: 'http://desktop.czht.top/api',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, "/"),
        },
        "/imageserver/": {
          name: 'dev1',
          // target: 'http://42.192.134.238:1200',
          target: 'http://42.192.134.238:1200/',
          // target: 'http://127.0.0.1',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/imageserver/, "/")
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      "process.env": {},
      "process.platform": JSON.stringify(__APP_INFO__),
    },
  };
};
