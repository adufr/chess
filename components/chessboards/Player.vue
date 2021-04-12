<template>
  <div class="h-12 flex" :class="color === 'black' ? 'items-start' : 'items-end'">
    <div class="flex items-start space-x-2">
      <div class="w-10 h-10 rounded-md bg-nord-snow-2 dark:bg-nord-night-1 p-1">
        <img :src="require('@/assets/images/svg/' + imgPath)" alt="">
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-200 truncate">
          {{ name }}
        </p>
        <div
          class="-mt-px"
          :class="color === 'white'
            ? 'text-nord-night-4 dark:text-nord-night-0'
            : 'text-nord-snow-1 dark:text-white'"
        >
          <font-awesome-icon
            v-for="(piece, index) in captures"
            :key="index"
            :icon="`chess-${piece}`"
            class="mx-px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'white',
      validator: value => ['white', 'black'].includes(value)
    },
    name: {
      type: String,
      default: ''
    },
    imgPath: {
      type: String,
      default: '@/assets/images/svg/white-pawn.svg'
    },
    captures: {
      type: Array,
      default: () => []
    }
  }
}
</script>
