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
        leaveWord: [],//留言
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
                console.log(res.data.data);
                if (res.data.error_code == 0) {
                    // swan.setStorageSync('priceToVoucher', res.data.data.item[0].g_price);
                    that.setData({
                        isAddressNull : res.data.data.length,
                        addressMessage : res.data.data[0],
                        loading: false,
                    })
                    swan.hideLoading()
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
    // 购物车减法
    buyNow() {
        console.log('moe')
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDetail();
        this.getAddress()
    }
})