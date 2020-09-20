// miniprogram/pages/user/user.js
const app = getApp();
const db = wx.cloud.database();

var start = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged_in: false,
    user_profile: ""


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              var userInfo = res.userInfo;
              var openid = wx.getStorageSync('openid');
              console.log("userInfo", userInfo);
              console.log("app.globalData.openid", openid)

              db.collection('users').where({
                _openid: openid
              }).get().then(res => {
                // console.log("res", res);
                var _id = res.data[0]._id;
                var _openid = res.data[0]._openid;
                var profile = res.data[0];

                db.collection('users').doc(_id).update({
                  data: {
                    userInfo: userInfo
                  }
                }).then(res1 => {
                  app.globalData.logged_in = true;

                  that.setData({
                    logged_in: true,
                    user_profile: profile
                  });

                  wx.getStorage({
                    key: '_id',
                    success(res) {
                      console.log("1", res.data)
                      app.globalData._id = res.data;
                    },
                    fail(err) {
                      console.log("no _id");
                      wx.setStorage({
                        key: '_id',
                        data: _id,
                      })
                    }
                  });

                  app.globalData._id = _id;

                })




              })

            }
          });

        }

      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    console.log(this.data);
    console.log(app.globalData);

    if (app.globalData.contact && app.globalData.desc) {
      console.log("new contact")
      var user_profile = that.data.user_profile;

      user_profile.contact = app.globalData.contact;
      user_profile.desc = app.globalData.desc;

      that.setData({
        user_profile: user_profile
      })

    }

    wx.cloud.callFunction({
      name: 'get_user_items',
      data: {},
      success: res => {
        var items = res.result.data.map((x, index) => {
          x.is_self = true;
          return x
        });

        wx.lin.renderWaterFlow(items, true);
      }
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;

    return {
      title: that.data.user_profile.userInfo.nickName + "的主页",
      // imageUrl: that.data.item.real_imgs[0],
      path: '/pages/profile/profile?share=true&openid=' + that.data.user_profile._openid
    }

  },

  share_user_info: function() {
    var that = this;
    return {
      title: that.data.user_profile.userInfo.nickName + "的主页",
      // imageUrl: that.data.item.real_imgs[0],
      path: '/pages/profile/profile?share=true&openid=' + that.data.user_profile._openid
    }
  },

  bindGetUserInfo: function(e) {
    var that = this

    if (e.detail.errMsg.indexOf('ok') != -1) { //同意授权
      var userInfo = e.detail.userInfo;
      console.log(userInfo);

      db.collection('users').where({
        _openid: app.globalData.openid
      }).get().then(res => {
        console.log("user after init", res)

        if (res.data.length == 0) {
          db.collection("users").add({
            data: {
              userInfo: userInfo,
              dateJoined: new Date(),
              contact: "未设置联系方式",
              desc: "未设置简介"
            }
          }).then(res => {
            console.log(userInfo);
            app.globalData.logged_in = true;
            that.setData({
              logged_in: true,
              user_profile: {
                userInfo: userInfo,
                contact: "未设置联系方式",
                desc: "未设置简介"
              }
            });

            db.collection("users").where({
              _openid: app.globalData.openid
            }).get().then(res=>{
              console.log("after signin res", res);
              var _id = res.data[0]._id;
              
              wx.getStorage({
                key: '_id',
                success(res) {
                  console.log(res.data)
                  app.globalData._id = res.data;
                },
                fail(err) {
                  console.log("no _id");
                  wx.setStorage({
                    key: '_id',
                    data: _id,
                  })
                }
              });
            })


          })

        } else {
          var _id = res.data[0]._id;
          var profile = res.data[0];

          wx.getStorage({
            key: '_id',
            success(res) {
              console.log(res.data)
              app.globalData._id = res.data;
            },
            fail(err) {
              console.log("no _id");
              wx.setStorage({
                key: '_id',
                data: _id,
              })
            }
          });

          db.collection('users').doc(_id).update({
            data: {
              userInfo: userInfo
            }
          }).then(res => {
            console.log("user after update", res)
            app.globalData.logged_in = true;
            that.setData({
              logged_in: true,
              user_profile: profile
            });

          })

        }

      })

    } else {
      console.log(e.detail)
    }
  },

  edit_user_info: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/edit_user_info/edit_user_info?contact=' + that.data.user_profile.contact + "&desc=" + that.data.user_profile.desc,
    })

  },

  add_item: function() {
    wx.navigateTo({
      url: '/pages/add_item/add_item',
    })
  },

  tap_item: function(e) {
    var id = e.detail.item._id;
    wx.navigateTo({
      url: '/pages/item/item?id=' + id + "&item=" + JSON.stringify(e.detail.item) + "&mode=self",
    })
  },

  goToFavorite: function(e) {
    wx.navigateTo({
      url: '/pages/favorite/favorite'
    })
  },

  goToImage: function(e) {
    app.globalData.user_profile = this.data.user_profile;

    wx.navigateTo({
      url: '/pages/generate_image/generate_image'
    })
  }


})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}