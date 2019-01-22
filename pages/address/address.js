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
                provinces:[],
                citys:[],
                area:[],
                cityCodes:[],
                addressMessage:[],
                provinceName: '',
                cityName: '',
                areaName : '',
                aid: '',
    },
    onLoad: function () {
        this.getList()
    },
    getList() {
        var that = this;
        swan.request({
            url: 'https://app.16988.cn/user/artisn/lists', // 仅为示例，并非真实的接口地址
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                console.log('ingenu',res.data);
                if (res.data.error_code == 0) {
                    that.setData({
                        artisnLists: res.data.data,
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
    gotoDetail(e) {
        console.log(e.currentTarget.dataset.uid)
        swan.navigateTo({
            url: `/pages/ingenuitydetail/ingenuitydetail?uid=${e.currentTarget.dataset.uid}`
        })
    },
    // 获取默认地址
            getAddress(){
                swan.request({
                    url: 'https://app.16988.cn/mall/user/address/lists', // 仅为示例，并非真实的接口地址
                    method: 'GET',
                    dataType: 'json',
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    data:{
                        uid: swan.getStorageSync('loginData').u_id,
                        isDefault: '1'
                    },
                    success: (res) => {
                        console.log('ingenu',res.data);
                        if (res.data.error_code == 0) {
                            that.setData({
                                artisnLists: res.data.data,
                                addressMessage : res.data.data[0],
                                name : res.data.data[0].a_name,
                                phone : res.data.data[0].a_phone,
                                address : res.data.data[0].a_address,
                                provinceName : res.data.data[0].a_provinceName,
                                cityName : res.data.data[0].a_cityName,
                                areaName : res.data.data[0].a_areaName,
                                aid : res.data.data[0].a_id
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
                this.$axios.post('/mall/user/address/getCode', {
                    })
                    .then(function(res) {
                        console.log(res.data.data);
                        that.provinces = res.data.data;
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            
            selectProCode(val){
                var that = this;
                console.log('that.$refs.ProCode',val)
                that.provinceName = ''
                that.cityName = ''
                that.areaName = ''
                that.area = ''
                this.$axios.post('/mall/user/address/getCode', {
                        cityCode:that.$refs.ProCode.value
                    })
                    .then(function(res) {
                        console.log(res.data.data);
                        that.citys = res.data.data
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            // this.selectCityCode()
            },
            selectCityCode(val){
                var that = this;
                console.log(that.$refs.CityCode.value)
                this.$axios.post('/mall/user/address/getCode', {
                        cityCode:that.$refs.ProCode.value,
                        areaCode:that.$refs.CityCode.value
                    })
                    .then(function(res) {
                        console.log(res.data.data);
                        that.area = res.data.data
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            
            },
            postAddress() {
                console.log(this.$refs.ProCode)
                console.log(this.$refs.ProCode.value)
                var that = this;
                var objAddress = {
                    name: this.name,
                        phone: this.phone,
                        provinceCode: parseInt(that.$refs.ProCode.value),
                        cityCode: parseInt(that.$refs.CityCode.value),
                        areaCode: parseInt(that.$refs.areaCode.value),
                        address: this.address,
                        isDefault: '1',
                        // uid: getCookie('u_id'),
                        // uid:localStorage.getItem('u_id'),
                        uid:MyLocalStorage.Cache.get("u_id"),
                }
                if(that.aid){
                    objAddress.id = that.aid
                }
                if(!that.$refs.areaCode.value){
                    that.$toast('请根据城市选择区县')
                    return false
                }
                if(!that.address){
                    that.$toast('请填写详细地址')
                    return false
                }
                this.$axios.post('/mall/user/address/post', objAddress)
                    .then(function(res) {
                        console.log(res.data.aid);
                        console.log(res.data);
                        if(res.data.error_code == '0'){
                            // window.location.href="index.html?aid="+res.data.data.aid+'#/submitOrder';
                            if(that.$route.query.fromcart == 'fromcart'){
                                that.$router.push({name:'cartSubOrd',query:{aid: res.data.data.aid,id:that.$route.query.id}});
                            }else{
                                that.$router.push({name:'submitOrder',query:{aid: res.data.data.aid,id:that.$route.query.id}});
                            }
                            
                        }else {
                            that.$toast(res.data.error_msg)
                            // alert('手机格式格式错误')
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            getCity(){
                this.$axios.post('/mall/user/address/getCode', {
                    cityCode:''
                    })
                    .then(function(res) {
                        console.log(res.data.data);
                        that.provinces = res.data.data
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
});
