// miniprogram/pages/item/item.js
import deviceUtil from "../../components/lin-ui/utils/device-util"
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: "self",
    // user_profile: {
    //   contact: "qq:123456",
    //   desc: "XXX University CS major",
    //   userInfo: {
    //     avatarUrl: "https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/item_imgs/bff62775-3e2d-4c82-a88b-8b6c3490ffe3.jpg?sign=8d010087d23768da9dc5ce11bb1350fa&t=1599876644",
    //     nickName:"小花"

    //   }
    // }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options);
    wx.showShareMenu({ withShareTicket: true });

    var that = this;

    var capsuleButtonInfo = getCapsuleButtonInfo();

    new Promise((resolve, reject)=>{
      if (options.item){
        var item = JSON.parse(options.item)
        resolve(item);
      } else {
        db.collection("items").doc(options.id).get().then(res => {
          var item = res.data;
          resolve(item);
        })

      }

    }).then(result=>{
      var item = result;
      var images = item.real_imgs.concat(item.support_imgs);
      item.images = images;

      return new Promise((resolve, reject)=>{
        var mode = "";

        if (options.mode) {
          resolve({ "mode": options.mode, "item": item, "capsuleButtonInfo": capsuleButtonInfo});
        } else {
          db.collection("items").where({
            _openid: app.globalData.openid,
            _id: options.id
          }).count().then(res=>{
            if (res.total == 0) {
              mode = "other";
            } else {
              mode = "self"
            }
            resolve({ "mode": mode, "item": item, "capsuleButtonInfo": capsuleButtonInfo });

          })

        }

      });
    }).then(result => {
      var data = result;

      return new Promise((resolve, reject)=>{
        if (data.mode == "other") {
          db.collection("users").where({
            "_openid": data.item._openid
          }).get().then(res => {
            console.log("user res", res);
            data.user_profile = res.data[0];
            resolve(data);
          })

        } else {
          resolve(data);
        }

      });

      

    }).then(result=>{
      // console.log("result", result);
      var data = result;

      return new Promise((resolve, reject) => {
        if (options.share == "true") {
          data.share = true;
          resolve(data);
        } else {
          data.share = false;
          resolve(data);
        }
      })
    }).then(result=>{
      console.log("result", result);
      var data = result;

      return new Promise((resolve, reject) => {
        db.collection("user-favorite").where({
          _openid: app.globalData.openid,
          item_id: options.id
        }).get().then(res => {
          // console.log("res", res);
          if (res.data.length == 0) {
            data.is_favorite = false;
            data.fav = false;
            resolve(data);
          } else {
            data.is_favorite = true;
            data.fav = true;
            data.fav_id = res.data[0]._id;
            resolve(data);
          }
        })

      })
    }).then(result=>{
      that.setData(result);
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
    console.log("item.js onHide");

    var that = this;
    if (this.data.mode == "self") {
      db.collection("items").doc(that.data.item._id).update({
        data:{
          is_active: that.data.item.is_active
        }
      })

    } else if (this.data.mode == "other") {
      if (this.data.is_favorite != this.data.fav) {
        if (this.data.is_favorite) {
          db.collection("user-favorite").add({
            data: {
              item_id: that.data.item._id,
              add_date: new Date()
            }
          })
        } else {
          db.collection("user-favorite").doc(that.data.fav_id).remove();
        }
        
      }
    }

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("item.js onUnload");

    var that = this;
    if (this.data.mode == "self") {
      db.collection("items").doc(that.data.item._id).update({
        data: {
          is_active: that.data.item.is_active
        }
      })

    } else if (this.data.mode == "other") {
      if (this.data.is_favorite != this.data.fav) {
        if (this.data.is_favorite) {
          db.collection("user-favorite").add({
            data: {
              item_id: that.data.item._id,
              add_date: new Date()
            }
          })
        } else {
          db.collection("user-favorite").doc(that.data.fav_id).remove();
        }

      }
    }

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
    console.log("item.js onShareAppMessage")
    var that = this;

    return {
      title: that.data.item.title,
      imageUrl: that.data.item.real_imgs[0],
      path: '/pages/item/item?share=true&id=' + that.data.item._id
    };

    


  },

  preview: function(e) {
    var that = this;
    wx.previewImage({
      current: e.target.dataset.url,
      urls: that.data.item.images,
    })
  },

  navigateBack: function() {
    wx.navigateBack({
      
    })
  },

  navigateHome: function () {

    wx.switchTab({
      url: '/pages/user/user'
    })

    
  },

  edit_item: function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/add_item/add_item?item=' + JSON.stringify(that.data.item),
    })
  },

  deactivate_item: function(){
    var item = this.data.item;
    item.is_active = false;

    this.setData({
      item: item
    })

  },

  activate_item: function () {
    var item = this.data.item;
    item.is_active = true;

    this.setData({
      item: item
    })

  },

  delete_item: function(){
    console.log("delete");
    var that = this;
    wx.showModal({
      title: '删除物品',
      content: '确定删除【' + that.data.item.title + '】吗？',
      success(res) {
        if (res.confirm) {
          db.collection("items").doc(that.data.item._id).update({data:{deleted:true}}).then(res=>{
            wx.navigateBack({});
          })
          
        } else if (res.cancel) {
        }
      }

    })
  },

  favorite_item: function(){
    this.setData({
      is_favorite: true
    });

  },

  unfavorite_item: function(){
    this.setData({
      is_favorite: false
    });

  },

  goToSeller: function(){
    var openid = this.data.item._openid;
    wx.navigateTo({
      url: '/pages/profile/profile?openid=' + openid,
    })
  }
})

function getCapsuleButtonInfo() {
  const screenWidth = wx.getSystemInfoSync().screenWidth;
  const capsuleButtonInfo = wx.getMenuButtonBoundingClientRect();
  capsuleButtonInfo.left = screenWidth - capsuleButtonInfo.right;
  capsuleButtonInfo.right = capsuleButtonInfo.left + capsuleButtonInfo.width;
  return capsuleButtonInfo;
}