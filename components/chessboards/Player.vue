<template>
  <div class="h-12 flex" :class="player ? 'items-end' : 'items-start'">
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
          :class="color === 'w'
            ? 'text-nord-night-4 dark:text-nord-night-0'
            : 'text-nord-snow-1 dark:text-white'"
        >
          <font-awesome-icon
            v-for="(piece, index) in captures"
            :key="index"
            :icon="`chess-${piece}`"
            class="mx-px"
          />

          <span v-show="advantage" class="text-gray-400 text-sm">
            +{{ advantage }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    player: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'w',
      validator: value => ['w', 'b'].includes(value)
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
    },
    advantage: {
      type: Number,
      default: 0
    }
  }
}
</script>
