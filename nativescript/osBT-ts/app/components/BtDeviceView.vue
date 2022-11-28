<template>
  <StackLayout>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="Index "/>
        <Span :text="currentDevice.index"/>
      </FormattedString>
    </Label>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="Desc "/>
        <Span :text="currentDevice.description"/>
      </FormattedString>
    </Label>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="Name "/>
        <Span :text="currentDevice.name"/>
      </FormattedString>
    </Label>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="UUID "/>
        <Span :text="currentDevice.UUID"/>
      </FormattedString>
    </Label>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="localName "/>
        <Span :text="currentDevice.localName"/>
      </FormattedString>
    </Label>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="RSSI "/>
        <Span :text="currentDevice.RSSI"/>
      </FormattedString>
    </Label>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="Manufacturer "/>
        <Span :text="currentDevice.manufacturerId"/>
      </FormattedString>
    </Label>
    <template v-if="currentDevice">
      <Label class="theDevice">
        <FormattedString>
          <Span text="Services "/>
          <Span :text="jsonServices"/>
        </FormattedString>
      </Label>
    </template>
    <TextView v-if="currentDevice" class="theDevice" editable="false" maxLines="3">
      JSON {{ currentDevice.json }}
    </TextView>
		
	  <Button class="button" text="Return" @tap="onReturn" />
  </StackLayout>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { BtDevice, Service } from "../shared/BtDevice";

export default {
  props: {
	  currentDevice: BtDevice
  },
  methods: {
	  onReturn() {
		  console.log("emitting close");
		  this.$emit("close", true);
	  },
	  connect() {
		  
	  },
	  disconnect() {
		  
	  }
  },
  computed: {
	  jsonServices() {
		  if (this.currentDevice) {
        if (this.currentDevice.services)
            return this.currentDevice.services.length + " " + JSON.stringify(this.currentDevice.services);
        else
            return "none";
		  }
		  else 
			  return "";
	  }
  }
}
</script>

<style scoped lang="scss">
  .theDevice {
    font-size: 20;
  }
</style>
