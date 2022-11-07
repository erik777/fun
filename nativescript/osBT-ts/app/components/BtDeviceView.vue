<template>

<!-- 
	<Label v-if="currentDevice">
	  <FormattedString>
	    <Span text="Device "/>
	    <Span :text="currentDevice.name"/>
	  </FormattedString>
	</Label>
 -->
	
  <Button class="button" text="Return" @tap="onReturn" />
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
