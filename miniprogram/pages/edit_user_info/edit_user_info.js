// miniprogram/pages/edit_user_info/edit_user_info.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact:"",
    desc: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    this.setData({
      contact: options.contact,
      desc: options.desc
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  contact_input: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },

  desc_input: function(e){
    this.setData({
      desc: e.detail.value
    })
  },

  edit: function () {
    var that = this;

    var contact = that.data.contact;
    var desc = that.data.desc.replace(/\n/g, "  ");

    wx.cloud.callFunction({
      name: "itemContentSecurityCheck",
      data:{
        text: contact + " " + desc
      }
    }).then(res=>{
      console.log("itemContentSecurityCheck", res)

      if (res.result.errCode == 0) {
        wx.getStorage({
          key: '_id',
          success: function (res) {
            var _id = res.data;

            db.collection('users').doc(_id).update({
              data: {
                contact: contact,
                desc: desc
              }
            }).then(res => {
              app.globalData.contact = contact;
              app.globalData.desc = desc;

              wx.navigateBack({

              })
            })


          },
        })

      } else {
        wx.showModal({
          title: '请修改',
          content: '内容含有违法违规内容',
          showCancel: false
          
        })

      }
    }).catch(err=>{
      wx.showModal({
        title: '出错了',
        content: '提交内容审核出错了，请稍等片刻再次提交',
        showCancel: false
      })
      

    })
    

    
  },

  cancel: function () {
    wx.navigateBack({
      
    })
  }
})