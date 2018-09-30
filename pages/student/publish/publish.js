var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class1: ["小学", "初中", "高中"],
    city: ["天津市","上海市"],
    sex:["男","女"],
    aptitude:["在校大学生"],
    index1:0,
    index2:0,
    t_sex_index:0,
    aptitude_index:0,
    class_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  //上课地点点击
  chooseloc:function(){
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
      },
    })
  },

  //选择性别
  bindPickerChange: function (e) {
    this.setData({
      index1: e.detail.value
    })
  },

  // 孩子年级选择
  pickclass: function (e) {
    this.setData({
      class_index: e.detail.value
    })
  },

  //选择教员性别
  picktsex: function (e) {
    this.setData({
      t_sex_index: e.detail.value
    })
  },

  //选择教员身份
  pickaptitude: function (e) {
    this.setData({
      aptitude_index: e.detail.value
    })
  },

  //选择城市
  pickcity: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },

  //表单提交
  formSubmit: function (e) {
    let user = Bmob.User.current();
    var id = user.objectId;
    let detail = e.detail.value;
    var subject =detail.subject;
    var sex = detail.sex;
    var city = detail.city;
    var address = detail.address;
    var introduce = detail.introduce;
    var pay = detail.pay;

    var t_sex = detail.t_sex;
    var require1 = detail.require;
    var course_time = detail.course_time;
    var class1 = detail.class;
    var aptitude = detail.aptitude;

    if (detail == "" || subject == "" || sex == "" || city == "" || address == "" || pay == "" || t_sex == "" || require1 =="" || course_time =="" || class1 =="" || aptitude =="")
    {
      wx.showToast({
        title: '请填写完整',
        icon:"none"
      })
    }else{
      const pointer = Bmob.Pointer('_User');
      const poiID = pointer.set(id);

      const query = Bmob.Query('student');
      query.set("subject", subject);
      query.set("sex", sex);
      query.set("pay", pay+"元/小时");
      query.set("localtion", city+address);
      query.set("introduce", introduce);
      query.set("city", city);
      query.set("class", class1);
      query.set("parent", poiID);
      query.save().then(res => {
        console.log(res)
        var student_id = res.objectId;
        const pointer = Bmob.Pointer('student');
        const poiID = pointer.set(student_id);

        const query = Bmob.Query('studentdetail');
        query.set("t_sex", t_sex);
        query.set("require", require1);
        query.set("course_time", course_time);
        query.set("class", class1);
        query.set("aptitude", aptitude);
        query.set("student", poiID);
        query.save().then(res => {
          this.setData({
            disabled:true
          });
          wx.navigateBack({
            delta: 1
          });
          setTimeout(function(){
            wx.showToast({
              title: '提交成功',
            });
          },1500)
        });
      })
    }

    console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },
})