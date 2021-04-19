<template>
  <transition name="fade">
    <div
      v-if="showing"
      class="z-40 fixed bottom-0 inset-0 h-screen"
      @keydown.esc="close()"
    >
      <div class="fixed inset-0" @click="close()">
        <div class="absolute inset-0 bg-black opacity-75" />
      </div>

      <div
        class="fixed right-0 h-screen w-screen max-w-md bg-nord-snow-3 dark:bg-nord-night-2 transform transition ease-in-out duration-500"
        :class="{ 'translate-x-0': showSlideover, 'translate-x-full': !showSlideover }"
      >
        <div class="h-full flex flex-col">
          <div class="p-5 flex flex-row justify-between items-center bg-nord-frost-3 dark:bg-nord-night-0">
            <h2 class="text-lg font-medium text-white">
              {{ title }}
            </h2>

            <font-awesome-icon
              icon="times"
              class="text-white dark:text-gray-400 cursor-pointer"
              @click="close()"
            />
          </div>

          <div class="pt-5 px-5 h-full overflow-y-auto">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showing: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Title'
    }
  },
  data () {
    return {
      showSlideover: false
    }
  },
  watch: {
    showing (value) {
      value
        ? document.querySelector('body').classList.add('overflow-hidden')
        : document.querySelector('body').classList.remove('overflow-hidden')

      if (!this.showing) { return }

      setTimeout(() => {
        this.showSlideover = true
      }, 50)
    }
  },
  mounted () {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) { this.close() }
    })
  },
  methods: {
    close () {
      this.showSlideover = false
      setTimeout(() => {
        this.$emit('close')
      }, 50)
    }
  }
}
</script>
