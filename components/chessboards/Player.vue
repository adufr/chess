<template>
  <div class="h-9 flex" :class="position === 'top' ? 'items-start' : 'items-end'">
    <div class=" flex items-center space-x-2">
      <div class="w-7 h-7 rounded-sm bg-nord-snow-2 dark:bg-nord-night-1" />

      <p class="text-sm font-medium text-gray-500 dark:text-gray-200">
        {{ name }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bot'].includes(value)
    }
  }
}
</script>
