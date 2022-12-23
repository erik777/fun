<template>
  <StackLayout>
    <template v-if="currentDevice">
      <Label class="theDevice">
        <FormattedString>
          <Span text="Desc "/>
          <Span :text="currentDevice.description"/>
        </FormattedString>
      </Label>
      <Label class="theDevice">
        <FormattedString>
          <Span text="RSSI "/>
          <Span :text="currentDevice.RSSI"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="!connected">
        <FormattedString>
          <Span text="Index "/>
          <Span :text="currentDevice.index"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="!connected">
        <FormattedString>
          <Span text="Name "/>
          <Span :text="currentDevice.name"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="!connected">
        <FormattedString>
          <Span text="UUID "/>
          <Span :text="currentDevice.UUID"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="!connected">
        <FormattedString>
          <Span text="localName "/>
          <Span :text="currentDevice.localName"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="!connected">
        <FormattedString>
          <Span text="Manufacturer "/>
          <Span :text="currentDevice.manufacturerId"/>
        </FormattedString>
      </Label>
      <Label class="theDevice">
        <FormattedString>
          <Span text="State "/>
          <Span :text="currentDevice.state"/>
        </FormattedString>
      </Label>
      <Label class="theDevice">
        <FormattedString>
          <Span text="Services "/>
          <Span :text="jsonServices"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="deviceState.lightSwitch">
        <FormattedString>
          <Span text="Light Switch "/>
          <Span :text="deviceState.lightSwitch"/>
        </FormattedString>
      </Label>
      <TextView class="theDevice" v-if="deviceState.error" maxLines="2">
           {{ deviceState.error }}
      </TextView>
      <TextView class="theDevice" v-if="!deviceState.error" maxLines="2">
           {{ deviceState | json }}
      </TextView>
      <TextView class="theDevice" editable="false" maxLines="3">
        {{ currentDevice.json }}
      </TextView>
      <Button v-if="!connected" class="button" text="Connect" @tap="connect" />
      <Button v-if="connected" class="button" text="Read" @tap="read" />
      <Button v-if="connected" class="button" text="Disconnect" @tap="disconnect" />
    </template>

    <Button class="button" text="Return" @tap="onReturn" />
  </StackLayout>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { BtDevice, Service } from "../shared/BtDevice";
import { DeviceState } from "../shared/DeviceState";
//import { ScrollView } from '@nativescript/core';

export default {
  props: {
	  currentDevice: BtDevice,
    deviceState: DeviceState,
  },
  methods: {
	  onReturn() {
		  console.log("emitting close");
		  this.$emit("close", true);
	  },
	  connect() {
	    console.log("emitting connect");
		  this.$emit("connect", this.currentDevice.UUID)
	  },
	  disconnect() {
	    console.log("emitting disconnect");
	    this.$emit("disconnect", this.currentDevice.UUID)
	  },
	  read() {
      console.log("emitting read");
      this.$emit("read", this.currentDevice.UUID)
	  }
  },
  computed: {
	  jsonServices() {
		  if (this.currentDevice) {
        if (this.currentDevice.services)
            return this.currentDevice.services.length + " " + JSON.stringify(this.currentDevice.services);
        else
            return "none " + this.currentDevice.serviceCount;
		  }
		  else
			  return "";
	  },
	  connected() {
		  if (this.currentDevice) return this.currentDevice.isConnected();
		  return false;
	  }
  }
}
</script>

<style scoped lang="scss">
  .theDevice {
    font-size: 20;
  }
</style>
