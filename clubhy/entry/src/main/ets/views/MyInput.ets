// struct 做组件或页面时，要使用struct关键字
// class 做数据结构时用class
@Preview //可预览组件
@Component //这个结构体是一个Component组件，@State 具有数据双向绑定的功能，实时更新
export struct MyInput{
  @State placeholder:string = '请输入'
  @State text:string = ''
  callback = (v:string)=>{} //callback是一个function(v:string)函数
  build() {
    TextInput({placeholder:this.placeholder,text:this.text})
      .fontSize(25)
      .placeholderFont({size:25})
      .backgroundColor(Color.Transparent)
      .borderWidth({bottom:1})
      .borderRadius(0)
      .borderColor('#ccc')
      .margin({top:20})
      .onChange(v=>this.callback(v))  //回调函数
  }
}