/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var domin = require('../../uitls/domain.js')
Page({
    data: {
        goodsHisLists: []
    },
    onLoad: function () {
        this.getViewsList()
    },
    getViewsList() {
        swan.request({
            url: `${domin.testdom}/user/visit/goodsHisLists` , // 仅为示例，并非真实的接口地址
            method: 'POST',
            dataType: 'json',
            data: {
                page:1,
            },
            header: {
                'content-type': 'application/json', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: (res) => {
                console.log(res.data);
                if (res.data.error_code == 0) {
                    this.setData({
                        goodsHisLists: res.data.data,
                    })
                } else {
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    
    // 跳转详情
    gotoViewDetail: function (e) {
        console.log(e.currentTarget.dataset.goodid)
        swan.navigateTo({
            url: `/pages/detail/detail?link=${e.currentTarget.dataset.goodid}`
        })
    }
});
