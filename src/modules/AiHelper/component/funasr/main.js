/**
 * Copyright FunASR (https://github.com/alibaba-damo-academy/FunASR). All Rights
 * Reserved. MIT License  (https://opensource.org/licenses/MIT)
 */
/* 2022-2023 by zhaoming,mali aihealthx.com */

import { RecorderGetter } from "./recorder-core";
import { WebSocketConnectMethod } from "./wsconnecter";


export function mainControl(messageGetter) {
	var isRec = false;
	// 连接; 定义socket连接类对象与语音对象
	var wsconnecter = new WebSocketConnectMethod({ msgHandle: getJsonMessage, stateHandle: getConnState });
	// 录音; 定义录音对象,wav格式
	Recorder = RecorderGetter()
	var rec = Recorder({
		type: "pcm",
		bitRate: 16,
		sampleRate: 16000,
		onProcess: recProcess
	});
	var sampleBuf = new Int16Array();
	var rec_text = "";  // for online rec asr result
	var offline_text = ""; // for offline rec asr result

	function handleWithTimestamp(tmptext, tmptime) {
		if (tmptime == null || tmptime == "undefined" || tmptext.length <= 0) {
			return tmptext;
		}
		tmptext = tmptext.replace(/。|？|，|、|\?|\.|\ /g, ","); // in case there are a lot of "。"
		var words = tmptext.split(",");  // split to chinese sentence or english words
		var jsontime = JSON.parse(tmptime); //JSON.parse(tmptime.replace(/\]\]\[\[/g, "],[")); // in case there are a lot segments by VAD
		var char_index = 0; // index for timestamp
		var text_withtime = "";
		for (var i = 0; i < words.length; i++) {
			if (words[i] == "undefined" || words[i].length <= 0) {
				continue;
			}


			if (/^[a-zA-Z]+$/.test(words[i])) {   // if it is english
				text_withtime = text_withtime + jsontime[char_index][0] / 1000 + ":" + words[i] + "\n";
				char_index = char_index + 1;  //for english, timestamp unit is about a word
			}
			else {
				// if it is chinese
				text_withtime = text_withtime + jsontime[char_index][0] / 1000 + ":" + words[i] + "\n";
				char_index = char_index + words[i].length; //for chinese, timestamp unit is about a char
			}
		}
		return text_withtime;


	}
	// 语音识别结果; 对jsonMsg数据解析,将识别结果附加到编辑框中
	function getJsonMessage(jsonMsg) {
		var rectxt = "" + JSON.parse(jsonMsg.data)['text'];
		var asrmodel = JSON.parse(jsonMsg.data)['mode'];
		var timestamp = JSON.parse(jsonMsg.data)['timestamp'];
		if (asrmodel == "2pass-offline" || asrmodel == "offline") {
			offline_text = offline_text + handleWithTimestamp(rectxt, timestamp); //rectxt; //.replace(/ +/g,"");
			rec_text = offline_text;
		}
		else {
			rec_text = rec_text + rectxt; //.replace(/ +/g,"");
		}
		// var varArea = document.getElementById('varArea');
		// varArea.value = rec_text;
		messageGetter(rec_text)
	}

	// 连接状态响应
	function getConnState(connState) {
		if (connState === 0) { //on open
		} else if (connState === 1) {
		} else if (connState === 2) {
			stop();
		}
	}

	function record() {
		rec.open(function () {
			rec.start();
		});
	}



	// 识别启动、停止、清空操作
	function start() {
		var ret = wsconnecter.wsStart();
		if (ret == 1) {
			isRec = true;
			return 1;
		}
		else {
			return 0;
		}
	}


	function stop() {
		rec_text = '';
		offline_text = ''
		var chunk_size = new Array(5, 10, 5);
		var request = {
			"chunk_size": chunk_size,
			"wav_name": "h5",
			"is_speaking": false,
			"chunk_interval": 10,
			"mode": 'mode2pass',
		};
		if (sampleBuf.length > 0) {
			wsconnecter.wsSend(sampleBuf);
			sampleBuf = new Int16Array();
		}
		wsconnecter.wsSend(JSON.stringify(request));
		// 控件状态更新
		isRec = false;
	}


	function recProcess(buffer, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
		if (isRec === true) {
			var data_48k = buffer[buffer.length - 1];
			var array_48k = new Array(data_48k);
			var data_16k = Recorder.SampleData(array_48k, bufferSampleRate, 16000).data;
			sampleBuf = Int16Array.from([...sampleBuf, ...data_16k]);
			var chunk_size = 960; // for asr chunk_size [5, 10, 5]
			while (sampleBuf.length >= chunk_size) {
				let sendBuf = sampleBuf.slice(0, chunk_size);
				sampleBuf = sampleBuf.slice(chunk_size, sampleBuf.length);
				wsconnecter.wsSend(sendBuf);
			}
		}
	}

	return {
		start: start,
		stop: stop,
		record: record,
	}
}
