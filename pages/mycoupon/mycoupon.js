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
    },
    // onLoad: function () {
    //     this.getAllOrderLists()
    // },
    onShow: function () {
        this.getAllOrderLists("0,1,2,3,14,15,16,21,22,23,24,25,35,36,100")
    },
    // tab 切换
    tabClick(e) {
        this.setData({
            tabNum: e.currentTarget.dataset.inx,
        })
        console.log(e.currentTarget.dataset.state)
        console.log(e)
        this.getAllOrderLists(e.currentTarget.dataset.state)
    },
    // 优惠券列表
    getAllOrderLists(statusData) {
        swan.showLoading({
            title: '加载中',
            mask: true
        });
        this.setData({
            allOrderLists:[]
        })
        swan.request({
            url: 'https://app.16988.cn/mall/order/order/lists', // 仅为示例，并非真实的接口地址
            method: 'POST',
            dataType: 'json',
            data: {
                listType: 1,
                uid: swan.getStorageSync('loginData').u_id,
                status:statusData||' ',
                page: 1,
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
                        allOrderLists: res.data.data,
                        listLength: res.data.data.length
                    })
                    swan.hideLoading()
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
