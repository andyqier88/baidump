/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var domin = require('../../uitls/domain.js')
Page({
    data: {
        imgs: [
            "https://zhangwan-picture-prod.oss-cn-hangzhou.aliyuncs.com/aliyun_oss/mall_ad_images/201809/30/JFFQY7tp5z.png",
            "https://zhangwan-picture-prod.oss-cn-hangzhou.aliyuncs.com/aliyun_oss/mall_ad_images/201809/30/JFFQY7tp5z.png",
            "https://zhangwan-picture-prod.oss-cn-hangzhou.aliyuncs.com/aliyun_oss/mall_ad_images/201809/30/JFFQY7tp5z.png"
        ]
    },
    onLoad: function () {
        swan.request({
            url: `${domin.testdom}/common/ad/lists` , // 仅为示例，并非真实的接口地址
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
                this.setData({
                    imgsItem: res.data.data
                })
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
        this.getdiscoverList();
        this.hotActive();
        this.getV2Category();
    },
    // 分类获取
    getV2Category(){
        swan.request({
            url: `${domin.testdom}/mall/goods/category/h5shop` , // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log(res.data);
                this.setData({
                    V2Category: res.data.data
                })
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 分类跳转
    gotoV2CateIndex(e){
        swan.navigateTo({
            url:`/pages/category/category?cgid=${e.currentTarget.dataset.cgid}`
        })
    },
    // 热门活动
    hotActive() {
        swan.request({
            url: `${domin.testdom}/common/ad/lists?mark=22`, // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log(res.data);
                this.setData({
                    adHotList: res.data.data
                })
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 轮播跳转
    gotoWebview: function (e) {
        console.log(e.currentTarget.dataset.bannerurl)
        var linkData = e.currentTarget.dataset.bannerurl
        swan.navigateTo({
            url: `/pages/banner/banner?link=${encodeURIComponent(linkData)}`
        })
    },
    // 推荐
    getdiscoverList() {
        swan.request({
            url: `${domin.testdom}/mall/goods/item/getWxRecommendGoods`, // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log(res.data);
                this.setData({
                    discoverList: res.data.data
                })
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 跳转详情
    gotoDetail: function (e) {
        console.log(e.currentTarget.dataset.goodid)
        swan.navigateTo({
            url: `/pages/detail/detail?link=${e.currentTarget.dataset.goodid}`
        })
    },
});
