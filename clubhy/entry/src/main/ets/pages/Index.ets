import { Activity } from '../models/Bean'
import { MyUtil } from '../models/MyUtil'
import { Screen } from '../models/Screen'
import { TitleBar } from '../views/TitleBar'
import router  from '@ohos.router'
import { Router } from '@ohos.arkui.UIContext'
import { ActivityItem } from '../views/ActivityItem'

let params:object =router.getParams()
let uid:number = params ? params['uid'] : 3 //若没经过登录直接打开Index，uid默认为3

@Entry  //这个装饰器才代表页面
@Component
struct Index {
  @State navList:string[] = ['A','B']
  @State index:number = 0
  async aboutToAppear() {
    Screen.full(this)
    this.navList = await MyUtil.http('/activity/navList')
  }
  @Builder
  NavText(text:string, i:number){
    Text(text)
      .fontColor(this.index==i?$r('app.color.myblue'):Color.Black)
      .fontSize(this.index==i?22:20)
      .fontWeight(this.index==i?FontWeight.Bold:FontWeight.Normal)
      .borderWidth({bottom:2})
      .padding(5)
      .borderColor(this.index==i?$r('app.color.myblue'):Color.White)
  }
  build() {
    Column(){
      TitleBar({title:'社团报名',right:'我的',callback:()=>{
        router.pushUrl({
          url: 'pages/Owner'
        })
      }})
      Tabs(){
        ForEach(this.navList,(item:string, i:number)=>{
          TabContent(){ //选项卡页面
            ActivityList({ hot:item })
          }.tabBar(this.NavText(item, i))
        })
      }.onChange(i=>this.index=i)
    }.width('100%').height('100%')
  }
}

@Component  //这个结构体不是页面，而是组件
struct ActivityList{
  @State isRefreshing: boolean = false // 下拉刷新
  @StorageProp('uid')uid:number = 3
  @State hot:string = ''
  @State activities:Activity[] = []   //活动信息列表
  async aboutToAppear() {
    this.activities = await MyUtil.http('/activity/getActivity',{
      hot:this.hot,
      uid:this.uid,
  })
  }
  build() {
    Refresh({ refreshing: $$this.isRefreshing, offset: 120, friction: 100 }) {
    List() {
      ForEach(this.activities,(item:Activity)=>{
        ListItem() {
          ActivityItem({ activity:item,callback: async ()=>{

            // MyUtil.alert(uid+'----'+this.activity.id)
            let resp: object = await MyUtil.http('/join/activity', {
              uid: this.uid, //this的范围仅限于这个结构体
              aid: item.id
            })
            let msg: string = resp['msg']
            MyUtil.alert(msg)

            this.aboutToAppear()  //再走一遍主函数
          } })
        }
      })
    }.width('100%').height('100%').padding({left:10,right:10})
    }.onRefreshing(() => {
      setTimeout(() => {
        this.aboutToAppear()
        this.isRefreshing = false
      }, 500)
    })
  }
}