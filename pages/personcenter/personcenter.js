// pages/personcenter/personcenter.js
var Bmob = require('../../utils/Bmob-1.6.2.min.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display1:'none',
    display2:'none',
    display3: "none",
    display4: "none",
    mask:"none",
    user:"",
    phone: "",
    teachernum:"",
    studentnum:""
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    let current = Bmob.User.current();
    console.log(current);
    wx.getSetting({
      success: (res) => {
        var authorize = res.authSetting['scope.userInfo'];
        if (authorize) {
          that.setData({
            display2: 'block',
            display1: 'none',
            user: current,
          })
        } else {
          if (current == null) {
            that.setData({
              display2: 'none',
              display1: 'block',
            })
          } else {
            if (current.islogin == true) {
              that.setData({
                display2: 'block',
                display1: 'none',
                user: current,
              })
            } else {
              that.setData({
                display2: 'none',
                display1: 'block',
              })
            }
          }
        }
      }
    })
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
    that.onLoad();

    const query = Bmob.Query("_User");
    query.equalTo("identity", "==", "大学生/毕业生");
    query.find().then(res => {
      that.setData({
        teachernum:res.length
      })
    });

    const query1 = Bmob.Query("_User");
    query1.equalTo("identity", "==", "家长");
    query1.find().then(res => {
      that.setData({
        studentnum: res.length
      })
    });
  },

  //获取用户信息
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo);
    let current = new Bmob.User.current();
    var user = e.detail.userInfo;
    var nickname = user.nickName;
    var gender = user.gender;
    var avatar = user.avatarUrl;

    const query = Bmob.Query('_User');
    query.get(current.objectId).then(res => {
      res.set('username', nickname);
      res.set('gender', gender);
      res.set('avatar',avatar);
      res.set('islogin', true);
      res.save();
      setTimeout(function(){
        that.onLoad()
      },1000)
    });
  },

  //我的认证点击
  gotoidentify:function()
  {
    let user = new Bmob.User.current();
    var islogin = user.islogin;
    if (islogin==null)
    {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }else{
      
      if(user.mobilePhoneNumber ==null ||user.mobilePhoneNumber =="")
      {
        wx.showToast({
          title: '请先绑定手机号',
          icon: "none"
        })
      }else{
        //去认证的时候点击
        if (user.identity == "" || user.identity == null || user.identity == '未通过') {
          wx.showActionSheet({
            itemList: ["大学生认证", "家长认证"],
            success: function (e) {
              if (e.tapIndex == 0) {
                wx.navigateTo({
                  url: 'teacher_identify/teacher_identify',
                })
              } else {
                wx.navigateTo({
                  url: 'parent_identify/parent_identify',
                })
              }
            }
          })
        } else {
          if (user.identity == "大学生/毕业生" || user.identity == "在职教师") {
            wx.navigateTo({
              url: 'teacher_identify/teacher_identify',
            })
          } else if (user.identity == "家长") {
            wx.showToast({
              title: '您的身份认证为：家长',
              icon: "none"
            })
          }
        }
      }
    }
},

  //我的手机点击
  bindmobile:function()
  {
    let current = Bmob.User.current();
    var islogin = current.islogin;

    if (islogin==null) {
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
    }else{
      let current = Bmob.User.current();
      if (current.mobilePhoneNumber == null || current.mobilePhoneNumber == "") {
        that.setData({
          mask:"block",
          display3: "block",
          display4: "none"
        })
      } else {
        that.setData({
          mask:"block",
          phone: current.mobilePhoneNumber,
          display3: "none",
          display4: "block"
        })
      }
    }
},

//获取手机号地点击
  getphone: function (e) {
    wx.showLoading({
      title: '获取中',
    });
    let current = Bmob.User.current();

    wx.BaaS.wxDecryptData(e.detail.encryptedData, e.detail.iv, 'phone-number').then(decrytedData => {

      const query = Bmob.Query('_User');
      query.get(current.objectId).then(res => {
        res.set('mobilePhoneNumber', decrytedData.phoneNumber);
        res.save();
        wx.showToast({
          title: '获取成功',
          icon: "none",
        });
        wx.hideLoading();
        that.setData({
          phone: decrytedData.phoneNumber,
          display3: "none",
          display4: "block"
        });
      });
    }, err => {
    })
  },

  //修改手机mask点击
  hidden:function()
  { 
    that.onLoad();
    that.setData({
      mask:"none"
    })
  },

  //修改电话号码点击
  modify: function () {
    wx.showToast({
      title: '请联系客服修改',
      icon:"none"
    })
  },

  //我的发布点击
  gotoedit:function()
  {
    let user = Bmob.User.current();
    var id = user.objectId;
    var indentify = user.identity;

    if (indentify == "大学生/毕业生")
    {
      const query = Bmob.Query("teacher");
      query.equalTo("parent", "==", id);
      query.find().then(res => {
        console.log(res)
        if(res.length == 0)
        {
          wx.showToast({
            title: '未发布',
            icon:"none"
          })
        }else{
          wx.navigateTo({
            url: 'teacher_edit/teacher_edit',
          })
        }
      });
    } else if (indentify == "家长")
    {
      const query = Bmob.Query("student");
      query.equalTo("parent", "==", id);
      query.find().then(res => {
        console.log(res)
        if (res.length == 0) {
          wx.showToast({
            title: '未发布',
            icon: "none"
          })
        } else {
          wx.navigateTo({
            url: 'parent_edit/parent_edit',
          })
        }
      });
    }else{
      wx.showToast({
        title: '请去认证',
        icon:"none"
      })
    }
  },

  //去到我的申请
  gotomyorder:function()
  {
    let user = Bmob.User.current();
    if(user == null)
    {
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
    }else{
      wx.navigateTo({
        url: 'myorder/myorder',
      })
    }
  },

  //关于我们点击
  gotoaboutus:function()
  {
    wx.navigateTo({
      url: 'about_us/about_us',
    })
  }

})