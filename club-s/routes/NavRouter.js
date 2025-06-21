var express = require('express');
var router = express.Router();
var db = require('../models/MysqlPool'); // 导入MysqlPool
// 四个地址  get /nav      查询导航列表
//          get /nav/:id  删除导航
//        post /nav       添加导航
//        post /nav/:id   修改导航
router.get('/nav', async(req, resp)=>{
  var sql = 'select * from tbl_nav'
  resp.json(await db.sql(sql)) // 写完查询了
})
router.get('/nav/:id', async(req, resp)=>{
  
})
router.post('/nav', async(req, resp)=>{

})
router.post('/nav/:id', async(req, resp)=>{

})

module.exports = router;
