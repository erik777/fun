import { Bluetooth, Peripheral, getBluetoothInstance, DiscoverServicesOptions, Service } from '@nativescript-community/ble';
import { check as checkPermission, request as requestPermission, Permissions, Result } from '@nativescript-community/perms';
import { BtDevice } from './BtDevice';
import { OsLogger } from '../util/OsLogger';
import { OsSharedObservable } from '../util/OsSharedObservable';

export class BtNativeScriptBle {

  private logger: OsLogger;
  private scanningEmmiter = new OsSharedObservable<BtDevice>();

  constructor(public btInstance: Bluetooth, logger?: OsLogger) {
    if (logger) this.logger = logger;
  }

  private log(message: string): void {
    if (this.logger) this.logger.log(message);
    console.log(message);
  }

  checkPermissions(): void {
    this.log("Checking bluetoothScan... ");
    // TODO currently have to add 'Nearby Devices' permission manually.
    // Throws SecurityException in stacktrace if you don't.
    this.checkPermission('bluetoothScan')
    .then( response => {
      this.checkPermission('bluetooth')
      .then( response => {
        this.checkPermission('location')
        .then( response => {
          this.checkPermission('bluetoothConnect')
          .then( response => this.log(" DONE checking permissions. ") )
          .catch(err => this.log("ERROR bluetoothConnect " + err));
        })
        .catch(err => this.log("ERROR location " + err));
      })
      .catch(err => this.log("ERROR bluetooth " + err));
    })
    .catch(err => this.log("ERROR bluetoothScan " + err))
    ;
  }

  checkPermission(permission: any): Promise<Result> {
    const promise = new Promise<Result>( (resolve, reject) => {
      checkPermission(permission, { type: 'always' })
      .then((result: Result) => {
        // checkPermission(permission, { type: 'always' }).then(response => {
        const authorized = result.length > 0 && result[0] === 'authorized'
          && result[1];
        this.log(" Bcp.checkPermission " +
          permission + ", response: " +
          (authorized ? "is authorized " : JSON.stringify(result)) + " "
        );
          // export type Status = 'authorized' | 'denied' | 'limited' | 'restricted' | 'undetermined' | 'never_ask_again';
        if (authorized) {
          this.log(" " + permission + " authorized! ");
          resolve(result);
        } else {
          this.log(" requesting " + permission + " ");
          requestPermission(permission, { type: 'always' })
          .then((response: Result) => {
            //  console.log("requestPermissions, response: " + JSON.stringify(response));
            this.log(" Bcp.requestPermission " + permission +
              ", response:" + JSON.stringify(response) + " ");
            resolve(response);
          })
          .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
    });
    return promise;
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

  enable(): Promise<boolean> {
    const promise = new Promise<boolean>( (resolve, reject) => {
      this.btInstance.enable()
        .then(enabled => resolve(enabled))
        .catch(err => reject(err));
    });
    return promise;
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

  write(uuid: string, serviceUUID: string,
    characteristicUUID: string, value: any): Promise<void>
  {
    const promise = new Promise<void>( (resolve, reject) => {
      this.log(" write(" + uuid + "," + serviceUUID + "," +
        characteristicUUID + "," + value + ") called ");
      this.btInstance.write({
        peripheralUUID: uuid,
        serviceUUID: serviceUUID,
        characteristicUUID: characteristicUUID,
        value: value,
      })
      .then(response => resolve())
      .catch(err => reject(err));
    });
    return promise;
  }

  disconnect(uuid: string): Promise<any> {
    this.log("disconnect " + uuid);
    return this.btInstance.disconnect({UUID: uuid});
  }

  getScanningEmmiter(): OsSharedObservable<BtDevice> {
    return this.scanningEmmiter;
  }

  startScanning(): OsSharedObservable<BtDevice> {
    let index = 0;
    this.btInstance
      .startScanning({
        seconds: 4,
        // we can't skip permissions and we need enabled location as we dont use filters:
        // https://developer.android.com/guide/topics/connectivity/bluetooth-le
        //                  skipPermissionCheck: false,
        onDiscovered: (perip: Peripheral) => {
            // this.log(` BLE.onDisc `);
            const btDevice = BtNativeScriptBle.toBtDevice(perip, index++);
            btDevice.description = "onDisc1 " + btDevice.description;
            if (!this.scanningEmmiter.send(btDevice))
              this.log(" Cannot send! ");
        }
    })
    .then(() => {
        // this.log(` startScanning - complete `);
        this.scanningEmmiter.done();
    }, (err: any) => {
        this.log(` startScanning - err ` + err);
        this.scanningEmmiter.error(err);
    });

    return this.getScanningEmmiter();
  }

  stopScanning() {
    this.btInstance.stopScanning().then(() => {
      this.log(` stopScanning - then`);
      // TODO not sure this is needed or wise
      // this.scanningEmmiter.done();
    }).catch( err => {
        this.log(` stopScanning - err`);
        // TODO how can it tell a start from a stop error?
        this.scanningEmmiter.error(err);
        // dialogs.alert({
        //     title: "Whoops!",
        //     message: err,
        //     okButtonText: "OK, so be it"
        // });
    });
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
