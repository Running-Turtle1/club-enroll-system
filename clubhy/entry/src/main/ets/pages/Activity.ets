import { Activity } from '../models/Bean'
import { MyUtil } from '../models/MyUtil'
import { ActivityItem } from '../views/ActivityItem'
import { TitleBar } from '../views/TitleBar'

@Entry
@Component
struct MyActivity {
  @State activities: Activity[] = []
  @StorageProp('uid') uid: number = 3

  async aboutToAppear() {
    try {
      // 调用后端接口查询当前用户已报名的活动
      let resp: object = await MyUtil.http('/join/getJoinedActivities', {
        uid: this.uid
      })
      // 假设后端返回的数据结构为 { code: 1, data: [ { activityId: 1, activityName: '活动1' }, ... ] }
      // 这里根据实际后端返回的数据结构进行调整
      if (resp['code'] === 1) {
        this.activities = resp['data']
      } else {
        MyUtil.alert(resp['msg'])
      }
    } catch (error) {
      console.error('查询已报名活动失败:', error)
      MyUtil.alert('查询已报名活动失败，请稍后重试')
    }
  }

  build() {
    Column() {
      TitleBar({ title: '已报名活动' })
      List() {
        ForEach(this.activities, (item: Activity) => {
          ListItem() {
            ActivityItem({
              activity: item,
              callback: async () => {
                let resp: object = await MyUtil.http('/join/activity', {
                  uid: this.uid,
                  aid: item.id
                })
                let msg: string = resp['msg']
                MyUtil.alert(msg)
                this.aboutToAppear() // 再走一遍主函数
              }
            })
          }
        })
      }
    }
  }
}