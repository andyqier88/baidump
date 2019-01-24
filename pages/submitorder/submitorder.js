//获取应用实例

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsItem: [], //数据详情
        listImgs: [],
        // id: this.GetQueryString("id"),
        lists: [], //数据详情
        itemArr: [],
        couponActive: true, //优惠券选中
        addressMessage: [],//地址信息
        leaveWord: '',//留言
        wxCode: [],
        openId: [],
        cid: [],
        loading: false,
        goodCountSto: 1,
        voucherSum: 0,
        isAddressNull: 0,
        confirmState: false,
        wxAddress: [],
        isAddressState: true,
        ziTiState: false,//自提状态
        aid: '',//地址id
        goodCountFromStro: 1,
        goodsid:'',
        goodsname:''
    },

    // 详情数据加载
    getDetail: function () {
        swan.showLoading({
            title: '加载中',
        })
        var that = this;
        swan.request({
            url: 'https://app.16988.cn/mall/goods/item/detail', //仅为示例，并非真实的接口地址
            data: {
                id: that.data.goodsid
            },
            method: 'GET',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                console.log(res.data.data);
                if (res.data.error_code == 0) {
                    swan.setStorageSync('priceToVoucher', res.data.data.item[0].g_price);
                    that.setData({
                        goodsItem: res.data.data.item[0],
                        detailCarousel: res.data.data.itemCarousel,
                        listImgs: res.data.data.itemImage,
                        itemArr: res.data.data,
                        loading: false,
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
            url: 'https://app.16988.cn/mall/user/address/lists', //仅为示例，并非真实的接口地址
            method: 'GET',
            data: {
                uid: swan.getStorageSync('loginData').u_id,
                isDefault: '1'
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                if (res.data.error_code == 0) {
                    // swan.setStorageSync('priceToVoucher', res.data.data.item[0].g_price);
                    that.setData({
                        isAddressNull : res.data.data.length,
                        addressMessage : res.data.data[0],
                        loading: false,
                    })
                    swan.hideLoading()
                    if(res.data.data.length == 0){
                        swan.showModal({
                            title: '',
                            content: '您未设置收货地址，请设置收货地址',
                            cancelColor: '#000000',
                            confirmColor: '#CEA068',
                            confirmText:"设置地址",
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击了确定');
                                    swan.navigateTo({
                                        url: '/pages/address/address'
                                    });
                                } else if (res.cancel) {
                                    console.log('用户点击了取消');
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        console.log(options, 'yuy')
        that.setData({
            goodsid: options.link,
            uid: swan.getStorageSync('loginData').u_id,
            goodCountFromStro:swan.getStorageSync('goodCountFromStro')
        })
    },
    // 用户留言
    bindLeaveInput:function (e) {
        console.log(e)
        this.setData({
            leaveWord: e.detail.value
        });
    },
    // 跳转首页
    gotoIndex: function () {
        console.log('gotoIndex')
        swan.switchTab({
            url: '../index/index'
        })
    },
    choAddress(){
        swan.navigateTo({
            url: '/pages/address/address'
        });
    },
    showMask() {
        this.setData({
            maskCart: true
        })
    },
    // 关闭弹窗
    closeCart() {
        this.setData({
            maskCart: false
        })
    },
// 购物车加法
    pluAcount(){
        var that = this;
        that.data.goodCountSto = swan.getStorageSync('goodCountFromStro')
        
        that.setData({
            goodCountSto:that.data.goodCountSto++
        })
        that.data.goodCountSto++
        swan.setStorageSync('goodCountFromStro',that.data.goodCountSto++);
        // console.log(that.data.goodCount++)
    },
    // 购物车减法
    minAcount(){
        var that = this;
        var goodCountSto = swan.getStorageSync('goodCountFromStro')
        if(swan.getStorageSync('goodCountFromStro')>1){
            goodCountSto--
            that.setData({
                goodCountFromStro:goodCountSto--

            })
        }
        // console.log(this.data.goodCount--)
        swan.setStorageSync('goodCountFromStro',swan.getStorageSync('goodCountFromStro'));
    },
    buyNow() {
        console.log('moe')
    },
    // 提交订单
    submitOrder(){
        var that = this;
        swan.request({
            url: 'https://dev-app.16988.cn/mall/order/buyer/add', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
                uid: '',
                gid: that.data.goodsid,
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
                            subject: that.data.goodsItem.g_name,
                            totalAmount:that.data.goodsItem.g_price*100,
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDetail();
        this.getAddress()
    }
})