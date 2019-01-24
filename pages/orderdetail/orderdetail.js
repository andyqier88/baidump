/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */

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
            ordersn:options.link
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
            url: 'https://dev-app.16988.cn/mall/order/order/detail', //仅为示例，并非真实的接口地址
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
            url: 'https://dev-app.16988.cn/mall/user/address/lists', //仅为示例，并非真实的接口地址
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
                        aid:res.data.data[0].a_id
                    })
                    swan.hideLoading()
                    if (res.data.data.length == 0) {
                        
                    }
                }
            }
        });
    },
     // 用户留言
    bindLeaveInput:function (e) {
        console.log(e)
        this.setData({
            leaveWord: e.detail.value
        });
    },
    submitOrder(e){
        console.log(e)
        var that = this;
        swan.request({
            url: 'https://dev-app.16988.cn/mall/order/buyer/add', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
                uid: '',
                gid: e.currentTarget.dataset.gid,
                aid:that.data.aid,
                count:swan.getStorageSync('goodCountFromStro'),
                guestContent:this.data.leaveWord || ''
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                "cookie": swan.getStorageSync('ZWCOOKIES')
            },
            success: function (res) {
                if (res.data.error_code == 0) {
                    swan.request({
                        url: 'https://dev-app.16988.cn/mall/order/pay/get', //仅为示例，并非真实的接口地址
                        method: 'POST',
                        data: {
                            tradeId: res.data.data.order_id,
                            subject: that.data.detailData.g_name,
                            totalAmount:that.data.detailData.o_total*100,
                            timeout:'30',
                            from:'1'
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded', // 默认值
                            "cookie": swan.getStorageSync('ZWCOOKIES')
                        },
                        success: function (res1) {
                            if (res1.data.error_code == 0) {
                                var linkData = `http://dev-app.16988.cn/mall/order/pay/init?payChannel=3&tradeId=${res.data.data.order_id}`
                                swan.navigateTo({
                                    url: `/pages/banner/banner?link=${encodeURIComponent(linkData)}`
                                });
                                swan.hideLoading()
                            }
                        }
                    });
                    swan.hideLoading()
                }
            }
        });
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
            url: 'https://dev-app.16988.cn/mall/order/order/cancel', // 仅为示例，并非真实的接口地址
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
            url: 'https://dev-app.16988.cn/mall/order/order/deleteOrder', // 仅为示例，并非真实的接口地址
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
});
