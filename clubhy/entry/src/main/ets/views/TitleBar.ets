import router from "@ohos.router"

@Preview
@Component
export struct TitleBar{
  @State title:string = '标题'
  @State showBack:boolean = true
  @State right:string = ''
  callback = ()=>{}
  build() { //1.Row 行 2.Column 列 3.Stack 层
    Stack(){  //层叠效果
      Text(this.title)
        .fontSize(30)
        .fontWeight(FontWeight.Bold)
        .height(60)
        .width('100%')
        .textAlign(TextAlign.Center)
      if(this.showBack){
       Image($r('app.media.ic_back'))
        .width(40)
        .height(40)
        .margin({right:300})
        .onClick(()=>router.back())
      }
      Text(this.right).position({top:16,right:13})
        .fontSize(25).fontColor($r('app.color.myblue'))
        .onClick(()=>this.callback())
    }.width('100%').alignContent(Alignment.Start)
  }
}