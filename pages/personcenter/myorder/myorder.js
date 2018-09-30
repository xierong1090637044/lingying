var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
var that;
Page({

  /*** 页面的初始数据*/
  data: {
    detail:"",
    id:"",
    detail_s:"",
    display1:"none",
    display2:"none",
    display3:"none"
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {
    that.getdata();
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {

  },

  getdata:function()
  {
    wx.showLoading({
      title: '加载中',
    });
    let user = Bmob.User.current();
    var id = user.objectId;

    if(user.identity == "家长")
    {
      const query = Bmob.Query("order");
      query.equalTo("user", "==", id);
      query.include("teacher", "teacher");
      query.find().then(res => {
        if (res.length == 0) {
          wx.hideLoading();
          that.setData({
            display1: "none",
            display2: "block"
          })
        } else {
          const query = Bmob.Query('_User');
          query.get(res[0].teacher.parent.objectId).then(res => {
            console.log(res);
            wx.hideLoading();
            that.setData({ user: res, display1: "block", display2: "none" })
          });
          that.setData({
            detail: res[0],
            id: res[0].objectId
          })
        }
      });
    } else if (user.identity =="大学生/毕业生"){
      const query = Bmob.Query("order");
      query.equalTo("user", "==", id);
      query.include("student", "student");
      query.find().then(res => {
        if (res.length == 0) {
          wx.hideLoading();
          that.setData({
            display3: "none",
            display2: "block"
          })
        } else {
          wx.hideLoading();
          console.log(res[0])
          that.setData({
            detail_s: res[0].student,
            id: res[0].objectId,
            display2: "none",
            display3: "block"
          })
        }
      });
    }else{
      wx.hideLoading();
      that.setData({
        display3: "none",
        display2: "block"
      })
    }
    
  },

  //点击去到详情
  gotodetail:function(e)
  {
    console.log(e)
    var itemid = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../../teacher/detail/detail?id='+itemid,
    })
  },

  gotodetail_s:function(e)
  {
    console.log(e)
    var itemid = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../../student/detail/detail?id=' + itemid,
    })
  },

  //自主联系点击
  call:function()
  {
    let user = Bmob.User.current();
    var id = user.objectId;

    if(user.identity =="家长")
    {
      const query = Bmob.Query("order");
      query.equalTo("user", "==", id);
      query.include("teacher", "teacher");
      query.find().then(res => {
        if (res[0].ischeck == "false") {
          wx.showToast({
            title: '请等待客服审核',
            icon: "none"
          })
        } else {
          const query = Bmob.Query('_User');
          query.get(res[0].teacher.parent.objectId).then(res => {
            console.log(res);
            wx.makePhoneCall({
              phoneNumber: res.mobilePhoneNumber,
            })
          });
        }
      })
    } else if (user.identity == "大学生/毕业生")
    {
      const query = Bmob.Query("order");
      query.equalTo("user", "==", id);
      query.include("student", "student");
      query.find().then(res => {
        if (res[0].ischeck == "false") {
          wx.showToast({
            title: '请等待客服审核',
            icon: "none"
          })
        } else {
          const query = Bmob.Query('_User');
          query.get(res[0].student.parent.objectId).then(res => {
            console.log(res);
            wx.makePhoneCall({
              phoneNumber: res.mobilePhoneNumber,
            })
          });
        }
      })
    }

    
  },

  //取消点击
  giveout:function()
  {
    console.log(that.data.id);
    wx.showModal({
      title: '提示',
      content: '是否取消此次申请',
      success:function(res)
      {
        if(res.confirm)
        {
          const query = Bmob.Query('order');
          query.destroy(that.data.id).then(res => {
            wx.showToast({
              title: '取消成功',
            });
            that.getdata();
          })
        }
      }
    })
  }

})