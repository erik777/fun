<template lang="html">
    <RadSideDrawer ref="drawer" drawerLocation="Left" gesturesEnabled="true" :drawerTransition="transition">
        <StackLayout ~drawerContent backgroundColor="#ffffff">
            <DrawerContent/>
        </StackLayout>
        <Frame ~mainContent ref="drawerMainContent">
            <Home/>
        </Frame>
    </RadSideDrawer>
</template>

<script lang="ts">
  import DrawerContent from './DrawerContent.vue'
  import Home from './Home.vue'
  import { SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';

  export default {
    data() {
      return {
        transition: new SlideInOnTopTransition()
      }
    },

    components: {
      DrawerContent,
      Home
    },
  methods: {
//     onNavigationButtonTap() {
//       Frame.topmost().goBack();
//     },
//     onOpenDrawerTap() {
//       if (this.$refs.drawer)
//         this.$refs.drawer.showDrawer();
//     },
//     onCloseDrawerTap() {
//       if (this.$refs.drawer)
//         this.$refs.drawer.closeDrawer();
//     },
//     onToggleDrawerTap() {
//       if (this.$refs.drawer)
//         this.$refs.drawer.toggleDrawerState();
//     },
  },
};
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '@nativescript/theme/scss/variables/blue';
    // End custom common variables

    // Custom styles
</style>