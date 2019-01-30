//获取应用实例
var domin = require('../../uitls/domain.js')
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
        isLogin: true,
        uid: '',
        canIUseNav: swan.canIUse('navigator'),
        plain: true,
        showAll: false,
        maskState: true, //弹窗状态
        maskCartSure:false,
        buyMaskCart:false,
        cartLists: [], //加入购物车,
        maskCart: false, //购物车弹窗隐藏
        goodCount: 1, //购物车数量
        totalGoodCount: 0,
        cartCount: 0,
        hidecsState:0,
    },

    // 详情数据加载
    getDetail: function () {
        swan.showLoading({
            title: '加载中',
        })
        var that = this;
        swan.request({
            url: `${domin.testdom}/mall/goods/item/detail` , //仅为示例，并非真实的接口地址
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
    // 增加访问商品的历史
      goodsHisAdd(){
        var that = this;
        swan.request({
            url: `${domin.testdom}/user/visit/goodsHisAdd` , //仅为示例，并非真实的接口地址
            data: {
                gid: that.data.goodsid
            },
            header: {
                'content-type': 'application/json', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: function (res) {
                console.log(res.data.data);
                if (res.data.error_code == 0) {
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
    // 隐藏客服按钮
    hidecs(){
        var that = this;
        swan.request({
            url: `${domin.testdom}/common/ui/isShow` , //仅为示例，并非真实的接口地址
            data: {
                id: "baidu_mini_goods_detail_custom_service_button"
            },
            header: {
                'content-type': 'application/json', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            success: function (res) {
                console.log(res.data.data);
                if (res.data.error_code == 0) {
                    that.data.hidecsState = res.data.data
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
            uid: swan.getStorageSync('loginData').u_id
        })
        swan.setStorageSync('goodCountFromStro',1);
        this.hidecs()
    },
    // 跳转首页
    gotoIndex: function () {
        console.log('gotoIndex')
        swan.switchTab({
            url: '../index/index'
        })
    },
    showMask(){
        this.setData({
            maskCart:true
        })
    },
    // 关闭弹窗
    closeCart(){
        this.setData({
            maskCart:false
        })
    },
    // 购物车加法
    pluAcount(){
        var that = this;
        if(Number(that.data.detailData.g_price)===0){
            swan.showToast({
                title:'限购一件'
            })
            return false
        }
        if(Number(that.data.detailData.g_stock)<=that.data.goodCount){
            swan.showToast({
                title:'库存不足'
            })
            return false
        }
        this.data.goodCount++
        that.setData({
            goodCount:that.data.goodCount++
        })
        
        swan.setStorageSync('goodCountFromStro',that.data.goodCount);
        
        // console.log(that.data.goodCount++)
    },
    // 购物车减法
    minAcount(){
        var that = this;
        
        if(that.data.goodCount>1){
            that.data.goodCount--
            that.setData({
                goodCount:that.data.goodCount--
            })
        }else{
            swan.showToast({
                title:'数量不能为0'
            })
        }
        // console.log(this.data.goodCount--)
        swan.setStorageSync('goodCountFromStro',that.data.goodCount);
    },
    //提交订单
    buyNow(e){
        console.log('moe')
        var that = this;
        if (swan.getStorageSync('ZWCOOKIES')) {
          swan.navigateTo({
            url:`/pages/submitorder/submitorder?link=${e.currentTarget.dataset.goodid}` ,
          })
        } else {
          swan.navigateTo({
            url: '/pages/login/login',
          })
        }
    },
    gotoWebview: function () {
        var linkData = 'https://p.qiao.baidu.com/cps/chat?siteId=12769985&userId=26746183'
        swan.navigateTo({
            url: `/pages/banner/banner?link=${encodeURIComponent(linkData)}` 
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDetail();
        this.goodsHisAdd()
    },
})