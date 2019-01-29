/**
 * @file demo page for apiDemo
 * @author renzhonghua
 */
/* globals Page, swan */

Page({
    data: {
        artisnLists: [],
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
                swan.stopPullDownRefresh()
            },
            fail: (err) => {
                swan.stopPullDownRefresh()
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
    // 下拉刷新
    onPullDownRefresh: function(e) {
        this.getList();
	},
});
