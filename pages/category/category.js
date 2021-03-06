/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */
var domin = require('../../uitls/domain.js')
Page({
    data: {
        adList: [], // 广告列表
        discoverList: [], // 商品列表组
        is_empty: false, // 是否有数据
        currentPage: 1, // 当前页面
        page_total: 0, // 总页数
        showLoading: true, // 是否显示 底部loading
        navTxt: "筛选", // 索引标题
        sortTime: 1, // 上架时间排序，1
        sortPrice: 0,// 按价格排序，1高，2低
        sortPrices: "",
        browseTimes: "", // 浏览量排序，1
        lowPrice: "", // 最低价
        highPrice: "", // 最高价
        loading: false,
        isSec: false, // 是否筛选
        preventRepeatReuqest: false, // 防止重复加载
        bottomNum: 0,
        isSecPin: false, //是否选中品类
        categoryList: [], //一级分类
        subcategoryList: [], //二级分类
        newNavTxt: "品类",
        topCateNum: -1,
        subCateNum: 0,
        subtopCateCname: '', //全部
        priceOrder: false,
        tuiJianState: true,
        noTopCate: false,
        topShaixuan: false,
        cgid: '',
        topState:false,
    },
    onLoad: function (options) {
        this.setData({
            cgid: options.cgid
        })
        this.getdiscoverList()
    },
    // 返回顶部
    onPageScroll(e){
        var that = this
        console.log(e)
        if(e.scrollTop>500){
            that.setData({
                topState:true
            })
        }else{
            that.setData({
                topState:false
            })
        }
    },
    onReachBottom(e) {
        var that = this;

        this.setData({
            currentPage: that.data.currentPage++
        })
        that.data.currentPage++
        // this.getdiscoverList(that.data.currentPage, 10)
        if(this.data.priceOrder){
            this.getdiscoverList(that.data.currentPage,10,1)
        }else{
            this.getdiscoverList(that.data.currentPage,10,2)
        }
    },
    init() {
        console.log("init")
    },
    // 监听价格
    watchHighPrice(e) {
        this.setData({
            highPrice: e.detail.value
        })
    },
    watchLowPrice(e) {
        this.setData({
            lowPrice: e.detail.value
        })
    },
    // 商品列表
    getdiscoverList(currentPage, size,priceLowHigh) {
        var that = this;
        let secJson = {
            page: currentPage || 1,
            pageSize: size || 10,
            categoryGroupIds: this.data.cgid,
            sortPrice: priceLowHigh?priceLowHigh:''
        };
        
        if (this.data.sortPrices == 2) {
            secJson.lowPrice = 0;
            secJson.highPrice = 500;
            secJson.sortPrice = ''
        }
        if (this.data.sortPrices == 3) {
            secJson.lowPrice = 500;
            secJson.highPrice = 2000;
            secJson.sortPrice = ''
        }
        if (this.data.sortPrices == 4) {
            secJson.lowPrice = 2000;
            secJson.highPrice = 5000;
            secJson.sortPrice = ''
        }
        if (this.data.browseTimes) {
            secJson.browseTimes = this.data.browseTimes;
        }
        if (!this.data.sortTime && !this.data.sortPrices && !this.data.browseTimes) {
            secJson.lowPrice = this.data.lowPrice;
            secJson.highPrice = this.data.highPrice;
        }
        swan.request({
            url: `${domin.dom}/mall/goods/item/listsWxH5`, // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: secJson,
            success: (res) => {
                console.log(res.data);
                this.setData({
                    discoverList: [...this.data.discoverList, ...res.data.data]
                })
                if (this.data.discoverList.length == 0) {
                    this.setData({
                        is_empty: true
                    })
                } else {
                    this.setData({
                        is_empty: false
                    })
                }
            },
            fail: (err) => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 筛选
    showSch() {
        this.setData({
            isSec: !this.data.isSec,
            isSecPin: !this.data.isSecPin,
            noTopCate: !this.data.noTopCate,
        })
    },
    // 跳转详情
    gotoDetail: function (e) {
        console.log(e.currentTarget.dataset.goodid)
        swan.navigateTo({
            url: `/pages/detail/detail?link=${e.currentTarget.dataset.goodid}`
        })
    },
    selSch: function (e) {
        var that = this
        that.init();
        console.log(e.target.dataset.sortnum)
        if (e.target.dataset.sortnum == 0) {
            this.setData({
                browseTimes: "",
                priceOrder: !this.data.priceOrder,
                currentPage: 1,
                lowPrice: "",
                sortPrice: this.data.priceOrder ? 1 : 2,
                highPrice: "",
                navTxt: "筛选",
                isSec: false,
                isSecPin: false,
                noTopCate: false,
            })
        } else if (e.target.dataset.sortnum == 1) {
            this.setData({
                browseTimes: 1,
                currentPage: 1,
                sortTime: "",
                lowPrice: "",
                sortPrices: "",
                highPrice: "",
                navTxt: "全部",
                isSec: !this.data.isSec,
                priceOrder: false
            })
        } else if (e.target.dataset.sortnum == 2) {
            this.setData({
                browseTimes: "",
                currentPage: 1,
                sortTime: "",
                lowPrice: "0",
                sortPrices: "",
                highPrice: "500",
                navTxt: "0-500元",
                isSec: !this.data.isSec,
                priceOrder: false
            })
        } else if (e.target.dataset.sortnum == 3) {
            this.setData({
                browseTimes: "",
                currentPage: 1,
                sortTime: "",
                lowPrice: "500",
                sortPrices: "",
                highPrice: "2000",
                navTxt: "500-2000元",
                isSec: !this.data.isSec,
                priceOrder: false,
                page_total: 0
            })
        } else if (e.target.dataset.sortnum == 4) {
            this.setData({
                browseTimes: "",
                currentPage: 1,
                sortTime: "",
                lowPrice: "2000",
                sortPrices: "",
                highPrice: "5000",
                navTxt: "2000-5000元",
                isSec: !this.data.isSec,
                priceOrder: false,
                page_total: 0
            })
        }
        this.setData({
            discoverList: [],
            isSecPin: false,
            newNavTxt: "品类"
        })
        if(this.data.priceOrder){
            this.getdiscoverList(1,10,1)
        }else{
            this.getdiscoverList(1,10,2)
        }
        
        //   MyLocalStorage.Cache.remove('selForCate')
    },
    savSec() {
        console.log('lowP', this.data.lowPrice)
        if (!this.data.lowPrice) {
            swan.showToast({
                title: "请填写最低价"
            });
            return false;
        }
        if (!this.data.highPrice) {
            swan.showToast({
                title: "请填写最高价"
            });
            return false;
        }
        this.setData({
            browseTimes: "",
            sortTime: "",
            sortPrice: "",
            currentPage: 1,
            navTxt: `${this.data.lowPrice} ～ ${this.data.highPrice}`,
            isSec: !this.data.isSec,
            discoverList: []
        })
        this.getdiscoverList();
    },
    gotoTop(){
        console.log("fjksdh")
        swan.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
    }
})
