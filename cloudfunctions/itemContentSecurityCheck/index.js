// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { content } = event;


  try {
    if (event.text) {
      const res = await cloud.openapi.security.msgSecCheck({
        content: event.text
      })
      return res;

    } else if (event.img) {
      const res = await cloud.openapi.security.imgSecCheck({
        media: {
          header: {
            'Content-Type': 'application/octet-stream'
          },
          contentType: event.contentType,
          value: Buffer.from(event.img)   // 这里必须要将小程序端传过来的进行Buffer转化,否则就会报错,接口异常
        }
      })
      return res;
      
    }
    
  } catch (err) {
    return err;
  }
}