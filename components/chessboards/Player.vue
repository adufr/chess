<template>
  <div class="h-12 flex" :class="color === 'black' ? 'items-start' : 'items-end'">
    <div class="flex items-start space-x-2">
      <div class="w-10 h-10 rounded-md bg-nord-snow-2 dark:bg-nord-night-1 p-1">
        <img :src="require('@/assets/images/svg/' + imgPath)" alt="">
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-200">
          {{ name }}
        </p>
        <div :class="color === 'white' ? 'text-black': 'text-white'">
          <font-awesome-icon
            v-for="(piece, index) in captures"
            :key="index"
            :icon="`chess-${piece}`"
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
    }
  },
  data () {
    return {
      captures: []
    }
  },
  mounted () {
    this.$options.intervalCaptures = setInterval(() => {
      this.computeCaptures()
    }, 100)
  },
  beforeDestroy () {
    clearInterval(this.$options.intervalCaptures)
  },
  methods: {
    computeCaptures () {
      if (this.color === 'white') {
        this.captures = this.getWhiteCaptures()
      }

      if (this.color === 'black') {
        this.captures = this.getBlackCaptures()
      }
    }
  }
}
</script>
