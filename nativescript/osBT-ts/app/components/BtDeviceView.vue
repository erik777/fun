<template>
  <StackLayout>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="Device "/>
        <Span :text="currentDevice.name"/>
      </FormattedString>
    </Label>
    <Label v-if="currentDevice" class="theDevice">
      <FormattedString>
        <Span text="UUID "/>
        <Span :text="currentDevice.UUID"/>
      </FormattedString>
    </Label>
		
	  <Button class="button" text="Return" @tap="onReturn" />
  </StackLayout>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { BtDevice } from "../shared/BtDevice";

export default {
  props: {
	  currentDevice: BtDevice
  },
  methods: {
	  onReturn() {
		  console.log("emitting close");
		  this.$emit("close", true);
	  }
  }
}
</script>

<style scoped lang="scss">
  .theDevice {
    font-size: 20;
  }
</style>
