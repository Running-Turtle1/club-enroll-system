var express = require('express'); // 导入express框架
var router = express.Router(); // express框架.路由---创建路由
// database数据库
var db = require('../models/MysqlPool') // 引入MysqlPool文件

router.get('/register', async(req, resp)=>{
  var username = req.query.username
  var password = req.query.password
  var status = req.query.status || '管理员'
  console.log(username, password, status)
  var sql = 'select * from tbl_user where username=?'
  var data = await db.sql(sql, [username])
  if (data.length == 0) { // 没有这个人，就可以注册
    var sql = 'insert into tbl_user(username,password,status) values(?,?,?)'
    await db.sql(sql, [username, password, status]) // 会不会报错，不会报错！
    resp.json({
      code: 1,
      msg: '注册成功'   // 返回提示语
    })
  } else {
    resp.json({
      code: 0,
      msg: '该账号已存在' // 返回提示语
    })
  }
})

router.get('/ellogin', async(req, resp)=>{
  var username = req.query.username
  var password = req.query.password        // 如果值不为空，就是这个值
  var status = req.query.status || '管理员' // 如果值为空，取后面的
  console.log(username, password, status) // 账号 密码 身份
  var sql = 'select * from tbl_user where username=? and password=? and status=?'
  var data = await db.sql(sql, [username, password, status])
  console.log(data)
  if (data.length == 0) { // 空数组
    resp.json({ code: 0 })
  } else { // 不是空数组
    resp.json({
      code: 1,
      uid: data[0].id,
      user: data[0].username,
    })  // 打开页面
  }
})


module.exports = router; // 导出router路由
