/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var md5 = require('../../uitls/md5.min.js')
var domin = require('../../uitls/domain.js')
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
        yzmClick: false, //是否获取过验证码
        loginWay1: true,   // 密码登录&验证码登录切换
        loginWay2: false,   // 密码登录&验证码登录切换
        passWord: '',
        confirmState: false
    },
    onLoad: function () {
        console.log(this.data)
        console.log(domin.dom)
        console.log(domin.dom)
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
    userAgreement(){
        var linkData = `${domin.dom}/html/userAgreement.html`
        swan.navigateTo({
            url: `/pages/banner/banner?link=${encodeURIComponent(linkData)}`
        })
    },
    bindKeyInput: function (e) {
        this.setData({
            phoneNum: e.detail.value
        });
    },
    bindPassInput: function (e) {
        this.setData({
            passText: e.detail.value
        });
    },
    bindYzmInput: function (e) {
        this.setData({
            yzmTexts: e.detail.value
        });
    },
    sendYZM() {   //发送验证码
        var that = this;
        if (this.data.yzmIsSend) {
            return false;
        }
        if (!/^1[34578][0-9]{9}$/.test(this.data.phoneNum.replace(/\s*/g, ''))) {
            swan.showToast({
                title: '手机号不对'
            });
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
            url: `${domin.dom}/user/common/getcaptcha` , // 仅为示例，并非真实的接口地址
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
                if (res.data.error_msg == "") {
                    if (res.data.data === true) {   //发送验证码成功
                        this.setData({
                            yzmClick: true,
                            yzmIsSend: true
                        })
                        // this.yzmClick = true;    //成功发送验证码
                        console.log('验证码发送成功');
                        // this.yzmIsSend = true;
                        const timer = setInterval(() => {
                            
                            this.data.yzmTimer--;
                            this.setData({
                                yzmTimer:this.data.yzmTimer
                            })
                            if (this.data.yzmTimer <= 0) {
                                clearInterval(timer);
                                this.setData({
                                    yzmTimer:60,
                                    yzmIsSend:false
                                })
                            }
                        }, 1000);
                    } else if (data.data === false) {    //发送验证码失败
                        swan.showToast({
                            title: '验证码发送失败，请稍后重试'
                        });
                    } else {
                        swan.showToast({
                            title: '服务器错误，请稍候重试~'
                        });
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
            swan.showToast({
                title: '手机号必须'
            });
            return false;
        }
        if (!that.data.passText) {
            swan.showToast({
                title: '请输入密码'
            });
            return false;
        }
        swan.request({
            url:`${domin.dom}/user/common/login`, // 仅为示例，并非真实的接口地址
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
                let data = res.data.data;
                if (res.data.error_code == '0') {
                    swan.showToast({
                        title: '登录成功'
                    });
                    console.log('1-登录成功-1')
                    console.log(res)
                    console.log(res.header['set-cookie'])||res.header['Set-Cookie']
                    console.log('2-登录成功-2')
                    let COOKS = res.header['set-cookie'] || res.header['Set-Cookie']||''
                    let ARRYS = COOKS.match(/([\w\-.]*)=([^\s=]+);/g) || []
                    
                    ARRYS.forEach((str) => {
                        if (str.indexOf('JPSESSID=') !== -1) {
                            swan.setStorageSync('ZWCOOKIES', str);
                            swan.setStorageSync('loginData', res.data.data)
                            console.log(str);
                            console.log('3-登录成功-3')
                        }
                    })
                    
                    setTimeout(function () {
                        swan.reLaunch({
                            url: '/pages/index/index',
                        });
                    }, 1000)
                }
                else {
                    swan.showToast({
                        title: res.data.error_msg
                    });
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
            swan.showToast({
                title: '请先获取验证码'
            });
            return false;
        }
        if (!/^1[34578][0-9]{9}$/.test(this.data.phoneNum.replace(/\s*/g, ''))) {
            swan.showToast({
                title: '手机号必须'
            });
            return false;
        }
        // alert('',this.yzmTexts)
        if (!this.data.yzmTexts) {
            swan.showToast({
                title: '请输入验证码'
            });
            return false;
        }
        if (!/^\d{6}$/.test(this.data.yzmTexts)) {
            swan.showToast({
                title: '请输入正确的验证码'
            });
            return false;
        }
        swan.request({
            url:`${domin.dom}/user/common/login` , // 仅为示例，并非真实的接口地址
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
                let data = res.data.data;
                if (res.data.error_code == '0') {
                    swan.showToast({
                        title: '登录成功'
                    });
                    let COOKS = res.header['set-cookie'] || res.header['Set-Cookie']||''
                    let ARRYS = COOKS.match(/([\w\-.]*)=([^\s=]+);/g) || []
                    
                    ARRYS.forEach((str) => {
                        if (str.indexOf('JPSESSID=') !== -1) {
                            swan.setStorageSync('ZWCOOKIES', str);
                            swan.setStorageSync('loginData', res.data.data)
                        }
                    })
                    setTimeout(function () {
                        swan.reLaunch({
                            url: '/pages/index/index',
                        });
                    }, 1000)
                }
                else {
                    swan.showToast({
                        title: res.data.error_msg
                    });
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
});
