var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var that;
var city;
var itemid;
Page({

  /*** 页面的初始数据*/
  data: {
    detail:"",
    array:["内容不真实","虚假信息","有诈骗嫌疑","其他"],
    index:0,
    maskdisplay:"none"
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    itemid = options.id;
    that.getdetail(options.id);
    console.log(options.id)
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显*/
  onShow: function () {

  },


  /*** 用户点击右上角分享*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '领英家教-学员详情',
      path: '/pages/student/detail/detail?id=' + itemid
    }
  },

  getdetail:function(id)
  {
    wx.showLoading({
      title: '详情加载中',
    });
    const query = Bmob.Query("studentdetail");
    query.include('student', 'student')
    query.equalTo("student", "==", id);
    query.find().then(res => {
      console.log(res);
      wx.hideLoading();
      that.setData({ detail: res[0] })
      city = res[0].student.localtion;
    });
  },

  gotothis:function()
  {
    var qqmapsdk = new QQMapWX({
      key: '3ACBZ-5PK34-HPZUT-XFODA-F4YS3-LNFXB'
    });
    qqmapsdk.geocoder({
      address: city,
      success: function (res) {
        console.log(res);
        wx.openLocation({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          scale: 28
        })
      },
    });
  },

  goback: function () {
    wx.switchTab({
      url: '/pages/personcenter/personcenter'
    })
  },

  //预约点击
  call: function () {
    let user = Bmob.User.current();
    var identify = user.identity;
    var userid = user.objectId;

    if (identify == "" || identify == null) {
      wx.showToast({
        title: '请先去认证',
        icon: "none"
      })
    } else {
      if (identify == "大学生/毕业生") {
        wx.showModal({
          title: '提示',
          content: '是否申请',
          success: function (res) {
            if (res.confirm) {
              const query = Bmob.Query("order");
              query.equalTo("user", "==", userid);
              query.find().then(res => {
                if (res.length == 0) {
                  const pointer = Bmob.Pointer('_User');
                  const poiID = pointer.set(userid);

                  const pointer1 = Bmob.Pointer('student');
                  const poiID1 = pointer1.set(id);

                  const query = Bmob.Query('order');
                  query.set("user", poiID);
                  query.set("student", poiID1);
                  query.set("ischeck", "false");
                  query.save().then(res => {
                    wx.showToast({
                      title: '预约成功',
                    })
                  })

                } else {
                  wx.showToast({
                    title: '请勿重复申请',
                    icon: "none"
                  })
                }
              });
            }
          }
        })
      } else {
        wx.showToast({
          title: '您的身份不符合',
          icon: "none"
        })
      }
    }
  },

  //举报点击
  jubao:function()
  {
    that.setData({ maskdisplay:"block"})
  },

  pickertext:function(e)
  {
    that.setData({index:e.detail.value})
  },

  formSubmit: function (e) {
    var text = e.detail.value.text;
    var anotnertext = e.detail.value.anotnertext;

    const query = Bmob.Query("jubao");
    query.equalTo("parent", "==", itemid);
    query.find().then(res => {
      console.log(res);
      const pointer = Bmob.Pointer('student');
      const poiID = pointer.set(itemid);

        const query = Bmob.Query('jubao');
        query.set("text", text);
        query.set("anotnertext", anotnertext);
        query.set("parent", poiID);
        query.save().then(res => {
          wx.showToast({
            title: '感谢您的反馈',
          });
          that.setData({ maskdisplay: "none" })
        })
      
    });
  },

  hidden:function()
  {
    that.setData({ maskdisplay: "none" })
  },

})