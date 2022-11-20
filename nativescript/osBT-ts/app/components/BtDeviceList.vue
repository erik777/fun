<template>
    <StackLayout class="deviceList">
      <Button class="button" :text="refreshBtnText" @tap="onRefresh" />

      <ListView for="item in deviceList" @itemTap="onItemTap">
        <v-template>
          <Label :text="item.name" />
        </v-template>
      </ListView>
    </StackLayout>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import { ObservableArray } from '@nativescript/core/data/observable-array';
  import { Bluetooth, Peripheral, getBluetoothInstance } from '@nativescript-community/ble';
  
  import { BtDevice, CurrentDevice } from "../shared/BtDevice";
  
  const deviceList: BtDevice[] = [];
  let currentDevice: CurrentDevice = null;
  const peripherals = new ObservableArray<Peripheral>();
  
  export default {
	  props: {
			isLoading: false
	  },
    data() {
      return {
        deviceList: deviceList,
        currentDevice: currentDevice,
        btInstance: getBluetoothInstance(),
        btEnabled: false,
//        refreshBtnText: "Refresh",
        peripherals: peripherals
      }
    },
    mounted() {
    	  const haveInstance = this.btInstance ? true : false;
        console.log(`mounted() called.  haveInstance: ` + haveInstance);
        this.btInstance.enable().then(enabled => {
          setTimeout(() => {
            this.btEnabled = enabled;
            if (enabled) 
            	this.doStartScanning();
//            else
//            	this.refreshBtnText="Demo Refresh";
          }, 500);
        });
        
        // using an event listener instead of the 'onDiscovered' callback of 'startScanning'
        this.btInstance.on(Bluetooth.device_discovered_event, (eventData: any) => {
            const perip = eventData.data as Peripheral;
            this.onDiscoveredEvent(perip);
        });
      },
    computed: {
      refreshBtnText() {
    	  return this.btEnabled ? (this.isLoading ? "Refresh (scanning)" : "Refresh") : "Refresh (demo)";
      }
    },
    methods: {
      onRefresh() {
    	  if (this.btEnabled) {
          this.doStartScanning();
          this.deviceList.push( new BtDevice( {name: "scanning "  + this.deviceList.length} ) );
    	  } else {
    	    this.deviceList.push( new BtDevice( {name: "blah "  + this.deviceList.length} ) );
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
      // this one uses automatic permission handling
      doStartScanning() {
          this.isLoading = true;
          // reset the array
          this.peripherals.length = 0;
//          this.refreshBtnText="Refresh (scanning)";
          this.btInstance
              .startScanning({
                  seconds: 10, // passing in seconds makes the plugin stop scanning after <seconds> seconds
                  // onDiscovered: peripheral => {
                  //     console.log("peripheral discovered. Not adding it here because we're using a listener.");
                  //     // this.peripherals.push(peripheral);
                  // },
                  skipPermissionCheck: false
                  , // we can't skip permissions and we need enabled location as we dont use filters: https://developer.android.com/guide/topics/connectivity/bluetooth-le
                  onDiscovered: (eventData: any) => {
                    this.deviceList.push( new BtDevice( {name: "onDiscovered "  + this.deviceList.length} ) );
                    const perip = eventData as Peripheral;
                	  console.log("Periperhal found with UUID: " + perip.UUID);
                	  this.onDiscoveredEvent(perip);
                  }
              })
              .then(() => {
//                this.refreshBtnText="Refresh (done)";
            	  this.isLoading = false;
              })
              .catch(err => {
                  this.isLoading = false;
                  dialogs.alert({
                      title: 'Whoops!',
                      message: err ? err : 'Unknown error',
                      okButtonText: 'OK, got it'
                  });
              });
      },
      doStopScanning() {
          this.btInstance.stopScanning().then(
              () => {
                  this.isLoading = false;
              },
              err => {
                  dialogs.alert({
                      title: 'Whoops!',
                      message: err,
                      okButtonText: 'OK, so be it'
                  });
              }
          );
      },
      onDiscoveredEvent(perip: Peripheral) {
//          const perip = eventData.data as Peripheral;
          let index = -1;
          this.peripherals.some((p, i) => {
              if (p.UUID === perip.UUID) {
                  index = i;
                  return true;
              }
              return false;
          });
          console.log('Peripheral found:', JSON.stringify(eventData.data), index);
          if (index === -1) {
              this.peripherals.push(perip);
              this.deviceList.push( new BtDevice( {name: "push "  + this.deviceList.length} ) );
          } else {
              this.peripherals.setItem(index, perip);
              this.deviceList.push( new BtDevice( {name: "setItem "  + index} ) );
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
</style>
