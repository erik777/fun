<template>
    <StackLayout class="deviceList">
      <Button class="button" :text="refreshBtnText" @tap="onRefresh" />
      <ScrollView>
	      <TextView class="status" editable="false" maxLines="4">
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
  import { ScrollView, Trace } from '@nativescript/core';

  import { Peripheral } from '@nativescript-community/ble';

  import { BtDevice, CurrentDevice } from "../shared/ble/BtDevice";
  import { BtNativeScriptBle } from "../shared/ble/BtNativeScriptBle";
  import { OsObservableLogger } from "~/shared/util/OsObservableLogger";
import { Subscription } from "rxjs";

  const deviceList: BtDevice[] = [];
  let currentDevice: CurrentDevice = null;
  const peripherals = new ObservableArray<Peripheral>();
  const status = "";

  export default {
    props: {
        bt: BtNativeScriptBle,
        logger: OsObservableLogger,
    },
    data() {
        return {
            deviceList: deviceList,
            currentDevice: currentDevice,
            btInstance: this.bt.btInstance,
            btEnabled: false,
            isLoading: false,
            peripherals: peripherals,
            status: status,
            subScanDone: undefined,
            subScanErr: undefined,
            subScanMessage: undefined,
        };
    },
    setup() {
    },
    mounted() {
        // Trace.enable();    // did nothing
        const haveInstance = this.btInstance ? true : false;
        this.log(`mounted() called.  haveInstance: ` + haveInstance);
        this.btInstance.enable().then(enabled => {
            setTimeout(() => {
                this.btEnabled = enabled;
                //            if (this.btEnabled)
                //                this.checkPermissions();
                //          	this.doStartScanning();
                this.log("Checking permissions... ");
                this.checkPermissions();
            }, 500);
        });
        this.logger.subscribe(msg => this.status += msg);
        this.log("mounted ");
        this.initSubscriptions();
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
                if (this.isLoading)
                    result = result + "Scanning";
            }
            else {
                result = result + "Demo mode";
            }
            console.log("statusText: " + result + ", status=" + this.status);
            return result;
        }
    },
    methods: {
        initSubscriptions() {
            this.log(" initSubscriptions ");
            // TODO need to unsubscribe on component destruction
            if (!this.subScanDone)
                this.subScanDone = this.bt.getScanningEmmiter().onDone(v => {
                    this.log(` scanning - done `);
                    this.isLoading = false;
                });

            if (!this.subScanErr)
                this.subScanErr = this.bt.getScanningEmmiter().onError(err => {
                    this.log(` scanning - err ` + err);
                });

            if (!this.subScanMessage) {
                this.subScanMessage = this.bt.getScanningEmmiter().onMessage(perip => {
                    if (perip) {
                        this.log(`onDisco `);
                        const btDevice = BtNativeScriptBle.toBtDevice(perip, this.deviceList.length);
                        btDevice.description = "onDisc1 " + btDevice.description;
                        this.deviceList.push(btDevice);
                    } else {
                        this.log(`subScanMessage ERROR: empty perip `);
                    }
                });
                this.log(" Subscribed for scanning! ");
            } else {
                this.log(" Already subscribed! ");
            }
//here
        },
        onRefresh() {
            if (this.btEnabled) {
                this.doStartScanning();
                this.deviceList.push(new BtDevice({
                    description: "scanning " + this.deviceList.length,
                    name: "scanning " + this.deviceList.length,
                    index: this.deviceList.length
                }));
            }
            else {
                this.deviceList.push(new BtDevice({
                    description: "blah " + this.deviceList.length,
                    name: "blah " + this.deviceList.length,
                    index: this.deviceList.length
                }));
            }
            this.log("onRefresh " + this.deviceList.length);
        },
        onItemTap(event: any) {
            this.doStopScanning();
            this.status = "";  // clear log
            console.log(event.index);
            console.log(event.item);
            this.currentDevice = event.item;
            this.$emit("currentDevice", this.currentDevice);
        },
        checkPermissions() {
            this.bt.checkPermissions();
        },
        // this one uses automatic permission handling
        doStartScanning() {
            this.isLoading = true;
            // reset the array
            this.deviceList.splice(0);  // clear
            this.peripherals.length = 0;
            this.log("startScanning - calling");
            this.$emit("startScanning");
            console.log("startScanning - called");
        },
        doStopScanning() {
            this.btInstance.stopScanning().then(() => {
              this.log(` stopScanning - then`);
                this.isLoading = false;
            }).catch( err => {
                this.log(` stopScanning - err`);
                dialogs.alert({
                    title: "Whoops!",
                    message: err,
                    okButtonText: "OK, so be it"
                });
            });
        },
        // currently not used
        onDiscoveredEvent(perip: Peripheral) {
            console.log(`onDiscoveredEvent()`);
            //          const perip = eventData.data as Peripheral;
            this.deviceList.push(new BtDevice({
                index: this.deviceList.length,
                name: "onDiscEvent " + this.deviceList.length,
                description: "onDiscEvent " + this.deviceList.length,
            }));
            let index = -1;
            this.peripherals.some((p, i) => {
                if (p.UUID === perip.UUID) {
                    index = i;
                    return true;
                }
                return false;
            });
            console.log("Peripheral found:", JSON.stringify(perip), index);
            if (index === -1) {
                this.deviceList.push(new BtDevice({
                    index: this.deviceList.length,
                    name: "push " + this.deviceList.length,
                    UUID: perip.UUID
                }));
                this.peripherals.push(perip);
            }
            else {
                this.deviceList.push(new BtDevice({
                    index: index,
                    name: "setItem " + index,
                    UUID: perip.UUID
                }));
                this.peripherals.setItem(index, perip);
            }
        },
        log(message: string): void {
          console.log(message);
          this.logger.log(message);
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
