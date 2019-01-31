/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */

var domin = require('../../uitls/domain.js')
Page({
    data: {
        title: '所在地区',
        value_0_1: [],
        value: [],
        name: '',
        phone: '',
        address: '',
        provinces: ['请选择'],
        citys: [],
        area: [],
        cityCodes: [],
        addressMessage: [],
        provinceName: '',
        cityName: '',
        areaName: '',
        aid: '',
        regionData: 0,
        provincesCodes:[],
        cityCodess:[],
        cityArrs:['选择'],
        proValue:0,
        cityValue:0,
        areaArr:[],
        areaCodess:[],
        areaValue:0
    },
    onLoad: function () {
        var that = this
        this.getCode();
        this.getAddress();
        console.log('proValueCode',that.data.addressMessage)
        console.log('proValueCode',swan.getStorageSync('proValueCode') !='')
        
    },
    onShow:function(){
        if(swan.getStorageSync('proValueCode') !=''){
            
            this.selectProCode(swan.getStorageSync('proValueCode'))
        }
        if(swan.getStorageSync('cityValueCode') !=''){
            console.log('cityValueCode')
            this.selectCityCode(swan.getStorageSync('cityValueCode'))
        }
    },
    // 获取默认地址
    getAddress() {
        var that= this;
        swan.showLoading({
            title: '加载中',
        })
        swan.request({
            url: `${domin.dom}/mall/user/address/lists`, // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: {
                uid: swan.getStorageSync('loginData').u_id,
                isDefault: '1'
            },
            success: (res) => {
                if (res.data.data.length != 0) {
                    swan.hideLoading()
                    var resw = res.data.data[0]
                    that.setData({
                        addressMessage: res.data.data[0],
                        name: resw.a_name ,
                        phone: resw.a_phone,
                        address: resw.a_address,
                        provinceName: resw.a_provinceName,
                        cityName: resw.a_cityName,
                        areaName: resw.a_areaName,
                        aid: resw.a_id
                    })
                    swan.setStorageSync('proValueCode', res.data.data[0].a_provinceCode);
                    swan.setStorageSync('cityValueCode', res.data.data[0].a_cityCode);
                    swan.setStorageSync('areaValueCode', res.data.data[0].a_areaCode);
                }else{
                    swan.hideLoading()
                    swan.setStorageSync('proValueCode','');
                    swan.setStorageSync('cityValueCode','' );
                    swan.setStorageSync('areaValueCode', '');
                    swan.showToast({
                        title:res.data.error_msg
                    })
                }
            },
            fail: (err) => {
                swan.hideLoading()
                console.log(res.data);
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    getCode() {
        var that = this;
        swan.showLoading({
            title: '加载中',
        })
        swan.request({
            url: `${domin.dom}/mall/user/address/getCode` , // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                if (res.data.error_code == 0) {
                    var provincesObj = res.data.data,arr=[],arrCode=[]
                    for (let i in provincesObj){
                        arrCode.push(i)
                        arr.push(provincesObj[i])
                    }
                    that.setData({
                        provinces:arr,
                        provincesCodes:arrCode
                    })
                    swan.hideLoading()
                }else{
                    swan.showToast({
                        title:res.data.error_msg
                    })
                }
            },
            fail: (err) => {
                console.log(res.data);
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
// 根据省份选择城市
    selectProCode(val) {
        var that = this;
        swan.showLoading({
            title: '加载中',
        })
        swan.request({
            url: `${domin.dom}/mall/user/address/getCode` , // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data:{
                cityCode:val
            },
            success: (res) => {
                if (res.data.error_code == 0) {
                    var citysObj = res.data.data,arr=[],arrCode=[]
                    for (let i in citysObj){
                        arrCode.push(i)
                        arr.push(citysObj[i])
                    }
                    that.setData({
                        // cityName: '',
                        // areaName: '',
                        cityArrs:arr,
                        cityCodess:arrCode
                    })
                    swan.hideLoading()
                }else{
                    swan.showToast({
                        title:res.data.error_msg
                    })
                }
                
            },
            fail: (err) => {
                console.log(res.data);
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 根据城市选择区域
    selectCityCode(areaval) {
        var that = this;
        swan.showLoading({
            title: '加载中',
        })
        swan.request({
            url: `${domin.dom}/mall/user/address/getCode` , // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data:{
                areaCode:areaval
            },
            success: (res) => {
                console.log('ingenu', res.data);
                if (res.data.error_code == 0) {
                    var areaObj = res.data.data,arr=[],arrCode=[]
                    for (let i in areaObj){
                        arrCode.push(i)
                        arr.push(areaObj[i])
                    }
                    that.setData({
                        areaArr:arr,
                        areaCodess:arrCode
                    })
                    if(swan.getStorageSync('areaValueCode') ==''){
                        swan.setStorageSync('areaValueCode',that.data.areaCodess[0]);
                    }
                    swan.hideLoading()
                }else{
                    swan.showToast({
                        title:res.data.error_msg
                    })
                }
            },
            fail: (err) => {
                console.log(res.data);
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // postAddress() {
    //     var that = this;
    //     var objAddress = {
    //         name: this.data.name,
    //         phone: this.data.phone,
    //         provinceName: this.data.regionData[0],
    //         cityName: this.data.regionData[1]=="市辖区" ? this.data.regionData[0] :this.data.regionData[1] ,
    //         areaName: this.data.regionData[2],
    //         address: this.data.address,
    //         isDefault: '1',
    //         uid: swan.getStorageSync('loginData').u_id,
    //     }
    //     if (that.aid) {
    //         objAddress.id = that.aid
    //     }
    //     if (!that.data.address) {
    //         swan.showToast('请填写详细地址')
    //         return false
    //     }
    //     swan.request({
    //         url: `${domin.dom}/mall/user/address/addByName` , // 仅为示例，并非真实的接口地址
    //         method: 'POST',
    //         dataType: 'json',
    //         header: {
    //             'content-type': 'application/x-www-form-urlencoded', // 默认值
    //             'cookie': swan.getStorageSync('ZWCOOKIES')
    //         },
    //         data:objAddress,
    //         success: (res) => {
    //             console.log('ingenu', res.data);
    //             if (res.data.error_code == 0) {
    //                 swan.navigateBack({
    //                     delta:1
    //                 });
    //             }
    //         },
    //         fail: (err) => {
    //             console.log(res.data);
    //             console.log('错误码：' + err.errCode);
    //             console.log('错误信息：' + err.errMsg);
    //         }
    //     })
    // },
    postAddress(){
        var that = this;
        swan.showLoading({
            title: '加载中',
        })
        var objAddress = {
            name: this.data.name,
            phone: this.data.phone,
            provinceCode: swan.getStorageSync('proValueCode'),
            cityCode: swan.getStorageSync('cityValueCode') ,
            areaCode: swan.getStorageSync('areaValueCode'),
            address: this.data.address,
            isDefault: '1',
            uid: swan.getStorageSync('loginData').u_id,
        }
        if (that.data.aid) {
            objAddress.id = that.data.aid
        }
        if(that.data.name ==''){
            swan.showToast({
                title:'名字不能为空'
            })
            return false
        }
        if(that.data.phone ==''){
            swan.showToast({
                title:'手机号不能为空'
            })
            return false
        }
        if (!/^1[34578][0-9]{9}$/.test(that.data.phone.replace(/\s*/g,''))){
                swan.showToast({
                    title:'手机号不对'
                })
                return false;
            }
        if (!that.data.address) {
            swan.showToast({
                title:'请填写详细地址'
            })
            return false
        }
        if(swan.getStorageSync('areaValueCode') ==''){
            swan.showToast({
                title:'根据城市选择区县'
            })
            return false
        }
        swan.request({
            url: `${domin.dom}/mall/user/address/post`, // 仅为示例，并非真实的接口地址
            method: 'POST',
            dataType: 'json',
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'cookie': swan.getStorageSync('ZWCOOKIES')
            },
            data:objAddress,
            success: (res) => {
                console.log('ingenu', res.data);
                if (res.data.error_code == 0) {
                    swan.navigateBack({
                        delta:1
                    });
                    swan.hideLoading()
                }else{
                    swan.showToast({
                        title:res.data.error_msg
                    })
                }
            },
            fail: (err) => {
                console.log(res.data);
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        })
    },
    // 省份
    provChange: function (e) {
        this.setData({
            proValue: e.detail.value,
            cityArrs:['选择'],
            provinceName: '',
            cityName: '',
            areaName: '',
            areaArr:[]
        });
        // 清空
        swan.setStorageSync('cityValueCode','');
        swan.setStorageSync('areaValueCode','');
        var proValueCode = this.data.provincesCodes[e.detail.value]
        swan.setStorageSync('proValueCode',proValueCode);
        console.log(proValueCode)
        this.selectProCode(swan.getStorageSync('proValueCode'))
        // this.selectCityCode(this.data.cityCodess[0])
    },
    // chooseCity(){
    //     this.selectCityCode(swan.getStorageSync('cityValueCode'))
    // },
    // 城市
    cityChange: function (e) {
        console.log(e.detail)
        this.setData({
            cityValue: e.detail.value,
            cityName: '',
            areaName: '',
            areaArr:[]
        });
        var cityValueCode = this.data.cityCodess[e.detail.value]
        swan.setStorageSync('cityValueCode',cityValueCode);
        this.selectCityCode(swan.getStorageSync('cityValueCode'))
    },
    // 区域
    areaChange: function (e) {
        this.setData({
            areaValue: e.detail.value,
            areaName: '',
        });
        var areaValueCode = this.data.areaCodess[e.detail.value]
        swan.setStorageSync('areaValueCode',areaValueCode);
        
    },
    bindPhoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        });
    },
    bindNameInput: function (e) {
        this.setData({
            name: e.detail.value
        });
    },
    bindAddressInput:function (e) {
        console.log(e)
        this.setData({
            address: e.detail.value
        });
    },
});
