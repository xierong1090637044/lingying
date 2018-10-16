var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
var that;
Page({

  /*** 页面的初始数据*/
  data: {
    content:""
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {

  },

  getinput:function(e)
  {
    that.setData({ content: e.detail.value})
  },

  submit:function()
  {
    var content = that.data.content;

    if(content.length <= 10)
    {
      wx.showToast({
        title: '不能少于10个字',
        icon:"none"
      })
    }else{
      let current = Bmob.User.current();
      const query = Bmob.Query('suggestions');
      query.set("content", content)
      query.save().then(res => {
        that.setData({content:""});
        wx.showToast({
          title: '感谢您的提交',
        })
      }).catch(err => {
      })
    }
  }


})