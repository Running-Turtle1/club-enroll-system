var mysql = require('mysql2');

conn = mysql.createPool({ // 数据库连接池技术
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root', // Mysql密码
	database: 'club', // 数据库名字
});

// 基础函数
mysql.mysql = (sql, callback, params) => {
	conn.query(sql, params, (err, rows) => {
		if (err) {
			console.log(err);
		}
		callback(rows);
	});
}

// 基于Promise
mysql.pmsql = (sql, params) => {
	return new Promise(resolve=> {
		mysql.mysql(sql, data=>{
			resolve(data);
		}, params);
	});
}

// 综合使用
mysql.sql = (sql, arg1, arg2) => {
	if (arg1 && typeof arg1 === 'function') {
		return mysql.mysql(sql, arg1, arg2)
	} else {
		return mysql.pmsql(sql, arg1)
	}
}

module.exports = mysql;
