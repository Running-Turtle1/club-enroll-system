var host = 'http://localhost:3000'; // Express后端 数据接口地址:端口号
var vue = null;
var PRIMARY_ID = 0;
var ROW_DATA = null;
var glCache = {};

// vscode字体：Consolas, 'Courier New', monospace ---> Lucida Console
function file(file) {
  var fr = new FileReader();
  fr.readAsDataURL(file.files[0]);
  fr.onload = e => {
    file.setAttribute('file', e.target.result);
  };
}

// 用在table身上，:onclick="'upload(this,'+item.id+')'"
function upload(father, column) {
  if (father.children.length <= 1) {
    var table = document.getElementById('table');
    var httpUrl = host + table.getAttribute('http');
    if (httpUrl.indexOf('page') != -1) {
      httpUrl = httpUrl.substring(0, httpUrl.lastIndexOf('/'))
    }
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    father.appendChild(input)
    input.onchange = function () {
      var file = this.files[0]
      var formData = new FormData()
      formData.append('file', file)
      fetch(httpUrl+'/file?column='+column, {
        method: 'POST',
        body: formData,
      })
    }
    input.click()
  } else {
    father.getElementsByTagName('input')[0].click()
  }
}

function form(form) {
  var httpUrl = form.action;
  if (PRIMARY_ID) {
    httpUrl += '/' + PRIMARY_ID;
  }
  var data = {};
  for (var input of form.getElementsByClassName('form-control')) {
    data[input.id] = input.getAttribute('file') || input.value;
  }
  fetch(httpUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(resp => resp.text()).then(resp => {
    if (isNaN(resp)) {
      try { resp = JSON.parse(resp); } catch (e) { }
      alert(resp);
    } else {
      PRIMARY_ID = 0;
      window.location.reload();
    }
  });
  return false;
}

// 导航权限控制        用户身份
function navDisabled(status) { // 在导航身上加 disabled="用户"
  var navs = document.getElementsByClassName('nav-link');
  for (var nav of navs) {
    var disabled = nav.getAttribute('disabled');
    if (disabled && disabled.split(',').indexOf(status) >= 0) {
      nav.style.display = 'none';
    }
    if (nav.href == window.location.href) {
      nav.className = 'nav-link active nav-active';
    }
  }
}

function initVue(callback, data) {
vue = new Vue({
  el: '#app',
  data: {
    data: data,
    // 分页参数
    pageNum: 1,
    pageCount: 0,
    // 表格数据
    tableData: [],
  },
  mounted() {
    var httpUrl = host + document.getElementById('table').getAttribute('http');
    fetch('../index/index.html').then(resp => resp.text()).then(resp => {
      var user = localStorage.getItem('user');
      var status = localStorage.getItem('status');
      var rtuser = status ? (status+' <b>'+user+'</b>') : user;
      document.getElementById('index').innerHTML = resp;
      document.getElementById('rt-user').innerHTML = rtuser;
      navDisabled(status); // 调用导航权限控制
      document.getElementById('addBtn').onclick = () => {
        if (!ROW_DATA)return;
        PRIMARY_ID = 0;
        document.getElementById('offcanvasExampleLabel').innerText = '添加';
        for (var key in ROW_DATA) {
          var input = document.getElementById(key);
          if (input && input.tagName == 'INPUT' &&
            input.type != 'hidden') {
            if (input.type == 'file') {
              input.setAttribute('file', '');
            } else {
              input.value = '';
            }
          }
        }
      }
      fetch('form.html').then(resp => resp.text()).then(data => {
        document.getElementById('sideBar').innerHTML = data;
        if (callback) callback();
        var form = document.getElementById('form');
        if (httpUrl.indexOf('page') != -1) {
          httpUrl = httpUrl.substring(0, httpUrl.lastIndexOf('/'))
        }
        form.action = httpUrl;
        var url = null;
        for (var select of form.getElementsByTagName('select')){
          url = select.getAttribute('http');
          if (url) break;
        }
        if (!url) return;
        httpUrl += url;
        fetch(httpUrl).then(resp => resp.json()).then(resp => {
          glCache = {...glCache, ...resp};
          console.log(glCache);
          for (var key in resp) {
            var select = document.getElementById(key);
            if (!select) continue;
            for (var item of resp[key]) {
              var option = document.createElement('option');
              option.value = item.value;
              option.innerText = item.label;
              select.appendChild(option);
            }
          }
        })
      }).catch(e => {
        if (e) console.log(e);
        document.getElementById('sideBar').innerHTML = '此模块没有这个功能';
      });
    });
    var params = '' // 列表数据权限控制
    if (this.data && this.data.params) {
      params = '?' + this.data.params // uid=用户id
    }
    fetch(httpUrl+params).then(resp => resp.json()).then(resp => {
      this.tableData = resp;
    });
  },
  methods: {
    remove(id) {
      var httpUrl = host + document.getElementById('table').getAttribute('http');
      if (httpUrl.indexOf('page') != -1) {
        httpUrl = httpUrl.substring(0, httpUrl.lastIndexOf('/'))
      }
      fetch(httpUrl + '/' + id).then(() => {
        window.location.reload();
      });
    },
    update(id) {
      document.getElementById('addBtn').click();
      PRIMARY_ID = id;
      ROW_DATA = this.tableData.filter(item => item.id == id)[0];
      for (var key in ROW_DATA) {
        var input = document.getElementById(key);
        if (input && input.type != 'hidden') {
          if (input.type == 'file') {
            input.setAttribute('file', ROW_DATA[key]);
          } else if (input.tagName == 'SELECT') {
            for (var item of glCache[key]) {
              if (item.label == ROW_DATA[key] || item.value == ROW_DATA[key]) {
                input.value = item.value;
                break;
              }
            }
          } else {
            input.value = ROW_DATA[key];
          }
        }
      }
      document.getElementById('offcanvasExampleLabel').innerText = '修改';
    },
    page(num) {
      var table = document.getElementById('table');
      var httpUrl = host + table.getAttribute('http');
      var url = httpUrl.substring(0,httpUrl.lastIndexOf('/'))
      var page = httpUrl.substring(httpUrl.lastIndexOf('/'));
      var pageNumber = Number(page.replace('/page',''))+ num;
      if (pageNumber < 1) pageNumber = 1;
      if (this.pageCount != 0 && pageNumber > this.pageCount){
        pageNumber = this.pageCount;
      }
      var newUrl = url + '/page' + pageNumber;
      fetch(newUrl).then(resp => resp.json()).then(resp => {
        this.tableData = resp;
        this.pageNum = pageNumber;
        table.setAttribute('http', newUrl.replace(host, ''))
      });
    }
  },
});
}

try {
Vue.component('bg', {
	template: `
		<div :style="{
			'background-image':'url('+src+'),url('+(onerror?onerror:'')+')',
			'background-size':'cover',
			'background-position':'center',
			'width':width,
			'height':height,
		}"><slot></slot></div>
	`,
	props: ['src','width','height','onerror']
});
} catch (e) {
}