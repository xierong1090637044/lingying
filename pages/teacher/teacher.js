var Bmob = require('../../utils/Bmob-1.6.2.min.js');
var that;
Page({

  /*** 页面的初始数据*/
  data: {
    array: [
      { name: "全部", value: 1000 },
      { name: '小于20元/小时', value: 20},
      { name: '小于50元/小时', value: 50 },
      { name: '小于80元/小时', value: 80 },
      { name: '小于100元/小时', value: 100 },
    ],
    array1: ["全部","上海市", "天津市"],
    array2: ["全部","大学生/毕业生"],
    detail:"",
    pay:null,
    city:null,
    identify:null,
    limit:20,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    that.getallteacherwithloading(that.data.pay, that.data.city, that.data.identify, that.data.limit);
    that.getpublishbutton();
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    
  },

  onHide:function()
  {
    that.getallteacher(that.data.pay, that.data.city, that.data.identify, that.data.limit);
  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '领英家教',
      path: '/pages/teacher/teacher'
    }
  },

  //点击去到详情页面
  gotodetail:function(e)
  {
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail/detail?id=' + id,
    })
  },

  //得到所有老师列表
  getallteacher:function(pay,city,identify,limit)
  {
      const query = Bmob.Query("teacher");
      if (pay != null) query.equalTo("pay", "<=", pay);
      if (city != null) query.equalTo("can_teach_city", "==", city);
      if (identify != null) query.equalTo("identify", "==", identify);
      query.include("parent", "_User");
      query.order("-createdAt");
      query.limit(limit);
      query.find().then(res => {
        that.setData({
          detail: res
        })
        console.log(res)
      });
    },

  //得到所有老师列表
  getallteacherwithloading: function (pay, city, identify, limit) {
    wx.showLoading({
      title: '加载中',
    });
    const query = Bmob.Query("teacher");
    if (pay != null) query.equalTo("pay", "<=", pay);
    if (city != null) query.equalTo("can_teach_city", "==", city);
    if (identify != null) query.equalTo("identify", "==", identify);
    query.include("parent", "_User");
    query.order("-createdAt");
    query.limit(limit);
    query.find().then(res => {
      wx.hideLoading();
      that.setData({
        detail: res
      })
      console.log(res)
    });
  },

    //下滑刷新
  skiplimit:function()
  {
    that.data.limit = that.data.limit+20;
    that.getallteacherwithloading(that.data.pay, that.data.city, that.data.identify, that.data.limit)
  },

  //薪水选择
  bindPickerChange: function (e) {
    var index = e.detail.value;
    if (index == 1000) {
      this.setData({
        index: null,
        index1: null,
        index2: null,
      });
      that.getallteacher(null, null, null, that.data.limit);
    } else {
      this.setData({
        index: index,
        pay: that.data.array[index].value
      });
      that.getallteacher(that.data.array[index].value, that.data.city, that.data.identify, that.data.limit);
    }
  },

  //可教城市选择
  bindPickerChange1: function (e) {
    var index = e.detail.value;
    if (index == 0) {
      this.setData({
        index: null,
        index1: null,
        index2: null,
      });
      that.getallteacher(null, null, null, that.data.limit);
    } else {
      this.setData({
        index1: index,
        city: that.data.array1[index]
      });
      console.log(that.data.array1[index]);
      that.getallteacher(that.data.pay, that.data.array1[index], that.data.identify, that.data.limit);
    }
  },

  //教员类型选择
  bindPickerChange2: function (e) {
    var index = e.detail.value;
    if (index==0)
    {
      this.setData({
        index:null,
        index1: null,
        index2: null,
      });
      that.getallteacher(null, null, null, that.data.limit);
    }else{
      this.setData({
        index2: index,
        identify: that.data.array2[index]
      });
      that.getallteacher(that.data.pay, that.data.city, that.data.array2[index], that.data.limit);
    }
  },

  //发布按钮点击
  publish: function () {

    let user = Bmob.User.current();
    let id = user.objectId;
    var identity = user.identity;
    if (identity != "大学生/毕业生") {
      wx.showToast({
        title: '您的身份不符合',
        icon: "none"
      });
    } else {
      const query = Bmob.Query("teacher");
      query.equalTo("parent", "==", id);
      query.find().then(res => {
        console.log(res)
        var lenght = res.length;
        if (lenght >= 1) {
          wx.showToast({
            title: '您已发布，请去修改',
            icon: "none"
          });
        } else {
          wx.navigateTo({
            url: 'publish/publish',
          })
        }
      });
    }
  },

  //是否显示发布按钮
  getpublishbutton: function () {
    const query = Bmob.Query('config');
    query.get('ApBP7779').then(res => {
      if (res.button) {
        that.setData({ publishbutton: "block" })
      } else {
        that.setData({ publishbutton: "none" })
      }
    })
  },
})