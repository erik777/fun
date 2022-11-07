<template>
    <StackLayout class="deviceList">
      <Button class="button" text="Refresh" @tap="onRefresh" />

      <ListView for="item in deviceList" @itemTap="onItemTap">
        <v-template>
          <Label :text="item.name" />
        </v-template>
      </ListView>
    </StackLayout>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import { BtDevice, CurrentDevice } from "../shared/BtDevice";
  
  const deviceList: BtDevice[] = [];
  let currentDevice: CurrentDevice = null;
  
  export default {
    data() {
      return {
        deviceList: deviceList,
        currentDevice: currentDevice
      }
    },
    computed: {
      message() {
        return "RoboSmart";
      }
    },
    methods: {
      onRefresh() {
        this.deviceList.push( new BtDevice( {name: "blah "  + this.deviceList.length} ) );
        console.log("onRefresh " + this.deviceList.length);
      },
      onItemTap(event: any) {
        console.log(event.index)
        console.log(event.item)
        this.currentDevice = event.item;
        this.$emit("currentDevice", this.currentDevice);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '@nativescript/theme/scss/variables/blue';

  // Custom styles
  .deviceList {
    margin-bottom: 100px
  }
  
  .button {
    font-size: 20;
    font-weight: bold;
    color: white;
    background-color: navy;
    width: 200em;
  }
</style>
