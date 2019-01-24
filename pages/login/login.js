/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var md5 = require('../../uitls/md5.min.js')
Page({
    data: {
        phoneNum: '',   //手机号
        yzmTexts: '',    //验证码
        pwdText: '',     //密码
        passText: '',
        pwdType: 'password',
        pwdIsShow: true,
        yzmIsSend: false,
        yzmTimer: 60,
        isFail: false,   //是否已经是掌玩资深用户
        failShow: false, //失败弹框是否出现
        isSuc: false,    //是否领取代金券成功
        sucShow: false,  //成功弹框是否出现
        yzmClick: false, //是否获取过验证码
        isOld: false,    //是否是老用户
        loginWay1: true,   // 密码登录&验证码登录切换
        loginWay2: false,   // 密码登录&验证码登录切换
        passWord: '',
        confirmState: false
    },
    onLoad: function () {
        console.log(this.data)
    },
    myInfo() {
        swan.request({
            url: 'https://dev-app.16988.cn/user/common/myInfo', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log(res.data);
                if (res.data.error_code == 0) {
                    this.setData({
                        myInfos: res.data.data,
                        isLogin: true
                    })
                } else {
                    this.setData({
                        isLogin: false
                    })
                }

            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    clickTab1() {
        this.setData({
            loginWay1: true,
            loginWay2: false
        })
    },
    clickTab2() {
        this.setData({
            loginWay1: false,
            loginWay2: true
        })
    },
    bindKeyInput: function (e) {
        console.log(e)
        this.setData({
            phoneNum: e.detail.value
        });
    },
    bindPassInput: function (e) {
        console.log(e)
        this.setData({
            passText: e.detail.value
        });
    },
    bindYzmInput: function (e) {
        console.log(e)
        this.setData({
            yzmTexts: e.detail.value
        });
    },
    confirm() {
        var that = this;
        this.confirmState = false;
        setTimeout(function () {
            swan.navigateTo({
                url: 'pages/detail/detail'
            });
        }, 1000)
    },
    sendYZM() {   //发送验证码
        var that = this;
        if (this.data.yzmIsSend) {
            return false;
        }
        console.log(this.data)
        if (!/^1[34578][0-9]{9}$/.test(this.data.phoneNum.replace(/\s*/g, ''))) {
            console.log('请输入正确的手机号');
            return false;
        }
        var timeStamp = (new Date()).valueOf();
        var map = new Map([
            ['appsecret', "h6eeded797aa2a8736ea90c09d8793c5"],
            ['phone', that.data.phoneNum.replace(/\s*/g, '')],
            ['timeStamp', timeStamp],
            ['type', 1]
        ]);
        var string = ""
        for (let [key, value] of map.entries()) {
            string += `${key}=${value}&`
        }
        var str = string.substr(0, string.length - 1);
        var md5ed = md5(str)
        swan.request({
            url: 'https://dev-app.16988.cn/user/common/getcaptcha', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            data: {
                phone: that.data.phoneNum.replace(/\s*/g, ''),
                type: 1,
                timeStamp: timeStamp,
                sign: md5ed
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log(res.data);
                if (res.data.error_msg == "") {
                    if (res.data.data === true) {   //发送验证码成功
                        this.setData({
                            // myInfos: res.data.data,
                            yzmClick: true,
                            yzmIsSend: true
                        })
                        // this.yzmClick = true;    //成功发送验证码
                        console.log('验证码发送成功');
                        // this.yzmIsSend = true;
                        const timer = setInterval(() => {
                            this.data.yzmTimer--;
                            if (this.data.yzmTimer <= 0) {
                                clearInterval(timer);
                                this.data.yzmTimer = 60;
                                this.data.yzmIsSend = false;
                            }
                        }, 1000);
                    } else if (data.data === false) {    //发送验证码失败
                        console.log('验证码发送失败，请稍后重试');
                    } else {
                        console.log('服务器错误，请稍候重试~');
                    }
                } else if (data.error_msg == "该手机号码已经注册，请返回登陆") {    ////手机号已经注册  -->老用户弹框
                    // this.loginWay = false;
                    this.setData({
                        loginWay: false
                    })
                    console.log(data.error_msg);
                } else {
                    console.log(data.error_msg);
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },

    loginBypass() {
        var that = this;
        if (!/^1[34578][0-9]{9}$/.test(that.data.phoneNum.replace(/\s*/g, ''))) {
            console.log('请输入正确的手机号');
            return false;
        }
        if (!that.data.passText) {
            console.log('请输入密码');
            return false;
        }
        swan.request({
            url: 'https://dev-app.16988.cn/user/common/login', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            data: {
                phone: that.data.phoneNum.replace(/\s*/g, ''),
                password: that.data.passText,
            },
            header: {
                'content-type': 'application/json', // 默认值
                
            },
            success: (res) => {
                console.log(res.data);
                let data = res.data.data;
                console.log(res.data)
                if (res.data.error_code == '0') {
                    console.log('登录成功');
                    console.dir(res.header)
                    console.log(res.header['set-cookie'])
                    let COOKS = res.header['set-cookie'] || ''
                    let ARRYS = COOKS.match(/([\w\-.]*)=([^\s=]+);/g) || []
                    
                    ARRYS.forEach((str) => {
                        if (str.indexOf('JPSESSID=') !== -1) {
                            swan.setStorageSync('ZWCOOKIES', str);
                            swan.setStorageSync('loginData', res.data.data)
                            console.log(str);
                            // swan.setStorage({
                            //     key: 'ZWCOOKIES',
                            //     data: str
                            // });
                        }
                    })
                    setTimeout(function () {
                        swan.reLaunch({
                            url: '/pages/index/index',
                        });
                    }, 1000)
                }
                else {
                    console.log('登录失败');
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    loginByCode() {
        var that = this;
        if (!this.data.yzmClick) {
            console.log('请先获取验证码');
            return false;
        }
        if (!/^1[34578][0-9]{9}$/.test(this.data.phoneNum.replace(/\s*/g, ''))) {
            console.log('请输入正确的手机号');
            return false;
        }
        // alert('',this.yzmTexts)
        if (!this.data.yzmTexts) {
            console.log('请输入验证码');
            return false;
        }
        if (!/^\d{6}$/.test(this.data.yzmTexts)) {
            console.log('请输入正确的验证码');
            return false;
        }
        // alert(that.yzmTexts)
        swan.request({
            url: 'https://dev-app.16988.cn/user/common/login', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            data: {
                phone: that.data.phoneNum.replace(/\s*/g, ''),
                captcha: that.data.yzmTexts,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log(res.data);
                let data = res.data.data;
                console.log(res.data)
                if (res.data.error_code == '0') {
                    console.log('登录成功');
                    swan.getStorage({
                        u_id: res.data.data.u_id,
                        success: function (res) {
                            console.log(res.data);
                        },
                        fail: function (err) {
                            console.log('错误码：' + err.errCode);
                            console.log('错误信息：' + err.errMsg);
                        }
                    });
                    setTimeout(function () {
                        swan.reLaunch({
                            url: '/pages/index/index',
                        });
                    }, 1000)
                }
                else {
                    console.log('登录失败');
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
});
