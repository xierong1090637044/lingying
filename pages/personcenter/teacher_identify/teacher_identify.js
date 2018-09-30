var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src1:"",
    src2:"",
    display1:"none",
    display2:"none",
    display3: "none",
    display4: "none",
    button:"none",
    notice:"none",
    notice2: "none",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let current = Bmob.User.current();
    that.getimg(current.objectId);
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

  },

  //上传身份证点击
  uoloadsfz:function()
  {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res.tempFilePaths)
        const tempFilePaths = res.tempFilePaths
        that.setData({
          display1:"none",
          display2:"block",
          src1: res.tempFilePaths
        })
      }
    })
  },

  //上传学生证点击
  uoloadxsz: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res.tempFilePaths)
        const tempFilePaths = res.tempFilePaths
        that.setData({
          display3: "none",
          display4: "block",
          src2: res.tempFilePaths
        })
      }
    })
  },

  //提交按钮点击
  upload:function()
  {
    wx.showLoading({
      title: '加载中',
    });

    let current = Bmob.User.current();
    var src1 = that.data.src1;
    var src2 = that.data.src2;
    var index =0;
    if(src1 == "" || src2 =="")
    {
      wx.showToast({
        title:"请上传图片",
        icon:"none"
      })
    }else{
      src1 = src1.concat(src2);

      var file;
      for (let item of src1) {
        console.log('itemn', item)
        file = Bmob.File('identify.jpg', item);
        index ++;
      }
      file.save().then(res => {
        console.log(res.length);
        console.log(JSON.parse(res[0]));
        var object = JSON.parse(res[0]);
        var object1 = JSON.parse(res[1]);

        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(current.objectId);

        const query = Bmob.Query('identify');
        query.set("parent", poiID);
        query.set("img1", object.url);
        query.set("img2", object1.url);
        query.set("isactive", "true");
        query.save().then(res => {

          const query = Bmob.Query('_User');
          query.get(current.objectId).then(res => {
            console.log(res)
            res.set('identity', '正在审核');
            res.save();
            wx.hideLoading();
            that.getimg(current.objectId);
            wx.showToast({
              title: '提交成功',
            })
          })
        })
      })
    }
  },

  getimg:function(id){
    wx.showLoading({
      title: '加载中',
      icon:"none"
    });
    const query = Bmob.Query("identify");
    query.equalTo("parent", "==", id);
    query.find().then(res => {
      console.log(res)
      if(res.length == 0)
      {
        wx.hideLoading();
        that.setData({
          display1: "block",
          display2: "none",
          display3: "block",
          display4: "none",
          notice:"none",
          button:"block",
        })
      }else{
        that.setData({
          src1: res[0].img2,
          src2: res[0].img1,
          display1: "none",
          display2: "block",
          display3: "none",
          display4: "block",
          button:"none",
        })

        let current = Bmob.User.current();
        if (current.identity == "大学生/毕业生" || current.identity == "在职教师")
        {
          that.setData({
            notice:'none',
            notice2:"block"
          })
          wx.hideLoading();
        }else{
          wx.hideLoading();
          that.setData({
            notice: 'block',
            notice2: "none"
          })
        }
      }
    });
  },
})