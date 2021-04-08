<template>
  <div
    v-if="show"
    id="windowGameOver"
    ref="windowGameOverRef"
    class="absolute bg-white rounded-md shadow-2xl"
    @close="show = false"
  >
    <div class="p-5 text-center bg-nord-green rounded-t-md">
      <p class="text-3xl font-extrabold text-white">
        {{ dialog.title }}
      </p>
      <small class="text-medium text-white">
        {{ dialog.subtitle }}
      </small>
    </div>

    <div class="p-5 flex flex-row items-center space-x-2">
      <div class="w-20 flex flex-col items-center text-center">
        <div class="h-16 w-16 border-4 border-nord-green rounded-md p-1">
          <img src="@/assets/images/svg/white-pawn.svg" alt="Player icon">
        </div>
        <span class="w-20 text-sm truncate text-gray-400">Player</span>
      </div>

      <div class="-mt-4 font-medium text-gray-500">
        1 - 0
      </div>

      <div class="w-20 flex flex-col items-center text-center">
        <div class="h-16 w-16 border-4 border-nord-snow-1 rounded-md p-2">
          <img src="@/assets/images/svg/computer.svg" alt="Computer icon">
        </div>
        <span class="w-20 text-sm truncate text-gray-400">Computer</span>
      </div>
    </div>
  </div>
</template>

<script>
import { windowGameOverEvents } from './windowGameOverEvents'

// TODO: handle player names / icons
export default {
  data () {
    return {
      show: false,
      dialog: {
        title: '',
        subtitle: ''
      }
    }
  },
  mounted () {
    if (!document) { return }
    windowGameOverEvents.$on('open', this.open)
    windowGameOverEvents.$on('close', () => {
      this.handleClickOverlay({ target: { id: 'windowGameOver' } })
    })
  },
  methods: {
    resetState () {
      this.dialog = {
        title: '',
        subtitle: ''
      }
    },
    handleClickButton ({ target }, confirm) {
      if (target.id === 'windowGameOver') { return }
      this.show = false

      if (this.params.callback) {
        this.params.callback(confirm)
      }
    },
    handleClickOverlay ({ target }) {
      if (target.id === 'windowGameOver') {
        this.show = false

        if (this.params.callback) {
          this.params.callback(false)
        }
      }
    },
    open (params) {
      this.resetState()
      this.params = params
      this.show = true

      // set params to dialog state
      Object.entries(params).forEach((param) => {
        if (typeof param[1] === typeof this.dialog[param[0]]) {
          this.dialog[param[0]] = param[1]
        }
      })
    }
  }
}
</script>
