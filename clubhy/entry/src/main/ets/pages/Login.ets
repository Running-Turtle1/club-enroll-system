import { MyUtil } from '../models/MyUtil'
import router from '@ohos.router'
import { MyInput } from '../views/MyInput'
import { TitleBar } from '../views/TitleBar'
import { Screen } from '../models/Screen'

@Entry
@Component
struct Login {
  @State username: string = '李四'
  @State password: string = '123'
  aboutToAppear(): void {
    Screen.full(this)
  }
  build() {
    Column() {
     TitleBar({ title: '登录' ,showBack:false})
     Column() { //垂直容器
      Image($r('app.media.ic_student'))
        .width(150).height(150)
        .borderRadius(20)
        .margin({ top: 40, bottom: 20 })
      MyInput({
        placeholder: '请输入用户名',
        text: this.username,
        callback: (v: string) => this.username = v
      })
      MyInput({
        placeholder: '请输入密码',
        text: this.password,
        callback: (v: string) => this.password = v
      })
      Button('登录')
        .fontSize(25)
        .height(50)
        .width(200)
        .margin({ top: 50 })
        .onClick(async () => { //回调函数，点击会调用
          let resp: object = await MyUtil.http('/ellogin', {
            username: this.username,
            password: this.password,
            status: '用户',
          })
          // MyUtil.alert(resp['code'])
          if (resp['code'] == 1) { //把数据uid保存到手机app里
            let uid:string = resp['uid']
            //本地存储
            PersistentStorage.persistProp('uid',uid)
            router.pushUrl({ //页面传参
              url: 'pages/LoginSuccess',
              params:{
                uid:uid
              }
            }, (err) => {
              if (err) {
                console.error('路由跳转失败:', err);
                MyUtil.alert('跳转失败: ' + JSON.stringify(err));
                // 如果跳转失败，直接跳转到Index页面
                router.pushUrl({
                  url: 'pages/Index',
                  params: { uid: uid }
                });
              }
            })
          } else {
            MyUtil.alert('用户名或密码错误')
          }
        })
      Button('注册')
        .fontSize(25)
        .height(50)
        .width(200)
        .margin({ top: 50 })
        .backgroundColor(Color.Red)
        .onClick(async () => {
          let resp: object = await MyUtil.http('/register', {
            username: this.username,
            password: this.password,
            status: '用户',
          })
          if (resp['code'] == 1) {
            MyUtil.alert('注册成功')
          } else {
            if (resp['message'] == '用户名已存在') {
              MyUtil.alert('用户已存在')
            } else {
              MyUtil.alert('注册失败')
            }

          }
        })
    }.width('100%').padding({ left: 15, right: 15 })
   }.width('100%').height('100%')
 }
}