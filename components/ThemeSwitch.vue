<template>
  <div>
    <!-- <font-awesome-icon icon="moon" class="text-gray-600" /> -->

    <div class="relative inline-block w-10 text-center text-lg">
      <input
        id="toggle"
        v-model="value"
        type="checkbox"
        name="toggle"
        class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none"
        @change="$colorMode.preference === 'light'
          ? $colorMode.preference = 'dark'
          : $colorMode.preference = 'light'"
      >
      <label for="toggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300  cursor-pointer" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: this.$colorMode.preference === 'dark'
    }
  }
}
</script>

<style scoped>
.toggle-checkbox:checked {
  @apply right-0;
  right: 0;
  /* border-color: #A78BFA; */
}
.toggle-checkbox:checked + .toggle-label {
  @apply bg-nord-frost-2;
}
</style>
