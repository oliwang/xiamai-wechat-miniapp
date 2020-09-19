// miniprogram/pages/add_item/add_item.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cWidth: 300,
    cHeight: 300,
    categories: [{
        "name": "家具",
        "id": 0
      },
      {
        "name": "电器",
        "id": 1
      },
      {
        "name": "服饰",
        "id": 2
      },
      {
        "name": "日用品",
        "id": 3
      },
      {
        "name": "化妆品",
        "id": 4
      },
      {
        "name": "书",
        "id": 5
      },
      {
        "name": "车",
        "id": 6
      },
      {
        "name": "其他",
        "id": 7
      }
    ],
    real_img_urls: [],
    support_img_urls: [],

    title: "",
    price: "",
    unit: "",
    desc: "",
    post_code: "",
    category_id: 0,
    tag: "",

    titleRules: [{
      type: 'string',
      required: true,
      message: "物品名称为必填"
    }, {
      min: 5,
      max: 20,
      message: '物品名称长度需要在5-20个字之间'
    }],
    priceRules: [{
      type: 'float',
      message: "价格为数字"
    }, {
      required: true,
      message: "价格为必填"

    }],
    unitRules: {
      type: 'string',
      required: true,
      message: "价格单位为必填"
    },
    postcodeRules: [{
      type: 'string',
      required: true,
      message: "邮编为必填"
    }, {
      pattern: '^\\d+$',
      message: "请输入数字邮编"

    }],

    descRules: [{
      required: true,
      message: "简介为必填"

    }, {
      min: 10,
      max: 140,
      message: '简介长度需要在10-140个字之间'
    }]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var mode = "add";
    if (options.item) {
      mode = "edit";
      var item = JSON.parse(options.item);

      var cat = item.category;
      var cat_id = 0;
      for (var i = 0; i < this.data.categories.length; i++) {
        if (cat == this.data.categories[i].name) {
          cat_id = this.data.categories[i].id;
          break;
        }
      }

      console.log(item._id);

      this.setData({
        _id: item._id,
        title: item.title,
        price: item.price,
        unit: item.unit,
        desc: item.desc,
        post_code: item.post_code,
        category_id: cat_id,
        tag: item.tags.join(' '),
        real_img_urls: item.real_imgs.map((x, index) => {
          return {
            url: x,
            key: index
          };
        }),
        support_img_urls: item.support_imgs.map((x, index) => {
          return {
            url: x,
            key: index
          };
        }),
        ori_real_img_urls: item.real_imgs,
        ori_support_img_urls: item.support_imgs,
        mode: mode
      })


    }

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

  title_input: function(e) {
    this.setData({
      title: e.detail.value
    })
  },

  price_input: function(e) {
    this.setData({
      price: e.detail.value
    })

  },

  unit_input: function(e) {
    this.setData({
      unit: e.detail.value
    })
  },

  desc_input: function(e) {
    this.setData({
      desc: e.detail.value
    })

  },

  post_code_input: function(e) {
    this.setData({
      post_code: e.detail.value
    })

  },

  category_change: function(e) {
    this.setData({
      category_id: parseInt(e.detail.key)
    })
  },

  tag_input: function(e) {
    this.setData({
      tag: e.detail.value
    })

  },

  real_change: function(e) {
    this.setData({
      real_img_urls: e.detail.all
    })

  },

  real_remove: function(e) {
    this.setData({
      real_img_urls: e.detail.all
    })

  },

  support_change: function(e) {
    this.setData({
      support_img_urls: e.detail.all
    })

  },

  support_remove: async function(e) {
    this.setData({
      support_img_urls: e.detail.all
    })

  },

  edit: async function() {
    var that = this;






    // if (false){
    if (this.data.title == "" || this.data.price == "" || this.data.unit == "" || this.data.post_code == "") {
      wx.lin.showToast({
        title: '请将表格填写完整，名称，价格，单位，邮编为必填',
        icon: 'error',
        duration: 3000,
        success: (res) => {
          console.log(res)
        },
        complete: (res) => {
          console.log(res)
        }
      })
      // } else if (false) {
    } else if (this.data.real_img_urls.length == 0) {
      wx.lin.showToast({
        title: '请至少上传一张实物图片',
        icon: 'error',
        success: (res) => {
          console.log(res)
        },
        complete: (res) => {
          console.log(res)
        }
      })

    } else {

      console.log("start editing");

      wx.showLoading();

      var text_content = that.data.title + " " + that.data.unit + " " + that.data.desc + " " + that.data.tag;

      var text_check_result = await wx.cloud.callFunction({
        name: "itemContentSecurityCheck",
        data: {
          text: text_content
        }
      })

      if (text_check_result.result.errCode == 0) {
        var images = [];

        var ori_real = this.data.ori_real_img_urls;
        var ori_support = this.data.ori_support_img_urls;

        var new_real = this.data.real_img_urls.map((x, index) => {
          return x.url;
        });
        var new_support = this.data.support_img_urls.map((x, index) => {
          return x.url;
        });


        var real_imgs = [];
        var support_imgs = [];

        // TODO 新images不对，还是tmp路径

        for (var i = 0; i < new_real.length; i++) {
          if (ori_real.includes(new_real[i])) {
            real_imgs.push(new_real[i]);
          } else {
            images.push({
              "action": "add",
              "type": "real",
              "tmp_url": new_real[i]
            });
          }
        }

        for (var i = 0; i < ori_real.length; i++) {
          if (!new_real.includes(ori_real[i])) {
            images.push({
              "action": "delete",
              "type": "real",
              "tmp_url": ori_real[i]
            });
          }
        }



        for (var i = 0; i < new_support.length; i++) {
          if (ori_support.includes(new_support[i])) {
            support_imgs.push(new_support[i]);
          } else {
            images.push({
              "action": "add",
              "type": "support",
              "tmp_url": new_support[i]
            });
          }
        }

        for (var i = 0; i < ori_support.length; i++) {
          if (!new_support.includes(ori_support[i])) {
            images.push({
              "action": "delete",
              "type": "support",
              "tmp_url": ori_support[i]
            });
          }
        }



        var promise = Promise.all(images.map(x => {
          // console.log("x", x);
          var type = x.type;
          var tmp_url = x.tmp_url;

          var uuid_tmp_filename = create_UUID() + "." + tmp_url.split(".").pop();

          console.log(uuid_tmp_filename);

          return new Promise(function(resolve, reject) {
            if (x.action == "add") {

              compress(tmp_url, that).then(res => {
                console.log("compress ", res)
                var path = res.path;
                var width = res.width;
                var height = res.height;

                return render(path, width, height, that);
              }).then(res => {
                console.log("render", res);
                var tempFilePath = res.tempFilePath;
                return cloudCheck(tempFilePath);
              }).then(res => {
                console.log("cloudCheck", res);
                if (res) {
                  wx.cloud.uploadFile({
                    cloudPath: 'item_imgs/' + uuid_tmp_filename,
                    filePath: tmp_url,
                    success: function(res) {
                      // console.log("upload", res);
                      // console.log(res.fileID);
                      if (type == "real") {
                        // console.log("real", res.fileID);
                        real_imgs.push(res.fileID);
                      } else {
                        // console.log("support", res.fileID);
                        support_imgs.push(res.fileID);
                      }
                      resolve([res.fileID, type]);
                    },
                    fail: function(err) {
                      // console.log(err);
                      reject(new Error('failed to upload file'));
                      // console.log("fail")
                    },
                    complete: function() {

                    }
                  });

                } else {
                  reject("图片内容含有违法违规内容");
                }
              }).catch(err=>{
                reject("图片上传失败")
              });


            } else if (x.action == "delete") {
              wx.cloud.deleteFile({
                fileList: [tmp_url]
              }).then(res => {
                // handle success
                // console.log(res.fileList)
                resolve([res.fileList, type]);
              }).catch(error => {
                // handle error
                reject(new Error('failed to delete file'));
              })


            }


          });
        })).then(res => {

          db.collection("items").doc(that.data._id).update({
            data: {
              title: that.data.title,
              price: parseFloat(that.data.price),
              unit: that.data.unit,
              desc: that.data.desc,
              post_code: that.data.post_code,
              category: that.data.categories[parseInt(that.data.category_id)].name,
              tags: that.data.tag.split(" "),
              real_imgs: real_imgs,
              support_imgs: support_imgs,
              status: "已上架",
              is_active: true,
              status_code: 1,
              last_update_date: new Date()
            }
          }).then(res => {
            wx.hideLoading();
            wx.navigateBack({
              delta: 1000
            });
          })

        }).catch(err=>{
          wx.hideLoading();
          wx.showModal({
            title: '图片上传出错了',
            content: err,
            showCancel:false
          })
        });

      } else {
        wx.showModal({
          title: '请修改',
          content: '文字内容含有违法违规内容',
          showCancel: false

        })

        wx.hideLoading();

      }

    }


  },

  add: async function() {
    var that = this;


    // if (false){
    if (this.data.title == "" || this.data.price == "" || this.data.unit == "" || this.data.post_code == "") {
      wx.lin.showToast({
        title: '请将表格填写完整，名称，价格，单位，邮编为必填',
        icon: 'error',
        duration: 3000,
        success: (res) => {
          console.log(res)
        },
        complete: (res) => {
          console.log(res)
        }
      })
      // } else if (false) {
    } else if (this.data.real_img_urls.length == 0) {
      wx.lin.showToast({
        title: '请至少上传一张实物图片',
        icon: 'error',
        success: (res) => {
          console.log(res)
        },
        complete: (res) => {
          console.log(res)
        }
      })

    } else {

      wx.showLoading();

      var text_content = that.data.title + " " + that.data.unit + " " + that.data.desc + " " + that.data.tag;

      var text_check_result = await wx.cloud.callFunction({
        name: "itemContentSecurityCheck",
        data: {
          text: text_content
        }
      })

      if (text_check_result.result.errCode == 0) {
        var images = [];

        for (var i = 0; i < this.data.real_img_urls.length; i++) {
          images.push({
            "type": "real",
            "tmp_url": this.data.real_img_urls[i].url
          });
        }
        for (var i = 0; i < this.data.support_img_urls.length; i++) {
          images.push({
            "type": "support",
            "tmp_url": this.data.support_img_urls[i].url
          });
        }

        var real_imgs = [];
        var support_imgs = [];

        var promise = Promise.all(images.map(x => {
          console.log(x);
          var type = x.type;
          var tmp_url = x.tmp_url;

          var uuid_tmp_filename = create_UUID() + "." + tmp_url.split(".").pop();

          console.log(uuid_tmp_filename);

          return new Promise(function(resolve, reject) {
            compress(tmp_url, that).then(res => {
              console.log("compress ", res)
              var path = res.path;
              var width = res.width;
              var height = res.height;

              return render(path, width, height, that);
            }).then(res => {
              console.log("render", res);
              var tempFilePath = res.tempFilePath;
              return cloudCheck(tempFilePath);
            }).then(res => {
              console.log("cloudCheck", res);
              if (res) {
                wx.cloud.uploadFile({
                  cloudPath: 'item_imgs/' + uuid_tmp_filename,
                  filePath: tmp_url,
                  success: function (res) {
                    if (type == "real") {
                      real_imgs.push(res.fileID);
                    } else {
                      support_imgs.push(res.fileID);
                    }
                    resolve([res.fileID, type]);
                  },
                  fail: function (err) {
                    reject(new Error('failed to upload file'));
                  },
                  complete: function () {

                  }
                });

              } else {
                reject("图片内容含有违法违规内容");
              }
            }).catch(err => {
              reject("图片上传失败")
            });
          });
        })).then(res => {
          db.collection("items").add({
            data: {
              title: that.data.title,
              price: parseFloat(that.data.price),
              unit: that.data.unit,
              desc: that.data.desc,
              post_code: that.data.post_code,
              category: that.data.categories[parseInt(that.data.category_id)].name,
              tags: that.data.tag.split(" "),
              real_imgs: real_imgs,
              support_imgs: support_imgs,
              status: "已上架",
              is_active: true,
              status_code: 1,
              add_date: new Date()
            }
          }).then(res => {
            wx.hideLoading();
            wx.navigateBack({

            });
          })

        });

      } else {
        wx.showModal({
          title: '请修改',
          content: '文字内容含有违法违规内容',
          showCancel: false

        })

        wx.hideLoading();

      }





    }




  },

  cancel: function() {
    wx.navigateBack({

    })
  }

})

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}


//作者：Jabin_Lee
//链接：https://juejin.im/post/6844904083225067533
//来源：掘金
//著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

function compress(path, that) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: path // 单张照片的临时路径
    }).then(res => {
      let aspectRatio = res.width / res.height;
      let width, height;
      // 本案例限制用户上传的照片比例不超过4: 1，根据需求修改或移除限制
      if (aspectRatio >= 0.25 && aspectRatio <= 4) {
        if (aspectRatio >= 1) {
          width = 256;
          height = Math.floor(width / aspectRatio);
        } else {
          height = 256;
          width = Math.floor(height * aspectRatio);
        }
        that.setData({
          cWidth: width, // 画布宽度（WXML）
          cHeight: height // 画布高度（WXML）
        });
        resolve({
          path: res.path,
          width: width,
          height: height
        });
      } else {
        // 提醒用户照片过长
        reject("图片太长，请修改后上传")
      }
    });

  });

}

// wx.getImageInfo({
//   src: 'https://7869-xiamai-ix9h1-1302385800.tcb.qcloud.la/item_imgs/fa9bd640-ecb4-438e-84c0-72d299548709.jpg?sign=2655131c09d9beba134fde127c9029cc&t=1600505970',
//   success: function (res) {
//     console.log(res)
//     that.setData({
//       cWidth: res.width,
//       cHeight: res.height
//     })

//     var path = res.path;
//     let ctx = wx.createCanvasContext('compress');
//     // ctx.clearRect(0, 0, width, height);
//     ctx.drawImage(path, 0, 0, res.width, res.height, 0, 0, 300, 500);
//     ctx.draw(true);
//     console.log("after draw")
//   }
// })

function render(path, width, height, that) {
  return new Promise((resolve, reject) => {
    console.log(path, width, height, that);
    let ctx = wx.createCanvasContext('compress', that);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(path, 0, 0, width, height);
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'compress',
        x: 0,
        y: 0,
        destWidth: width,
        destHeight: height,
        fileType: 'jpg',
        quality: 0.8,
        success: res => {
          resolve({
            "tempFilePath": res.tempFilePath
          });
        },
        fail: err => {
          reject("图片渲染失败，请重新上传");
        }
      }, that);

    });

  });

}

function cloudCheck(temp) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: temp,
      success: buffer => {
        wx.cloud.callFunction({
          name: "itemContentSecurityCheck",
          data: {
            img: buffer.data,
            contentType: "image/jpg"
          },
        }).then(res => {
          if (res.result.errCode == 0) {
            resolve(true);
          } else {
            reject("图片内容含有违法违规内容")
          }
        })

      },
      fail: err => {
        console.error(err);
        reject("图片检查出错，请稍后再次尝试");
      }
    });

  });
}