Page({
    onLoad: function (options) {
        var that = this;
        console.log(options.link)
        var innerLink =decodeURIComponent(options.link)
        if (innerLink.indexOf('pages') > 0) {
            swan.redirectTo({
                url: innerLink
            })
        } else {
            that.setData({
                bannerlink: options.link
            })
        }
    },
})

