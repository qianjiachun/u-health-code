<template>
    <div class="wrap">
		<iframe v-if="hasToken" :src="iframeUrl" class="webview" scrolling=no></iframe>
		<div v-else class="form">
			<CellGroup inset>
				<Field
					v-model="phone"
					required
					label="手机号"
					placeholder="请输入手机号"
				/>
				<Field
					v-model="sms"
					center
					label="验证码"
					placeholder="请输入短信验证码"
				>
					<template #button>
						<Button :disabled="isSending" size="small" type="primary" @click="onClickSendCode">{{sendingText}}</Button>
					</template>
				</Field>
				<Button style="margin-top: 10px;" round block type="primary" @click="onClickLogin">
					登录
				</Button>
			</CellGroup>
			
		</div>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import { Field, CellGroup, Button, Notify } from 'vant'

import { apiGetLingxiToken, apiGetSuHealthCodeToken, apiSendSmsCode } from "../apis"

let hasToken = ref(false);
let iframeUrl = ref("");

let sms = ref("");
let phone = ref("");
let isSending = ref(false);
let cd = ref(0);
let sendingText = ref("发送验证码");

function onClickSendCode() {
	if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phone.value)) {
		cd.value = 60;
		isSending.value = true;
		sendingText.value = `${String(cd.value)}s`;
		cd.value--;
		let timer = setInterval(() => {
			sendingText.value = `${String(cd.value)}s`;
			if (cd.value <= 0) {
				isSending.value = false;
				sendingText.value = "发送验证码";
				clearInterval(timer);
			}
			cd.value--;
		}, 1000);
		apiSendSmsCode(phone.value).then(ret => {
			if (ret.data.code == 200) {
				Notify({ type: 'success', message: '短信验证码发送成功' });
			} else {
				Notify({ type: 'warning', message: ret.data.info });
			}
		}).catch(err => {
			console.log(err);
		})
	} else {
		Notify({ type: 'warning', message: '请输入正确的手机号' });
	}
}

async function onClickLogin() {
	if (sms.value === "") {
		Notify({ type: 'warning', message: '请输入短信验证码' });
		return;
	}
	let ret = await apiGetLingxiToken(phone.value, sms.value);
	if (ret.data.code !== 200) {
		Notify({ type: 'warning', message: ret.data.info });
		return;
	}
	let access_token = ret.data.data.access_token;
	ret = await apiGetSuHealthCodeToken(access_token);
	if (ret.data.code !== 200) {
		Notify({ type: 'warning', message: ret.data.info });
		return;
	}
	let tokenObj = JSON.parse(String(ret.data.data).replace(/\\/g, ""));
	localStorage.setItem("jkm", tokenObj.token);
	goToSuHealthCode(tokenObj.token);
	hasToken.value = true;
}


function goToSuHealthCode(token) {
	iframeUrl.value = "https://jsstm.jszwfw.gov.cn/jkmIndex.html?token=" + token;
}

onMounted(() => {
    let token = localStorage.getItem("jkm");
	if (token && token !== "") {
		hasToken.value = true;
		goToSuHealthCode(token);
	}
})

</script>

<style scoped>
.wrap {
    width: 100%;
    height: 100%;
}
.wrap .webview {
    width: 100%;
    height: 100%;
    overflow: hidden;
	border: medium none;
}
.wrap .form {
	height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>