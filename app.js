//app.js
var Bmob = require('utils/Bmob-1.6.2.min.js');
Bmob.initialize("fe19a8c030c6dc5440399eddc8d7b028", "e67c942a2cfd9abc81f7358cb46615d9");
App({
  onLaunch: function () {
    var that=this;
    Bmob.User.auth().then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err)
    });

    require('utils/sdk-v1.8.0.js');
    let clientID = 'eff73136cdf0669c0921';
    wx.BaaS.init(clientID)

  },

})