// miniprogram/pages/profile/profile.js
import deviceUtil from "../../components/lin-ui/utils/device-util";

const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("profile.js onLoad");
    wx.showShareMenu({ withShareTicket: true });
    
    var share = (options.share == "true");
    var openid = options.openid;

    var that = this;

    db.collection("users").where({
      _openid: openid
    }).get().then(res=>{
      var capsuleButtonInfo = getCapsuleButtonInfo();
      console.log(capsuleButtonInfo.width);

      var user_profile = res.data[0];

      wx.cloud.callFunction({
        name: "get_user_active_items",
        data:{
          openid: openid
        }
      }).then(res=>{
        console.log("res", res.result.data);
        wx.lin.renderWaterFlow(res.result.data, true);
        
        that.setData({ 
          share: share, 
          capsuleButtonInfo: capsuleButtonInfo, 
          user_profile: user_profile 
        });
        

      })
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
    var that = this;

    return {
      title: that.data.user_profile.userInfo.nickName + "的主页",
      // imageUrl: that.data.item.real_imgs[0],
      path: '/pages/profile/profile?share=true&openid=' + that.data.user_profile._openid
    }

  },

  navigateHome: function () {

    wx.switchTab({
      url: '/pages/user/user'
    })


  },
  navigateBack: function () {
    wx.navigateBack({

    })
  },

  tap_item: function (e) {
    var id = e.detail.item._id;
    wx.navigateTo({
      url: '/pages/item/item?id=' + id + "&item=" + JSON.stringify(e.detail.item),
    })
  },


})

function getCapsuleButtonInfo() {
  const screenWidth = wx.getSystemInfoSync().screenWidth;
  const capsuleButtonInfo = wx.getMenuButtonBoundingClientRect();
  capsuleButtonInfo.left = screenWidth - capsuleButtonInfo.right;
  capsuleButtonInfo.right = capsuleButtonInfo.left + capsuleButtonInfo.width;
  console.log("getCapsuleButtonInfo", capsuleButtonInfo);
  return capsuleButtonInfo;
}