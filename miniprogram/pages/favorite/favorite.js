// miniprogram/pages/favorite/favorite.js
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
    wx.showLoading({
      title: '获取物品信息中',
    })
    wx.cloud.callFunction({
      name: 'get_user_fav_items',
      data: {
      },
    }).then(res => {
      console.log("res", res.result.data);
      wx.lin.renderWaterFlow(res.result.data, true);
      wx.hideLoading();
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

  tap_item: function (e) {
    var id = e.detail.item._id;
    wx.navigateTo({
      url: '/pages/item/item?id=' + id + "&item=" + JSON.stringify(e.detail.item) + "&mode=other",
    })
  }
})