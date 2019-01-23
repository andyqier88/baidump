/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */

Page({
    data: {
        title: '所在地区',
        value_0_1: [],
        value: [],
        name: '',
        phone: '',
        address: '',
        provinces: ['北京', '上海', '天津'],
        citys: [],
        area: [],
        cityCodes: [],
        addressMessage: [],
        provinceName: '',
        cityName: '',
        areaName: '',
        aid: '',
        regionData: ['北京市', '北京市', '东城区'],
    },
    onLoad: function () {
        this.getCode();
        this.getAddress()
    },
    // 获取默认地址
    getAddress() {
        var that= this;
        swan.request({
            url: 'https://app.16988.cn/mall/user/address/lists', // 仅为示例，并非真实的接口地址
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
                console.log('ingenu', res.data);
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
            url: 'https://app.16988.cn/mall/user/address/getCode', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log('ingenu', res.data);
                if (res.data.error_code == 0) {
                    that.setData({
                        provinces:res.data.data
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

    selectProCode(val) {
        var that = this;
        this.setData({
            provinceName : '',
            cityName : '',
            areaName : '',
            area : ''
        })
        swan.request({
            url: 'https://app.16988.cn/mall/user/address/getCode', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data:{
                cityCode:10002
            },
            success: (res) => {
                console.log('ingenu', res.data);
                if (res.data.error_code == 0) {
                    that.setData({
                        provinces:res.data.data
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
    selectCityCode(val) {
        var that = this;
        swan.request({
            url: 'https://app.16988.cn/mall/user/address/getCode', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data:{
                cityCode:10002,
                areaCode:100
            },
            success: (res) => {
                console.log('ingenu', res.data);
                if (res.data.error_code == 0) {
                    that.setData({
                        area:res.data.data
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
    postAddress() {
        var that = this;
        var objAddress = {
            name: this.data.name,
            phone: this.data.phone,
            provinceName: this.data.regionData[0],
            cityName: this.data.regionData[1]=="市辖区" ? this.data.regionData[0] :this.data.regionData[1],
            areaName: this.data.regionData[2],
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
            url: 'https://app.16988.cn/mall/user/address/addByName', // 仅为示例，并非真实的接口地址
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
    getCity() {
        swan.request({
            url: 'https://app.16988.cn/mall/user/address/getCode', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data:{
                cityCode:10,
                areaCode:100
            },
            success: (res) => {
                console.log('ingenu', res.data);
                if (res.data.error_code == 0) {
                    that.setData({
                        area:res.data.data
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
    regionChange: function (e) {
        this.setData({
            provinceName:'',
            cityName:'',
            areaName:'',
            regionData: e.detail.value
        });
        console.log('picker-time changed，值为', e.detail.value)
    },
    bindPhoneInput: function (e) {
        console.log(e)
        this.setData({
            phone: e.detail.value
        });
    },
    bindNameInput: function (e) {
        console.log(e)
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
