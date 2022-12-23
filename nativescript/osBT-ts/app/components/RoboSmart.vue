<template>
    <StackLayout class="deviceList">
      <Label class="bt-brand">
        <FormattedString>
          <Span text.decode="&#xf135; "/>
          <Span class="bt-brand" :text="message"/>
        </FormattedString>
      </Label>

      <BtDeviceList v-if="!currentDevice"
        @currentDevice="onCurrentDevice($event)"
        :bt="bt"
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
  import { Bluetooth, Peripheral, getBluetoothInstance } from '@nativescript-community/ble';
  import * as dialogs from '@nativescript/core/ui/dialogs';

  import BtDeviceList from "./BtDeviceList";
  import BtDeviceView from "./BtDeviceView";
  import { BtDevice, CurrentDevice } from "../shared/BtDevice";
  import { BtNativeScriptBle } from "../shared/BtNativeScriptBle";
  import { robosmart } from "../shared/RoboSmart.ts";
  import { DeviceState } from "~/shared/DeviceState";

  const btInstance = getBluetoothInstance();
  const bt = new BtNativeScriptBle(btInstance);
  const deviceState = new DeviceState();

  export default {
	  data() {
		  return {
			  currentDevice: null,
			  bt: bt,
		    btEnabled: false,
        deviceState: deviceState,
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
	  },
    computed: {
      message() {
        return "RoboSmart";
      }
    },
    methods: {
    	onCurrentDevice(event: any) {
    		console.log("onCurrentDevice event: " + JSON.stringify(event));
    		this.currentDevice = event
    	},
    	clearItem() {
    		console.log("clearItem");
    		this.currentDevice = null;
    	},
    	connect(uuid: string) {
    		console.log("connecting to " + uuid);
        this.currentDevice.connecting();
    		this.bt.connect(uuid)
      		.then( (perip: Peripheral) => {
      	    console.log("Connected to " + perip.UUID);
      			const device = BtNativeScriptBle.toBtDevice(perip, this.currentDevice.index);
      			this.currentDevice = device.connected();
      		}).catch( err => {
      			console.log("Error connecting to " + uuid + ", err: " + JSON.stringify(err));
      			 this.currentDevice.disconnected();
      		});
    	},
    	read(uuid: string) {
        this.currentDevice.reading();
    		this.bt.read(uuid, robosmart.service, robosmart.lightSwitch )
    		  .then(value => {
            console.log("value: " + value);
            this.currentDevice.doneReading();
            this.deviceState.lightSwitch = value;
          })
    		  .catch(err => {
            console.log("error: " + err);
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
