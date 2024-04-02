/*
 * @Date: 2024-03-08 14:12:24
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-26 10:42:43
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/types.ts
 */

// iot事件 触发检测类型
export const iotEventTriggerTypeObject = {
  inArray: "在选项中",
  outArray: "在选项外",
  inRange: "在范围中",
  outRange: "在范围外",
  is: "是",
  not: "不是",
  customTriggerFunc: "customTriggerFunc",
};
export type iotEventTriggerType = keyof typeof iotEventTriggerTypeObject;

// iot事件 触发后执行事件 类型
export const iotEventActionTypeObject = {
  sendMsg: "sendMsg",
  keyMapTransform: "keyMapTransform",
  saveDataToMySql: "saveDataToMySql",
};


export type iotEventActionType = keyof typeof iotEventActionTypeObject;

// iot事件 事件模板
export interface iotEventTemplate {
  id?: number;
  createTime?: Date;
  updateTime?: Date;
  /** 事件名称 */
  name: string;
  /** 事件描述 */
  description?: string;
  /** 用户id */
  userId: string;
  /** 触发主题 */
  triggerTopic: string;
  /** 触发范围 */
  triggerTarget: string;
  /** 触发方式 */
  triggerType: iotEventTriggerType;
  /** 触发条件 */
  triggerCondition: string;
  /** 触发事件类型 */
  eventType: iotEventActionType;
  /** 目标主题 */
  targetTopic: string;
}
