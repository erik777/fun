<template lang="html">
<Page>
          <Label text="Close Drawer" color="lightgray" padding="10" style="horizontal-align: center" 
            @tap="onCloseDrawerTap"></Label>
</Page>
</template>

<script>
  import Home from "./Home";
  import Browse from "./Browse";
  import Featured from "./Featured";
  import Search from "./Search";
  import Settings from "./Settings";
//  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "~/shared/selected-page-service";

  export default {
    mounted() {
      SelectedPageService.getInstance().selectedPage$
        .subscribe((selectedPage) => this.selectedPage = selectedPage);
    },
    data() {
      return {
        Home: Home,
        Browse: Browse,
        Featured: Featured,
        Search: Search,
        Settings: Settings,
        selectedPage: "Home"
      };
    },
    components: {
      Home,
      Browse,
      Featured,
      Search,
      Settings
    },
    methods: {
      onCloseDrawerTap() {
        if (this.$refs.drawer)
          this.$refs.drawer.closeDrawer();
      },
      onNavigationItemTap(component) {
        this.$navigateTo(component, {
          clearHistory: true
        });
        this.$refs.drawer.closeDrawer();
//        utils.closeDrawer();
      }
    }
  };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '@nativescript/theme/scss/variables/blue';
    // End custom common variables

    // Custom styles
</style>
