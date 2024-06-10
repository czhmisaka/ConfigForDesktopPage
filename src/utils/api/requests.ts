/*
 * @Date: 2022-01-22 18:59:01
 * @LastEditors: CZH
 * @LastEditTime: 2024-06-09 20:44:17
 * @FilePath: /ConfigForDesktopPage/src/utils/api/requests.ts
 */

import axios from "axios";
import { clearCookie, getCookie } from "./config/cookie";
import { getDownLoadRequestHeaders, getHeaders } from "./user/header";
export const CancelToken: any = axios.CancelToken; // axios 的取消请求
import { ElMessage } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { stringAnyObj } from "@/modules/userManage/types";
import { saveAs } from "file-saver";

// development , production
const Env = import.meta.env.VITE_MODE;
const isDev = () => Env == "development";
import { loadEnv } from "@build/index";
import { ElLoading } from "element-plus";
import { getPureRequestHeaders } from "./user/header";
import { timeConsole } from "@/router/util";
import { useRoute, useRouter } from "vue-router";
import router from "@/router";
const { VITE_PROXY_DOMAIN_REAL, VITE_PROXY_DOMAIN_FLOW } = loadEnv();

export function getPreUrl() {
  return VITE_PROXY_DOMAIN_REAL;
}
export function getFlowUrl() {
  return VITE_PROXY_DOMAIN_FLOW;
}

export function isMobile() {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true; // 移动端
  } else {
    return false; // PC端
  }
}

let baseURL = isDev ? "/" : "/";
export const request = axios.create({
  baseURL: baseURL, // 可以不需要
  timeout: 100000000000000000, // 超时时间
  withCredentials: true,
  validateStatus() {
    return true;
  },
});

// 防止重复提交 利用axios的cancelToken
// 这里保存了部分拒绝进入重复请求中断功能的请求
let pendingList: string[] = []; // 声明一个数组用于存储每个ajax请的取消函数和ajax标识

/**
 * 取消重复请求
 * @param config
 * @param f
 */
const queue: any[] = [];
// axios内置的中断ajax的方法

// 同样的url、方法、参数可以视为相同的请求
const configString = (config: any) => {
  if (
    pendingList
      .map((x) => {
        return config.url.indexOf(x) > -1 ? true : false;
      })
      .filter(Boolean).length > 0
  )
    return `${config.url}_${config.method}_${config.data}_${Math.random()}`;
  return `${config.url}_${config.method}_${config.data}_${Math.random()}`;
};

// 响应拦截调用
// 中断重复的请求，并从队列中移除
const removeQueue = (config: any) => {
  for (let i = 0, size = queue.length; i < size; i++) {
    const task = queue[i];
    if (task.token === configString(config)) {
      if (task.cancel) task.cancel();
      queue.splice(i, 1);
      break;
    }
  }
};
/**
 * 请求拦截器
 */
request.interceptors.request.use((config) => {
  removeQueue(config);
  // 添加cancelToken
  config.cancelToken = new CancelToken((c) => {
    queue.push({ token: configString(config), cancel: c });
  });
  //一定要将config return 出去
  return config;
});

/**
 * 响应拦截器
 */
//响应拦截
request.interceptors.response.use(
  (response) => {
    removeQueue(response.config);
    let res = response.data;
    if (res.status == 200 || res.code === 1000) {
      return Promise.resolve(res);
    } else if (response.status == 401 || res.code === 401) {
      // 未登录状态
      const route = router.getRoutes();
      const nowRoute = route.filter((x) => {
        return (
          window.location.hash.split("#")[1].indexOf(x.path.split("/:")[0]) >
          -1 && x.path != "/"
        );
      })[0];
      if (
        nowRoute?.meta &&
        (nowRoute?.meta["allPeopleCanSee"] || nowRoute?.meta["loginPage"])
      ) {
      } else {
        console.log("fuck");
        return useUserStoreHook().logOut(false);
      }
      return Promise.resolve({ data: {} });
    } else {
      if (res.message) ElMessage.error(res.message);
      return Promise.reject(res);
    }
  },
  (error: any) => {
    // Http错误状态码处理
    return Promise.reject(error);
  }
);

export const get = (url: string, params: any) => {
  let res = request({
    url: getPreUrl() + url,
    method: "get",
    headers: getHeaders(),
    params,
  }) as any;
  return res;
};

export function post(url: string, data: object) {
  return request({
    url: getPreUrl() + url,
    headers: getHeaders(),
    method: "post",
    data,
  }) as any;
}

// 聊天专用
export const chat = async (
  word: string,
  model: 'glm-4-0520' | 'glm-4 ' | 'glm-4-air' | 'glm-4-airx' | 'glm-4-flash' | 'glm-3-turbo' = 'glm-4-flash'
) => {
  const tokenRes = await post("/admin/iot/iot/getChatToken", { word, model });
  return tokenRes;
};

export function post_formData(url: string, params: object) {
  let formData = new FormData();
  for (let key in params) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].forEach((v: any) => {
          if (v || v === 0 || v === "0") {
            formData.append(key, v);
          }
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }
  return request({
    url: getPreUrl() + url,
    headers: getHeaders({
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    }),
    method: "post",
    data: formData,
  }) as any;
}

export function put(url: string, data: object) {
  return request({
    url: getPreUrl() + url,
    headers: getHeaders(),
    method: "put",
    data,
  }) as any;
}

export function del(url: string, params: any) {
  return request({
    url: getPreUrl() + url,
    method: "delete",
    headers: getHeaders(),
    params,
  }) as stringAnyObj;
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== "" &&
            typeof value[key] !== "undefined"
          ) {
            let params = propName + "[" + key + "]";
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}

// 验证是否为blob格式
export async function blobValidate(data) {
  try {
    const text = await data.text();
    JSON.parse(text);
    return false;
  } catch (error) {
    return true;
  }
}

// 通用下载方法
export function download(url, filename = "hahahha", params, config = {}) {
  let data = {
    headers: {
      ...getHeaders(),
    },
    responseType: "blob",
    ...config,
  };
  return request
    .post(
      getPreUrl() +
      url +
      (url == "/cult/sysFile/download"
        ? "?" +
        Object.keys(params)
          .map((x) => {
            return x + "=" + params[x];
          })
          .join("&")
        : ""),
      params,
      {
        ...(data as stringAnyObj),
      }
    )
    .then(async (data) => {
      const blob = new Blob([data as unknown as any]);
      saveAs(blob, filename);
    })
    .catch(async (err) => {
      const blob = new Blob([err], {
        type: "application/vnd.ms-excel; charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "统计分析";
      link.click();
      URL.revokeObjectURL(link.href);
      ElMessage.success("数据导出成功!");

      // saveAs(blob, filename);
    });
}
export function previewFile(url, params, config = {}) {
  let data = {
    headers: {
      ...getHeaders(),
    },
    responseType: "blob",
    ...config,
  };
  return request.get(
    getPreUrl() +
    url +
    (url == "/cult/sysFile/download"
      ? "?" +
      Object.keys(params)
        .map((x) => {
          return x + "=" + params[x];
        })
        .join("&")
      : ""),
    {
      ...(data as stringAnyObj),
    }
  );
}
// 通用下载方法
export function downloadget(url, filename = "hahahha", params, config = {}) {
  let data = {
    headers: {
      ...getHeaders(),
    },
    responseType: "blob",
    ...config,
  };
  return request
    .get(
      getPreUrl() +
      url +
      (url == "/cult/sysFile/download"
        ? "?" +
        Object.keys(params)
          .map((x) => {
            return x + "=" + params[x];
          })
          .join("&")
        : ""),
      {
        ...(data as stringAnyObj),
      }
    )
    .then(async (data) => {
      const blob = new Blob([data as unknown as any]);
      saveAs(blob, filename);
      // const reader = new FileReader();
      // reader.readAsDataURL(data);
      // const blob = new Blob([data as unknown as any]);
      // saveAs(blob, filename);
    })
    .catch(async (err) => {
      ElMessage.success("数据导出失败!");
    });
}
export const uploadProps = {
  action: getPreUrl() + "/cult/sysFile/upload",
  headers: getDownLoadRequestHeaders(),
};
