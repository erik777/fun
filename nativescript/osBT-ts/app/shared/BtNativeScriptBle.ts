import { Bluetooth, Peripheral, getBluetoothInstance } from '@nativescript-community/ble';
import { check as checkPermission, request as requestPermission } from '@nativescript-community/perms';
import { BtDevice } from './BtDevice';

export class BtNativeScriptBle {
  status = "";
  
  constructor(public btInstance: Bluetooth) {
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
  
  connect(uuid: string): Promise<Peripheral> {
    const promise = new Promise<Peripheral>( (resolve, reject) => {
      console.log("connect(" + uuid + ") called");
      this.btInstance.connect({
        UUID: uuid,
        onConnected: (perip: Peripheral) => {
          console.log("connected to " + uuid);
//          this.disconnect(uuid);
          resolve(perip);
        },
        onDisconnected: (perip: Peripheral) => {
          reject(perip);
          console.log("disconnected from " + uuid);
        },
      });
    });
    return promise;
  }
  
  disconnect(uuid: string): Promise<any> {
    console.log("disconnect " + uuid);
    return this.btInstance.disconnect({UUID: uuid});
//      .then( () => {
//        console.log("disconnected " + uuid);
//      })
//      .catch( (err) => {
//        console.log("error disconnecting from " + uuid + ", err: " + JSON.stringify(err));
//      });
  }
  
  static toBtDevice(perip: Peripheral, index: number): BtDevice {
    const btDevice = new BtDevice({
          index: index,
          description: index + " " + (perip.name ? perip.name : perip.UUID), 
          name: perip.name, 
          UUID: perip.UUID, 
          localName: perip.localName,
          RSSI: perip.RSSI,
          manufacturerId: perip.manufacturerId,
          services: perip.services,
          json: JSON.stringify(perip),
    });
    return btDevice;
  }
}