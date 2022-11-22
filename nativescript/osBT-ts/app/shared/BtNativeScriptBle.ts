import { Bluetooth, Peripheral, getBluetoothInstance } from '@nativescript-community/ble';
import { check as checkPermission, request as requestPermission } from '@nativescript-community/perms';


export class BtNativeScriptBle {
  status = "";
  
  constructor() {
  }
  
  checkPermissions(): void {
    this.status = "checking...";
    console.log("Checking permissions " + this.status);
    checkPermission(['location', 'bluetooth', 'bluetoothScan'], { type: 'always' }).then(response => {
      console.log("checkPermissions, response: " + JSON.stringify(response));
      this.status = response.length + " l:" + response[0];
      requestPermission(['location', 'bluetooth', 'bluetoothScan'], { type: 'always' }).then(response => {
         console.log("requestPermissions, response: " + JSON.stringify(response));
         this.status += " lr:" + response[0];
      });
    });
  }
}