<template>
  <div :class="getColorScheme()">
    <!--------------------------------------->
    <!-- backdrop --------------------------->
    <!--------------------------------------->
    <transition name="fade" :duration="200">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-20"
        @click="$store.commit('layout/TOGGLE_SIDEBAR', false)"
      >
        <div class="absolute inset-0 bg-black opacity-75" />
      </div>
    </transition>

    <!--------------------------------------->
    <!-- main content ----------------------->
    <!--------------------------------------->
    <div class="flex flex-row min-h-screen">
      <!-- page content -->
      <div class="flex flex-col w-full lg:ml-64 bg-white dark:bg-nord-night-2">
        <responsive-header />
        <nuxt />
      </div>

      <!-- sidebar -->
      <div
        class="fixed transform transition-all duration-300 lg:translate-x-0 lg:fixed z-30"
        :class="{
          'translate-x-0': isSidebarOpen,
          '-translate-x-80': !isSidebarOpen
        }"
      >
        <sidebar />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('layout', [
      'isSidebarOpen'
    ])
  },
  methods: {
    getColorScheme () {
      return this.$colorMode.preference
    }
  }
}
</script>
