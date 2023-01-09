<template>
    <StackLayout class="deviceList">
      <Label class="bt-brand">
        <FormattedString>
          <Span text.decode="&#xf135; "/>
          <Span class="bt-brand" :text="message"/>
        </FormattedString>
      </Label>

      <BtDeviceList v-show="!currentDevice"
        @currentDevice="onCurrentDevice($event)"
        @startScanning="onStartScanning"
        :bt="bt"
        :logger="logger"
        />
      <BtDeviceView v-if="currentDevice"
        @close="clearItem"
        @connect="connect"
        @disconnect="disconnect"
        @read="read"
        :currentDevice="currentDevice"
        :deviceState="deviceState"/>
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
  import { OsObservableLogger } from "~/shared/util/OsObservableLogger";

  const btInstance = getBluetoothInstance();
  const logger = new OsObservableLogger();
  const btNSBLE = new BtNativeScriptBle(btInstance, logger);
  const deviceState = new DeviceState();

  export default {
	  data() {
		  return {
			  currentDevice: null,
			  bt: btNSBLE,
		    btEnabled: false,
        deviceState: deviceState,
        logger: logger,
		  }
	  },
	  components: {
		  BtDeviceList,
		  BtDeviceView,
	  },
	  mounted() {

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
        this.log("RS.stopScanning ");
        this.bt.stopScanning();
      },
    	onCurrentDevice(event: any) {
    		this.log("onCurrentDevice event: " + JSON.stringify(event));
    		this.currentDevice = event
    	},
    	clearItem() {
    		this.log("clearItem");
    		this.currentDevice = null;
    	},
    	connect(uuid: string) {
    		this.log("connecting to " + uuid);
        this.currentDevice.connecting();
    		this.bt.connect(uuid)
      		.then( (perip: Peripheral) => {
      	    this.log("Connected to " + perip.UUID);
      			const device = BtNativeScriptBle.toBtDevice(perip, this.currentDevice.index);
      			this.currentDevice = device.connected();
      		}).catch( err => {
      			this.log("Error connecting to " + uuid + ", err: " + JSON.stringify(err));
      			 this.currentDevice.disconnected();
      		});
    	},
    	read(uuid: string) {
        this.currentDevice.reading();
    		this.bt.read(uuid, robosmart.service, robosmart.lightSwitch )
    		  .then(value => {
            this.log("read value: " + value);
            this.currentDevice.doneReading();
            this.deviceState.lightSwitch = value;
          })
    		  .catch(err => {
            this.log("read error: " + err);
            this.currentDevice.doneReadingError();
            this.deviceState.error = err;
          });
    	},
    	disconnect(uuid: string) {
        console.log("disconnecting " + uuid);
        this.currentDevice.disconnecting();
        this.bt.disconnect(uuid).then( () => {
        	console.log("Disconnected " + uuid);
        	this.currentDevice.disconnected();
        }).catch( err => {
        	console.log("Disconnecting error for " + uuid + ", err: " + JSON.stringify(err));
          this.currentDevice.disconnected();
        })
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
