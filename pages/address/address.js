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
        this.getCode();
        this.getAddress()
    },
    // 获取默认地址
    getAddress() {
        var that= this;
        swan.request({
            url: `${domin.testdom}/mall/user/address/lists`, // 仅为示例，并非真实的接口地址
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
                if (res.data.error_code == 0) {
                    that.setData({
                        addressMessage: res.data.data[0],
                        name: res.data.data[0].a_name,
                        phone: res.data.data[0].a_phone,
                        address: res.data.data[0].a_address,
                        provinceName: res.data.data[0].a_provinceName,
                        cityName: res.data.data[0].a_cityName,
                        areaName: res.data.data[0].a_areaName,
                        aid: res.data.data[0].a_id
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
    getCode() {
        var that = this;
        swan.request({
            url: `${domin.testdom}/mall/user/address/getCode` , // 仅为示例，并非真实的接口地址
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
        swan.request({
            url: `${domin.testdom}/mall/user/address/getCode` , // 仅为示例，并非真实的接口地址
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
                        cityArrs:arr,
                        cityCodess:arrCode
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
        swan.request({
            url: `${domin.testdom}/mall/user/address/getCode` , // 仅为示例，并非真实的接口地址
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
    //         url: `${domin.testdom}/mall/user/address/addByName` , // 仅为示例，并非真实的接口地址
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
        if (that.aid) {
            objAddress.id = that.aid
        }
        if (!that.data.address) {
            swan.showToast('请填写详细地址')
            return false
        }
        swan.request({
            url: `${domin.testdom}/mall/user/address/post`, // 仅为示例，并非真实的接口地址
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
            cityArrs:['选择']
        });
        var proValueCode = this.data.provincesCodes[e.detail.value]
        swan.setStorageSync('proValueCode',proValueCode);
        this.selectProCode(swan.getStorageSync('proValueCode'))
    },
    // 城市
    cityChange: function (e) {
        this.setData({
            cityValue: e.detail.value
        });
        var cityValueCode = this.data.cityCodess[e.detail.value]
        swan.setStorageSync('cityValueCode',cityValueCode);
        this.selectCityCode(swan.getStorageSync('cityValueCode'))
    },
    // 区域
    areaChange: function (e) {
        this.setData({
            areaValue: e.detail.value
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
