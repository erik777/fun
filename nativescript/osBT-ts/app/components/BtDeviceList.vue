<template>
    <StackLayout class="deviceList">
      <Button class="button" :text="refreshBtnText" @tap="onRefresh" />
      <ScrollView>
	      <TextView class="status" editable="false" maxLines="7">
	        {{ statusText }}
	      </TextView>
      </ScrollView>

      <ListView for="item in deviceList" @itemTap="onItemTap">
        <v-template>
          <Label :text="item.description" />
        </v-template>
      </ListView>
    </StackLayout>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import { ObservableArray } from '@nativescript/core/data/observable-array';
  import * as dialogs from '@nativescript/core/ui/dialogs';
  import { Trace } from '@nativescript/core';
  
  import { Bluetooth, Peripheral, getBluetoothInstance } from '@nativescript-community/ble';
  import { check as checkPermission, request as requestPermission } from '@nativescript-community/perms';

  import { BtDevice, CurrentDevice } from "../shared/BtDevice";
  import { BtNativeScriptBle } from "../shared/BtNativeScriptBle";

  const deviceList: BtDevice[] = [];
  let currentDevice: CurrentDevice = null;
  const peripherals = new ObservableArray<Peripheral>();
  const bt = new BtNativeScriptBle();

  export default {
    data() {
      return {
        deviceList: deviceList,
        currentDevice: currentDevice,
        btInstance: getBluetoothInstance(),
        btEnabled: false,
        isLoading: false,
        peripherals: peripherals,
        status: ""
      }
    },
    mounted() {
    	// Trace.enable();    // did nothing
    	  const haveInstance = this.btInstance ? true : false;
        console.log(`mounted() called.  haveInstance: ` + haveInstance);
        this.btInstance.enable().then(enabled => {
          setTimeout(() => {
            this.btEnabled = enabled;
//            if (this.btEnabled)
//                this.checkPermissions();
  //          	this.doStartScanning();
          }, 500);
        });

        this.btInstance.on(Bluetooth.bluetooth_status_event, (eventData: any) => {
        	console.log("bluetooth_status_event fired: " + JSON.stringify(eventData));
        });
        
        this.checkPermissions();
        this.requestPermissions();
        // using an event listener instead of the 'onDiscovered' callback of 'startScanning'
        this.btInstance.on(Bluetooth.device_discovered_event, (eventData: any) => {
      //      const perip = eventData.data as Peripheral;
//          this.onDiscoveredEvent(perip);
        });
      },
    computed: {
      refreshBtnText() {
    	  return this.btEnabled ?
    			  (this.isLoading ? "Refresh (scan)" : "Refresh")
    			  : "Refresh (demo)";
      },
      statusText() {
    	  let result = this.status + " ";
    	  if (this.btEnabled) {
    		  if (this.isLoading) result = result + "Scanning";
    	  } else {
    		  result = result + "Demo mode";
    	  }
        console.log("statusText: " + result + ", status=" + this.status);
        return result;
      }
    },
    methods: {
      onRefresh() {
    	  if (this.btEnabled) {
          this.doStartScanning();
          this.deviceList.push( new BtDevice( {
        	  description: "scanning "  + this.deviceList.length, 
            name: "scanning "  + this.deviceList.length, 
        	  index: this.deviceList.length} ) );
    	  } else {
    	    this.deviceList.push( new BtDevice( {
            description: "blah "  + this.deviceList.length, 
            name: "blah "  + this.deviceList.length, 
    	    	index: this.deviceList.length} ) );
    	  }
        console.log("onRefresh " + this.deviceList.length);
      },
      onItemTap(event: any) {
        this.doStopScanning();
        console.log(event.index)
        console.log(event.item)
        this.currentDevice = event.item;
        this.$emit("currentDevice", this.currentDevice);
      },
      checkPermissions() {
    	  this.status = "checking...";
    	  console.log("Checking permissions " + this.status);
    	  this.btInstance.hasLocationPermission( result => this.status += " hlp: " + result );
        this.permissionToStatus('location');
        this.permissionToStatus('bluetooth');
        this.permissionToStatus('bluetoothScan');
//    	  checkPermission('bluetoothScan', { type: 'always' }).then(response => {
//    	    console.log("checkPermissions, response: " + JSON.stringify(response));
//          this.status += " c:" + JSON.stringify(response);
//    		  this.requestPermissions();
//    		}, err => {
//    			this.status += " c-error: " + JSON.stringify(err);
//    		});
      },
      permissionToStatus(permission: string) {
          checkPermission(permission, { type: 'always' }).then(response => {
            console.log("checkPermissions, response: " + JSON.stringify(response));
            this.status += " c:" + permission + ": " + JSON.stringify(response);
          }, err => {
            this.status += " cE:" + permission + ": " +  + JSON.stringify(err);
          });
      },
      requestPermissions() {
        requestPermission(['location', 'bluetooth', 'bluetoothScan', 'bluetoothConnect'], { type: 'always' }).then(response => {
          console.log("requestPermissions, response: " + JSON.stringify(response));
          this.status += " lr:" + JSON.stringify(response);
          this.btInstance = getBluetoothInstance();
        });
      },
      // this one uses automatic permission handling
      doStartScanning() {
          this.isLoading = true;
          // reset the array
          this.peripherals.length = 0;
          console.log("startScanning - calling");
          this.btInstance
              .startScanning({
                  seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
                  // onDiscovered: peripheral => {
                  //     console.log("peripheral discovered. Not adding it here because we're using a listener.");
                  //     // this.peripherals.push(peripheral);
                  // },
                  // we can't skip permissions and we need enabled location as we dont use filters:
                	// https://developer.android.com/guide/topics/connectivity/bluetooth-le
//                  skipPermissionCheck: false,
                  onDiscovered: (perip: Peripheral) => {
                	  this.status += " onDiscovered()";
                    console.log(`onDiscovered()`);
                    this.deviceList.push( new BtDevice( {
                        index: this.deviceList.length,
                        description: "onDisc "  + this.deviceList.length + " " + (perip.name ? perip.name : perip.UUID), 
                        name: perip.name, 
                      	UUID: perip.UUID, 
                      	localName: perip.localName,
                      	RSSI: perip.RSSI,
                      	manufacturerId: perip.manufacturerId,
                      	services: perip.services,
                      	json: JSON.stringify(perip),
                    	} ) );
//                    const perip = eventData as Peripheral;
//                    console.log("Periperhal found with UUID: " + perip.UUID);
//                	  this.onDiscoveredEvent(perip);
                  }
              })
              .then(() => {
            	    this.status += "startScanning.then";
	                console.log(`startScanning - then`);
	            	  this.isLoading = false;
	              },
                (err: any) => {
                  this.status += "startScanning.err";
                  console.log(`startScanning - err`);
                }
              );
//              .catch(err => {
//                  console.log(`startScanning - err`);
//                  this.isLoading = false;
//                  dialogs.alert({
//                      title: 'Whoops!',
//                      message: err ? err : 'Unknown error',
//                      okButtonText: 'OK, got it'
//                  });
//              });
          console.log("startScanning - called");
      },
      doStopScanning() {
          this.btInstance.stopScanning().then(
              () => {
                  console.log(`stopScanning - then`);
                  this.isLoading = false;
              },
              err => {
                  console.log(`stopScanning - err`);
                  dialogs.alert({
                      title: 'Whoops!',
                      message: err,
                      okButtonText: 'OK, so be it'
                  });
              }
          );
      },
      onDiscoveredEvent(perip: Peripheral) {
          console.log(`onDiscoveredEvent()`);
//          const perip = eventData.data as Peripheral;
          this.deviceList.push( new BtDevice( {
            index: this.deviceList.length,
        	  name: "onDiscEvent "  + this.deviceList.length,
        	  description: "onDiscEvent "  + this.deviceList.length,
        	  } ) );
          let index = -1;
          this.peripherals.some((p, i) => {
              if (p.UUID === perip.UUID) {
                  index = i;
                  return true;
              }
              return false;
          });
          console.log('Peripheral found:', JSON.stringify(perip), index);
          if (index === -1) {
              this.deviceList.push( new BtDevice( {
            	  index: this.deviceList.length,
            	  name: "push "  + this.deviceList.length, 
            	  UUID: perip.UUID} ) );
              this.peripherals.push(perip);
          } else {
              this.deviceList.push( new BtDevice( {
                index: index,
            	  name: "setItem "  + index, 
            	  UUID: perip.UUID} ) );
              this.peripherals.setItem(index, perip);
          }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '@nativescript/theme/scss/variables/blue';

  // Custom styles
  .deviceList {
    margin-bottom: 100px
  }
  
  .status {
    margin-top: 10px;
    font-size: large;
  }
</style>
