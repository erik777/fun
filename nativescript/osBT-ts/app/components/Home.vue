<template>
  <Page>
    <ActionBar>
      <Label text="Home"/>
    </ActionBar>

    <GridLayout>
      <Label class="info">
        <FormattedString>
          <Span class="fas" text.decode="&#xf135; "/>
          <Span :text="message"/>
        </FormattedString>
      </Label>
      <RoboSmart/>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import RoboSmart from "./RoboSmart";
  
  export default Vue.extend({
	  components: {
		  RoboSmart 
	  },
    computed: {
      message() {
        return "OpenStandards.net {N}-Vue fun";
      }
    }
  });
</script>

<style scoped lang="scss">
  @import '@nativescript/theme/scss/variables/blue';

  // Custom styles
  .fas {
    @include colorize($color: accent);
  }

  .info {
    font-size: 20;
    horizontal-align: center;
    vertical-align: bottom;
  }
</style>
