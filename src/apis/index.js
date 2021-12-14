import axios from "axios"
export function apiSendSmsCode(phone) {
    return new Promise((resolve, reject) => {
        axios.post("https://api.internetofcity.cn/api/auth/anon/validate/sms/code", `{"mobile":"${String(phone)}","sms":"1"}`, {
            headers: {
                "Content-Type": "application/json",
                "deviceid": "qianjiachun",
            }
        }).then(ret => {
            resolve(ret);
        }).catch(err => {
            reject(err);
        })
    })
}

export function apiGetLingxiToken(phone, sms) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.internetofcity.cn/api/auth/anon/login/sms?mobile=${phone}&sms=${sms}`, {
            headers: {
                "deviceid": "qianjiachun",
                "authorization": "Basic YXBwOmFwcA==",
            }
        }).then(ret => {
            resolve(ret);
        }).catch(err => {
            reject(err);
        })
    })
}

export function apiGetSuHealthCodeToken(access_token) {
    return new Promise((resolve, reject) => {
        axios.post("https://api.internetofcity.cn/api/channel/suHeath/getSuHeathCode", "{}", {
            headers: {
                "deviceid": "qianjiachun",
                "authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json; charset=UTF-8",
            }
        }).then(ret => {
            resolve(ret);
        }).catch(err => {
            reject(err);
        })
    })
}