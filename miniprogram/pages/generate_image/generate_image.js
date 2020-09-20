// miniprogram/pages/generate_image/generate_image.js

const app = getApp();
const db = wx.cloud.database();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 400,
    height: 3000,
    items: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '获取物品信息中',
    });
    var that = this;
    this.widget = this.selectComponent('.widget');

    wx.cloud.callFunction({
      name: "get_user_active_items",
      data: {}
    }).then(res => {
      console.log(res)
      wx.hideLoading();
      var items = res.result.data;
      items = items.map((x, index) => {
        x.isChecked = false;
        x.disabled = false;

        if (index < 10) {
          x.isChecked = true;
        }

        return x;
      })

      that.setData({
        items: items
      })


    })

  },

  renderToCanvas: async function() {
    if (this.data.items.filter(x => x.isChecked).length == 0) {
      wx.showModal({
        title: '没有选中物品',
        content: '请至少选中一个物品',
      })
    } else {
      wx.showLoading({
        title: '生成中',
      })
      var wxml = await this.generate_wxml();

      var that = this;
      const p1 = this.widget.renderToCanvas({
        wxml,
        style
      })
      p1.then((res) => {
        console.log('res', res)
        console.log('res.layoutBox', res.layoutBox)
        that.container = res

        that.setData({
          width: res.layoutBox.width,
          height: res.layoutBox.height
        })

        wx.hideLoading();

      })

    }


  },

  extraImage: function() {
    var that = this;

    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      that.setData({
        src: res.tempFilePath,
        width: that.data.width,
        height: that.data.height
      })

      wx.previewImage({
        urls: [res.tempFilePath],
      })
    })
  },

  previewImage: function() {
    wx.previewImage({
      current: this.data.src,
      urls: [this.data.src],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  onChangeTap: function(e) {
    console.log(e);
    var id = e.detail.key;

    var items = this.data.items;

    items.forEach(item => {
      if (item._id == id) {
        item.isChecked = e.detail.checked;
      }
    })

    this.setData({
      items: items
    })
  },

  generate_wxml: async function() {
    var user_profile = app.globalData.user_profile;
    var seller_info_template = `
    <view class="seller-info">
      <view class="avatar-name">
        <image class="avatar" src="${user_profile.userInfo.avatarUrl}"></image>
        <text class="nickname">${user_profile.userInfo.nickName}</text>
      </view>

      <text class="text desc">${user_profile.desc}</text>    
      <text class="text contact">${user_profile.contact}</text>
    </view>
    `;

    console.log("desc", user_profile.desc);

    var item_info_str = "";

    var items = this.data.items.filter(item => item.isChecked);
    console.log(items);

    var item_info_promise = await Promise.all(items.map(item => {
      return new Promise(async(resolve, reject) => {
        var images = item.real_imgs.concat(item.support_imgs);

        var images_result = await wx.cloud.getTempFileURL({
          fileList: images
        });
        // console.log("images_result", images_result);
        var tmp_images = images_result.fileList.map((x, index) => {
          return `
        <image class="item-image" src="${x.tempFileURL}"></image>
        `
        });


        var item_template = `<view class="card">
        <text class="item-name">${item.title}</text>
        <text class="item-price">${item.unit} ${item.price}</text>
        <view class="item-images">${tmp_images.join("\n")}</image>
      </view>`;

        resolve(item_template);
      });

    }))

    var item_info_template = `<view class="item-info">${item_info_promise.join("\n")}</view>`;

    var wxml_template = `<view class="container"><view class="content">
    ${seller_info_template}
    ${item_info_template}
    <view class="footer">
      <image class="logo-image" src="https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/images/gh_874fdc8f3a7f_258-2.jpg"></image>
      <text class="slogan slogan-content">东西不坏，全场虾麦</text>
      <text class="slogan">虾麦</text>
    </view>
    </view></view>`;

    return wxml_template;


  }
})




const wxml = `
<view class="container" >
  <view class="content">
    <view class="seller-info">
      <view class="avatar-name">
        <image class="avatar" src="https://thirdwx.qlogo.cn/mmopen/vi_32/ZCSPaeUFPWIbic1b5nqAHBLUqkVs74f2QCUMaLnP84474N7W2CFuCUGxqGZ8Iaen6y8Tzcfy8icicBNK6Tiax1ZjOQ/132"></image>
        <text class="nickname">olivia🐨</text>
      </view>

      <text class="text desc">简单介绍一下自己，提供一下额外的信息</text>    
      <text class="text contact">wx:123123</text>
    </view>

  <view class="item-info"> 
    <view class="card">
      <text class="item-name">雷蛇游戏耳机</text>
      <text class="item-price">美元 45</text>
      <view class="item-images">
        <image class="item-image" src="https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/item_imgs/14d998d4-48d4-4571-bd1a-0e2256cf9131.jpg?sign=9d93cf47967f7eeb7a01d2c656ac4352&t=1600413023"></image>
        <image class="item-image" src="https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/item_imgs/14d998d4-48d4-4571-bd1a-0e2256cf9131.jpg?sign=9d93cf47967f7eeb7a01d2c656ac4352&t=1600413023"></image>
        <image class="item-image" src="https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/item_imgs/14d998d4-48d4-4571-bd1a-0e2256cf9131.jpg?sign=9d93cf47967f7eeb7a01d2c656ac4352&t=1600413023"></image>
        <image class="item-image" src="https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/item_imgs/14d998d4-48d4-4571-bd1a-0e2256cf9131.jpg?sign=9d93cf47967f7eeb7a01d2c656ac4352&t=1600413023"></image>
      
      </view>
    
    </view>

    <view class="footer">
      
      <image class="logo-image" src="https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/images/gh_874fdc8f3a7f_258.jpg"></image>
      <text class="slogan slogan-content">室友不在，全场虾麦</text>

      <text class="slogan">虾麦</text>
    </view>
  
    </view>
  
  </view>
  

</view>
`

const style = {
  container: {
    width: 400,
    // height: 600,
    flexDirection: 'column',
    // justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    backgroundColor: "#ED6663"
  },
  content: {
    backgroundColor: 'white',
    width: 360,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    // width: 360,
    height: 30,
    textAlign: 'left',
    verticalAlign: 'middle',
    fontSize: 12,
    fontWeight: 100,
    color: "#545454"
  },
  sellerInfo: {
    width: 300,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'column',
    alignItems: 'left',
  },
  avatarName: {
    flexDirection: 'row',
    // alignItems: 'left',
    // justifyContent: 'start',
    width: 300,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },

  nickname: {
    marginLeft: 20,
    width: 180,
    textAlign: 'left',
    verticalAlign: 'middle',
    height: 40,
    fontSize: 16,
    color: "#545454"
  },

  contact: {
    width: 300,
    height: 40,
    verticalAlign: 'top',
  },

  desc: {
    marginTop: 10,
    width: 300,
    height: 60,
    fontSize: 16,
    verticalAlign: 'top',
  },

  card: {
    width: 320,
    padding: 10,
    marginBottom: 20
    // height:200,

  },

  itemName: {
    width: 300,
    fontSize: 20,
    height: 40,
    verticalAlign: 'middle',

  },

  itemPrice: {
    width: 300,
    color: "#ED6663",
    fontSize: 14,
    verticalAlign: 'middle',
    height: 20,
    marginTop: 5,
    marginBottom: 5

  },

  itemImages: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: "#e8eaef"


  },

  itemImage: {
    width: 90,
    height: 90,
    marginTop: 5,
    marginBottom: 5



  },

  footer: {
    flexDirection: 'column',
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
    // height:100

  },

  slogan: {
    color: "#ED6663",
    verticalAlign: 'middle',
    height: 20,
    fontSize: 14,
    width: 320,
    textAlign: 'center',
    marginTop: 5,


  },
  logoImage: {
    width: 80,
    height: 80,


  },

  sloganContent: {
    textAlign: 'center',
    marginTop: 10,
    height: 20,
    verticalAlign: 'middle',
    fontSize: 12,
    fontWeight: 100,
    color: "#545454"

  }


}