/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */

Page({
    data: {
        allOrderLists: [], //订单列表
        cartNum: [],
        page: 1,
        isLoading: true,
        listLength: 0,
        tabItems:[{name:"所有订单",status:"0,1,2,3,14,15,16,21,22,23,24,25,35,36,100"},
                {name:"待付款",status:"0"},
                {name:"待发货",status:"1"},
                {name:"已发货",status:"2"},
                {name:"售后中",status:"14,15,24,25,35"},
                {name:"已完成",status:"3"}],
        tabNum:0,
        hideMore:true
    },
    // onLoad: function () {
    //     this.getAllOrderLists()
    // },
    onLoad: function () {
        this.getAllOrderLists("0,1,2,3,14,15,16,21,22,23,24,25,35,36,100")
    },
    // tab 切换
    tabClick(e) {
        this.setData({
            tabNum: e.currentTarget.dataset.inx,
            page:1,
            allOrderLists:[]
        })
        console.log(e.currentTarget.dataset.state)
        console.log(e)
        this.getAllOrderLists(e.currentTarget.dataset.state)
    },
    // 订单列表
    getAllOrderLists(statusData) {
        var that = this;
        swan.showLoading({
            title: '加载中',
            mask: true
        });
        swan.request({
            url: 'https://dev-app.16988.cn/mall/order/order/lists', // 仅为示例，并非真实的接口地址
            method: 'POST',
            dataType: 'json',
            data: {
                listType: 1,
                uid: swan.getStorageSync('loginData').u_id,
                status:statusData||' ',
                page: that.data.page++||1,
                pageSize: 10
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: (res) => {
                console.log(res.data);
                if (res.data.error_code == 0) {
                    this.setData({
                        allOrderLists:that.data.allOrderLists.concat(res.data.data),
                        listLength: res.data.data.length
                    })
                    swan.hideLoading()
                    if(that.data.listLength==0){
                        that.setData({
                            hideMore:false
                        })
                    }else{
                       that.setData({
                            hideMore:true
                        }) 
                    }
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
    loadMore(){
        var that = this;
        this.getAllOrderLists(that.data.tabItems[that.data.tabNum].status)
    },
    goOrderDetail: function (e) {
        console.log(e.currentTarget.dataset.osn)
        swan.navigateTo({
            url: `/pages/orderdetail/orderdetail?link=${e.currentTarget.dataset.osn}`
        })
    },
    // 取消订单
    cancelOrder(e){
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
                        allOrderLists:[],
                        allOrderLists:that.data.allOrderLists
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
    delOrder(e){
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
                o_sn:e.currentTarget.dataset.osn
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
                        allOrderLists:[],
                        allOrderLists:that.data.allOrderLists
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
