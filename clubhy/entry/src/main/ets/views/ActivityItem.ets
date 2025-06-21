import { Activity } from '../models/Bean'
import { MyUtil } from '../models/MyUtil'

@Preview  //可预览组件
@Component
 export struct ActivityItem {
  @StorageLink('uid') uid: number = 3 //取出李四的uid：2，未经过登录默认为3
  @State activity: Activity = new Activity()
  callback = () => {
  } //声明一个回调函数，已被使用

  build() {
    Row() {
      Image(this.activity.logo).width('25%').height(85)
        .borderRadius(10)
      Column() {
        Text(this.activity.activity).fontSize(22)
        Text(this.activity.price == 0 ? '免费' : (this.activity.price)
          + '元/人').fontSize(18).margin({ top: 10 })
        Text('时间：' + this.activity.start).margin({ top: 10 })
        Text(this.activity.username + '社团').position({ top: 0, right: 15 })
        Text(this.activity.aid ? '已报名' : '报名').fontSize(20).fontColor(Color.Red)
          .position({ bottom: 0, right: 15 })
          .onClick(async () => {
            // 在外面进行处理 回调
            this.callback()
          })
      }.width('75%').alignItems(HorizontalAlign.Start) //左对齐
      .margin({ left: 10 }) //外边距
    }.padding({ top: 10, bottom: 10 }) //内边距
    .width('100%')
    .borderWidth({ bottom: 1 })
    .borderColor('#ddd')
  }
}