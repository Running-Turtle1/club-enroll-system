import { Screen } from '../models/Screen'
import { TitleBar } from '../views/TitleBar'
import router from '@ohos.router'

interface RouteParams {
  uid: string
}

interface ChatMessage {
  text: string
  isUser: boolean
}

@Entry
@Component
struct AIChat {
  @State messages: ChatMessage[] = []
  @State inputText: string = ''
  private scroller: Scroller = new Scroller()

  aboutToAppear() {
    Screen.full(this)
    // 添加欢迎消息
    this.messages.push({
      text: '你好！我是AI小助手，有什么可以帮助你的吗？',
      isUser: false
    } as ChatMessage)
  }

  build() {
    Column() {
      TitleBar({
        title: '聊天小助手',
        callback: () => {
          router.back()
        }
      })

      // 聊天消息区域
      Scroll(this.scroller) {
        Column() {
          ForEach(this.messages, (msg: ChatMessage, index: number) => {
            Row() {
              if (msg.isUser) {
                Blank()
                Column() {
                  Text(msg.text)
                    .fontSize(16)
                    .backgroundColor('#007AFF')
                    .fontColor(Color.White)
                    .borderRadius(8)
                    .padding(10)
                    .margin({ right: 10 })
                }
                .alignItems(HorizontalAlign.End)
                .width('80%')

                Image($r('app.media.ic_student'))
                  .width(40)
                  .height(40)
                  .borderRadius(20)
              } else {
                Image($r('app.media.ic_student')) // 可以替换为AI头像
                  .width(40)
                  .height(40)
                  .borderRadius(20)

                Column() {
                  Text(msg.text)
                    .fontSize(16)
                    .backgroundColor('#E5E5EA')
                    .fontColor(Color.Black)
                    .borderRadius(8)
                    .padding(10)
                    .margin({ left: 10 })
                }
                .alignItems(HorizontalAlign.Start)
                .width('80%')

                Blank()
              }
            }
            .width('100%')
            .margin({ top: 10, bottom: 10 })
            .alignItems(VerticalAlign.Top)
          })
        }
        .width('100%')
        .padding({ left: 10, right: 10 })
      }
      .layoutWeight(1)
      .width('100%')
      .backgroundColor('#F2F2F7')

      // 输入区域
      Row() {
        TextInput({ placeholder: '请输入消息...', text: this.inputText })
          .onChange((value) => {
            this.inputText = value
          })
          .layoutWeight(1)
          .height(50)
          .backgroundColor(Color.White)
          .borderRadius(25)
          .padding({ left: 20, right: 20 })
          .margin({ right: 10 })

        Button('发送')
          .width(80)
          .height(50)
          .borderRadius(25)
          .onClick(() => {
            if (this.inputText.trim() === '') {
              return
            }

            // 添加用户消息
            this.messages.push({
              text: this.inputText,
              isUser: true
            } as ChatMessage)

            // 模拟AI回复
            setTimeout(() => {
              this.messages.push({
                text: `我收到了你的消息："${this.inputText}"，正在处理中...`,
                isUser: false
              } as ChatMessage)

              // 滚动到底部
              this.scroller.scrollToIndex(this.messages.length - 1)
            }, 500)

            this.inputText = ''

            // 滚动到底部
            this.scroller.scrollToIndex(this.messages.length - 1)
          })
      }
      .width('100%')
      .padding(10)
      .backgroundColor('#F2F2F7')
      .borderWidth({ top: 1 })
      .borderColor('#E5E5EA')
    }
    .width('100%')
    .height('100%')
  }
}
