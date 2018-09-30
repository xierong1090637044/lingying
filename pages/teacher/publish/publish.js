var Bmob = require('../../../utils/Bmob-1.6.2.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class1: ["专科", "本科", "研究生"],
    city: ["天津市"],
    sex:["男","女"],
    class_index:0,
    sex_index:0,
    city_index:0,
    items: [ {value: '小学' },{value: '初中', checked: 'true' },{value: '高中' }],
    subjects: ['小学语文', "小学英语", "小学数学", "初中语文", "初中数学", "初中英语", "初中物理", "初中化学", "初中政治", "高中语文", "高中数学", "高中英语", "高中物理", "高中化学", "高中政治","高中历史","高中地理"],
    ways: [{ value: '本人上门',checked: 'true' }, { value: '学生上门'}, { value: '网络辅导' }],
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

  //选择性别
  picktsex: function (e) {
    this.setData({
      sex_index: e.detail.value
    })
  },

  //目前身份选择
  pickclass: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      class_index: e.detail.value
    })
  },

  //可教年级多选
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  //可教科目多选
  can_teacher: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  //选择可教城市
  pickcity: function (e) {
    this.setData({
      city_index: e.detail.value
    })
  },

  //可教科目多选
  byway: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },


  //表单提交
  formSubmit: function (e) {
    let user = Bmob.User.current();
    var id = user.objectId;
    let detail = e.detail.value;

    var school = detail.schoolname;
    var by_way = detail.byway;//数组类型
    var can_teach = detail.can_teacher_subject;//数组类型
    var can_teach_city = detail.can_teacher_city;
    var can_teach_class = detail.can_teacher_class;//数组类型
    var expire = detail.expire;//可不填
    var major = detail.profession;
    var pay = detail.pay;
    var award = detail.award;//可不填
    var clas = detail.class1 +detail.class2;
    var introduce = detail.introduce;

    if (school == "" || by_way.length == 0 || can_teach.length == 0 || can_teach_city == "" || can_teach_class=="" || major=="" || pay=="" ||clas==""||introduce=="")
    {
      wx.showToast({
        title: '请填写完整',
        icon:"none"
      })
    }else{
      console.log(school, by_way, can_teach, can_teach_city, can_teach_class,major,pay,clas,introduce)
      const pointer = Bmob.Pointer('_User');
      const poiID = pointer.set(id);

      const query = Bmob.Query('teacher');
      query.set("school", school);
      query.set("by_way", by_way);
      query.set("can_teach", can_teach);
      query.set("can_teach_city", can_teach_city);
      query.set("can_teach_class", can_teach_class);
      if(expire =="")
      {
        query.set("expire", "暂无");
      }else{
        query.set("expire", expire);
      }
      query.set("major", major);
      query.set("pay", Number(pay));
      if(award=="")
      {
        query.set("award", "暂无");
      }else{
        query.set("award", award);
      }
      query.set("class", clas);
      query.set("introduce", introduce);
      query.set("parent", poiID);
      if (user.identity =="大学生/毕业生")
      {
        query.set("identify", "大学生/毕业生");
      }else{
        query.set("identify", "在校老师");
      }
      query.save().then(res => {
        this.setData({
          disabled: true
        });
        wx.navigateBack({
          delta: 1
        });
        setTimeout(function () {
          wx.showToast({
            title: '提交成功',
          });
        }, 1500)
      })
    }

    console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },
})