const {
  formatTime
} = require("../../../utils/util");

const cloud = wx.cloud;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style: [{
        color: 'cyan',
        icon: 'newsfill'
      },
      {
        color: 'blue',
        icon: 'colorlens'
      },
      {
        color: 'purple',
        icon: 'font'
      },
      {
        color: 'mauve',
        icon: 'icon'
      },
      {
        color: 'pink',
        icon: 'btn'
      },
      {
        color: 'brown',
        icon: 'tagfill'
      },
      {
        color: 'red',
        icon: 'myfill'
      },
      {
        color: 'orange',
        icon: 'icloading'
      },
      {
        color: 'olive',
        icon: 'copy'
      },
      {
        color: 'green',
        icon: 'loading2'
      }
    ],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }],
    CategoriesList: [], //分类数据
    articlesList: []
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  openArticleDetile(option) {
    const index = option.currentTarget.dataset.index;
    const data = this.data.articlesList[index];
    wx.navigateTo({
      url: '/pages/home/detail/detail?aid=' + data.aid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    Promise.all([
      cloud.callFunction({
        name: "getList",
        data: {
          type: 2,
          page: 1,
          limit: 5
        }
      }), cloud.callFunction({
        name: "getList",
        data: {
          type: 1, //1获取文章分类列表，2获取文章列表
          page: 1,
          limit: 20
        }
      })

    ]).then(res => {
      let articlesList = res[0].result.data
      let reg = /<\/?.+?\/?>/ig;
      for (let i = 0; i < articlesList.length; i++) {
        let str = articlesList[i].htmlContent;
        let time = articlesList[i].createdTime;
        str = str.replace(reg, '');
        str = str.substring(0, 120);
        articlesList[i].description = str;
        articlesList[i].createdTime = formatTime(new Date(time));
      }

      this.setData({
        articlesList,
        CategoriesList: res[1].result.data
      })
      wx.hideLoading({
        success: (res) => {},
      })
    }).catch(err => {
      wx.showToast({
        title: '数据加载失败',
        icon: "none",
        mask: true
      })
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})