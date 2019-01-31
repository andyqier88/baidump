/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var domin = require('../../uitls/domain.js')
Page({
    data: {
        detailData: [], //详情数据
        goodCount: 1,
        addressMessage: [], //地址信息
        leaveWord: [],
        getGoodsLists: [],
        loading: false,
        ordersn: ''
    },
    // onLoad: function () {
    //     this.getAllOrderLists()
    // },
    onLoad: function (options) {
        this.setData({
            ordersn: options.link
        })
        this.getDetail();
        this.getAddress();
    },
    // 详情数据加载
    getDetail: function () {
        swan.showLoading({
            title: '加载中',
        })
        var that = this;
        swan.request({
            url: `${domin.dom}/mall/order/order/detail`, //仅为示例，并非真实的接口地址
            data: {
                sn: that.data.ordersn,
                type: 1,
            },
            method: 'GET',
            header: {
                'content-type': 'application/json', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: function (res) {
                console.log(res.data.data);
                if (res.data.error_code == 0) {
                    that.setData({
                        detailData: res.data.data,

                    })
                    swan.hideLoading()
                }
            }
        });
    },
    // 获取默认地址
    getAddress() {
        var that = this;
        swan.request({
            url: `${domin.dom}/mall/user/address/lists` , //仅为示例，并非真实的接口地址
            method: 'GET',
            data: {
                uid: swan.getStorageSync('loginData').u_id,
                isDefault: '1'
            },
            header: {
                'content-type': 'application/json', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: function (res) {
                if (res.data.error_code == 0) {
                    that.setData({
                        isAddressNull: res.data.data.length,
                        addressMessage: res.data.data[0],
                        loading: false,
                        aid: res.data.data[0].a_id
                    })
                    swan.hideLoading()
                    if (res.data.data.length == 0) {

                    }
                }
            }
        });
    },
    // 用户留言
    bindLeaveInput: function (e) {
        console.log(e)
        this.setData({
            leaveWord: e.detail.value
        });
    },
    submitOrder(e) {
        console.log(e)
        var that = this;
        swan.request({
            url: 'https://app.16988.cn/mall/order/pay/init', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
                payChannel: 9,
                tradeId: e.currentTarget.dataset.osn

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                "cookie": swan.getStorageSync('ZWCOOKIES')
            },
            success: function (res) {
                console.log(res.data.data)
                var resw = res.data.data.payInfo9
                console.log(resw)
                if (res.data.error_code == 0) {
                    swan.requestPolymerPayment({
                        orderInfo: resw,
                        bannedChannels:['BDWallet'],
                        success: function (resp) {
                            swan.showToast({
                                title: '支付成功',
                                icon: 'success'
                            });
                        },
                        fail: function (err) {
                            swan.showToast({
                                title: "支付失败",
                                duration: 5000
                            });
                            console.log('pay fail', err);
                        }
                    });
                }else{
                    swan.showToast({
                        title:res.data.error_msg
                    })
                }
            }
        });
        // return false;
       
    },
    // 取消订单
    cancelOrder(e) {
        console.log(e.currentTarget.dataset.inx)
        console.log(e.currentTarget.dataset.oid)
        var that = this;
        swan.showLoading({
            title: '加载中',
            mask: true
        });
        swan.request({
            url: `${domin.dom}/mall/order/order/cancel` , // 仅为示例，并非真实的接口地址
            method: 'POST',
            dataType: 'json',
            data: {
                id: e.currentTarget.dataset.oid,
                reason: '其他原因',
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: (res) => {
                console.log(res.data);
                if (res.data.error_code == 0) {
                    var allOrderList = that.data.allOrderLists
                    allOrderList.splice(e.currentTarget.dataset.inx, 1);
                    that.setData({
                        allOrderLists: [],
                        allOrderLists: that.data.allOrderLists
                    })
                    swan.hideLoading()
                    console.log(that.data.allOrderLists)
                } else {
                    swan.showToast({
                        title: res.data.error_msg,
                        icon: 'loading',
                        duration: 1000,
                    })
                    swan.hideLoading()
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 删除订单
    delOrder(e) {
        console.log(e.currentTarget.dataset.inx)
        console.log(e.currentTarget.dataset.oid)
        var that = this;
        swan.showLoading({
            title: '加载中',
            mask: true
        });
        swan.request({
            url: `${domin.dom}/mall/order/order/deleteOrder` , // 仅为示例，并非真实的接口地址
            method: 'POST',
            dataType: 'json',
            data: {
                type: 1,
                o_sn: e.currentTarget.dataset.osn
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: (res) => {
                console.log(res.data);
                if (res.data.error_code == 0) {
                    var allOrderList = that.data.allOrderLists
                    allOrderList.splice(e.currentTarget.dataset.inx, 1);
                    that.setData({
                        allOrderLists: [],
                        allOrderLists: that.data.allOrderLists
                    })
                    swan.hideLoading()
                    console.log(that.data.allOrderLists)
                } else {
                    swan.showToast({
                        title: res.data.error_msg,
                        icon: 'loading',
                        duration: 1000,
                    })
                    swan.hideLoading()
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 确认收货
    getGoods(e) {
        var that = this;
        swan.showLoading({
            title: '加载中',
            mask: true
        });
        console.log(e.currentTarget.dataset.osn)
        swan.request({
            url: `${domin.dom}/mall/order/buyer/finish`, // 仅为示例，并非真实的接口地址
            method: 'POST',
            dataType: 'json',
            data: {
                osn: e.currentTarget.dataset.osn
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: (res) => {
                console.log(res.data);
                if (res.data.error_code == 0) {
                    swan.showToast({
                        title: "已确认收货",
                    })
                    that.getDetail()
                    swan.hideLoading()
                } else {
                    swan.showToast({
                        title: res.data.error_msg,
                    })
                    swan.hideLoading()
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 联系客服
    gotoKefu(){
        var linkData = 'https://p.qiao.baidu.com/cps/chat?siteId=12769985&userId=26746183'
        swan.navigateTo({
            url: `/pages/banner/banner?link=${encodeURIComponent(linkData)}` 
        })
    },
    goDetail(e){
        swan.navigateTo({
            url: `/pages/detail/detail?link=${e.currentTarget.dataset.gid}`
        })
    },
});
