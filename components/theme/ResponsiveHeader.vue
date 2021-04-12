<template>
  <div class="flex items-center lg:hidden h-12 px-5 bg-nord-snow-3 dark:bg-nord-night-0">
    <div @click="toggleSidebar()">
      <font-awesome-icon icon="bars" class="block lg:hidden text-nord-night-0 dark:text-nord-snow-3" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toggleSidebar () {
      this.$store.commit('layout/TOGGLE_SIDEBAR')
    }
  }
}
</script>
