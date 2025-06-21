var express = require('express');
var router = express.Router();
var db = require('../models/MysqlPool') // db对象

// 查询当前用户已报名的活动
router.get('/join/getJoinedActivities', async(req, resp) => {
  var uid = req.query.uid
  var sql = 'SELECT v_activity.* FROM v_activity JOIN tbl_join ON v_activity.id = tbl_join.aid WHERE tbl_join.uid = ?'
  var data = await db.sql(sql, [uid])
  resp.json({
    code: 1,
    data: data
  })
})

// 报名和取消报名逻辑
router.get('/join/activity', async(req, resp) => {
  var uid = req.query.uid
  var aid = req.query.aid
  console.log(uid, aid)
  var sql = 'select * from tbl_join where uid=? and aid=?'
  var data = await db.sql(sql, [uid, aid])
  if (data.length == 0) { // 说明这个人没有报名这个活动
    var sql = 'insert into tbl_join(uid,aid) values(?,?)'
    await db.sql(sql, [uid, aid])
    resp.json({
      code: 1,
      msg: '报名成功'
    })
  } else { // 说明这个人已经报名了这个活动 tbl_join报名表
    var sql = 'delete from tbl_join where uid=? and aid=?'
    await db.sql(sql, [uid, aid])
    resp.json({
      code: 0,
      msg: '取消报名成功'
    })
  }
})

module.exports = router;