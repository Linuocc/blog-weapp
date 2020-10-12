const {
  formatTime
} = require("../../../utils/util");

let startPoint;
const app = getApp();
const cloud = wx.cloud;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imageArray: [],
    isLoad: false,
    showImgBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    cloud.callFunction({
      name: "getList",
      data: {
        type: 3,
        aid: options.aid,
      }
    }).then(res => {
      const data = res.result;
      // console.log(data)
      this.setData({
        title: data.title,
        node: this.formatHtml(data.htmlContent),
        aid: data.aid,
        author: data.author,
        createdTime: formatTime(new Date(data.createdTime)),
        isLoad: true
      }, () => {
        wx.setNavigationBarTitle({
          title: data.title,
        })
      })

    })
  },

  formatHtml(htmlContent) {
    htmlContent = htmlContent.replace(/<pre>/ig, '<pre class="pre">')
    htmlContent = htmlContent.replace(/<code[^>]*>/ig, '<code class="code">')
    htmlContent = htmlContent.replace(/<h2[^>]*>/ig, '<h2 class="h2">')
    htmlContent = htmlContent.replace(/<p>/ig, '<p class="p">')
    htmlContent = htmlContent.replace(/<img/ig, '<img class="img" ')
    htmlContent = htmlContent.replace(/<table>/ig, '<table border="1" class="table">')
    htmlContent = htmlContent.replace(/<td/ig, '<td class="td"')
    htmlContent = `<div class="wrap">${htmlContent}</div>`
    let arr = [];
    // let reg = /(?<=(src="))[^"]*?(?=")/ig;
    let reg = new RegExp(`((src="))[^"]*?(?=")`, 'gi');
    let allSrc = htmlContent.match(reg)
    if (allSrc != null) {
      for (let i = 0; i < allSrc.length; i++) {
        allSrc[i] = allSrc[i].substring(5)
        arr.push(allSrc[i])
        this.setData({
          imageArray: arr
        })
      }
      this.setData({
        showImgBtn: true
      })
    }
    return htmlContent;

  },


  previewImage(option) {
    wx.previewImage({
      urls: this.data.imageArray,
      current: this.data.imageArray[option.currentTarget.dataset.index]
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      showImgBtn: false
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      showImgBtn: true
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: `/pages/home/detail/detail?aid=${this.data.aid}`
    }
  }
})