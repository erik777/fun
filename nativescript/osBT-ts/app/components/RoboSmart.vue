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
        :currentDevice="currentDevice"/>
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

  const btInstance = getBluetoothInstance();
  const bt = new BtNativeScriptBle(btInstance);
  
  export default {
	  data() {
		  return {
			  currentDevice: null,
			  bt: bt,
		    btEnabled: false
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
    		console.log("connect " + uuid);
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