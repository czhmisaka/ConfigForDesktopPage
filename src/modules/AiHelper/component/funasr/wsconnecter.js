/*
 * @Date: 2024-04-14 02:00:44
 * @LastEditors: CZH
 * @LastEditTime: 2024-04-14 22:41:22
 * @FilePath: /ConfigForDesktopPage/src/modules/AiHelper/component/funasr/wsconnecter.js
 */
/**
 * Copyright FunASR (https://github.com/alibaba-damo-academy/FunASR). All Rights
 * Reserved. MIT License  (https://opensource.org/licenses/MIT)
 */
/* 2021-2023 by zhaoming,mali aihealthx.com */

export function WebSocketConnectMethod(config) { //定义socket连接方法类
	var speechSokt;
	var connKeeperID;
	var msgHandle = config.msgHandle;
	var stateHandle = config.stateHandle;
	this.wsStart = function () {
		var Uri = 'ws://127.0.0.1:10096/'
		// var Uri = 'ws://123.206.222.58:10096/'
		if (Uri.match(/wss:\S*|ws:\S*/)) {
			console.log("Uri" + Uri);
		}
		else {
			alert("请检查wss地址正确性");
			return 0;
		}

		if ('WebSocket' in window) {
			speechSokt = new WebSocket(Uri); // 定义socket连接对象
			speechSokt.onopen = function (e) { onOpen(e); }; // 定义响应函数
			speechSokt.onclose = function (e) {
				console.log("onclose ws!");
				//speechSokt.close();
				onClose(e);
			};
			speechSokt.onmessage = function (e) { onMessage(e); };
			speechSokt.onerror = function (e) { onError(e); };
			return 1;
		}
		else {
			alert('当前浏览器不支持 WebSocket');
			return 0;
		}
	};

	// 定义停止与发送函数
	this.wsStop = function () {
		if (speechSokt != undefined) {
			console.log("stop ws!");
			speechSokt.close();
		}
	};

	this.wsSend = function (oneData) {
		if (speechSokt == undefined) return;
		if (speechSokt.readyState === 1) { // 0:CONNECTING, 1:OPEN, 2:CLOSING, 3:CLOSED
			speechSokt.send(oneData);
		}
	};
	// SOCEKT连接中的消息与状态响应
	function onOpen(e) {
		// 发送json
		var chunk_size = new Array(5, 10, 5);
		var request = {
			"chunk_size": chunk_size,
			"wav_name": "h5",
			"is_speaking": true,
			"chunk_interval": 10,
			"itn": false,
			"mode": 'mode2pass',

		};
		console.log(JSON.stringify(request));
		speechSokt.send(JSON.stringify(request));
		console.log("连接成功");
		stateHandle(0);

	}
	function onClose(e) {
		stateHandle(1);
	}
	function onMessage(e) {
		msgHandle(e);
	}
	function onError(e) {
		stateHandle(2);
	}
}