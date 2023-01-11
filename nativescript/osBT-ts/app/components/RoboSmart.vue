<template>
    <StackLayout class="deviceList">
      <Label class="bt-brand">
        <FormattedString>
          <Span text.decode="&#xf135; "/>
          <Span class="bt-brand" :text="message"/>
        </FormattedString>
      </Label>

      <BtDeviceList v-show="!currentDevice || !currentDevice.isValid()"
        @currentDevice="onCurrentDevice($event)"
        @startScanning="onStartScanning"
        :bt="bt"
        :logger="logger"
        :appState="appState"
        />
      <BtDeviceView v-if="currentDevice && currentDevice.isValid()"
        @close="clearItem"
        @connect="connect"
        @disconnect="disconnect"
        @read="read"
        @changeLightSwitch="changeLightSwitch"
        @changeBrightness="changeBrightness"
        :logger="logger"
        :currentDevice="currentDevice"
        :deviceState="deviceState"
        :lightSwitch="deviceState.lightSwitch === 1"
        :brightness="deviceState.brightness"
      />
    </StackLayout>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import { Peripheral, getBluetoothInstance } from '@nativescript-community/ble';
  import * as dialogs from '@nativescript/core/ui/dialogs';

  import BtDeviceList from "./BtDeviceList";
  import BtDeviceView from "./BtDeviceView";
  import { BtNativeScriptBle } from "../shared/ble/BtNativeScriptBle";
  import { robosmart } from "../shared/RoboSmart";
  import { DeviceState } from "~/shared/DeviceState";
  import { BtDevice } from "~/shared/ble/BtDevice";
  import { OsObservableLogger } from "~/shared/util/OsObservableLogger";
  import { AppState } from "~/shared/AppState";

  const btInstance = getBluetoothInstance();
  const logger = new OsObservableLogger();
  const btNSBLE = new BtNativeScriptBle(btInstance, logger);
  const deviceState = new DeviceState();

  // TODO needs for currentDevice to be a singleton

  export default {
	  data() {
		  return {
			  currentDevice: new BtDevice(),
			  bt: btNSBLE,
		    appState: new AppState(),
        deviceState: deviceState,
        logger: logger,
		  }
	  },
	  components: {
		  BtDeviceList,
		  BtDeviceView,
	  },
	  mounted() {
      // this.log(`RS.mounted() called. `);
      this.bt.enable().then(enabled => {
          setTimeout(() => {
              this.appState.enabled = enabled;
              //            if (this.btEnabled)
              //                this.checkPermissions();
              //          	this.doStartScanning();
              this.log("RS.checkPermissions " + this.appState.enabled + "... ");
              this.bt.checkPermissions();
          }, 500);
      });
      this.log("RS.mounted ");

//		  console.log(`mounted() called.`);
//      this.btInstance.enable().then(enabled => {
//        setTimeout(() => {
//        	this.btEnabled = enabled;
//          dialogs.alert({
//              title: 'Did the user allow enabling Bluetooth by our app?',
//              message: enabled ? 'Yes' : 'No',
//              okButtonText: 'OK, nice!'
//          });
//        }, 500);
//      });
        // this.btInstance.on(Bluetooth.bluetooth_status_event, (eventData: any) => {
        //     console.log("bluetooth_status_event fired: " + JSON.stringify(eventData));
        // });
        // // using an event listener instead of the 'onDiscovered' callback of 'startScanning'
        // this.btInstance.on(Bluetooth.device_discovered_event, (eventData: any) => {
        //     //      const perip = eventData.data as Peripheral;
        //     //          this.onDiscoveredEvent(perip);
        // });
	  },
    computed: {
      message() {
        return "RoboSmart";
      }
    },
    methods: {
      onStartScanning() {
        this.log("RS.startScanning ");
        this.bt.startScanning();
      },
      onStopScanning() {
        this.log(" RS.stopScanning ");
        this.bt.stopScanning();
      },
    	onCurrentDevice(event: any) {
    		this.log(" onCurrentDevice event: " + JSON.stringify(event));
    		this.currentDevice = event
    	},
    	clearItem() {
    		this.log(" RS.clearItem ");
    		// this.currentDevice = null;
        this.deviceState.clear();
    		this.currentDevice.clear();
    	},
    	connect(uuid: string) {
    		this.log(" connecting to " + uuid);
        if (this.currentDevice) this.currentDevice.connecting();
    		this.bt.connect(uuid)
      		.then( (perip: Peripheral) => {
      	    this.log(" Connected to " + perip.UUID);
      			const device = BtNativeScriptBle.toBtDevice(perip, this.currentDevice.index);
      			this.currentDevice = device.connected();
      		}).catch( err => {
      			this.log(" Error connecting to " + uuid + ", err: " + JSON.stringify(err));
      			if (this.currentDevice) this.currentDevice.disconnected();
      		});
    	},
    	read(uuid: string) {
        this.currentDevice.reading();
    		this.bt.read(uuid, robosmart.service, robosmart.lightSwitch )
    		  .then(value => {
            this.log(" read lightSwitch=" + value);
            this.deviceState.lightSwitch = value;

            this.bt.read(uuid, robosmart.service, robosmart.brightness )
            .then(value => {
              this.log(" read brightness=" + value);
              this.deviceState.brightness = value;
              this.currentDevice.doneReading();
            })
            .catch(err => {
              this.log("read error: " + err);
              this.deviceState.error = err;
              this.currentDevice.doneReadingError();
            });

          })
    		  .catch(err => {
            this.log("read error: " + err);
            this.deviceState.error = err;
            this.currentDevice.doneReadingError();
          });
    	},
      changeLightSwitch(uuid: string, onOrOff: boolean) {
        this.log(" RS.changeLightSwitch " + onOrOff);
        this.currentDevice.writing();
        const data = new Uint8Array(1);
        data[0] = onOrOff ? 0x1 : 0x0;
    		this.bt.write(uuid, robosmart.service, robosmart.lightSwitch, data )
    		  .then(v => {
            this.log(" write lightSwitch=" + data);
            this.deviceState.lightSwitch = data[0];
            this.currentDevice.doneWriting();
          })
    		  .catch(err => {
            this.log(" write lightSwitch error: " + JSON.stringify(err) );
            this.deviceState.error = err;
            this.currentDevice.doneWritingError();
          });
      },
      changeBrightness(uuid: string, value: number) {
        this.log(" RS.changeBrightness " + value);
        this.currentDevice.writing();
    		this.bt.write(uuid, robosmart.service, robosmart.brightness, value)
    		  .then(v => {
            this.log(" write brightness=" + value);
            this.deviceState.brightness = value;
            this.currentDevice.doneWriting();
          })
    		  .catch(err => {
            this.log("write brightness error: " +  + JSON.stringify(err) );
            this.deviceState.error = err;
            this.currentDevice.doneWritingError();
          });
      },
    	disconnect(uuid: string) {
        this.log(" disconnecting " + uuid);
        if (this.currentDevice) {
          this.currentDevice.disconnecting();
          this.bt.disconnect(uuid).then( () => {
            this.log(" Disconnected " + uuid);
            this.currentDevice.disconnected();
          }).catch( err => {
            this.log(" Disconnecting error for " + uuid + ", err: " + JSON.stringify(err));
            this.currentDevice.disconnected();
          })
        } else {
          this.log(" disconnect error - currentDevice is null ");
        }
    	},
      log(message: string): void {
        console.log(message);
        logger.log(message);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '@nativescript/theme/scss/variables/blue';

  // Custom styles
  .bt-brand {
    @include colorize($color: accent);
    font-size: 40;
    horizontal-align: center;
  }
</style>

<style lang="scss">
  .button {
    font-size: 20;
    font-weight: bold;
    color: white;
    background-color: navy;
    width: 200em;
  }
</style>
