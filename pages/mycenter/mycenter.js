/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var domin = require('../../uitls/domain.js')
Page({
    data: {
        myInfos:[],
        isLogin:false
    },
    onLoad:function(){
        if(swan.getStorageSync('loginData')){
            this.setData({
                myInfos:swan.getStorageSync('loginData'),
                isLogin:true
            })
        }else{
            this.setData({
                isLogin:false
            })
        }
    },

    myInfo() {
        swan.request({
            url: `${domin.dom}/user/common/myInfo` , // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            data: {
                mark: '17'
            },
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
    // 我的足迹MyLocalStorage.Cache.get('u_id')
    goToMyViews() {
        if(swan.getStorageSync('ZWCOOKIES')){
            swan.navigateTo({
                url: '/pages/myviews/myviews',
            })
        }else{
            swan.showToast({
                title: '请先登录'
            });
        }
    },
    // 我的订单
    goToMyOrder() {
        if (swan.getStorageSync('ZWCOOKIES')) {
            swan.navigateTo({
                url: `/pages/myorder/myorder`
            })
        } else {
            swan.showToast({
                title: '请先登录'
            });
        }
    },
//登录跳转
    gotoLogin() {
        console.log("89")
        swan.navigateTo({
            url: '/pages/login/login'
        })
    },


});
