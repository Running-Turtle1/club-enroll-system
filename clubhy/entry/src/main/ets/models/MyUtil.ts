import promptAction from '@ohos.promptAction'
import http from '@ohos.net.http'
import router from '@ohos.router'

export class MyUtil {
  public static host = 'http://localhost:3000'

  // 跳转页面
  public static pushUrl(url: string) {
    router.pushUrl({ url })
  }

  // 弹出提示
  public static alert(msg: string | number) {
    promptAction.showToast({
      message: msg + ''
    })
  }

  public static JSONParse(resp: object): any {
    let data: string = resp['result']
    console.log(data.split('/').join('\\'))
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  }

  // 预览器只能发起get请求
  public static http(url: string, data?: object) {
    let params = ''
    if (data) {
      params = '?'
      for (const k of Object.keys(data)) {
        params += k + '=' + data[k] + '&'
      }
      params = params.substring(0, params.length - 1)
    } // 模拟器和真机运行需要开通网络权限
    let httpUrl = MyUtil.host + url + params
    return http.createHttp().request(encodeURI(httpUrl)).then(resp => {
      return MyUtil.JSONParse(resp)
    })
  }
}