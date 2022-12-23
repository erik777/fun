import { Bluetooth, Peripheral, getBluetoothInstance, DiscoverServicesOptions, Service } from '@nativescript-community/ble';
import { check as checkPermission, request as requestPermission, Permissions } from '@nativescript-community/perms';
import { BtDevice } from './BtDevice';
import { OsLogger } from './util/OsLogger';

export class BtNativeScriptBle {
  status = "";

  private logger: OsLogger;

  constructor(public btInstance: Bluetooth, logger?: OsLogger) {
    if (logger) this.logger = logger;
  }

  private log(message: string): void {
    if (this.logger) this.logger.log(message);
    console.log(message);
  }

  checkPermissions(): void {
    this.status = "checking...";
    this.log("Checking permissions " + this.status);
    // TODO currently have to add 'Nearby Devices' permission manually.
    // Throws SecurityException in stacktrace if you don't.
    this.checkPermission('location');
    this.checkPermission('bluetooth');
    this.checkPermission('bluetoothScan');
    // checkPermission('bluetoothScan', { type: 'always' }).then(response => {
    //   console.log("checkPermissions, response: " + JSON.stringify(response));
    //   this.status = response.length + " l:" + response[0];
    //   requestPermission('bluetoothScan', { type: 'always' }).then(response => {
    //      console.log("requestPermissions, response: " + JSON.stringify(response));
    //      this.status += " lr:" + response[0];
    //   });
    // });

    // checkPermission(['location', 'bluetooth', 'bluetoothScan'], { type: 'always' }).then(response => {
    //   console.log("checkPermissions, response: " + JSON.stringify(response));
    //   this.status = response.length + " l:" + response[0];
    //   requestPermission(['location', 'bluetooth', 'bluetoothScan'], { type: 'always' }).then(response => {
    //      console.log("requestPermissions, response: " + JSON.stringify(response));
    //      this.status += " lr:" + response[0];
    //   });
    // });
  }

  checkPermission(permission: any): void {
    checkPermission(permission, { type: 'always' }).then(response => {
      // checkPermission(permission, { type: 'always' }).then(response => {
      this.log("checkPermission, response: " + JSON.stringify(response));
      // this.status = response.length + " cp:" + response[0];
      requestPermission(permission, { type: 'always' }).then(response => {
        //  console.log("requestPermissions, response: " + JSON.stringify(response));
         this.log(" requestPermission, response:" + response[0]);
      });
    });
  };

  connect(uuid: string): Promise<Peripheral> {
    const promise = new Promise<Peripheral>( (resolve, reject) => {
      this.log("connect(" + uuid + ") called");
      this.btInstance.connect({
        UUID: uuid,
        onConnected: (perip: Peripheral) => {
          this.log("connected to " + uuid);
          if (perip.services)
            resolve(perip);
          else {
            this.discoverServices({peripheralUUID: perip.UUID})
              .then( (result: {services: Service[]}) => {
                perip.services = result.services;
                resolve(perip);
              })
              .catch(err => reject(err));
          }
        },
        onDisconnected: (perip: Peripheral) => {
          reject(perip);
          this.log("disconnected from " + uuid);
        },
      });
    });
    return promise;
  }

  discoverServices(options: DiscoverServicesOptions): Promise<{ services: Service[] }> {
    this.log("connect(" + JSON.stringify(options) + ") called");
    return this.btInstance.discoverServices(options);
  }

  read(uuid: string, serviceUUID: string, characteristicUUID: string): Promise<number> {
    const promise = new Promise<number>( (resolve, reject) => {
      this.log("read(" + uuid + "," + serviceUUID + "," + characteristicUUID + ") called");
      this.btInstance.read({
        peripheralUUID: uuid,
        serviceUUID: serviceUUID,
        characteristicUUID: characteristicUUID,
      })
      .then(response => resolve(BtNativeScriptBle.arrayBufferToInt(response.value)))
      .catch(err => reject(err));
    });
    return promise;
  }

  disconnect(uuid: string): Promise<any> {
    this.log("disconnect " + uuid);
    return this.btInstance.disconnect({UUID: uuid});
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
    if (perip.services) btDevice.serviceCount = perip.services.length;
    return btDevice;
  }

  static arrayBufferToInt(ab): number {
    var a = new Uint8Array(ab);
    return a[0];
  };

}
