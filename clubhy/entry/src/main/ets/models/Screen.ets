import { window } from "@kit.ArkUI"

export class Screen {
  public static full(ctx: Object) {
    window.getLastWindow(getContext(ctx), (err, win) => {
      win.setWindowLayoutFullScreen(true)
    })
  }
}