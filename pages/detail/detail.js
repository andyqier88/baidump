//获取应用实例

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageWidth: swan.getSystemInfoSync().windowWidth,
        imageHeight: swan.getSystemInfoSync().windowHeight,
        goodsid: '',
        detailData: [],
        detailDataImg: [],
        detailCarousel: [],
        timer: false,
        hasDetailImage: false,
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        // pageHeight:0
        isLogin: true,
        uid: '',
        canIUseNav: swan.canIUse('navigator'),
        plain: true,
        showAll: false,
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
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                console.log(res.data.data);
                if (res.data.error_code == 0) {
                    that.setData({
                        detailData: res.data.data.item[0],
                        detailCarousel: res.data.data.itemCarousel,
                        detailDataImg: res.data.data.itemImage
                    })
                    swan.hideLoading()
                }
            }
        });
    },
    isShowAll: function () {
        this.setData({
            showAll: true
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        console.log(options, 'yuy')
        that.setData({
            goodsid: options.link,
            uid: swan.getStorageSync('loginData').u_id
        })
    },
    // 跳转首页
    gotoIndex: function () {
        console.log('gotoIndex')
        swan.switchTab({
            url: '../index/index'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDetail()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        var that = this;
        console.log('detailData', that.data.detailData)
        return {
            title: that.data.detailData.g_name,
            path: '/pages/jumpyswh/jumpyswh?goodsid=' + that.data.detailData.g_id + '&uid=' + that.data.uid,
            imageUrl: that.data.detailData.surfaceImageUrl
        }
    }
})