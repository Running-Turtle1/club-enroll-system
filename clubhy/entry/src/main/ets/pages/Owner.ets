import { Screen } from '../models/Screen'
import { TitleBar } from '../views/TitleBar'
import router from '@ohos.router'
import http from '@ohos.net.http';

interface User {
  username: string;
  status: string;
}

interface ResponseData {
  code: number;
  user: User;
}

@Entry
@Component
struct Owner {
  private username: string = '';
  private status: string = '';

  async aboutToAppear() {
    Screen.full(this);
  }

  build() {
    Column() {
      TitleBar({ title: '我的' })
      Text(`用户名: 李四`).width('100%')
        .height(60).backgroundColor(Color.White)
        .padding({ left: 15 }).fontSize(22)
        .borderWidth({ bottom: 1, top: 1 })
        .borderColor('#ddd').margin({ top: 20 })
      Text(`状态: 用户`).width('100%')
        .height(60).backgroundColor(Color.White)
        .padding({ left: 15 }).fontSize(22)
        .borderWidth({ bottom: 1, top: 1 })
        .borderColor('#ddd').margin({ top: 10 })
      Text('已报名活动').width('100%')
        .height(60).backgroundColor(Color.White)
        .padding({ left: 15 }).fontSize(22)
        .borderWidth({ bottom: 1, top: 1 })
        .borderColor('#ddd').margin({ top: 100 })
        .onClick(() => {
          router.pushUrl({
            url: 'pages/Activity'
          })
        })
      Text('退出登录').width('100%')
        .height(60).backgroundColor(Color.White)
        .padding({ left: 15 }).fontSize(22)
        .borderWidth({ bottom: 1, top: 1 })
        .borderColor('#ddd').margin({ top: 10 })
    }.width('100%').height('100%')
    .backgroundColor('#eee')
  }

}