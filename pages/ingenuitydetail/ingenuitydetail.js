/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var bdParse = require('../../bdParse/bdParse.js')
Page({
    data: {
        artisnLists: [],
        content:[]
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({
            uid: options.uid
        })
        this.getList(options.uid)
    },
    getList(uid) {
        var that = this;
        swan.request({
            url: 'https://app.16988.cn/user/artisn/detail', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data:{
                uid:uid
            },
            success: (res) => {
                console.log('ingenu',res.data);
                if (res.data.error_code == 0) {
                    this.setData({
                        infoMes:res.data.data,
                        ShopLists: res.data.data.goods_list,
                        content:bdParse.bdParse('article', 'html', res.data.data.ua_detail, that, 5)
                    })
                }
            },
            fail: (err) => {
                console.log(res.data);
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    
});
