var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
var that;
var id;
Page({

  /*** 页面的初始数据*/
  data: {
    codeimg:"",
    detail:""
  },

  /** * 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    id = options.id;
    wx.showLoading({
      title: '加载中',
    });
    var path = "pages/teacher/detail/detail?id="+id;
    let qrData = { path: path, width: 430, type: 1 }
    Bmob.generateCode(qrData).then(function (res) {
      console.log(res);
      wx.hideLoading();
      that.setData({
        codeimg:res.url
      })
    }).catch(function (err) {
      console.log(err);
    });
    that.getdetail(id)
  },

  /*** 生命周期函数--监听页面初次渲染完*/
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {

  },

  getdetail: function (id) {
    const query = Bmob.Query('teacher');
    query.include("parent", "_User");
    query.get(id).then(res => {
      console.log(res)
      that.setData({ detail: res })
    })
  },
})