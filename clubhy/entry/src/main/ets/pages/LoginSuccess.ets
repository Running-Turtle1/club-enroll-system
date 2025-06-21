import { Screen } from '../models/Screen'
import { TitleBar } from '../views/TitleBar'
import router from '@ohos.router'

interface RouteParams {
  uid: string
}

@Entry
@Component
struct LoginSuccess {
  private uid: string = (router.getParams() as RouteParams)?.uid || '3'

  aboutToAppear() {
    Screen.full(this)
  }

  build() {
    Column() {
      TitleBar({ title: '选择功能', showBack: false })
      Column() {
        Image($r('app.media.ic_student'))
          .width(150)
          .height(150)
          .borderRadius(20)
          .margin({ top: 40, bottom: 20 })

        Button('AI小助手聊天')
          .fontSize(25)
          .height(50)
          .width(200)
          .margin({ top: 50 })
          .onClick(() => {
            router.pushUrl({
              url: 'pages/AIChat',
              params: {
                uid: this.uid
              }
            })
          })

        Button('前往主页')
          .fontSize(25)
          .height(50)
          .width(200)
          .margin({ top: 50 })
          .backgroundColor(Color.Blue)
          .onClick(() => {
            router.pushUrl({
              url: 'pages/Index',
              params: {
                uid: this.uid
              }
            })
          })
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#eee')
  }
}
