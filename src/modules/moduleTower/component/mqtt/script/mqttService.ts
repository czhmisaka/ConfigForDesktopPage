/*
 * @Date: 2024-02-14 23:16:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-08 20:52:20
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/script/mqttService.ts
 */
import { useUserStoreHook } from "@/store/modules/user";
import mqtt from "./mqtt";
import { loadEnv } from "@build/index";
const { VITE_PROXY_DOMAIN_MQTT } = loadEnv();

const connectUrl = VITE_PROXY_DOMAIN_MQTT;
const DefaultOptions = {
  clean: true, // 保留会话
  connectTimeout: 4000, // 超时时间
  reconnectPeriod: 1000, // 重连时间间隔
};

let funcData = {};

// 获取mqtt 服务
export const mqttService = async (
  key = "",
  messageBack = (topic, msg, pac) => {}
) => {
  let user = await useUserStoreHook().getOptions();
  const client = mqtt.connect(connectUrl, {
    ...DefaultOptions,
    clientId: user.id + "_web_" + key,
  });
  funcData[key] = messageBack;
  client.on("message", function (topic, message, packet) {
    // console.log(topic, message.toString());
    funcData[topic](topic, message.toString(), packet);
    // messageBack(topic, message.toString(), packet);
  });
  client.on("connect", () => {
    // 成功连接后触发的回调
    // console.log("成功连接");
    client.subscribe([key], () => {
      // console.log(`订阅成功 ${key}`);
    });
  });
  return client;
};
