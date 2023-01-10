<template>
  <StackLayout>
    <template v-if="currentDevice">
      <Label class="theDevice">
        <FormattedString>
          <Span text="Desc "/>
          <Span :text="currentDevice.description"/>
        </FormattedString>
      </Label>
        <Label class="theDevice" v-if="!deviceState.error">
          <FormattedString>
            <Span text="RSSI "/>
            <Span :text="currentDevice.RSSI"/>
          </FormattedString>
        </Label>
        <Label class="theDevice" v-if="debug && !connected">
          <FormattedString>
            <Span text="Index "/>
            <Span :text="currentDevice.index"/>
          </FormattedString>
        </Label>
        <Label class="theDevice" v-if="debug && !connected">
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
        <Label class="theDevice" v-if="debug && !connected">
          <FormattedString>
            <Span text="localName "/>
            <Span :text="currentDevice.localName"/>
          </FormattedString>
        </Label>
        <Label class="theDevice" v-if="!connected && !deviceState.error">
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
      <Label class="theDevice" v-if="!connected && !deviceState.error">
        <FormattedString>
          <Span text="Services "/>
          <Span :text="jsonServices"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="deviceState.haveLightSwitch()">
        <FormattedString>
          <Span text="Light Switch "/>
          <Span :text="deviceState.lightSwitch"/>
        </FormattedString>
      </Label>
      <Label class="theDevice" v-if="deviceState.haveBrightness()">
        <FormattedString>
          <Span text="Brightness "/>
          <Span :text="deviceState.brightness"/>
        </FormattedString>
      </Label>
      <Switch v-show="deviceState.haveLightSwitch()"
        :checked="deviceState.isLightOn()"
        @checkedChange="onLightSwitchChange($event)"
        class="switch" />
      <Slider v-show="deviceState.haveBrightness()"
        :value="deviceState.brightness"
        @valueChange="onBrightnessChange($event)"
        maxValue="255" />
      <TextView class="error" v-if="deviceState.error" maxLines="2">
           {{ deviceState.error }}
      </TextView>
      <TextView class="theDevice" v-if="debug && !deviceState.error" maxLines="2">
           {{ deviceState | json }}
      </TextView>
      <TextView v-if="debug" class="theDevice" editable="false" maxLines="3">
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
import { BtDevice } from "../shared/ble/BtDevice";
import { DeviceState } from "../shared/DeviceState";
import { OsObservableLogger } from "~/shared/util/OsObservableLogger";
//import { ScrollView } from '@nativescript/core';

export default {
  props: {
	  currentDevice: BtDevice,
    deviceState: DeviceState,
    logger: OsObservableLogger,
    lightSwitch: Number,
    brightness: Number
  },
  data: {
    debug: false
  },
  methods: {
	  onReturn() {
      this.debug=true;
		  this.log("emitting close");
		  this.$emit("close", true);
	  },
	  connect() {
	    this.log(" emitting connect ");
		  this.$emit("connect", this.currentDevice.UUID)
	  },
	  disconnect() {
	    this.log(" emitting disconnect ");
	    this.$emit("disconnect", this.currentDevice.UUID)
	  },
	  read() {
      this.log(" emitting read ");
      this.$emit("read", this.currentDevice.UUID)
	  },
    onBrightnessChange(event) {
      this.log(" brightness changed to " + event.value );
      if (event.value !== this.deviceState.brightness)
        this.$emit("changeBrightness", this.currentDevice.UUID, event.value);
    },
    onLightSwitchChange(event) {
      this.log(" lightSwitch changed to " + event.value );
      if (event.value !== this.deviceState.isLightOn())
        this.$emit("changeLightSwitch", this.currentDevice.UUID, event.value);
    },
    log(message: string): void {
      console.log(message);
      this.logger.log(message);
    }
  },
  computed: {
    // lightSwitchCalc: {
    //   get(): boolean {
    //     return this.deviceState.lightSwitch === 1;
    //   },
    //   set(value: boolean) {
    //     // TODO write value
    //   }
    // },
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
  .attrList {
    height: 30em;
  }
  .theDevice {
    font-size: 20;
  }
  .error {
    font-size: 16;
  }
</style>
