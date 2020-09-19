// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "xiamai-ix9h1"
})

const MAX_LIMIT = 100
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var openid = wxContext.OPENID;
  if (event.openid) {
    openid = event.openid;
  }

  const countResult = await db.collection('user-group').where({
    _openid: openid,
  }).count()

  const total = countResult.total
  if (total == 0) {
    return { data: [] }
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('user-group').where({
      _openid: openid,
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}