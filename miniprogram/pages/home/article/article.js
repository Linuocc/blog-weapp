const {
  formatTime
} = require("../../../utils/util")

const cloud = wx.cloud
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1, //当前页数
    limit: 5, //每页数据条数
    articlesList: [], //文章列表
    end: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      cid: options.cid,
      title: options.title
    })
    const {
      currentPage,
      limit
    } = this.data
    this.getArticleList(currentPage, limit, options.cid, () => {


    })
  },

  getArticleList(cureentPage, limit, cid, callback) {
    if (!this.data.end) {
      // wx.showLoading({
      //   title: '加载中',
      //   mask:true
      // })
      cloud.callFunction({
        name: "getList",
        data: {
          type: 2,
          page: cureentPage,
          limit,
          cid
        }
      }).then(res => {
        let {
          articlesList
        } = this.data;

        let {
          data
        } = res.result;


        let arr = [];

        let reg = /<\/?.+?\/?>/ig;
        // let reg = new RegExp("<\/?.+?\/?>",'g')

        for (let i = 0; i < data.length; i++) {
          let str = data[i].htmlContent;
          let time = data[i].createdTime;
          str = str.replace(reg, '');
          str = str.substring(0, 100);
          data[i].description = str;
          data[i].createdTime = formatTime(new Date(time));
        }

        articlesList.push(...data)
        this.setData({
          articlesList,
          currentPage: this.data.currentPage + 1,
          end: res.result.data.length < limit
        })
        callback();
      })
    }
  },

  openArticleDetile(option) {
    const index = option.currentTarget.dataset.index;
    const data = this.data.articlesList[index];
    wx.navigateTo({
      url: '/pages/home/detail/detail?aid=' + data.aid,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    const {
      currentPage,
      limit,
      cid
    } = this.data
    this.getArticleList(currentPage, limit, cid, () => {
      // wx.hideLoading()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})