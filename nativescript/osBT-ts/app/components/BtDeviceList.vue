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
//   import Vue from "nativescript-vue";
//   import * as dialogs from '@nativescript/core/ui/dialogs';
// import { ObservableArray } from '@nativescript/core/data/observable-array';
// import { Peripheral } from '@nativescript-community/ble';
import { ScrollView, Trace } from '@nativescript/core';

import { BtDevice, CurrentDevice } from "../shared/ble/BtDevice";
import { BtNativeScriptBle } from "../shared/ble/BtNativeScriptBle";
import { OsObservableLogger } from "~/shared/util/OsObservableLogger";
import { AppState } from "~/shared/AppState";

const deviceList: BtDevice[] = [];
const devices = new Map<string, BtDevice>();
let currentDevice: CurrentDevice = null;
// const peripherals = new ObservableArray<Peripheral>();
const status = "";

export default {
    props: {
        bt: BtNativeScriptBle,
        logger: OsObservableLogger,
        appState: AppState,
    },
    data() {
        return {
            deviceList: deviceList,
            devices: devices,
            currentDevice: currentDevice,
            isLoading: false,
            // peripherals: peripherals,
            status: status,
            subScanDone: undefined,
            subScanErr: undefined,
            subScanMessage: undefined,
        };
    },
    setup() {
        this.initSubscriptions();
    },
    mounted() {
        this.logger.subscribe(msg => this.status += msg);
        this.log("LIST.mounted ");
        this.initSubscriptions();
    },
    computed: {
        btEnabled() {
            return this.appState && this.appState.enabled;
        },
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
                        this.log(`LIST.onDisco `);
                        const btDevice = BtNativeScriptBle.toBtDevice(perip, this.deviceList.length);
                        btDevice.description = "onDisc1 " + btDevice.description;
                        if (!this.devices.has(btDevice.UUID))
                            this.deviceList.push(btDevice);
                        this.devices.set(btDevice.UUID, btDevice);
                    } else {
                        this.log(`subScanMessage ERROR: empty perip `);
                    }
                });
                this.log(" Subscribed for scanning! ");
            } else {
                this.log(" Already subscribed! ");
            }
        },
        onRefresh() {
            let device: BtDevice;
            if (this.btEnabled) {
                this.doStartScanning();
                device = new BtDevice({
                    description: "scanning " + this.deviceList.length,
                    name: "scanning " + this.deviceList.length,
                    index: this.deviceList.length
                });
            }
            else {
                device = new BtDevice({
                    description: "blah " + this.appState.enabled + " " + this.deviceList.length,
                    name: "blah " + this.deviceList.length,
                    index: this.deviceList.length
                });
            }
            if (!this.devices.has(device.UUID))
                this.deviceList.push(device);
            this.devices.set(device.UUID, device);
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
            this.devices.clear();
            // this.peripherals.length = 0;
            this.log(" startScanning - calling ");
            this.$emit("startScanning");
        },
        doStopScanning() {
            this.log(" doStopScanning - calling ");
            this.$emit("stopScanning");
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
