var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
var that;
var id;
Page({

  /*** 页面的初始数据*/
  data: {
    detail:""
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    id = options.id;
    that.getdetail(id)
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {

  },


  /*** 用户点击右上角分享*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '领英家教-教员详情',
      path: '/pages/teacher/detail/detail?id=' + id
    }
  },

  getdetail:function(id)
  {
    const query = Bmob.Query('teacher');
    query.include("parent","_User");
    query.get(id).then(res => {
      console.log(res)
      that.setData({detail:res})
    })
  },

  goback: function () {
    wx.switchTab({
      url: '/pages/personcenter/personcenter'
    })
  },

  sharefriend:function()
  {
    wx.navigateTo({
      url: '../share/share?id='+id,
    })
  },

  //预约点击
  call:function()
  {
    let user = Bmob.User.current();
    var identify = user.identity;
    var userid = user.objectId;

    if(identify =="" || identify == null)
    {
      wx.showToast({
        title: '请先去认证',
        icon:"none"
      })
    }else{
      if(identify == "家长")
      {
        wx.showModal({
          title: '提示',
          content: '是否申请',
          success:function(res){
            if(res.confirm)
            {
              const query = Bmob.Query("order");
              query.equalTo("user", "==", userid);
              query.find().then(res => {
                if(res.length == 0)
                {
                  const pointer = Bmob.Pointer('_User');
                  const poiID = pointer.set(userid);

                  const pointer1 = Bmob.Pointer('teacher');
                  const poiID1 = pointer1.set(id);

                  const query = Bmob.Query('order');
                  query.set("user", poiID);
                  query.set("teacher", poiID1);
                  query.set("ischeck", "false");
                  query.save().then(res => {
                    wx.showToast({
                      title: '预约成功',
                    })
                  })

                }else{
                  wx.showToast({
                    title: '请勿重复申请',
                    icon:"none"
                  })
                }
              });
            }
          }
        })
      }else{
        wx.showToast({
          title: '您的身份不符合',
          icon: "none"
        })
      }
    }
  },

})