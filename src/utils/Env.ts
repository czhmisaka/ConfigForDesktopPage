/*
 * @Date: 2022-08-16 13:01:09
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-17 09:45:40
 * @FilePath: /configforpagedemo/src/utils/Env.ts
 */

// 判断运行环境
function isClient(clientName: string) {
  return (
    window.navigator.userAgent.toLowerCase().indexOf(clientName.toLowerCase()) >
    -1
  );
}

export function isMobile() {
  // return window.screen.availWidth < 768;
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return window.navigator.userAgent; // 移动端
  } else {
    return false; // PC端
  }
}

export function isIphone() {
  return isClient("iPhone");
}

export function isAndroid() {
  return isClient("Android");
}

export function isWeixin() {
  return isClient("MicroMessenger");
}

export function isWorkWeixin() {
  return isClient("wxwork");
}

// 设备环境对象
export class DeviceEnv {
  Device: string;
  WebScreenSize: { width: number; height: number };
}

/**
 * @name: getDeviceEnv
 * @description: 获取设备环境对象
 * @authors: CZH
 * @Date: 2022-08-16 13:08:20
 * @param {*} Env
 */
export const getDeviceEnv = (): DeviceEnv => {
  let env = new DeviceEnv();

  return env;
};
