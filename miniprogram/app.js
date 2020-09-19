//app.js


// https://blog.csdn.net/original_heart/article/details/84258985
var check_update = new Promise(function (resolve, reject) {
  const updateManager = wx.getUpdateManager();
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();

            }
            resolve(res);
          }
        });
      });
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: "已经有新版本了哟~",
          content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
        });
        resolve(res);
      });
    } else {
      resolve("no update");
    }
  });

});

App({
  onLaunch: function () {
    
    wx.cloud.init({
      env: 'xiamai-ix9h1',
      traceUser: true,
    })

    const db = wx.cloud.database();

    this.globalData = {};


    check_update.then(res => {
      var that = this;

      wx.getStorage({
        key: 'openid',
        success(res) {
          console.log(res.data)
          that.globalData.openid = res.data;
        },
        fail(err) {
          console.log("no openid");
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              that.globalData.openid = res.result.openid;
              wx.setStorage({
                key: 'openid',
                data: res.result.openid,
              })
            }
          });
        }
      })

    })

    
  },

  onShow: function (options) {
    var that = this;
    console.log("app.js onShow options", options);
    this.globalData.scene = options.scene;

    if (this.globalData.scene == 1044) {
      this.globalData.shareTicket = options.shareTicket

      wx.getShareInfo({
        shareTicket: this.globalData.shareTicket,
        success: function (res) {
          console.log('getShareTiket---shareTicket-->res', res)
          //获取cloudID
          let cID = res.cloudID
          console.log("cID " + cID)
          //调用云函数mytest
          wx.cloud.callFunction({
            name: 'opengid',
            // 这个 CloudID 值到云函数端会被替换
            data: {
              weRunData: wx.cloud.CloudID(cID)
            },
            success: function (res) {
              console.log(res);

              var openGId = res["result"]["event"]["weRunData"]["data"]["openGId"]
              var openid = res["result"]["openid"];

              const db = wx.cloud.database();

              // console.log("app.globalData.openid", app.globalData.openid)
              db.collection("user-group").where({
                gid: openGId,
                _openid: openid
              }).get().then(res=>{
                if (res.data.length == 0) {
                  db.collection("user-group").add({
                    data:{
                      gid:openGId
                    }
                  })
                }

              })
              


            },
            fail: function (res) {
              console.log("getopenid failed")
            }
          })
        }
      })

    }
    
  },
})
