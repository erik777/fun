<template>
    <GridLayout>
      <Label class="bt-brand">
        <FormattedString>
          <Span text.decode="&#xf135; "/>
          <Span class="bt-brand" :text="message"/>
        </FormattedString>
      </Label> 
      <ListView for="item in deviceList" @itemTap="onItemTap">
	      <v-template>
	        <Label :text="item.name" />
	      </v-template>
	    </ListView>

	<Button text="Refresh" @tap="onRefresh" />
    </GridLayout>
</template>

<script>
  import Vue from "nativescript-vue";
  import { BtDevice } from "../shared/BtDevice";
  
  const deviceList = [];
  
  export default {
	  data() {
		  return {
			  deviceList: deviceList
		  }
	  },
    computed: {
      message() {
        return "RoboSmart";
      }
    },
    methods: {
      onRefresh() {
    	  this.deviceList.push( new BtDevice( {name: "blah"} ) );
        console.log("onRefresh " + this.deviceList.length);
      },
      onItemTap(event) {
    	  console.log(event.index)
    	  console.log(event.item)
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

  .info {
    font-size: 20;
    horizontal-align: center;
  }
</style>
