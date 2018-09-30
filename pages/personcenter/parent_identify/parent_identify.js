var that;
var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { value: '上门辅导', checked: 'true'},
      { value: '在线辅导'},
    ],
    multiArray: [['小学', '初中','高中'], ['小学数学', '小学英语', '小学语文', '小学陪读']],
    multiIndex: [0, 0],
    phone: "",
    display1:"none",
    display2:"none",
    disabled:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getphone();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.setData({
      display1:"block"
    })
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  //多列选择器
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e)
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['小学数学', '小学英语', '小学语文', '小学陪读'];
            break;
          case 1:
            data.multiArray[1] = ['初中数学', '初中英语', '初中语文', '初中化学', '初中物理', '初中历史', '初中地理'];
            break;
          case 2:
            data.multiArray[1] = ['高中数学', '高中英语', '高中语文', '高中化学', '高中物理', '高中历史', '高中地理'];
            break;
        }
        data.multiIndex[1] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  },

  //提交按钮点击
  formSubmit: function (e) {
      wx.showLoading({
        title: '加载中',
      });
      console.log('form发生了submit事件，携带数据为：', e.detail.value);
      let user = new Bmob.User.current();

      var byway = e.detail.value.checkbox;
      var name = e.detail.value.inputname;
      var mobile = e.detail.value.inputmob;
      var clas = that.data.multiArray[0][that.data.multiIndex[0]];
      var subject = that.data.multiArray[1][that.data.multiIndex[1]];

      if (name == "") {
        wx.hideLoading();
        wx.showToast({
          title: '请填写姓名',
            icon: "none"
        })
      } else if (mobile == "") {
        wx.hideLoading();
        wx.showToast({
          title: '请去绑定手机',
          icon: "none"
        })
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '请确认信息',
          showCancel:false,
          confirmColor:"#2ca879",
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
              });
              const pointer = Bmob.Pointer('_User')
              const poiID = pointer.set(user.objectId);

              const query = Bmob.Query('parent_identify');
              query.set("byway", byway);
              query.set("name", name);
              query.set("mobile", mobile);
              query.set("class", clas);
              query.set("subject", subject);
              query.set("isactive", "true");
              query.set("parent", poiID);
              query.save().then(res => {

                const query = Bmob.Query('_User');
                query.get(user.objectId).then(res => {
                  console.log(res)
                  res.set('identity', '正在审核');
                  res.save();
                  wx.hideLoading();
                  that.onLoad();
                  wx.showToast({
                    title: '提交成功',
                  });
                  that.setData({
                    display1: "none",
                    display2: "block",
                    disabled: "false",
                  })
                })
              })
            }
          }
        })
      }
  },

  getphone:function()
  {
    let user = Bmob.User.current();
    console.log(user)
    that.setData({
      phone: user.mobilePhoneNumber
    })
  },

  //联系方式点击
  inputmob:function()
  {
    wx.showToast({
      title: '请先去绑定',
      icon:"none"
    })
  },
})