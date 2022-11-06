<template>
    <GridLayout>
      <Label class="bt-brand">
        <FormattedString>
          <Span text.decode="&#xf135; "/>
          <Span class="bt-brand" :text="message"/>
        </FormattedString>
      </Label>
      <Button text="Refresh" @tap="onRefresh" />
    </GridLayout>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";

  const deviceList = [];
  
  export default Vue.extend({
	  data() {
		  return {
			  deviceList: []
		  }
	  },
    computed: {
      message() {
        return "RoboSmart";
      }
    },
    methods: {
      onRefresh() {
        console.log("onRefresh");
      },
      onItemTap(event) {
    	  console.log(event.index)
    	  console.log(event.item)
    	}
    }
  });
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
