import { Application, View } from '@nativescript/core'

export const showDrawer = () => {
  let drawerNativeView: any = Application.getRootView()
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.showDrawer()
  }
}

export const closeDrawer = () => {
  let drawerNativeView: any = Application.getRootView()
  if (drawerNativeView && drawerNativeView.closeDrawer) {
    drawerNativeView.closeDrawer()
  }
}
