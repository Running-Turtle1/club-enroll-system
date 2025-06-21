var express = require('express');
var router = express.Router();
var db = require('../models/MysqlPool'); // 导入MysqlPool
var fmt = require('../models/FormatDate');

// req.query.参数     鸿蒙提交到的参数要使用query接收
// req.params.参数    地址中的参数要使用params来接收
// req.body.参数      form提交到的参数要使用body来接收
router.get('/activity/getActivity', async(req, resp)=>{
  var hot = req.query.hot
  var sql = 'select v_activity.*, t_join.aid from v_activity left join (select * from tbl_join where uid=?) as t_join on v_activity.id = t_join.aid'
  sql = sql + ' where hot=?'
  var uid = req.query.uid
  var data = await db.sql(sql, [uid, hot])
  resp.json(data)
})

router.get('/activity/navList', async(req, resp)=>{
  var sql = 'select hot,count(hot) as count from v_activity group by hot'
  var data = []
  for (var item of await db.sql(sql)) {
    data.push(item.hot)
  }
  resp.json(data) // 输出数据
})

// 接收图片(500KB以内)中等图片
var fs = require('fs');
var multiparty = require('multiparty');
router.post('/activity/file', (req,resp)=>{
  var column = req.query.column;
  var form = new multiparty.Form();
  form.uploadDir = './public/file';
  form.parse(req, (err, fields, files) => {
    for (var file of files.file) {
      var filename = file.originalFilename;
      fs.renameSync(file.path, form.uploadDir+'/'+filename);
      console.log(form.uploadDir, filename, column)
      var url = 'http://localhost:3000/file/' + filename
      var sql = 'update tbl_activity set logo=? where id=?'
      db.sql(sql, [url, column]) // 把图片保存地址存入到数据库中
    }
    resp.json('/file/' + filename + '?column=' + column);
  });
});


// 下拉，拉出热不热门
router.get('/activity/option', async(req,resp)=>{
  var sql = 'select * from tbl_nav'
  var data = await db.sql(sql)
  var array = []
  for (var item of data) {
    array.push({ 
      label: item.hot,  // label是下拉显示出来的文本
      value: item.id,   // value: xxx.id 毋庸置疑
    })
  }
  resp.json({ nid: array })
})

// 查询活动列表，已表格形式展示
router.get('/activity', async(req, resp)=>{
  var sql = 'select * from v_activity order by ctime desc'
  var data = await db.sql(sql)
  data = fmt(data)  // 格式化时间：datetime类型 转换成 字符串时间
  for (var item of data) { // item数组元素  此处没有数组下标
    // item.hot = item.hot == 1 ? '热门' : '普通' // 三目运算
    item.price = item.price == 0 ? '免费' : (item.price+'元')
  }
  resp.json(data)
})

// 删除活动，根据id删除这一条活动
router.get('/activity/:id', async(req,resp)=>{
  var id = req.params.id
  await db.sql('delete from tbl_activity where id=?', [id])
  resp.json(1) // 1代表操作成功
})

// post 添加活动，添加操作
router.post('/activity', async(req,resp)=>{
  var activity = req.body.activity
  var price = req.body.price
  var detail = req.body.detail
  var start = req.body.start
  var uid = req.body.uid
  var nid = req.body.nid
  var logo = req.body.logo
  if (!activity || !price || !detail || !start) {
    return resp.json('请完善信息')
  }
  console.log(activity, price, detail, start, uid, nid, logo)
  // 打印：活动名称，报名费用，活动介绍，开始时间，发布者，热门，宣传图
  var sql = 'insert into tbl_activity(activity,price,detail,start,uid,nid,logo,ctime)'
  sql += ' values(?,?,?,?,?,?,?,now())'
  await db.sql(sql, [activity, price, detail, start, uid, nid, logo])
  resp.json(1) // 操作成功
})

// post 修改活动，修改操作
router.post('/activity/:id', async(req,resp)=>{
  var activity = req.body.activity
  var price = req.body.price
  var detail = req.body.detail
  var start = req.body.start
  var uid = req.body.uid
  var nid = req.body.nid
  var logo = req.body.logo // 表单中的参数要使用body来接收
  if (!activity || !price || !detail || !start) {
    return resp.json('请完善信息')
  }
  console.log(activity, price, detail, start, uid, nid, logo)
  // 打印：活动名称，报名费用，活动介绍，开始时间，发布者，热门，宣传图
  var id = req.params.id // 地址中的参数要使用params来接收
  var sql = 'update tbl_activity set activity=?,price=?,detail=?,start=?,uid=?,nid=?'
  sql += ',logo=? where id=?'
  await db.sql(sql, [activity,price,detail,start,uid,nid,logo, id])
  resp.json(1) // 操作成功
})

// get /路由名/option 下拉
// get /路由名        查询
// get /路由名/:id    删除
// post/路由名        添加
// post/路由名/:id    修改

module.exports = router;