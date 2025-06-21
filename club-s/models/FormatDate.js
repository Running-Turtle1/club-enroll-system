var dayjs = require('dayjs');

module.exports = function (data, column) {
  if (data) {
    if (!column) {
      column = 'ctime';
    }
    var fmt = 'yyyy-MM-DD HH:mm';
    fmt = fmt.replace('yyyy','YYYY')
    for (var item of data) {
      item[column] = dayjs(item[column]).format(fmt)
    }
  }
  return data;
}