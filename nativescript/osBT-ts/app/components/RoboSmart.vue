<template>
    <StackLayout class="deviceList">
      <Label class="bt-brand">
        <FormattedString>
          <Span text.decode="&#xf135; "/>
          <Span class="bt-brand" :text="message"/>
        </FormattedString>
      </Label> 

      <BtDeviceList @currentDevice="onCurrentDevice($event)" v-if="!currentDevice" />
      <BtDeviceView @close="clearItem" :currentDevice="currentDevice" v-if="currentDevice"/>
    </StackLayout>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import BtDeviceList from "./BtDeviceList";
  import BtDeviceView from "./BtDeviceView";
  import { BtDevice, CurrentDevice } from "../shared/BtDevice";
  
//  let currentDevice: CurrentDevice = null;
  
  export default {
	  data() {
		  return {
			  currentDevice: null
		  }
	  },
	  components: {
		  BtDeviceList,
		  BtDeviceView,
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