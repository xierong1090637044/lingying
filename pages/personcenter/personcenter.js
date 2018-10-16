// pages/personcenter/personcenter.js
var Bmob = require('../../utils/Bmob-1.6.2.min.js');
var that;
var phoneinput;
var codeinput;
Page({
  /*** 页面的初始数据*/
  data: {
    display1:'none',
    display2:'none',
    display3: "none",
    display4: "none",
    mask:"none",
    mask1: "none",
    user:"",
    phone: "",
    teachernum:"",
    studentnum:"",
    getcode:"发送验证码"
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
            avatar: current.avatar,
            nickname: current.username
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
                avatar: current.avatar,
                nickname: current.username
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
    let current = Bmob.User.current();
    Bmob.User.updateStorage(current.objectId).then(res => {
      that.setData({
        user: current,
      })
    }).catch(err => {
      console.log(err)
    });

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

  /*** 用户点击右上角分享*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '领英家教',
      path: '/pages/personcenter/personcenter'
    }
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
        } else if (user.identity == "正在审核"){
          wx.showToast({
            title: '正在审核',
            icon:"none"
          })
        }else {
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

  modifyphone:function()
  {
    that.setData({
      display3: "block",
      display4: "none"
    })
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

//输入手机号input
  getphone: function (e) {
    phoneinput = e.detail.value;
  },

//输入验证码input
  getinputcode:function(e)
  {
    codeinput = e.detail.value;
  },

  //发送验证码点击
  getcode:function()
  {
    wx.showLoading({
      title: '发送中',
    });
    if (phoneinput ==null)
    {
      wx.showToast({
        title: '请填写手机号',
        icon:"none"
      });
    }else{
      let params = {
        mobilePhoneNumber: phoneinput,
        template:"领英"
      };
      Bmob.requestSmsCode(params).then(function (response) {
        console.log(response);
        that.setData({
          getcode_canuse:true,
          getcode:60
        });
        var Interval = setInterval(function(){
          that.setData({
            getcode: that.data.getcode - 1
          });
          if(that.data.getcode == 1){
            that.setData({
              getcode_canuse: false,
              getcode: "重发"
            });
            clearInterval(Interval)
          }
        },1000);
        wx.hideLoading();
      }).catch(function (error) {
           if(error.error != null)
           {
             wx.showToast({
               title: error.error,
               icon:"none"
             })
           }
        });
    }
  },

  //绑定手机点击
  confrim_bindmobile:function()
  {
    if (phoneinput == null || codeinput == null)
    {
      wx.showToast({
        title: '请填写完整',
        icon:"none"
      })
    }else{
      let smsCode = codeinput
      let data = {
        mobilePhoneNumber: phoneinput
      }
      Bmob.verifySmsCode(smsCode, data).then(function (response) {
        console.log(response);
        if (response.msg =="ok")
        {
          let current = Bmob.User.current();
          const query = Bmob.Query('_User');
          query.set('id', current.objectId);
          query.set('mobilePhoneNumber', phoneinput);
          query.save().then(res => {
            wx.showToast({
              title: '绑定成功',
            });
            setTimeout(function(){
              that.hidden();
            },500)
          }).catch(err => {
            console.log(err)
          })
        }else{
          wx.showToast({
            title: "验证码错误",
            icon: "none"
          })
        }
      }).catch(function (error) {
        if (error.error != null) {
          wx.showToast({
            title: error.error,
            icon: "none"
          })
        }
        });
    }
  },

  //修改手机mask点击
  hidden:function()
  { 
    that.onLoad();
    that.setData({
      mask:"none",
      mask1:"none"
    })
  },

  //修改电话号码点击
  modify: function () {
   
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
  },

  //编辑个人信息点击
  edit_infor:function()
  {
    that.setData({mask1:"block"})
  },

  //修改头像点击
  modifyavatar:function()
  {
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          console.log('itemn', item)
          file = Bmob.File(that.data.user.username+'.jpg', item);
        }
        file.save().then(res => {
          var infor = JSON.parse(res[0]);
          that.setData({ avatar: infor.url});
        })
      }
    })
  },

  //修改用户昵称
  modifyusername:function(e)
  {
    that.setData({
      nickname: e.detail.value
    })
  },

  //用户信息点击修改
  modifyinfor:function()
  {
    console.log(that.data.nickname,that.data.avatar);

    let current = Bmob.User.current();

    const query = Bmob.Query('_User');
    query.set('id', current.objectId);
    query.set('username', that.data.nickname);
    query.set('avatar', that.data.avatar);
    query.save().then(res => {
      that.setData({mask1:"none"});
      wx.showToast({
        title: '修改成功',
      });
      that.onLoad();
    }).catch(err => {
      console.log(err)
    })
  }

})