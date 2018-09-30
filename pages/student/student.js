var Bmob = require('../../utils/Bmob-1.6.2.min.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var that;
Page({
  data: {
    localtion:"",
    array:["全部","天津市","上海市"],
    array1: ["全部","小学", "初中", "高中"],
    studentinfo:"",
    publishbutton:"none",
    clas:null,
    city:null,
  },

  onLoad: function () {
    that=this;
    that.getpublishbutton();
    that.getlocation();
  },

  onShow:function() {
    that.getstudentinfo(that.data.city,that.data.clas);
  },

  //选择年级
  pickerclass: function (e) {
    var index = e.detail.value;

    if(index == 0)
    {
      this.setData({
        index1: null,
        index: null,
        clas : null,
        city: null,
      })
      that.getstudentinfo();
    }else{
      this.setData({
        index1: index,
        clas: that.data.array1[index]
      })
      that.getstudentinfo(that.data.city, that.data.array1[index]);
    }
  },

  //选择城市
  pickercity: function (e) {
    var index = e.detail.value;

    if(index == 0)
    {
      this.setData({
        index1: null,
        index: null,
        city: null,
        clas: null,
      })
      that.getstudentinfo();
    }else{
      this.setData({
        index: index,
        city: this.data.array[index],
      })
      that.getstudentinfo(this.data.array[index], that.data.clas);
    }
  },

  //查询获得所有学生信息
  getstudentinfo:function(city,clas)
  {
    wx.showLoading({
      title: '加载中',
      success:function(){
        const query = Bmob.Query("student");
        if(city != null ) query.equalTo("city", "==", city);
        if (clas != null) query.equalTo("class", "==", clas);
        query.find().then(res => {
          wx.hideLoading();
          that.setData({
            studentinfo: res
          })
          console.log(res)
        });
      }
    })
  },

  //加载得到当前位置信息
  getlocation: function () 
  {
    wx.getLocation({
      success: function (res) {
        var qqmapsdk = new QQMapWX({
          key: '3ACBZ-5PK34-HPZUT-XFODA-F4YS3-LNFXB'
        });
        qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude,
              },
              success: function (res) {
                that.getstudentinfo(res.result.address_component.city);
                that.setData({
                  city: res.result.address_component.city,
                  localtion: res.result.address_component.city
                })
              },
        });
      },
    })
  },

  //去到学生详情
  gotodetail:function(e)
  {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail/detail?id='+id,
    })
  },

  //发布按钮点击
  publish:function()
  {
    let user = Bmob.User.current();
    let id = user.objectId;
    var identity = user.identity;
    if(identity !="家长")
    {
      wx.showToast({
        title: '您的身份不符合',
        icon:"none"
      });
    }else{
      wx.showLoading({
        title: '加载中',
      });
      const query = Bmob.Query("student");
      query.equalTo("parent", "==", id);
      query.find().then(res => {
        wx.hideLoading();
        console.log(res)
        var lenght = res.length;
        if(lenght >=1)
        {
          wx.showToast({
            title: '您已发布，请去修改',
            icon:"none"
          });
          
        }else{
          
          wx.navigateTo({
            url: 'publish/publish',
          })
        }
      });
    }
  },

  //是否显示发布按钮
  getpublishbutton:function()
  {
    const query = Bmob.Query('config');
    query.get('ApBP7779').then(res => {
      if(res.button)
      {
        that.setData({ publishbutton:"block"})
      }else
      {
        that.setData({ publishbutton: "none" })
      }
    })
  },

})
